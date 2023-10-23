import mongoose from "mongoose";

const DB_URI = process.env.MONGODB_URI || "";
const DB_URI_DEVICE = process.env.MONGODB_URI_DEVICE || "";
const DB_URI_BOARD = process.env.MONGODB_URI_BOARD || "";
const DB_URI_COUNTER = process.env.MONGODB_URI_COUNTER || "";

let cachedLoginConn = null;
let cachedDeviceConn = null;
let cachedBoardConn = null;
let cachedCountConn = null;

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

async function dbConnectBoard() {
  if (cachedBoardConn) return cachedBoardConn;

  const conn = await mongoose.createConnection(DB_URI_BOARD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedBoardConn = conn;
  return cachedBoardConn;
}

async function dbConnectCount() {
  if (cachedCountConn) return cachedCountConn;

  const conn = await mongoose.createConnection(DB_URI_COUNTER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedCountConn = conn;
  return cachedCountConn;
}

export { dbConnectLogin, dbConnectDevice, dbConnectBoard, dbConnectCount };
