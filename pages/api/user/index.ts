import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import loginModel from "../../../src/commons/libraries/login.model";
import { dbConnectLogin } from "../../../src/commons/libraries/dbConnect";

export default async function handler(req, res) {
  if (req.method == "GET") {
    const email = req.query.email;
    if (!req.query.email) {
      return res.status(400).json({ error: "이메일을 입력하시오" });
    }

    try {
      const conn = await dbConnectLogin();
      const User = loginModel(conn);

      const user = await User.findOne({ email: email }); // Use findOne to get a single document

      if (user) {
        return res.status(404).json({ error: "아이디가 이미 존재합니다" });
      }

      res.status(200).json({ message: "성공" });
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method == "POST") {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;

      const conn = await dbConnectLogin();
      const User = loginModel(conn);

      const user = new User(req.body);

      const savedUser = await user.save();
      res.status(200).json(savedUser);
    } catch (err) {
      console.error("Error occurred:", err);
      res.status(500).json({ message: err.message });
    }
  } else if (req.method == "PUT") {
    try {
      if (req.query.password) {
        const { email, password, newPassword } = req.body;
        const conn = await dbConnectLogin();
        const User = loginModel(conn);

        const user = await User.findOne({ email: email });

        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          throw new Error("Invalid password");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await User.findOneAndUpdate(
          { email },
          {
            password: hashedPassword,
          },
          { new: true }
        );

        if (!updatedUser) {
          res.status(404).json({ message: "User update failed" });
          return;
        }

        res.status(200).json(updatedUser);
      } else if (req.query.name) {
        const { email, password, name } = req.body;
        const conn = await dbConnectLogin();
        const User = loginModel(conn);

        const user = await User.findOne({ email: email });

        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          throw new Error("Invalid password");
        }

        const updatedUser = await User.findOneAndUpdate(
          { email },
          {
            name: name,
          },
          { new: true }
        );

        if (!updatedUser) {
          res.status(404).json({ message: "User update failed" });
          return;
        }

        res.status(200).json(updatedUser);
      }
    } catch (err) {
      console.error("Error occurred:", err);
      res.status(500).json({ message: err.message });
    }
  }
}
