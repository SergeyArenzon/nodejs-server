//
//  mongoose Locations module
//
import mongoose from "mongoose";



const { Schema } = mongoose;

const locationSchema = new Schema({
  email: String,
  author: { type: Schema.Types.ObjectId, ref: "user" },
  name: String,
  location: String,
  price: Number,
  description: String,
  comments: [{ type: Schema.Types.ObjectId, ref: "comment" }],
  coordinate: [Number, Number],
  date: { type: Date, default: Date.now },
  images: [],
  ratings: [
    {
      user: { type: Schema.Types.ObjectId, ref: "user" },
      rating: Number,
    },
  ],
});

const Location =
  mongoose.models["location"] || mongoose.model("location", locationSchema);

export default Location;
