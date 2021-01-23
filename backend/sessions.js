const { Session } = require("./database/schemas");
const { v4: uuidv4 } = require("uuid");

const log = require("debug")("sessions");
const logError = require("debug")("sessions:error");

const getSession = async (id) => {
  if (!id) {
    id = uuidv4();
    log("Creating session with id", id);
  }
  try {
    return await Session.findOneAndUpdate(
      { id },
      {},
      { upsert: true, new: true }
    );
  } catch (e) {
    logError(e);
  }
};

module.exports = {
  getSession,
};
