import React, { Component, Fragment } from "react";
import "./ResultsContainer.css";
import Calculate from "../../components/Calculate";
import DepartureTimes from "../../components/Sidebar/DepartureTimes";

class ResultsContainer extends Component {
  render() {
    return (
      <div
        className={`results-container ${
          this.props.sidebarHasHidden
            ? "results-container-hidden"
            : "results-container-shown"
        }`}
      >
        <DepartureTimes session={this.props.session} />
        <Calculate
          onClick={this.props.calculate}
          session={this.props.session}
          hasCalculated={this.props.hasCalculated}
        />
      </div>
    );
  }
}

export default ResultsContainer;
