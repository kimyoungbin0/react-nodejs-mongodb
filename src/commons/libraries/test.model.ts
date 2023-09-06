import mongoose, { Schema, models } from "mongoose";

export const TestSchema = new Schema({
  testId: {
    type: Number,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Test = models?.Test || mongoose.model("Test", TestSchema);

export default Test;
