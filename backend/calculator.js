const { Location, Session, User } = require("./database/schemas");
const api = require("./api");
const turf = require("@turf/turf");

const getSession = (id) => {
    return Session.findOne({ id: id }).populate({
        path: "users",
        model: "User",
    });
};

const getUsers = async (userIDs) => {
    users = [];
    for (let u = 0; u < userIDs.length; u++) {
        users.push(await User.find({ _id: userIDs[u] }));
    }
    return users;
};

const getLocationByType = (type, searchPolygon) => {
    const geoWithinQuery = {
        $geometry: searchPolygon.geometry,
    };
    return Location.find({
        locationType: type,
        geoJson: { $geoWithin: geoWithinQuery },
    });
};

const createLocationSearchPolygon = (users) => {
    const userCircles = [];

    for (const user of users) {
        const {
            maxBicycleDistance,
            maxCarDistance,
            maxWalkDistance,
        } = user.preferences;

        let radius = Math.max(
            maxBicycleDistance,
            maxCarDistance,
            maxWalkDistance
        );

        // radius *= 1.1;

        const options = {
            steps: 10,
            units: "kilometers",
        };

        const circle = turf.circle(
            user.location.geoJson.coordinates,
            radius,
            options
        );

        // console.log("circle.geometry.coordinates", circle.geometry.coordinates);

        // for (let i = 0; i < circle.geometry.coordinates[0].length; i++) {
        //     console.log(
        //         circle.geometry.coordinates[0][i][1],
        //         ",",
        //         circle.geometry.coordinates[0][i][0],
        //         ", User,",
        //         "#FFF000"
        //     );
        // }
        // console.log("");
        userCircles.push(circle);
    }

    let searchPolygon = turf.intersect(userCircles[0], userCircles[1]);
    console.log(
        "searchPolygon.geometry.coordinates",
        searchPolygon.geometry.coordinates
    );
    for (let i = 2; i < userCircles.length; i++) {
        searchPolygon = turf.intersect(searchPolygon, userCircles[i]);
    }

    return searchPolygon;
};

const createPossibleLocationArray = async (
    cafeTrue,
    outdoorsTrue,
    governmentTrue,
    restaurantTrue,
    hotelTrue,
    publicTrue,
    users
) => {
    let possibleLocations = [];

    const polygon = createLocationSearchPolygon(users);
    console.log("polygon", polygon);

    if (outdoorsTrue) {
        possibleLocations = possibleLocations.concat(
            await getLocationByType("Outdoors", polygon)
        );
    }

    if (governmentTrue) {
        possibleLocations = possibleLocations.concat(
            await getLocationByType("Government Building", polygon)
        );
    }

    if (publicTrue) {
        possibleLocations = possibleLocations.concat(
            await getLocationByType("Public Building", polygon)
        );
    }

    if (cafeTrue) {
        possibleLocations = possibleLocations.concat(
            await getLocationByType("Cafe", polygon)
        );
    }

    if (restaurantTrue) {
        possibleLocations = possibleLocations.concat(
            await getLocationByType("Restaurant", polygon)
        );
    }

    if (hotelTrue) {
        possibleLocations = possibleLocations.concat(
            await getLocationByType("Hotel", polygon)
        );
    }
    console.log("possibleLocations length", possibleLocations.length);
    return possibleLocations;
};

function formatCoordinates(coordinates) {
    let resultStrings = [];
    coordinates.forEach((coordSet) => {
        coordString = coordSet[0].toString() + "%2C" + coordSet[1].toString();
        resultStrings.push(coordString);
    });
    let resultString = "";
    if (resultStrings[0]) {
        resultString += resultStrings[0];
        for (let i = 1; i < resultStrings.length; i++) {
            resultString += "%3B" + resultStrings[i];
        }
    }
    return resultString.trim();
}

const calculateDistanceFull = async (user, loc, tansportType) => {
    helperString = formatCoordinates([user, loc]);
    options = {
        routing: tansportType,
        coordinates: helperString,
    };
    console.log("options full", options);
    result = await api.getMapBoxDirections(options);
    //console.log("result", result.data.routes[0].distance);
    return result.data;
};

const calculateDistance = async (user, loc, tansportType) => {
    helperString = formatCoordinates([user, loc]);
    options = {
        routing: tansportType,
        coordinates: helperString,
    };
    console.log("options", options);

    result = await api.getMapBoxDirections(options);
    //console.log("result", result.data.routes[0].distance);
    result = result.data.routes[0].distance;
    return result;
};

const driver = async (id) => {
    session = await getSession(id);
    // userIDs = session.users;
    // users = await getUsers(userIDs);
    const { users } = session;
    locations = await createPossibleLocationArray(
        session.locationPreferences.cafe,
        session.locationPreferences.outdoors,
        session.locationPreferences.government,
        session.locationPreferences.restaurant,
        session.locationPreferences.hotel,
        session.locationPreferences.publicBuilding,
        users
    );

    console.log("users", users);

    var minCost = Number.MAX_SAFE_INTEGER;
    var bestLocIndex;
    var userTransTypes = [];
    var bestLocationName;
    var bestLocationType;

    // loop through locations and users
    for (let l = 0; l < locations.length; l++) {
        var cost = 0;
        var tempTransTypes = [];
        for (let u = 0; u < users.length; u++) {
            // console.log("user", users[u]);
            // console.log(
            //     "users[u][0].location.geoJson.coordinates",
            //     users[u].location.geoJson.coordinates
            // );
            // console.log(
            //     "locations[l].geoJson.coordinates",
            //     locations[l].geoJson.coordinates
            // );
            let distanceWalk = await calculateDistance(
                users[u].location.geoJson.coordinates,
                locations[l].geoJson.coordinates,
                "walking"
            );
            let distanceCycling = await calculateDistance(
                users[u].location.geoJson.coordinates,
                locations[l].geoJson.coordinates,
                "cycling"
            );
            let distanceDriving = await calculateDistance(
                users[u].location.geoJson.coordinates,
                locations[l].geoJson.coordinates,
                "driving"
            );

            // console.log("@@@@@@", users[u].preferences.maxWalkDistance);
            // console.log("dist", distanceWalk);
            if (distanceWalk <= users[u].preferences.maxWalkDistance * 1000) {
                //user will walk no C02 Cost
                tempTransTypes.push("walking");
            } else if (
                distanceCycling <=
                users[u].preferences.maxBicycleDistance * 1000
            ) {
                //user will bike no C02 Cost
                tempTransTypes.push("cycling");
            } else if (
                distanceDriving <=
                users[u].preferences.maxCarDistance * 1000
            ) {
                //user will drive
                //cost += distanceDriving * users[u][0].preferences.carType;
                cost += Math.floor((distanceDriving / 1000) * 200);
                tempTransTypes.push("driving");
            } else {
                //Not a viable location, user cannot get there
                console.log(
                    "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$"
                );
            }
        }
        if (cost < minCost) {
            minCost = cost;
            bestLocIndex = l;
            userTransTypes = tempTransTypes;
            bestLocationName = locations[bestLocIndex].name;
            bestLocationType = locations[bestLocIndex].locationType;

            // console.log("minCost", minCost);
            // console.log("index", bestLocIndex);
            // console.log("TransTypes", userTransTypes);
            //update users best tranport types
        }
    }
    console.log("tempTransTypes", tempTransTypes);
    console.log("userTransTypes", userTransTypes);
    for (let i = 0; i < session.users.length; i++) {
        await User.findOneAndUpdate(
            { _id: session.users[i]._id },
            { "results.transportationType": userTransTypes[i] }
        );
        //console.log("BoogMEOnce", users[i][0].location);
        var result = calculateDistanceFull(
            users[i].location.geoJson.coordinates,
            locations[bestLocIndex].geoJson.coordinates,
            userTransTypes[i]
        );
        await User.findOneAndUpdate(
            { _id: session.users[i]._id },
            { "results.routes": result }
        );
    }
    await Session.findOneAndUpdate({ id }, { "results.cost": minCost });
    await Session.findOneAndUpdate(
        { id: id },
        { "results.geoJson": locations[bestLocIndex].geoJson }
    );
    await Session.findOneAndUpdate(
        { id: id },
        {
            "results.endpoint": bestLocationName,
            "results.endpointType": bestLocationType,
            "results.geoJson": locations[bestLocIndex].geoJson,
        }
    );
};

module.exports = driver;
