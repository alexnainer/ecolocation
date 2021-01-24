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

    map.resize();

    map.on("load", async function () {
      map.resize();
      const result = await axios.get("https://api.mapbox.com/directions/v5/mapbox/walking/-76.502106%2C44.257578%3B-76.285721%2C44.355278?alternatives=false&overview=full&geometries=geojson&access_token=pk.eyJ1IjoiYWxleDlyIiwiYSI6ImNraDgybmpzaDE2ejEycm84NXpoOTJidjIifQ.3orrdNJLc-SghBYF8paqzQ");
      console.log(result);
      const json = result.data;
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      console.log(route);
      const geojsont = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };
      console.log("LENGTH: ", route.length);
      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: geojsont.geometry.coordinates,
            }
          }
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });

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
