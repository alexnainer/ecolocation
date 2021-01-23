const gramsCO2PerMile = 404;

//These get populated from the city database
var location = {name:"City Hall", xLoc:"230", yLoc:"100", cost: 0}
const parkLocations = [park1, park2, park3];
const schoolLocations = [school1, school2, school3];
const libraryLocations = [library1, library2, library3];

//get array of user objects from front end of form:
var user = {name:"Mike", xLoc:"200", yLoc:"200", walkDist: 1000, CO2PerMile: 500}
const users = [user1, user2, user3];

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

const calculateCarbonEmission = (miles) => {
    return gramsCO2PerMile * miles;
}

const calculateDistance = (origin, end) => {
    //distance = api call to mapbox
    //return distance
}



//we need to get state of checkboxes from the frontend (parksTrue, schoolsTrue, libraryTrue)
const driver = (peopleOptions, endPointOptions, parksTrue, schoolsTrue, libraryTrue) => {
    // carbon cost array initalize
    posibleLocations = createPosibleLocationArray(parksTrue, schoolsTrue, libraryTrue)

    // for every people location in people locations:
    for (l = 0; l < posibleLocations.length; l++) {
        for (u = 0; u < users.length; u++) {
            var cost = 0;
            //costCalculator
            // distance = calculateDistance()
            // carbonEmission = calculateCarbonEmission()

            posibleLocations[l].cost = cost; 
        }
    }

    //search location objects for lowest cost
    return posibleLocations[lowestCost];
}

