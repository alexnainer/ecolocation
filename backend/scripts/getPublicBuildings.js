require("dotenv").config();
const api = require("../api");

const mongoose = require("mongoose");

const log = require("debug")("getPublicBuildings");
const logError = require("debug")("getPublicBuildings:error");

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoIP = process.env.MONGO_IP;
const mongoPort = process.env.MONGO_PORT;

(async () => {
  await mongoose.connect(
    `mongodb://${mongoUser}:${mongoPassword}@${mongoIP}:${mongoPort}/qhacks`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  log(`Successfully connected to MongoDB server ${mongoIP}:${mongoPort}`);

  const { Location } = require("../database/schemas");

  locations = [
    "Park",
    "Playground",
    "Queen's University",
    "Education Facility",
    "Community Service",
    "Parkette",
    "Government Centre",
    "Municipal Government Facility",
    "Library",
    "Recreation Facility",
    "Athletic Centre",
  ];

  data = locations.map(async (location) => {
    options = {
      location: location,
    };
    apiData = await api.getKingstonPointData(options);

    const formattedData = apiData.data.records.map((result) => {
      // console.log("LOCATION: ", result.fields.name);
      // console.log("COORDINATES: ", result.fields.geojson.coordinates);
      return {
        name: result.fields.name,
        geoJson: {
          type: "Point",
          coordinates: result.fields.geojson.coordinates,
        },
        locationType: locationGeneral(result.name),
        address: result.fields.address,
        description: result.fields.description,
      };
    });

    console.log("formattedData.length", formattedData.length);

    await Location.insertMany(formattedData, (error) => {
      console.error("Error:", error);
    });

    // add data[location to database?]
  });
})();

function locationGeneral(name) {
  if (name === "Park" || name === "Playground" || name === "Parkette") {
    return "Outdoors";
  } else if (
    name === "Municipal Government Facility" ||
    name === "Government Centre"
  ) {
    return "Government Building";
  } else {
    return "Public Building";
  }
}
