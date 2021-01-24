import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import "./MapContainer.css";
import api from "../../api/api";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
let map;

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  async componentDidMount() {
    var mapBounds = [
      [-76.702106, 44.157578],
      [-76.285721, 44.355278],
    ];
    map = new mapboxgl.Map({
      center: [-76.5, 44.233334],
      zoom: 14,
      maxZoom: 18,
      minZoom: 12,
      maxBounds: mapBounds,
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
    });

    map.on("load", async function () {
      map.resize();
      const calls = ["https://api.mapbox.com/directions/v5/mapbox/walking/-76.511188%2C44.221491%3B-76.500344%2C44.231040?alternatives=false&overview=full&geometries=geojson&access_token=pk.eyJ1IjoiYWxleDlyIiwiYSI6ImNraDgybmpzaDE2ejEycm84NXpoOTJidjIifQ.3orrdNJLc-SghBYF8paqzQ",
      "https://api.mapbox.com/directions/v5/mapbox/walking/-76.509857%2C44.233485%3B-76.500344%2C44.231040?alternatives=false&overview=full&geometries=geojson&access_token=pk.eyJ1IjoiYWxleDlyIiwiYSI6ImNraDgybmpzaDE2ejEycm84NXpoOTJidjIifQ.3orrdNJLc-SghBYF8paqzQ",
      "https://api.mapbox.com/directions/v5/mapbox/walking/-76.482195%2C44.234008%3B-76.500344%2C44.231040?alternatives=false&overview=full&geometries=geojson&access_token=pk.eyJ1IjoiYWxleDlyIiwiYSI6ImNraDgybmpzaDE2ejEycm84NXpoOTJidjIifQ.3orrdNJLc-SghBYF8paqzQ"];
      const startingCoords = [[-76.511188,44.221491], [-76.509857,44.233485], [-76.482195,44.234008]]
      for (let i=0; i < calls.length; i++) {
        var randomColour = "#" + ((1<<24)*Math.random() | 0).toString(16);
        const result = await axios.get(calls[i]);
        const route = result.data.routes[0].geometry.coordinates

        const geojsont = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route,
          },
        };
        console.log("LENGTH: ", route.length);
        map.addLayer({
          id: "route" + i.toString(),
          type: "line",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: geojsont.geometry.coordinates,
              },
            },
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": randomColour,
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });

        map.addLayer({
          id: "point" + i.toString(),
          type: "circle",
          source: {
            type: "geojson",
            data: {
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
            },
          },
          paint: {
            "circle-radius": 10,
            "circle-color": randomColour,
          },
        });


  
      }
      map.addLayer({
        id: "point",
        type: "circle",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: [-76.500344,44.231040],
                },
              },
            ],
          },
        },
        paint: {
          "circle-radius": 20,
          "circle-color": "#000000",
        },
      });


      //MapContainer.generateMapLines();
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

export default MapContainer;
