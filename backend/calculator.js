const { Location, Session, User } = require("./database/schemas");
const api = require("./api");

const getSession = (id) => {
  return Session.findOne({ id: id });
};

const getUsers = async (userIDs) => {
    users = [];
  for (let u = 0; u < userIDs.length; u++) {
    users.push( await User.find({ _id: userIDs[u]}))
  }
  return users;
};

const getLocationByType = (type) => {
  return Location.find({ locationType: type });
};

const createPosibleLocationArray = async (
  cafeTrue,
  outdoorsTrue,
  governmentTrue,
  restaurantTrue,
  hotelTrue,
  publicTrue
) => {
  var posibleLocations = [];

  if (outdoorsTrue) {
    posibleLocations = posibleLocations.concat(await getLocationByType("Outdoors"));
  }
  if (governmentTrue) {
    posibleLocations = posibleLocations.concat(await getLocationByType("Government Building"));
  }
  if (publicTrue) {
    posibleLocations = posibleLocations.concat(await getLocationByType("Public Building"));
  }
  if (cafeTrue) {
    posibleLocations = posibleLocations.concat(await getLocationByType("Cafe"));
  }
  if (restaurantTrue) {
    posibleLocations = posibleLocations.concat(await getLocationByType("Restaurant"));
  }
  if (hotelTrue) {
    posibleLocations = posibleLocations.concat(await getLocationByType("Hotel"));
  }

  return posibleLocations;
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
    result = await api.getMapBoxDirections(options);
    //console.log("result", result.data.routes[0].distance);
    result = result.data.routes[0].distance;
    return result;
  };

const driver = async (id) => {
  session = await getSession(id);
  userIDs = session.users;
  users = await getUsers(userIDs);
  locations = await createPosibleLocationArray(
    session.locationPreferences.cafe,
    session.locationPreferences.outdoors,
    session.locationPreferences.government,
    session.locationPreferences.restaurant,
    session.locationPreferences.hotel,
    session.locationPreferences.publicBuilding
  );
  
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
      let distanceWalk = await calculateDistance(users[u][0].location.geoJson.coordinates,locations[l].geoJson.coordinates,"walking");
      let distanceCycling = await calculateDistance(users[u][0].location.geoJson.coordinates,locations[l].geoJson.coordinates,"cycling");
      let distanceDriving = await calculateDistance(users[u][0].location.geoJson.coordinates,locations[l].geoJson.coordinates,"driving");

      console.log("@@@@@@", users[u][0].preferences.maxWalkDistance)
      console.log("dist", distanceWalk)
      if (distanceWalk <= (users[u][0].preferences.maxWalkDistance)*1000) {
        //user will walk no C02 Cost
        tempTransTypes.push("walking");
      } else if (distanceCycling <= (users[u][0].preferences.maxBicycleDistance)*1000) {
        //user will bike no C02 Cost
        tempTransTypes.push("cycling");
      } else if (distanceDriving <= (users[u][0].preferences.maxCarDistance)*1000) {
        //user will drive
        //cost += distanceDriving * users[u][0].preferences.carType;
        cost += distanceDriving * 200;
        tempTransTypes.push("driving");
      } else {
        //Not a viable location, user cannot get there
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
      }
    }
    if (cost < minCost) {
      minCost = cost;
      bestLocIndex = l;
      userTransTypes = tempTransTypes;
      bestLocationName = locations[bestLocIndex].name;
      bestLocationType = locations[bestLocIndex].locationType;

      console.log("minCost", minCost);
      console.log("index", bestLocIndex);
      console.log("TransTypes", userTransTypes);
      //update users best tranport types
    
    }
  }

  for (let i = 0; i < session.users.length; i++) {
    await User.findOneAndUpdate({ _id: session.users[i]._id },{ "results.transportationType": userTransTypes[i] });
    //console.log("BoogMEOnce", users[i][0].location);
    var result = calculateDistanceFull(users[i][0].location.geoJson.coordinates,locations[bestLocIndex].geoJson.coordinates,userTransTypes[i]);
    await User.findOneAndUpdate({ _id: session.users[i]._id },{ "results.routes": result });
  }
  await Session.findOneAndUpdate({ id: id }, { "results.cost": minCost });
  await Session.findOneAndUpdate({ id: id },{ "results.geoJson": locations[bestLocIndex].geoJson });
  await Session.findOneAndUpdate({ id: id },{ "results.endpoint": bestLocationName });
  await Session.findOneAndUpdate({ id: id },{ "results.endpointType": bestLocationType });
};

module.exports = driver;
