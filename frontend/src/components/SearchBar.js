import React, { Component } from "react";
import Autocomplete from "./Autocomplete";
import "./SearchBar.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
// import MapGL from "react-map-gl";

// mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
// let geocoder;

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    // geocoder = new MapboxGeocoder({
    //   accessToken: mapboxgl.accessToken,
    //   mapboxgl: mapboxgl,
    // });
  }

  onSelect(place) {
    console.log("place", place);
  }

  render() {
    return (
      <div class="searchbar">
        <Autocomplete onSelect={(place) => this.onSelect(place)}></Autocomplete>
      </div>
    );
  }
}

export default SearchBar;
