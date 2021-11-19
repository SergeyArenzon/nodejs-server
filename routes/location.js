import express from 'express';
import Location from "../models/Location.js";
import { getAllLocations, findOneUser } from "../services/db.js";
import { locationSchema } from "../validations/location.js";

//  /location //


const router = express.Router();


router.get('/', async(req, res) => {
    try {
        const locations = await getAllLocations();
        res.status(200).json({ locations: locations });
      } catch (error) {
        res.status(500).json({
          message: "Error in fetchin locations",
          error,
        });
      }
});


router.post('/', async(req, res) => {

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
      coordinate
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
});



router.get("/:id", async(req, res) => {
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
})


export default router;

