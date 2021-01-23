require("dotenv").config({ path: "../.env" });
const api = require("../api");
console.log("API KEY: ", process.env.MAPBOX_API_KEY);

locations = ["Coffee", "Restaurant", "Hotel", "Pub", "Motel"];
coordinates = ["-76.500000,44.233334"];

locations.forEach((location) => {
  coordinates.forEach(async (coord) => {
    options = {
      location: location,
      coordinates: coord,
    };
    apiData = await api.getMapBoxGeocoding(options);

    formattedData = apiData.data.features.map((result) => {
      return {
        name: result.text,
        geoJson: {
          type: "Point",
          coordinates: result.geometry.coordinates,
        },
        type: locationGeneral(location),
        address: result.properties.address,
        description: result.place_name,
      };
    });
    console.log(formattedData);
  });

  // add data[location to database?]
});

function locationGeneral(name) {
  if (name === "Coffee") {
    return "Cafe";
  } else if (name === "Motel" || name === "Hotel") {
    return "Hotel";
  } else {
    return "Restaurant";
  }
}
