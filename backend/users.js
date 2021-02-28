const { User, Session } = require("./database/schemas");

const log = require("debug")("server");
const logError = require("debug")("server:error");

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

const updateUser = async (user) => {
    try {
        return await User.findOneAndUpdate({ _id: user._id }, user, options);
    } catch (e) {
        logError(e);
    }
};

module.exports = {
    createUser,
    updateUser,
};
