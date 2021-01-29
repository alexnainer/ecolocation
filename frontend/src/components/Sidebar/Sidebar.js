import React, { Component } from "react";
import "./Sidebar.css";
import PersonButton from "../Users/PersonButton";
import AddPersonButton from "../Users/AddPersonButton";
import LocationPreferences from "./LocationPreferences";
import UserPreferences from "./UserPreferences";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {
        preferences: {
          carpool: false,
          maxWalkDistance: 0,
          maxCarDistance: 0,
          maxBicycleDistance: 0,
        },
        location: {
          searchString: "",
        },
      },
    };
  }

  handleAddPerson = () => {
    this.props.addPerson(`Person ${this.props.session.users.length + 1}`);
  };

  handlePersonSelected = (user) => {
    this.setState({ currentUser: user });
  };

  handleUpdateDistance = async (type, distance) => {
    await this.setState({
      currentUser: {
        ...this.state.currentUser,
        preferences: {
          ...this.state.currentUser.preferences,
          [type]: distance,
        },
      },
    });
    this.props.updatePerson(this.state.currentUser);
  };

  handleSearchChange = async (searchString) => {
    this.setState({
      currentUser: {
        ...this.state.currentUser,
        location: {
          ...this.state.currentUser.location,
          searchString,
        },
      },
    });
  };

  handleLocationChange = async (location, searchString) => {
    await this.setState({
      currentUser: {
        ...this.state.currentUser,
        location: {
          searchString,
          geoJson: location,
        },
      },
    });

    this.props.updatePerson(this.state.currentUser);
  };

  handleUpdateSessionPreferences = (type, value) => {
    console.log("type, value", type, value);
    console.log("this.props", this.props);
    const session = {
      ...this.props.session,
      locationPreferences: {
        ...this.props.session.locationPreferences,
        [type]: value,
      },
    };
    this.state.session.locationPreferences[type] = value;
    this.props.updateSession(session);
  };

  render() {
    return (
      <div className="sidebar-container">
        <div className="meeting-header">
          <h1 className="meeting-text">-- In your meeting --</h1>
        </div>
        <div className="list-container">
          {!this.props.loading &&
            this.props.session.users.map((user, index) => {
              return (
                <PersonButton
                  onClick={() => this.handlePersonSelected(user)}
                  name={user.name}
                  key={user._id}
                  index={index}
                  selected={user._id === this.state.currentUser._id}
                />
              );
            })}
        </div>
        <AddPersonButton onClick={this.handleAddPerson} />
        <UserPreferences
          currentUser={this.state.currentUser}
          handleUpdateDistance={this.handleUpdateDistance}
          handleLocationChange={this.handleLocationChange}
          handleSearchChange={this.handleSearchChange}
        />
        <LocationPreferences
          session={this.props.session}
          handleUpdateSessionPreferences={this.handleUpdateSessionPreferences}
        />
      </div>
    );
  }
}

export default Sidebar;
