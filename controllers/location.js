import Location from "../models/Location.js";
import {
  getAllLocations,
  findOneUser,
  getLocationById,
  deleteLocationById,
  updateLocationById,
  getCommentsByLocationId,
} from "../services/db.js";
import { locationSchema } from "../validations/location.js";

export const getLocations = async (req, res) => {
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

export const createLocation = async (req, res) => {
  const { name, price, location, description, email, images, coordinate } =
    req.body;

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

  const author = await findOneUser(session.user.email);
  const locationModel = new Location({
    author: author._id,
    email,
    name,
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

export const getLocation = async (req, res) => {
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

export const deleteLocation = async (req, res) => {
  const { id } = req.params;
  const session = await getSession({ req });
  console.log(session.user.email);
  const location = await getLocationById(id);
  console.log(session.user.email, location.email);

  if (session.user.email !== location.email) {
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

export const editLocation = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  // Check for correct user trying to edit
  const location = await getLocationById(id);
  if (location.email !== session.user.email) {
    res.status(401).json({ message: "Wrong user editing location" });
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

export const updateRating = async (req, res) => {
  const userEmail = session.user.email;
  const rating = req.body.rating;
  const locationId = req.params.id;
  const location = await getLocationById(locationId);

  const user = await findOneUser(userEmail);

  let userAlreadtRated = false;
  try {
    location.ratings.forEach((existRating, index) => {
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
    });
  }
};

export const createComment = async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  const locationId = id;
  const creatorEmail = session.user.email;
  const author = await findOneUser(creatorEmail);
  const location = await getLocationById(locationId);

  // console.log(location);
  const comment = new Comment({
    author: author._id,
    title,
    body,
  });

  try {
    const response = await comment.save();

    location.comments.push(comment);
    location.save();

    //  const l = await Location.findOne({name: "test2"}).populate('comments').exec()
    //    console.log(l)

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

export const getComment = async (req, res) => {
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
