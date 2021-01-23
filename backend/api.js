const axios = require("axios");

const kingstonApiPrefix = "https://opendatakingston.cityofkingston.ca/api/records/1.0/search/?dataset=point-of-interest&q=&rows=10&facet=description&facet=name&refine.description="
const kingstonApiSuffix = "&timezone=America%2FNew_York"

const mapboxDirectionsApi = "https://api.mapbox.com/directions/v5/mapbox/"


const mapBoxApiKey = process.env.MAPBOX_API_KEY;

const getKingstonPointData = (options) => {
  return axios.get(
    '${kingstonApiPrefix}${options.location}${kingstonApiSuffix}'
  );
};


const getMapBoxDirections = (options) => {
  return axios.get(
    '${mapboxDirectionsApi}${options.routing}/${options.coordinates}?alternatives=false&geometries=geojson&steps=true&access_token=${mapBoxApiKey}'
  )
}


/*
const axios = require("axios");

const ontarioApi = "https://data.ontario.ca/api/3/action/datastore_search";
const mapBoxApi = "https://api.mapbox.com/geocoding/v5/mapbox.places";
const resourceIdPhu = "455fd63b-603d-4608-8216-7d8647f43350";
const resourceIdSchools = "8b6d22e2-7065-4b0f-966f-02640be366f2";
const resourceIdLtr = "4b64488a-0523-4ebb-811a-fac2f07e6d59";
const resourceIdChildCare = "eee282d3-01e6-43ac-9159-4ba694757aea";

const mapBoxApiKey = process.env.MAPBOX_API_KEY;

const limitPhu = 90000;
const limitSchools = 1000;
const limitLtr = 15000;
const limitChildCare = 5000;

const getAllPhuData = () => {
  return axios.get(
    `${ontarioApi}?resource_id=${resourceIdPhu}&limit=${limitPhu}`
  );
};

const getOptionsPhuData = (options) => {
  return axios.get(
    `${ontarioApi}?resource_id=${resourceIdPhu}&limit=${limitPhu}&filters=${JSON.stringify(
      options
    )}`
  );
};

const getSchoolData = () => {
  return axios.get(
    `${ontarioApi}?resource_id=${resourceIdSchools}&limit=${limitSchools}`
  );
};

const getLtrData = () => {
  return axios.get(
    `${ontarioApi}?resource_id=${resourceIdLtr}&limit=${limitLtr}`
  );
};

const getChildCareData = () => {
  return axios.get(`${ontarioApi}?resource_id=${resourceIdChildCare}&limit=${limitChildCare}`
  );
};

const getGeocoding = (query) => {
  return axios.get(
    `${mapBoxApi}/${encodeURIComponent(
      query
    )}.json?country=CA&access_token=${mapBoxApiKey}`
  );
};

module.exports = {
  getAllPhuData,
  getOptionsPhuData,
  getSchoolData,
  getChildCareData,
  getGeocoding,
  getLtrData,
};
*/
