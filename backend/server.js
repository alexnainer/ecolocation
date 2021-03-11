const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const log = require("debug")("server");
const logError = require("debug")("server:error");
const cors = require("cors");

require("dotenv").config();

const host = process.env.HOST;
const port = process.env.PORT;

(async () => {
  try {
    app.use(cors());
    app.options("*", cors());
    app.use(cookieParser());

    const router = require("./routes");

    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
    app.use("/api/v1.0", router);

    const mongoUser = process.env.MONGO_USER;
    const mongoPassword = process.env.MONGO_PASSWORD;
    const mongoIP = process.env.MONGO_IP;
    const mongoPort = process.env.MONGO_PORT;

    console.log("host", host);
    if (
      !host ||
      !port ||
      !mongoUser ||
      !mongoPassword ||
      !mongoIP ||
      !mongoPort
    ) {
      throw "Missing environment variables";
    }

    await mongoose.connect(
      `mongodb://${mongoUser}:${mongoPassword}@${mongoIP}:${mongoPort}/qhacks`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    log(`Successfully connected to MongoDB server ${mongoIP}:${mongoPort}`);

    app.listen(port, () => {
      log(`Backend listening at http://${host}:${port}`);
    });

    mongoose.connection.on("error", (error) => {
      logError(error);
    });
  } catch (e) {
    logError(e);
  }
})();
