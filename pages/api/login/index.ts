// login.api.ts (API 파일)
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import loginModel from "../../../src/commons/libraries/login.model";
import { dbConnectLogin } from "../../../src/commons/libraries/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, password, name, theme } = req.body; // 추가: theme

  if (!email) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const conn = await dbConnectLogin();
    const Login = loginModel(conn);

    const user = await Login.findOne({ email: email }); // Use findOne to get a single document

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (theme) {
      user.theme = theme;
      await user.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
