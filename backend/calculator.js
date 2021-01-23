
const carCO2perKm = [{name: "Smart Car", co2: 124},
                     {name: "Honda Civic", co2: 140},
                     {name: "Toyota Camry", co2: 164},
                     {name: "Acura TLX", co2: 205},
                     {name: "Ford F-150", co2: 293},
                     {name: "Audi R8", co2: 304},
                     {name: "Bugatti Chiron", co2: 522},
                    ]

//These get populated from the city database
var location = {name:"City Hall", xLoc:"230", yLoc:"100", cost: 0}
const parkLocations = [park1, park2, park3];
const schoolLocations = [school1, school2, school3];
const libraryLocations = [library1, library2, library3];

//get array of user objects from front end of form:
var user = {name:"Mike", xLoc:"200", yLoc:"200", walkDist: 1000, bikeDist: 5000, driveDist: 20000, CO2PerKm: 500}
const users = [user];

const storeMeetingLocation = (x, y, array) => {
    array.push({x: x, y: y});
}

const createPosibleLocationArray = (parksTrue, schoolsTrue, libraryTrue) => {
    var posibleLocations = [];

    if (parksTrue) {posibleLocations = posibleLocations.concat(parkLocations);}
    if (schoolsTrue) {posibleLocations = posibleLocations.concat(schoolLocations);}
    if (libraryTrue) {posibleLocations = posibleLocations.concat(libraryLocations);}  

    return posibleLocations;
}

const calculateDistance = (user, location, tansportType) => {
    //distance = api call to mapbox
    //return distance
}



//we need to get state of checkboxes from the frontend (parksTrue, schoolsTrue, libraryTrue)
const driver = (parksTrue, schoolsTrue, libraryTrue) => {
    // carbon cost array initalize
    posibleLocations = createPosibleLocationArray(parksTrue, schoolsTrue, libraryTrue)

    // loop through locations and users
    for (l = 0; l < posibleLocations.length; l++) {
        var cost = 0;
        for (u = 0; u < users.length; u++) {

            distanceWalk = calculateDistance(users[u], posibleLocations[l], "walking")
            distanceWalk = calculateDistance(users[u], posibleLocations[l], "bike")
            distanceWalk = calculateDistance(users[u], posibleLocations[l], "drive")

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

