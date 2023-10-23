import { dbConnectDevice } from "../../../src/commons/libraries/dbConnect";
import deviceModel from "../../../src/commons/libraries/device.model";
import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get the count from req.body
    const { count } = req.query;

    // Create the folder path based on count value
    const folderPath = `public/uploads/${count}/`;

    // Check if the folder exists; if not, create it
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
    cb(null, file.originalname); // 저장되는 파일명
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
        res.status(200).json({ message: "File uploaded successfully." });
      });
    } else if (req.method === "GET") {
      const { count } = req.query;

      if (!count) {
        return res.status(400).json({ message: "Missing count parameter." });
      }

      const folderPath = `public/uploads/${count}/`;
      if (!fs.existsSync(folderPath)) {
        return res.status(404).json({ message: "No images found for the given count." });
      }

      const imageFiles = fs.readdirSync(folderPath);
      return res.status(200).json(imageFiles);
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
