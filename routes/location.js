import express from 'express';
import Location from "../models/Location.js";
import { getAllLocations, findOneUser } from "../services/db.js";
import { locationSchema } from "../validations/location.js";



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


export default router;

