import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import "./MapContainer.css";
import api from "../../api/api";
import CircularProgress from "@material-ui/core/CircularProgress";

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
    map = new mapboxgl.Map({
      center: [-79.3832, 43.6532],
      zoom: 7,
      maxZoom: 11,
      minZoom: 4,
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
    });

    map.resize();

    map.on("load", function () {
      map.resize();
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
