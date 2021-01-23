const mongoose = require("mongoose");
const { Schema } = mongoose;

const locationSchema = new Schema(
  {
    name: String,
    geoJson: {
      type: String,
      coordinates: [Number],
    },
    type: String,
    address: String,
    description: String,
  },
  { collection: "locations" }
);

const userSchema = new Schema(
  {
    name: String,
    geoJson: {
      type: String,
      coordinates: [Number],
    },
    preferences: {
      carType: String,
      carpool: Boolean,
      maxWalkDistance: Number,
      maxCarDistance: Number,
      maxBicycleDistance: Number,
    },
    results: {
      distance: Number,
      duration: Number,
      transportationType: String,
      routes: [{}],
    },
  },
  { collection: "users" }
);

const sessionSchema = new Schema(
  {
    id: String,
    users: [userSchema],
    locationPreferences: [String],
    results: {
      cost: Number,
    },
  },
  { collection: "sessions" }
);

const Location = mongoose.model("Location", locationSchema);
const User = mongoose.model("User", userSchema);
const Session = mongoose.model("Session", sessionSchema);

module.exports = { Location, User, Session };
