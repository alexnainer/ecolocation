import React, { Component, Fragment } from "react";
import "./Sidebar.css";
import LocationPreferenceCheckbox from "./LocationPreferenceCheckbox";

let centerMap = [-76.5, 44.233334];
let map;
let numberOfSources = 0;

const locationLabels = {
  cafe: "Café",
  outdoors: "Parks",
  government: "Gov. Building",
  restaurant: "Restaurants",
  hotel: "Hotels",
  publicBuilding: "Public Buildings",
};

class LocationPreferences extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    const { session } = this.props;
    const locationPreferences = Object.keys(session.locationPreferences);

    return (
      <Fragment>
        {locationPreferences.map((pref) => {
          return (
            <LocationPreferenceCheckbox
              onClick={this.props.handleUpdateSessionPreferences}
              locationType={pref}
              locationLabel={locationLabels[pref]}
              checked={session.locationPreferences[pref]}
            />
          );
        })}
      </Fragment>
    );
  }
}

export default LocationPreferences;
