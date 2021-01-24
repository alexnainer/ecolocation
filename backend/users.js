const { User } = require("./database/schemas");

const log = require("debug")("sessions");
const logError = require("debug")("sessions:error");

const options = { upsert: true, new: true };

const createUser = async ({ name }) => {
  try {
    return await User.findOneAndUpdate({}, { name }, options);
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
