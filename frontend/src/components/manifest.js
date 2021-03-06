import React, { Component } from "react";
import "./manifest.css";

class Manifest extends Component {
  render() {
    const { session } = this.props;
    return (
      <div className="manifestContainer">
        <p className="textStyleTitle">
          User - Departure - Arrive
        </p>
        <p className="textStyleCont">
          Mike - 1:32 - 2:00
        </p>
        <p className="textStyleCont">
          Aleks - 1:45 - 2:00
        </p>
        <p className="textStyleCont">
          Alex - 1:50 - 2:00
        </p>
        <p className="textStyleCont">
          Ryan - 1:55 - 2:00
        </p>
      </div>
    );
  }
}
export default Manifest;
