import React, { Component } from "react";
import Autocomplete from "./Autocomplete";
import "./SearchBar.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSelect(place) {
    this.props.onLocationChange(place.geometry, place.place_name);
  }

  render() {
    return (
      <div class="searchbar">
        <Autocomplete
          onSelect={(place) => this.onSelect(place)}
          onSearchChange={(searchString) =>
            this.props.onSearchChange(searchString)
          }
          searchString={this.props.searchString}
        ></Autocomplete>
      </div>
    );
  }
}

export default SearchBar;
