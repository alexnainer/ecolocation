const axios = require("axios");

const kingstonApiPrefix =
  "https://opendatakingston.cityofkingston.ca/api/records/1.0/search/?dataset=point-of-interest&q=&rows=230&facet=description&facet=name&refine.description=";
const kingstonApiSuffix = "&timezone=America%2FNew_York";

const mapboxDirectionsApi = "https://api.mapbox.com/directions/v5/mapbox/";
const mapboxOptimizationApi =
  "https://api.mapbox.com/optimized-trips/v1/mapbox/";
const mapboxGeoCodeApi = "https://api.mapbox.com/geocoding/v5/mapbox.places";

const mapBoxApiKey = process.env.MAPBOX_API_KEY;

const getKingstonPointData = (options) => {
  return axios.get(
    `${kingstonApiPrefix}${options.location}${kingstonApiSuffix}`
  );
};

const getMapBoxDirections = (options) => {
  return axios.get(
    `${mapboxDirectionsApi}${options.routing}/${options.coordinates};?alternatives=false&geometries=geojson&overview=full&access_token=${mapBoxApiKey}`
  );
};

const getMapBoxOptimization = (options) => {
  return axios.get(
    `${mapboxOptimizationApi}${options.routing}/${options.coordinates}?destination=last&access_token=${mapBoxApiKey}`
  );
};

const getMapBoxGeocoding = (options) => {
  return axios.get(
    `${mapboxGeoCodeApi}/${encodeURIComponent(
      options.location
    )}.json?country=CA&limit=10&proximity=${
      options.coordinates
    }&access_token=${mapBoxApiKey}`
  );
};

module.exports = {
  getMapBoxGeocoding,
  getMapBoxOptimization,
  getMapBoxDirections,
  getKingstonPointData,
};
