import mongoose from "mongoose";
import {Types} from "mongoose";

const { Schema } = mongoose;

type ICommentSchema =  {
  author: Types.ObjectId;
  title: string;
  body: string;
  rating: number;
  date: {type: DateConstructor, default: DateConstructor};

}


const commentSchema = new Schema<ICommentSchema>({
  author: { type: Schema.Types.ObjectId, ref: "user" },
  title: String,
  body: String,
  date: { type: Date, default: Date.now },
  rating: Number,
});

const Comment =
  mongoose.models["comment"] || mongoose.model("comment", commentSchema);

export default Comment;
