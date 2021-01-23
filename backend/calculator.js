const { Location } = require("./database/schemas");
const { User } = require("./database/schemas");
const { Session } = require("./database/schemas");
const api = require("./api");

const getSession = async (id) => {
    return await User.find({id: id})
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

    // loop through locations and users
    for (l = 0; l < locations.length; l++) {
        var cost = 0;
        for (u = 0; u < users.length; u++) {

            distanceWalk = calculateDistance(users[u].geoJson.coordinates, locations[l].geoJson.coordinates, "walking")
            distanceCycling = calculateDistance(users[u].geoJson.coordinates, locations[l].geoJson.coordinates, "cycling")
            distanceDriving = calculateDistance(users[u].geoJson.coordinates, locations[l].geoJson.coordinates, "driving")

            if (distanceWalk <= users[u].walkDist) {
                //user will walk no C02 Cost
            }else if (distanceBike <= users[u].bikeDist) {
                //user will bike no C02 Cost
            }else if (distanceDrive <= users[u].driveDist) {
                //user will drive
                cost += distance*users[u].CO2PerKm
            }else {
                //Not a viable location, user cannot get there
            }
            cost += distance*users[u].CO2PerKm
        }
        posibleLocations[l].cost = cost; 
    }

    //search location objects for lowest cost
    return posibleLocations[lowestCost];
}

const storeMeetingLocation = (x, y, array) => {
    array.push({x: x, y: y});
}

