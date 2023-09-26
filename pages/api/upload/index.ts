import { dbConnectDevice } from "../../../src/commons/libraries/dbConnect";
import deviceModel from "../../../src/commons/libraries/device.model";
import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      upload.single("file")(req, res, async (err) => {
        if (err) {
          console.error("File upload error:", err);
          res.status(500).json({ message: "File upload failed." });
          return;
        }

        const conn = await dbConnectDevice();
        const Device = deviceModel(conn);

        const { location, name } = req.body;

        console.log(location);
        console.log(name);
        const response = await Device.find({ location, name }).exec();
        if (!response[0]) {
          console.error("Device not found for given location and name:", location, name);
          res.status(404).json({ message: "Device not found." });
          return;
        }

        const newFileName = `${response[0]._id}.png`;
        console.log("3");
        try {
          console.log(newFileName);
          fs.renameSync(path.join("public/uploads/", req.file.originalname), path.join("public/uploads/", newFileName));
          res.status(200).json({ message: "File uploaded and renamed successfully", fileName: newFileName });
        } catch (fsErr) {
          console.error("File renaming error:", fsErr);
          res.status(500).json({ message: "Failed to rename the file." });
        }
      });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in /api/upload:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};
