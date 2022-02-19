import Location from "../models/Location";
import Comment from "../models/Comment";
import {
  getAllLocations,
  findOneUser,
  findUserById,
  getLocationById,
  deleteLocationById,
  updateLocationById,
  getCommentsByLocationId,
} from "../services/db";
import { locationSchema } from "../validations/location";
import bcrypt from "bcrypt";
import passport from "passport";
import { Request, Response } from "express";


interface IComment {
  author: string,
    title: string,
    body: string,
}



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

export const createLocation = async (req: Request, res: Response) => {

  const { name, price, location, description, images, coordinate } = req.body;
  const { user } = req;
 
  if(!user){
    res.status(401).json({ message: "Unauthorized user" });
    return
  }

  // check for input validity
  const isValid = await locationSchema.isValid({
    name,
    price,
    location,
    description,
  });

  if (!isValid) {
    res.status(400).json({ message: "Error! Wrong input!" });
  }
 //@ts-ignore
  const author = await findOneUser(user.email );
 
  const locationModel = new Location({
    author: author._id,
    name,
     //@ts-ignore
    email: user.email, 
    price,
    location,
    description,
    images,
    coordinate,
  });

  try {
    const response = await locationModel.save();
    res.status(201).json({
      message: "Successfully location added.",
      response,
    });
  } catch (error) {
    res.status(501).json({
      message: "Failed adding location",
      error,
    });
  }
  await locationModel.save();
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
  const updatedData = req.body;

  console.log(updatedData);
  // Check for correct user trying to edit
  const location = await getLocationById(id);
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
 //@ts-ignore
  const userEmail = req.user.email;
  const rating: [] = req.body.rating;
  const locationId = req.params.id;
  const location = await getLocationById(locationId);
  
  const user = await findOneUser(userEmail);

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
  const author = await findUserById(user.id);
  console.log(author);
  

  const location = await getLocationById(locationId);

   //@ts-ignore
  const comment = new Comment({
    author: author._id,
    title,
    body,
  });

  

  try {
//@ts-ignore
    const response = await comment.save();

    location.comments.push(comment);
    location.save();


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




