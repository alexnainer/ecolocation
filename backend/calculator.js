const { Location } = require("./database/schemas");
const { User } = require("./database/schemas");
const api = require("./api");

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

const getLocationByType = async (type) => {
    return await Location.find({locationType: type})
}

const calculateDistance = (user, loc, tansportType) => {
    //distance = api call to mapbox
    //return distance
    options = {
        routing: tansportType,
        coordinates: [[user, user], [loc, loc]] //[origin, end]
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

const driver = (locSelec, users) => {
    // carbon cost array initalize
    posibleLocations = createPosibleLocationArray(locSelec[0].selec, locSelec[1].selec, locSelec[2].selec, locSelec[3].selec, locSelec[4].selec, locSelec[5].selec)

    // loop through locations and users
    for (l = 0; l < posibleLocations.length; l++) {
        var cost = 0;
        for (u = 0; u < users.length; u++) {

            distanceWalk = calculateDistance(users[u], posibleLocations[l], "walking")
            distanceWalk = calculateDistance(users[u], posibleLocations[l], "cycling")
            distanceWalk = calculateDistance(users[u], posibleLocations[l], "driving")

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

