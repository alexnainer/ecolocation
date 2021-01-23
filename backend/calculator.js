const { Location } = require("./database/schemas");
const { User } = require("./database/schemas");
const { Session } = require("./database/schemas");
const api = require("./api");

const getSession = async () => {
    return await User.find({})
}

const getUserList = async () => {
    return await User.find({})
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

//needs locSelec and users from front end
const locSelec = [{name: "Outdoors", selec: true},
                  {name: "Government", selec: false},
                  {name: "Public", selec: true,
                  {name: "Cafe", selec: false},
                  {name: "Restaurant", selec: false},
                  {name: "Hotel", selec: false},]
const users = [{name:"Mike", xLoc:"200", yLoc:"200", walkDist: 1000, bikeDist: 5000, driveDist: 20000, CO2PerKm: 522},
               {name:"Alex", xLoc:"300", yLoc:"10", walkDist: 1000, bikeDist: 5000, driveDist: 20000, CO2PerKm: 140},
               {name:"Aleks", xLoc:"250", yLoc:"100", walkDist: 1000, bikeDist: 5000, driveDist: 20000, CO2PerKm: 304},
               {name:"Ryan", xLoc:"100", yLoc:"100", walkDist: 1000, bikeDist: 5000, driveDist: 20000, CO2PerKm: 293},]
//needs locSelec and users from front end

const driver = (locSelec, users, id) => {
    // carbon cost array initalize
    locations = createPosibleLocationArray(locSelec[0].selec, locSelec[1].selec, locSelec[2].selec, locSelec[3].selec, locSelec[4].selec, locSelec[5].selec)
    users = getUserList({});

    // loop through locations and users
    for (l = 0; l < locations.length; l++) {
        var cost = 0;
        for (u = 0; u < users.length; u++) {

            distanceWalk = calculateDistance(users[u].geoJson.coordinates, locations[l].geoJson.coordinates, "walking")
            distanceWalk = calculateDistance(users[u].geoJson.coordinates, locations[l].geoJson.coordinates, "cycling")
            distanceWalk = calculateDistance(users[u].geoJson.coordinates, locations[l].geoJson.coordinates, "driving")

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

