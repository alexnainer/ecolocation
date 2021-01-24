const { User, Session } = require("./database/schemas");

const log = require("debug")("sessions");
const logError = require("debug")("sessions:error");

const options = { upsert: true, new: true };

const createUser = async ({ name, sessionId }) => {
  try {
    console.log("name", name);
    const user = await User.create({
      name,
      geoJson: {},
      preferences: {
        carType: "",
        carpool: false,
        maxWalkDistance: 0,
        maxCarDistance: 0,
        maxBicycleDistance: 0,
      },
    });
    console.log("user", user);
    await Session.findOneAndUpdate(
      { id: sessionId },
      { $push: { users: user._id } },
      options
    );
  } catch (e) {
    logError(e);
  }
};

const updateUser = async ({ id, update }) => {
  try {
    return await User.findOneAndUpdate({ _id: id }, update, options);
  } catch (e) {
    logError(e);
  }
};

module.exports = {
  createUser,
};
