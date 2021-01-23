import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import "./Container.css";
import api from "../../api/api";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async componentDidMount() {
    
  }


  render() {
    return (
      <div>
        
      </div>
    );
  }
}

export default Container;
