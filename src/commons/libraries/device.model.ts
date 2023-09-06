import mongoose, { Schema } from "mongoose";

export const DeviceSchema = new Schema({
  email: { type: String, required: true },
  location: { type: String, required: true },
  name: { type: String, required: true },
  size: {
    type: {
      latitude_L: Number,
      longitude_L: Number,
      latitude_R: Number,
      longitude_R: Number,
    },
    required: false,
  },
  latLong: {
    type: {
      latitude: Number,
      longitude: Number,
    },
    required: true,
  },
});

function deviceModel(conn) {
  return conn.model("Device", DeviceSchema);
}

export default deviceModel;
