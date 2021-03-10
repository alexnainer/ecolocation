import React, { Component, Fragment } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "./Sidebar.css";

class LocationPreferenceCheckbox extends Component {
  render() {
    return (
      <FormControlLabel
        value="walking"
        control={
          <Checkbox
            checked={this.props.checked}
            onClick={(e) =>
              this.props.onClick(this.props.locationType, e.target.checked)
            }
            color="primary"
            size="small"
            style={{ width: 25 }}
          />
        }
        label={
          <span style={{ fontSize: "30px", fontFamily: "Teko" }}>
            {this.props.locationLabel}
          </span>
        }
        labelPlacement="start"
        className="locationCheckboxText"
      />
    );
  }
}

export default LocationPreferenceCheckbox;
