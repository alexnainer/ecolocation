import React, { Component } from "react";
import "./Calculate.css";

class Calculate extends Component {
  render() {
    const { session } = this.props;
    return (
      <div className="calculateContainer">
        <div className="calculate-button">
          <p onClick={this.props.onClick} className="textStyle">
            Calculate
          </p>
        </div>
        {session.results.endpoint && (
          <dib className="resultContainer resultTextStyle">
            Your meeting location is {session.results.endpoint} with a carbon
            cost of {session.results.cost}g CO<sub>2</sub>
          </dib>
        )}
      </div>
    );
  }
}
export default Calculate;
