import mongoose, { Schema } from "mongoose";

export const BoardSchema = new Schema({
  num: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
  views: { type: Number, required: true },
  likes: {
    type: Number,
    required: true,
  },
});

function boarderModel(conn) {
  return conn.model("Board", BoardSchema);
}

export default boarderModel;
