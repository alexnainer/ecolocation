import React, { Component } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import "./MapContainer.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import { isEqual, xorWith, isEmpty } from "lodash";
import carSvg from "../../images/carIcon.svg";
import walkingSvg from "../../images/walkingIcon.svg";
import bikingSvg from "../../images/bikingIcon.svg";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

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
  [-77.002106, 44.157578],
  [-76.085721, 44.355278],
];

const centerMap = [-76.5, 44.233334];
let map;
let mapInformation;

class MapContainer extends Component {
  constructor(props) {
    momentDurationFormatSetup(moment);
    super(props);
    this.state = {
      loading: this.props.loading,
    };
  }

  async componentDidUpdate(prevProps) {
    if (
      !isEqual(prevProps.session, this.props.session) ||
      !this.areArraysEqual(prevProps.session.users, this.props.session.users)
    ) {
      console.log("didUpdate");
      const { session } = this.props;
      const { users } = session;

      this.createMapInformation(session, users);
      this.initializeApiArrays(users, session);
      this.addMapLayers(session);
    } else {
      console.log("didntUpdate");
    }
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
    this.loadCustomImages();
    const { session } = this.props;
    const { users } = session;

    map.on("load", async () => {
      console.log("WE LOADED");

      map.resize();

      this.createMapInformation(session, users);

      this.shuffleArray(randomColourArray);

      this.createCirclesSource();
      this.createCirclesLayer("circles", 10);

      this.createLinesSource();
      this.createLineLayer("lines");

      this.createPlacesSource();
      this.addLabelLayer();

      if (!mapInformation.session.users?.length) return;

      this.initializeApiArrays(users, session);

      this.addMapLayers(session);
    });
  }

  areArraysEqual = (x, y) => {
    return isEmpty(xorWith([x, y], isEqual));
  };

  handleMarkerClick = (currentMarker, i) => {
    this.flyToLocation(currentMarker.getLngLat());
    this.props.updateCurrentUserIndex(i);
  };

  createMapInformation = (session, users) => {
    mapInformation = {};
    mapInformation.session = session;
    mapInformation.users = users;
    mapInformation.startingCoords = [];
    mapInformation.calls = [];
    mapInformation.descriptions = [];
    mapInformation.icons = [];
    mapInformation.places = [];
    mapInformation.durations = [];
    mapInformation.ids = [];
  };

  addMapLayers = async (session) => {
    mapInformation.places = { type: "FeatureCollection", features: [] };
    mapInformation.circleData = { type: "FeatureCollection", features: [] };
    mapInformation.lineData = { type: "FeatureCollection", features: [] };

    for (let i = 0; i < mapInformation.calls.length; i++) {
      var colour = randomColourArray[i % mapInformation.calls.length];
      if (!mapInformation.calls[i]) continue;
      const result = await axios.get(mapInformation.calls[i]);
      const route = result.data.routes[0].geometry.coordinates;

      mapInformation.circleData.features.push(
        this.createCircle(
          mapInformation.startingCoords[i],
          mapInformation.ids[i],
          colour
        )
      );
      mapInformation.places.features.push(
        this.createPlace(
          mapInformation.descriptions[i],
          mapInformation.icons[i],
          mapInformation.ids[i],
          mapInformation.startingCoords[i],
          1.0
        )
      );
      mapInformation.lineData.features.push(
        this.createLine(route, mapInformation.ids[i], colour)
      );
    }

    mapInformation.places.features.push(
      this.createPlace(
        session.results.endpoint,
        this.determineIconEndPoint(session.results.endpointType),
        session.id,
        session.results.geoJson.coordinates,
        2.6
      )
    );
    mapInformation.circleData.features.push(
      this.createCircle(
        session.results.geoJson.coordinates,
        session.id,
        "#000000"
      )
    );

    map.getSource("circlesData").setData(mapInformation.circleData);
    map.getSource("places").setData(mapInformation.places);
    map.getSource("lines").setData(mapInformation.lineData);
    this.createMarkerPopups();
  };

  createMarkerPopups = () => {
    for (let i = 0; i < mapInformation.places.features.length; i++) {
      let marker = mapInformation.places.features[i];
      let duration = mapInformation.durations[i];
      if (mapInformation.places.features.length) {
        if (marker.properties.id != mapInformation.session.id) {
          // create a HTML element for each feature
          var el = document.createElement("div");
          el.className = "marker";
          // make a marker for each feature and add to the map

          console.log(
            "marker.geometry.coordinates",
            marker.geometry.coordinates
          );
          if (!(marker?.geometry?.coordinates?.length === 2)) return;

          const mapMarker = new mapboxgl.Marker(el)
            .setLngLat({
              lng: marker.geometry.coordinates[0],
              lat: marker.geometry.coordinates[1],
            })
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(
                  "<h3>" +
                    marker.properties.description +
                    `<div class='d-inline-block transport-text'>is ${marker.properties.icon}</div>` +
                    "</h3><h4>" +
                    "<b>Duration: </b>" +
                    duration +
                    "</h4><h4>" +
                    "<b>Address: </b>" +
                    mapInformation.users[i].location.searchString +
                    "</h4>"
                )
            )
            .addTo(map);
          mapMarker.getElement().addEventListener("click", () => {
            this.handleMarkerClick(mapMarker, i);
          });
        } else if (marker.properties.id == mapInformation.session.id) {
          var el = document.createElement("div");
          el.className = "marker";

          if (!(marker?.geometry?.coordinates?.length === 2)) return;

          const mapMarker = new mapboxgl.Marker(el)
            .setLngLat({
              lng: marker.geometry.coordinates[0],
              lat: marker.geometry.coordinates[1],
            })
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(
                  "<h3>" + marker.properties.description + "</h3><h4></h4>"
                )
            )
            .addTo(map);
          mapMarker.getElement().addEventListener("click", () => {
            this.handleMarkerClick(mapMarker);
          });
        }
      }
    }
  };

  loadCustomImages = () => {
    let carimg = new Image(70, 70);
    carimg.onload = () => map.addImage("Driving", carimg);
    carimg.src = carSvg;

    let bikeimg = new Image(70, 70);
    bikeimg.onload = () => map.addImage("Biking", bikeimg);
    bikeimg.src = bikingSvg;

    let walkimg = new Image(70, 70);
    walkimg.onload = () => map.addImage("Walking", walkimg);
    walkimg.src = walkingSvg;
  };

  flyToLocation = (featureCoordinates) => {
    map.flyTo({
      center: featureCoordinates,
      zoom: 15,
    });
  };

  determineIconOrigin = (transportType) => {
    switch (transportType) {
      case "driving":
        return "Driving";
      case "walking":
        return "Walking";
      case "cycling":
        return "Biking";
    }
  };

  determineIconEndPoint = (ept) => {
    switch (ept) {
      case "Outdoors":
        return "garden-15";
      case "Cafe":
        return "cafe-15";
      case "Government Building":
        return "town-hall-15";
      case "Public Building":
        return "college-15";
      case "hotel":
        return "suitcase-15";
      case "Restaurant":
        return "restaurant-15";
    }
  };

  initializeApiArrays = async (users, session) => {
    for (let i = 0; i < session.users.length; i++) {
      if (users[i].results.transportationType) {
        mapInformation.calls.push(
          `https://api.mapbox.com/directions/v5/mapbox/${users[i].results.transportationType}/${users[i].location.geoJson.coordinates[0]}%2C${users[i].location.geoJson.coordinates[1]}%3B${session.results.geoJson.coordinates[0]}%2C${session.results.geoJson.coordinates[1]}?alternatives=false&overview=full&geometries=geojson&access_token=${process.env.REACT_APP_MAPBOX_API_KEY}`
        );
        mapInformation.startingCoords.push(
          users[i].location.geoJson.coordinates
        );
        mapInformation.descriptions.push(users[i].name);
        mapInformation.icons.push(
          this.determineIconOrigin(users[i].results.transportationType)
        );
        mapInformation.durations.push(
          moment
            .duration(users[i].results.durationSeconds, "seconds")
            .format("m [minutes]")
        );
        mapInformation.ids.push(users[i]._id);
      } else {
        mapInformation.calls.push("");
      }
    }
  };

  createLinesSource = () => {
    map.addSource("lines", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: { type: "FeatureCollection", features: [] },
      },
    });
  };

  createLineLayer = (id) => {
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
  };

  createLine = (coordinates, id, colour) => {
    return {
      type: "geojson",
      type: "Feature",
      properties: {
        id: id,
        color: colour,
      },
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
    };
  };

  createCirclesSource = () => {
    map.addSource("circlesData", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: { type: "FeatureCollection", features: [] },
      },
    });
  };

  createCirclesLayer = (id, radius) => {
    map.addLayer({
      id: id,
      type: "circle",
      source: "circlesData",
      paint: {
        "circle-radius": 0,
        "circle-color": ["get", "color"],
      },
    });
  };

  createCircle = (coordinates, id, colour) => {
    return {
      type: "Feature",
      properties: {
        id: id,
        color: colour,
      },
      geometry: {
        type: "Point",
        coordinates: coordinates,
      },
    };
  };

  createPlacesSource = () => {
    map.addSource("places", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
  };

  addLabelLayer = () => {
    map.addLayer({
      id: "poi-labels",
      type: "symbol",
      source: "places",
      layout: {
        "text-field": ["get", "description"],
        "text-variable-anchor": ["top", "bottom", "left", "right"],
        "text-radial-offset": 1.5,
        "text-justify": "auto",
        "icon-image": ["concat", ["get", "icon"]],
        "icon-allow-overlap": true,
        "text-allow-overlap": true,
        "icon-size": ["get", "iconsize"],
      },
      paint: {
        "text-color": "#ffffff",
      },
    });
  };

  createPlace = (description, icon, id, coord, iconsize) => {
    var places = {
      type: "Feature",
      properties: {
        description: description,
        icon: icon,
        iconsize: iconsize,
        id: id,
      },
      geometry: {
        type: "Point",
        coordinates: coord,
      },
    };
    return places;
  };

  shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

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
            <div
              ref={(el) => (this.mapContainer = el)}
              id="map"
              className="map"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MapContainer;
