import React, { Component } from "react";
import "./Calculate.css";

class Calculate extends Component {
  render() {
    return (
      <div className="calculateContainer">
        <p onClick={this.props.onClick} className="textStyle">
          Calculate
        </p>
        {/* <p className="resultContainer resultTextStyle">
          Your meeting location is [] with a carbon cost of []
          </p> */}
      </div>
    );
  }
}
export default Calculate;
