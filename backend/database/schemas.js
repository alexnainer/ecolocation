const mongoose = require("mongoose");
const { Schema } = mongoose;

const locationSchema = new Schema(
  {
    name: { $type: String },
    geoJson: {
      $type: {
        type: { $type: String },
        coordinates: { $type: [Number] },
      },
    },
    locationType: { $type: String },
    address: { $type: String },
    description: { $type: String },
  },
  { collection: "locations", typeKey: "$type" }
);

const userSchema = new Schema(
  {
    name: String,
    location: {
      geoJson: {
        type: String,
        coordinates: [Number],
      },
      searchString: { $type: String, default: "" },
    },
    preferences: {
      carType: String,
      carpool: Boolean,
      maxWalkDistance: Number,
      maxCarDistance: Number,
      maxBicycleDistance: Number,
    },
    results: {
      distanceMetres: Number,
      durationSeconds: Number,
      transportationType: String,
      routes: [{}],
    },
  },
  { collection: "users", typeKey: "$type" }
);

const sessionSchema = new Schema(
  {
    id: String,
    users: { $type: [Schema.Types.ObjectId], ref: "User" },
    locationPreferences: {
      cafe: Boolean,
      outdoors: Boolean,
      government: Boolean,
      restaurant: Boolean,
      hotel: Boolean,
      publicBuilding: Boolean,
    },
    results: {
      cost: Number,
      endpoint: String,
      endpointType: String,
      geoJson: {
        type: String,
        coordinates: { $type: [Number] },
      },
    },
  },
  { collection: "sessions", typeKey: "$type" }
);

const Location = mongoose.model("Location", locationSchema);
const User = mongoose.model("User", userSchema);
const Session = mongoose.model("Session", sessionSchema);

module.exports = { Location, User, Session };
