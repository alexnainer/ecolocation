import React, { Component } from "react";
import "./Calculate.css";

class Calculate extends Component {
  render() {
    const { session } = this.props;
    return (
      <div className="calculateContainer">
        <p onClick={this.props.onClick} className="textStyle">
          Calculate
        </p>
        {session.results.endpoint && (
          <p className="resultContainer resultTextStyle">
            Your meeting location is {session.results.endpoint} with a carbon
            cost of {session.results.cost}g CO<sub>2</sub>
          </p>
        )}
      </div>
    );
  }
}
export default Calculate;
