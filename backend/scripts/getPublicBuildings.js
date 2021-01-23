const api = require("../api");
require("dotenv").config();

locations = [
  "Park",
  "Playground",
  "Queen's University",
  "Education Facility",
  "Community Service",
  "Parkette",
  "Government Centre",
  "Municipal Government Facility",
  "Library",
  "Recreation Facility",
  "Athletic Centre",
];

data = locations.map(async (location) => {
  options = {
    location: location,
  };
  apiData = await api.getKingstonPointData(options);

  formattedData = apiData.data.records.map((result) => {
    console.log("LOCATION: ", result.fields.name);
    console.log("COORDINATES: ", result.fields.geojson.coordinates);
    return {
      name: result.fields.name,
      geoJson: {
        type: "Point",
        coordinates: result.fields.geojson.coordinates,
      },
      type: locationGeneral(result.name),
      address: result.fields.address,
      description: result.fields.description,
    };
  });

  console.log(formattedData);

  // add data[location to database?]
});

function locationGeneral(name) {
  if (name === "Park" || name === "Playground" || name === "Parkette") {
    return "Outdoors";
  } else if (
    name === "Municipal Government Facility" ||
    name === "Government Centre"
  ) {
    return "Government Building";
  } else {
    return "Public Building";
  }
}
