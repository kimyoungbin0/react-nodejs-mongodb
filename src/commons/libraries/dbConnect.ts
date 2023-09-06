import mongoose from "mongoose";

const DB_URI = process.env.MONGODB_URI || "";
const DB_URI_DEVICE = process.env.MONGODB_URI_DEVICE || "";

let cachedLoginConn = null;
let cachedDeviceConn = null;

async function dbConnectLogin() {
  if (cachedLoginConn) return cachedLoginConn;

  const conn = await mongoose.createConnection(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedLoginConn = conn;
  return cachedLoginConn;
}

async function dbConnectDevice() {
  if (cachedDeviceConn) return cachedDeviceConn;

  const conn = await mongoose.createConnection(DB_URI_DEVICE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedDeviceConn = conn;
  return cachedDeviceConn;
}

export { dbConnectLogin, dbConnectDevice };
