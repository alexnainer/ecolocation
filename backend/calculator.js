const { Location, Session, User } = require("./database/schemas");
const api = require("./api");

const getSession = async (id) => {
    return await Session.find({id: id})
}

const getLocationByType = async (type) => {
    return await Location.find({locationType: type})
}

const createPosibleLocationArray = (outdoorsTrue, governmentTrue, publicTrue, cafeTrue, restaurantTrue, hotelTrue) => {
    var posibleLocations = [];
    
    if (outdoorsTrue) {posibleLocations = posibleLocations.concat( getLocationByType("Outdoors"));}
    if (governmentTrue) {posibleLocations = posibleLocations.concat( getLocationByType("Government Building"));}
    if (publicTrue) {posibleLocations = posibleLocations.concat( getLocationByType("Public Building"));}
    if (cafeTrue) {posibleLocations = posibleLocations.concat( getLocationByType("Cafe"));}
    if (restaurantTrue) {posibleLocations = posibleLocations.concat( getLocationByType("Restaurant"));}
    if (hotelTrue) {posibleLocations = posibleLocations.concat( getLocationByType("Hotel"));}  

    return posibleLocations;
}

function formatCoordinates(coordinates) {
    let resultStrings = [];
    coordinates.forEach((coordSet) => {
        coordString = coordSet[0].toString() + "%2C" + coordSet[1].toString();
        resultStrings.push(coordString);
    });
    let resultString = ""
    if (resultStrings[0]) {
        resultString += resultStrings[0];
        for (i=1; i<resultStrings.length; i++) {
            resultString += "%3B" + resultStrings[i];
        }
    }
    return resultString.trim();

}

const calculateDistance = (user, loc, tansportType) => {
    
    helperString = formatCoordinates([user, loc])
    options = {
        routing: tansportType,
        coordinates: helperString
    }

    result = api.getMapBoxDirections(options);

    return result.routes[0].distance;
}

const driver = (id) => {
    session = getSession(id)
    users = session.users;
    locations = createPosibleLocationArray(session.locationPreferences.cafe, 
                                           session.locationPreferences.outdoors, 
                                           session.locationPreferences.government, 
                                           session.locationPreferences.restaurant, 
                                           session.locationPreferences.hotel, 
                                           session.locationPreferences.public)
    
    var minCost = 100000;
    var bestLocIndex;
    var userTransType = [];

    // loop through locations and users
    for (l = 0; l < locations.length; l++) {
        var cost = 0;
        for (u = 0; u < users.length; u++) {

            distanceWalk = calculateDistance(users[u].geoJson.coordinates, locations[l].geoJson.coordinates, "walking")
            distanceCycling = calculateDistance(users[u].geoJson.coordinates, locations[l].geoJson.coordinates, "cycling")
            distanceDriving = calculateDistance(users[u].geoJson.coordinates, locations[l].geoJson.coordinates, "driving")

            if (distanceWalk <= users[u].walkDist) {
                //user will walk no C02 Cost
                userTransType.push("walking");
            }else if (distanceBike <= users[u].bikeDist) {
                //user will bike no C02 Cost
                userTransType.push("cycling");
            }else if (distanceDrive <= users[u].driveDist) {
                //user will drive
                cost += distance*users[u].preferences.carType;
                userTransType.push("driving");
            }else {
                //Not a viable location, user cannot get there
            }
        }
        if (cost < minCost) {
            minCost = cost;
            bestLocIndex = l;
            //update users best tranport types
            for (u = 0; u < users.length; u++) {
                session.users[u].results
            }
            //user[u].results.transportationType
        }
    }

    
    for (let i = 0; i < session.users; i++) {
        await User.findOneAndUpdate({ _id: session.users[i]._id }, { "results.transportationType": userTransType[i] });
    }

    //search location objects for lowest cost
    return locations[bestLocIndex];
}

module.exports = driver;

