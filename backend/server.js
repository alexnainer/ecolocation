const express = require("express");
// const debug = require("debug");
const mongoose = require("mongoose");

const app = express();
const port = 3001;

const log = require("debug")("server");
const logError = require("debug")("server:error");

require("dotenv").config();
const cors = require("cors");

(async () => {
  try {
    app.use(cors());
    app.options("*", cors());

    const router = require("./routes");
    app.use("/api/v1.0", router);

    const mongoUser = process.env.MONGO_USER;
    const mongoPassword = process.env.MONGO_PASSWORD;
    const mongoIP = process.env.MONGO_IP;
    const mongoPort = process.env.MONGO_PORT;

    await mongoose.connect(
      `mongodb://${mongoUser}:${mongoPassword}@${mongoIP}:${mongoPort}/qhacks`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    log(`Successfully connected to MongoDB server ${mongoIP}:${mongoPort}`);

    app.listen(port, () => {
      log(`Backend listening at http://localhost:${port}`);
    });

    mongoose.connection.on("error", (error) => {
      logError(error);
    });
  } catch (e) {
    logError(e);
  }
})();
