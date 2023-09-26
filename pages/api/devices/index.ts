import { dbConnectDevice } from "../../../src/commons/libraries/dbConnect";
import deviceModel from "../../../src/commons/libraries/device.model";

export default async function handler(req, res) {
  const conn = await dbConnectDevice();
  const Device = deviceModel(conn);

  if (req.method === "POST") {
    const device = new Device(req.body);

    try {
      const { name, location } = req.body;
      const existingDevice = await Device.findOne({ name, location });
      if (existingDevice) {
        res.status(400).send("같은 이름의 파일이 이미 존재합니다");
        return;
      }
      const savedDevice = await device.save();
      res.status(200).json(savedDevice);
    } catch (err) {
      console.error("Error occurred:", err);
      res.status(500).json({ message: err.message });
    }
  } else if (req.method === "GET") {
    let devices;
    if (req.query.location && req.query.name) {
      devices = await Device.find({ location: req.query.location, name: req.query.name }).exec();
    } else if (req.query.location) {
      devices = await Device.find({ location: req.query.location }).exec();
    } else if (req.query.email) {
      devices = await Device.find({ email: req.query.email }).exec();
    } else {
      devices = await Device.find().exec();
    }

    res.status(200).json(devices);
  } else if (req.method === "PUT") {
    try {
      const { email, location, name, latitude_L, longitude_L, latitude_R, longitude_R, latitude, longitude, originalName, originalLocation } = req.body;

      const updatedDevice = await Device.findOneAndUpdate(
        { location: originalLocation, name: originalName },
        {
          email,
          location,
          name,
          size: {
            latitude_L,
            longitude_L,
            latitude_R,
            longitude_R,
          },
          latLong: {
            latitude,
            longitude,
          },
        },
        { new: true }
      );

      if (!updatedDevice) {
        res.status(404).json({ message: "Device not found" });
        return;
      }

      res.status(200).json(updatedDevice);
    } catch (err) {
      console.error("Error occurred:", err);
      res.status(500).json({ message: err.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const { name, location } = req.body;

      const result = await Device.deleteOne({ name, location });

      if (result.deletedCount === 0) {
        res.status(404).json({ message: "Device not found" });
        return;
      }

      res.status(200).json({ message: "Device successfully deleted" });
    } catch (err) {
      console.error("Error occurred:", err);
      res.status(500).json({ message: err.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
