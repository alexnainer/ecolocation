import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import "./MapContainer.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
let randomColourArray = [
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
let mapBounds = [
  [-76.702106, 44.157578],
  [-76.285721, 44.355278],
];
let centerMap = [-76.5, 44.233334];
let map;
let numberOfSources = 0;

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

    let diff = users.length - numberOfSources;

    const calls = [];
    const startingCoords = [];
    const descr = [];
    const icon = [];

    let places = { type: "FeatureCollection", features: [] };

    console.log("session.users.length", session.users.length);
    for (let i = 0; i < session.users.length; i++) {
      if (users[i].results.transportationType) {
        calls.push(
          `https://api.mapbox.com/directions/v5/mapbox/${users[i].results.transportationType}/${users[i].location.geoJson.coordinates[0]}%2C${users[i].location.geoJson.coordinates[1]}%3B${session.results.geoJson.coordinates[0]}%2C${session.results.geoJson.coordinates[1]}?alternatives=false&overview=full&geometries=geojson&access_token=${process.env.REACT_APP_MAPBOX_API_KEY}`
        );
        startingCoords.push(users[i].location.geoJson.coordinates);
        descr.push(users[i].name);
        icon.push(determineIconOrigin(users[i].results.transportationType));
      } else {
        calls.push("");
      }
    }
    let counter = 0;
    for (let i = 0; i < session.users.length; i++) {
      const result = await axios.get(calls[i]);
      const route = result.data.routes[0].geometry.coordinates;

      const geojson = generateGeoJson(route);
      console.log(`lines-route${i}`);

      if (i >= numberOfSources) {
        if (users[i].results.transportationType) {
          counter++;
          let colour = randomColourArray[i];
          createLines(
            map,
            "route" + i.toString(),
            geojson.geometry.coordinates,
            colour
          );
          createCircle(
            map,
            "point-origin" + i.toString(),
            startingCoords[i],
            colour,
            0
          );
        }
      } else {
        map.getSource(`lines-route${i}`).setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: geojson.geometry.coordinates,
          },
        });

        map.getSource(`circles-point-origin${i}`).setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: startingCoords[i],
              },
            },
          ],
        });
      }
      places["features"].push(
        createPlace(descr[i], icon[i], startingCoords[i])
      );
    }
    //numberOfSources += counter;
    console.log("session", session);
    console.log("session.results", session.results);
    places["features"].push(
      createPlace(
        session.results.endpoint,
        determineIconEndPoint(session.results.endpointType),
        session.results.geoJson.coordinates
      )
    );
    map.getSource("places").setData(places);
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

    console.log("this.props", this.props);
    const { session } = this.props;
    const { users } = session;

    map.on("load", async function () {
      map.resize();

      const calls = [];
      const startingCoords = [];
      const descr = [];
      const icon = [];
      for (let i = 0; i < session.users.length; i++) {
        calls.push(
          `https://api.mapbox.com/directions/v5/mapbox/${users[i].results.transportationType}/${users[i].location.geoJson.coordinates[0]}%2C${users[i].location.geoJson.coordinates[1]}%3B${session.results.geoJson.coordinates[0]}%2C${session.results.geoJson.coordinates[1]}?alternatives=false&overview=full&geometries=geojson&access_token=${process.env.REACT_APP_MAPBOX_API_KEY}`
        );
        startingCoords.push(users[i].location.geoJson.coordinates);
        descr.push(users[i].name);
        icon.push(determineIconOrigin(users[i].results.transportationType));
      }

      // const descr = ["Julia", "Bob", "Bogdanoff"];

      // const icon = ["car", "bicycle", "toilet"];

      shuffleArray(randomColourArray);
      var places = { type: "FeatureCollection", features: [] };

      // session = get sessionSchema from backend
      // users = get users from session variable

      // below is loop through users.length
      for (let i = 0; i < calls.length; i++) {
        // stays
        var colour = randomColourArray[i % calls.length];

        //remove
        const result = await axios.get(calls[i]);
        //remove
        const route = result.data.routes[0].geometry.coordinates;

        // createplace using data from first user ->
        // descr : users['name']
        // icon : users['results'].transportationType
        // startingCoords : users['geoJson'].coordinates

        // route is users['results'].routes.data.routes[0].geometry.coordinates;
        const geojson = generateGeoJson(route);
        // Generate line from one origin to endpoint
        createLines(
          map,
          "route" + i.toString(),
          geojson.geometry.coordinates,
          colour
        );

        // Generate origin circles -> use users['geoJson'].coordinates
        createCircle(
          map,
          "point-origin" + i.toString(),
          startingCoords[i],
          colour,
          0
        );
        places["features"].push(
          createPlace(descr[i], icon[i], startingCoords[i])
        );
      }
      // Generate endpoint circle -> use sessions['result']['geoJson'].coordinates
      createCircle(
        map,
        "point-endpoint",
        session.results.geoJson.coordinates,
        "#000000",
        0
      );

      if (users.length > 0) {
        places["features"].push(
          createPlace(
            session.results.endpoint,
            determineIconEndPoint(session.results.endpointType),
            session.results.geoJson.coordinates
          )
        );
      }
      console.log(places);
      addSource(map, places);
      addLabelLayer(map);
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

function determineIconOrigin(transportType) {
  if (transportType === "driving") {
    return "car";
  } else if (transportType === "walking") {
    return "toilet";
  } else {
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

function createCircle(map, id, coordinates, colour, radius) {
  map.addSource(`circles-${id}`, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: coordinates,
          },
        },
      ],
    },
  });

  map.addLayer({
    id: id,
    type: "circle",
    source: `circles-${id}`,
    paint: {
      "circle-radius": radius,
      "circle-color": colour,
    },
  });
}

function addSource(map, places) {
  map.addSource("places", {
    type: "geojson",
    data: places,
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

function addLabelLayer(map) {
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

function createLines(map, id, coordinates, color) {
  numberOfSources++;
  console.log(`lines-${id}`);
  map.addSource(`lines-${id}`, {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
    },
  });

  map.addLayer({
    id: id,
    type: "line",
    source: `lines-${id}`,
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": color,
      "line-width": 5,
      "line-opacity": 1.0,
    },
  });
}

function generateGeoJson(route) {
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: route,
    },
  };
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
