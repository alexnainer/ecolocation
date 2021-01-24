// require("dotenv").config({ path: "../.env" });
require("dotenv").config();
const api = require("../api");

const mongoose = require("mongoose");

const log = require("debug")("getPrivateBuildings");
const logError = require("debug")("getPrivateBuildings:error");

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoIP = process.env.MONGO_IP;
const mongoPort = process.env.MONGO_PORT;

console.log(mongoUser, mongoPassword, mongoIP, mongoPort);

locations = ["Coffee", "Restaurant", "Hotel", "Pub", "Motel"];
coordinates = ["-76.500000,44.233334"];

(async () => {
  try {
    console.log("before");
    await mongoose.connect(
      `mongodb://${mongoUser}:${mongoPassword}@${mongoIP}:${mongoPort}/qhacks`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (e) {
    logError(e);
  }
  console.log("after");
  log(`Successfully connected to MongoDB server ${mongoIP}:${mongoPort}`);

  const { Location } = require("../database/schemas");

  locations.forEach(async (location) => {
    let formattedData;
    coordinates.forEach(async (coord) => {
      options = {
        location: location,
        coordinates: coord,
      };
      apiData = await api.getMapBoxGeocoding(options);

      formattedData = apiData.data.features.map((result) => {
        return {
          name: result.text,
          geoJson: {
            type: "Point",
            coordinates: result.geometry.coordinates,
          },
          locationType: locationGeneral(location),
          address: result.properties.address,
          description: result.place_name,
        };
      });
      console.log("formattedData.length", formattedData.length);

      await Location.insertMany(formattedData, (error) => {
        logError(error);
      });
    });
  });
})();

function locationGeneral(name) {
  if (name === "Coffee") {
    return "Cafe";
  } else if (name === "Motel" || name === "Hotel") {
    return "Hotel";
  } else {
    return "Restaurant";
  }
}
