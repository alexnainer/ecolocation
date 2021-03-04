const { Session } = require("./database/schemas");
const { v4: uuidv4 } = require("uuid");

const log = require("debug")("server");
const logError = require("debug")("server:error");

const options = { upsert: true, new: true };

const getSession = async (id) => {
    if (!id) {
        id = uuidv4();
        log("Creating session with id", id);
        return await Session.create({
            id,
            locationPreferences: {
                cafe: false,
                outdoors: false,
                government: false,
                restaurant: false,
                hotel: false,
                publicBuilding: false,
            },
        });
    } else {
        try {
            return await Session.findOne({ id }).populate({
                path: "users",
                model: "User",
            });
        } catch (e) {
            logError(e);
        }
    }
};

const updateSessionPreferences = async (sessionId, preferences) => {
    try {
        return await Session.findOneAndUpdate(
            { id: sessionId },
            { locationPreferences: preferences },
            options
        );
    } catch (e) {
        logError(e);
    }
};

module.exports = {
    getSession,
    updateSessionPreferences,
};
