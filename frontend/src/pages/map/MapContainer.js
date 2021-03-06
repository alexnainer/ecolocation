import React, { Component } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import "./MapContainer.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

const randomColourArray = [
  "#E71212",
  "#E77C12",
  "#6A9D11",
  "#085F18",
  "#13E3B4",
  "#13AEE3",
  "#133CE3",
  "#8E13E3",
  "#E313D4",
  "#EEB9EE",
  "#A8B4FF",
  "#66ccff",
  "#ffff66",
  "#ffcc00",
];

const mapBounds = [
  [-76.702106, 44.157578],
  [-76.285721, 44.355278],
];

const centerMap = [-76.5, 44.233334];
let map;

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  async componentDidUpdate() {
    console.log("didUpdate");

    const { session } = this.props;
    const { users } = session;

    const calls = [];
    const startingCoords = [];
    const descriptions = [];
    const icons = [];

    initializeApiArrays(users, session, calls, startingCoords, descriptions, icons);

    addMapLayers(session, calls, startingCoords, descriptions, icons);
  }

  async componentDidMount() {
    map = new mapboxgl.Map({
      center: centerMap,
      pitchWithRotate: false,
      dragRotate: false,
      zoom: 14,
      maxZoom: 16,
      minZoom: 13,
      maxBounds: mapBounds,
      container: "map",
      style: "mapbox://styles/mapbox/navigation-guidance-night-v4",
    });

    const { session } = this.props;
    const { users } = session;

    map.on("load", async function () {
      console.log("WE LOADED");

      map.resize();

      const calls = [];
      const startingCoords = [];
      const descriptions = [];
      const icons = [];

      shuffleArray(randomColourArray);

      createCirclesSource();
      createCirclesLayer("circles", 10);

      createLinesSource();
      createLineLayer("lines");

      createPlacesSource();
      addLabelLayer();

      initializeApiArrays(users, session, calls, startingCoords, descriptions, icons);

      addMapLayers(session, calls, startingCoords, descriptions, icons);
    });
  }

  render() {
    return (
      <div>
        <div className="d-flex justify-content-end align-items-end">
          {this.state.loading && (
            <div className="loading position-absolute d-flex justify-content-center align-items-center">
              <CircularProgress />
            </div>
          )}
          <div className="map-container">
            <div ref={(el) => (this.mapContainer = el)} id="map" className="map" />
          </div>
        </div>
      </div>
    );
  }
}

async function addMapLayers(session, calls, startingCoords, descriptions, icons) {
  let places = { type: "FeatureCollection", features: [] };
  let circleData = { type: "FeatureCollection", features: [] };
  let lineData = { type: "FeatureCollection", features: [] };

  for (let i = 0; i < calls.length; i++) {
    var colour = randomColourArray[i % calls.length];
    const result = await axios.get(calls[i]);
    const route = result.data.routes[0].geometry.coordinates;

    circleData.features.push(createCircle(startingCoords[i], colour));
    places.features.push(createPlace(descriptions[i], icons[i], startingCoords[i]));
    lineData.features.push(createLine(route, colour));
  }

  places["features"].push(
    createPlace(
      session.results.endpoint,
      determineIconEndPoint(session.results.endpointType),
      session.results.geoJson.coordinates
    )
  );
  circleData.features.push(createCircle(session.results.geoJson.coordinates, "#000000"));

  map.getSource("circlesData").setData(circleData);
  map.getSource("places").setData(places);
  map.getSource("lines").setData(lineData);
  createMarkerPopup(places);
}

function createMarkerPopup(data) {
  data.features.forEach(function (marker) {
    if (marker.geometry.coordinates.length) {
      // create a HTML element for each feature
      var el = document.createElement("div");
      el.className = "marker";
      console.log("COORDIANTES: ", marker.geometry.coordinates)
      
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat({lng: marker.geometry.coordinates[0], lat: marker.geometry.coordinates[1]})
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML("<h5>" + marker.properties.description + "</h5><p>" + "Transport Type: " + marker.properties.icon + "</p>")
        )
        .addTo(map);
    }
      
  });
}

function determineIconOrigin(transportType) {
  switch (transportType) {
    case "driving":
      return "car";
    case "walking":
      return "toilet";
    case "cycling":
      return "bicycle";
  }
}

function determineIconEndPoint(ept) {
  switch (ept) {
    case "Outdoors":
      return "garden";
    case "Cafe":
      return "cafe";
    case "Government Building":
      return "town-hall";
    case "Public Building":
      return "college";
    case "hotel":
      return "suitcase";
    case "Restaurant":
      return "restaurant";
  }
}

function initializeApiArrays(users, session, calls, startingCoords, descriptions, icons) {
  for (let i = 0; i < session.users.length; i++) {
    if (users[i].results.transportationType) {
      calls.push(
        `https://api.mapbox.com/directions/v5/mapbox/${users[i].results.transportationType}/${users[i].location.geoJson.coordinates[0]}%2C${users[i].location.geoJson.coordinates[1]}%3B${session.results.geoJson.coordinates[0]}%2C${session.results.geoJson.coordinates[1]}?alternatives=false&overview=full&geometries=geojson&access_token=${process.env.REACT_APP_MAPBOX_API_KEY}`
      );
      startingCoords.push(users[i].location.geoJson.coordinates);
      descriptions.push(users[i].name);
      icons.push(determineIconOrigin(users[i].results.transportationType));
    } else {
      calls.push("");
    }
  }
}

function createLinesSource() {
  map.addSource("lines", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: { type: "FeatureCollection", features: [] },
    },
  });
}

function createLineLayer(id) {
  map.addLayer({
    id: id,
    type: "line",
    source: "lines",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": ["get", "color"],
      "line-width": 5,
      "line-opacity": 1.0,
    },
  });
}

function createLine(coordinates, colour) {
  return {
    type: "geojson",
    type: "Feature",
    properties: {
      color: colour,
    },
    geometry: {
      type: "LineString",
      coordinates: coordinates,
    },
  };
}

function createCirclesSource() {
  map.addSource("circlesData", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: { type: "FeatureCollection", features: [] },
    },
  });
}

function createCirclesLayer(id, radius) {
  map.addLayer({
    id: id,
    type: "circle",
    source: "circlesData",
    paint: {
      "circle-radius": radius,
      "circle-color": ["get", "color"],
    },
  });
}

function createCircle(coordinates, colour) {
  return {
    type: "Feature",
    properties: {
      color: colour,
    },
    geometry: {
      type: "Point",
      coordinates: coordinates,
    },
  };
}

function createPlacesSource() {
  map.addSource("places", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });
}

function addLabelLayer() {
  map.addLayer({
    id: "poi-labels",
    type: "symbol",
    source: "places",
    layout: {
      "text-field": ["get", "description"],
      "text-variable-anchor": ["top", "bottom", "left", "right"],
      "text-radial-offset": 1.5,
      "text-justify": "auto",
      "icon-image": ["concat", ["get", "icon"], "-15"],
      "icon-size": 2.3,
    },
    paint: {
      "text-color": "#ffffff",
    },
  });
}

function createPlace(description, icon, coord) {
  var places = {
    type: "Feature",
    properties: {
      description: description,
      icon: icon,
    },
    geometry: {
      type: "Point",
      coordinates: coord,
    },
  };
  return places;
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export default MapContainer;
