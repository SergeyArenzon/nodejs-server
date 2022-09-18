import Location from "../models/Location";
import Comment from "../models/Comment";
import { createLocation, getAllLocations, getLocationById, getCommentsByLocationId, createCommentByUserId } from '../services/pg';
import {
  // getAllLocations,
  findUserById,
  // getLocationById,
  deleteLocationById,
  updateLocationById,
  // getCommentsByLocationId,
  getFilteredLocations
} from "../services/db";
import { Request, Response } from "express";
import util from 'util';
import fs from 'fs';
import { uploadFiles, getFile } from '../services/s3';
const unlinkFile = util.promisify(fs.unlink);


export const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await getAllLocations();
    res.status(200).json({ locations: locations });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetchin locations",
      error,
    });
  }
};

export const postLocation = async (req: Request, res: Response) => {

  const { name, price, location, description, images, coordinate } = req.body;
  const { user } = req;
 
  if(!user){
    res.status(401).json({ message: "Unauthorized user" });
    return
  }
  try {
    const response = await createLocation({name,price,locationName: location,description, userId: user.id})
    console.log(response);
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const getLocation = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const location = await getLocationById(id);
    res.status(200).json({
      message: "Successfully location by id fatched",
      location: location,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req;
  const location = await getLocationById(id);

  if(!user) {
    res.status(401).json({ message: "Unauthorized user" });
    return;
  }  

  console.log(user.id, location.author._id.toString() );
  

  if (user.id !== location.author._id.toString()) {
    res.status(401).json({ message: "Wrong user trying to delete location" });
    return;
  }

  try {
    const respone = await deleteLocationById(id);
    res.status(200).json({
      message: "Successfully location Deleted by id",
      location: respone,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const editLocation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req;

  const updatedData = req.body;


  // Check for correct user trying to edit
  if(!user){
    res.status(401).json({ message: "Unauthorized user" });
    return; 
  }

  const location = await getLocationById(id);
  
  if(user.id !== location.author.toString()){
    res.status(405).json({ message: "User not allowed for editing this location." });
    return;
  }

  try {
    const response = await updateLocationById(id, updatedData);
    res.status(200).json({
      message: "Successfully location by id updated",
      location: response,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const updateRating = async (req: Request, res: Response) => {
  
  if(!req.user){
    res.status(401).json({ message: "Unauthorized user" });
    return;
  }

  const userId = req.user.id;
  const rating: [] = req.body.rating;
  const locationId = req.params.id;
  const location = await getLocationById(locationId);
  
  const user = await findUserById(userId);

  let userAlreadtRated = false;
  try {

    location.ratings.forEach((existRating: any, index: number) => {
      if (existRating.user._id.equals(user._id)) {
        location.ratings[index].rating = rating;
        userAlreadtRated = true;
      }
    });

    if (!userAlreadtRated) {
      location.ratings.push({ user, rating });
    }

    // calculate avarage ratings of location
    if(location.ratings.length > 0){
      let sumRating = 0;
      for (const rating of location.ratings) {
        sumRating += rating.rating;
      }
      location.avarageRating = sumRating / location.ratings.length ;
    }
    await updateLocationById(locationId, location);
    res.status(200).json({
      message: "Successfully rating was added",
      rating,
      location,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed adding rating",
      rating,
      location,
      error
    });
  }
};

export const createComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, body } = req.body;
  const locationId = id;
  const {user} = req;

  if(!user){
    res.status(401).json({ message: "Unauthorized user" });
    return;
  }
  try {
    const response = await createCommentByUserId(user.id, locationId, body, title );
    res.status(201).json({
      message: "Successfully comment added.",
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      message: "Failed adding comment",
      error,
    });
  }
};

export const getComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const comments = await getCommentsByLocationId(id);
    res.status(200).json({
      message: "Successfully all comments fetched.",
      comments: comments,
    });
  } catch (error) {
    res.status(501).json({
      message: "Failed adding comment",
      error,
    });
  }
};





export const postImage = async (req: Request, res: Response) => {
  const locationId = req.params.id;  
  if(!locationId) return res.status(400).json({message: "No location id"});

  if(!req.files){
      res.status(400).json({error: "Files not found"});
      return;
  }

  try {
      const files = req.files as Express.Multer.File[];    
      const result:any = await uploadFiles(files);
      const imagesUrl:string[] = [];

      for (const image of result) {
        imagesUrl.push(image.key);
      }
      await updateLocationById(locationId, {images: imagesUrl});
      
      for (const file of files) {
          unlinkFile(file.path);
      }
      res.status(200).json({message: 'File sucessfuly uploaded', s3: result});
  } catch (error) {
      res.status(400).json({error: error, message: "File uploading failed"});
  }
}

export const getImage = async (req: Request, res: Response) => {
  console.log("----getimage--");
  const key = req.params.key;
  try {
    const readStream = await getFile(key);
    (await readStream).pipe(res);
  } catch (error) {
    res.status(400).json({error, message: 'Couldnt get image'})
  }
}
export const getFilter = async (req: Request, res: Response) => {

  if(!req.query.filter || !req.query.operator || !req.query.value){
    res.status(400).json({error: 'Bad filter request'})
    return;
  }
  const filterParams = {filter: req.query.filter.toString(), 
    operator: req.query.operator.toString(), 
    value: req.query.value.toString()};
  
    
  const location = await getFilteredLocations(filterParams);
  res.status(200).json({location})
  

}