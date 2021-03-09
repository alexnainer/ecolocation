import React, { Component } from "react";
import "./Sidebar.css";
import PersonButton from "../Users/PersonButton";
import AddPersonButton from "../Users/AddPersonButton";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Form from "react-bootstrap/Form";
import LocationPreferences from "./LocationPreferences";
import UserPreferences from "./UserPreferences";
import Collapse from "@material-ui/core/Collapse";
import SearchBar from "../SearchBar";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUserPreferences: false,
      showLocationPreferences: false,
      currentUserIndex: -1,
    };
  }

  handleAddPerson = () => {
    this.props.addPerson(`Person ${this.props.session.users.length + 1}`);
  };

  handlePersonSelected = (index) => {
    // this.setState({ currentUser: user });
    this.setState({
      currentUserIndex: index,
      showUserPreferences: true,
      showLocationPreferences: true,
    });
  };

  setShowUserPreferences = (show) => {
    this.setState({
      showUserPreferences: show,
    });
  };

  async handleUpdateDistance(type, distance) {
    const { currentUserIndex } = this.state;
    const { currentUser } = this.props.session.users[currentUserIndex];
    const user = {
      ...currentUser,
      preferences: {
        ...currentUser,
        [type]: distance,
      },
    };

    this.props.updatePerson(user);
  }

  handlePersonNameChange = async (name, index) => {
    const user = {
      ...this.props.session.users[index],
      name,
    };
    this.props.updatePerson(user);
  };

  handleSearchChange = async (searchString) => {
    const { currentUserIndex } = this.state;
    const currentUser = this.props.session.users[currentUserIndex];
    const user = {
      ...currentUser,
      location: {
        ...currentUser.location,
        searchString,
      },
    };
    this.props.updatePerson(user);
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

  async handleUpdateSessionPreferences(type, value) {
    const session = {
      ...this.props.session,
      locationPreferences: {
        ...this.props.session.locationPreferences,
        [type]: value,
      },
    };
    this.props.updateSession(session);
  }

  render() {
    const { session } = this.props;
    const {
      currentUserIndex,
      showUserPreferences,
      showLocationPreferences,
    } = this.state;
    let currentUser;
    if (currentUserIndex >= 0) {
      currentUser = session.users[currentUserIndex];
    }
    const {
      cafe,
      outdoors,
      government,
      restaurant,
      hotel,
      publicBuilding,
    } = session.locationPreferences;

    return (
      <div className="sidebar-container">
        <div className="meeting-container">
          <div className="meeting-header">
            <h1 className="meeting-text">-- In your meeting --</h1>
          </div>
          <div className="list-container">
            {!this.props.loading &&
              this.props.session.users.map((user, index) => {
                return (
                  <PersonButton
                    onClick={() => this.handlePersonSelected(index)}
                    onPersonNameChange={(name) =>
                      this.handlePersonNameChange(name, index)
                    }
                    name={user.name}
                    key={user._id}
                    index={index}
                    selected={index === currentUserIndex}
                  />
                );
              })}
          </div>
          <AddPersonButton onClick={this.handleAddPerson} />
        </div>

        <div className="preferences-container">
          <UserPreferences
            show={showUserPreferences && !!currentUser}
            setShow={this.setShowUserPreferences}
            currentUser={currentUser}
            handleUpdateDistance={this.handleUpdateDistance}
            handleLocationChange={this.handleLocationChange}
            handleSearchChange={this.handleSearchChange}
          />
          {/* <LocationPreferences
          session={this.props.session}
          currentUserIndex={this.state.currentUserIndex}
          handleUpdateSessionPreferences={this.handleUpdateSessionPreferences}
        /> */}
          <div className="location-preferences-container">
            {/* LOCATION PREFERENCES */}
            <div className="locationPreferencesHeader">
              <p className="preferenceText">Location Preferences</p>
              <IconButton
                onClick={() =>
                  this.setState({
                    showLocationPreferences: !showLocationPreferences,
                  })
                }
              >
                {showLocationPreferences ? (
                  <KeyboardArrowDownIcon classes={{ root: "header-arrow" }} />
                ) : (
                  <KeyboardArrowUpIcon classes={{ root: "header-arrow" }} />
                )}
              </IconButton>
            </div>
            <div className="locationUnderline"></div>
            <Collapse
              in={showLocationPreferences}
              classes={{ container: "collapse-container" }}
            >
              <div className="locationPreferences">
                <FormControl component="fieldset">
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      value="walking"
                      control={
                        <Checkbox
                          checked={publicBuilding}
                          onClick={(e) =>
                            this.handleUpdateSessionPreferences(
                              "publicBuilding",
                              e.target.checked
                            )
                          }
                          color="primary"
                          size="small"
                          style={{ width: 25 }}
                        />
                      }
                      label={
                        <span
                          style={{
                            fontSize: "30px",
                            fontFamily: "Teko",
                          }}
                        >
                          {"Public Buildings"}
                        </span>
                      }
                      labelPlacement="start"
                      className="locationCheckboxText"
                    />
                    <FormControlLabel
                      value="walking"
                      control={
                        <Checkbox
                          checked={restaurant}
                          onClick={(e) =>
                            this.handleUpdateSessionPreferences(
                              "restaurant",
                              e.target.checked
                            )
                          }
                          color="primary"
                          size="small"
                          style={{ width: 25 }}
                        />
                      }
                      label={
                        <span
                          style={{
                            fontSize: "30px",
                            fontFamily: "Teko",
                          }}
                        >
                          {"Restaurants"}
                        </span>
                      }
                      labelPlacement="start"
                      className="locationCheckboxText"
                    />
                    <FormControlLabel
                      value="walking"
                      control={
                        <Checkbox
                          checked={outdoors}
                          onClick={(e) =>
                            this.handleUpdateSessionPreferences(
                              "outdoors",
                              e.target.checked
                            )
                          }
                          color="primary"
                          size="small"
                          style={{ width: 25 }}
                        />
                      }
                      label={
                        <span
                          style={{
                            fontSize: "30px",
                            fontFamily: "Teko",
                          }}
                        >
                          {"Outdoors"}
                        </span>
                      }
                      width="1px"
                      labelPlacement="start"
                      className="locationCheckboxText"
                    />

                    <FormControlLabel
                      value="walking"
                      control={
                        <Checkbox
                          checked={cafe}
                          onClick={(e) =>
                            this.handleUpdateSessionPreferences(
                              "cafe",
                              e.target.checked
                            )
                          }
                          color="primary"
                          size="small"
                          style={{ width: 25 }}
                        />
                      }
                      label={
                        <span
                          style={{
                            fontSize: "30px",
                            fontFamily: "Teko",
                          }}
                        >
                          {"Café"}
                        </span>
                      }
                      labelPlacement="start"
                      className="locationCheckboxText"
                    />
                    <FormControlLabel
                      value="walking"
                      control={
                        <Checkbox
                          checked={government}
                          onClick={(e) =>
                            this.handleUpdateSessionPreferences(
                              "government",
                              e.target.checked
                            )
                          }
                          color="primary"
                          size="small"
                          style={{ width: 25 }}
                        />
                      }
                      label={
                        <span
                          style={{
                            fontSize: "30px",
                            fontFamily: "Teko",
                          }}
                        >
                          {"Gov. Buildings"}
                        </span>
                      }
                      labelPlacement="start"
                      className="locationCheckboxText"
                    />
                    <FormControlLabel
                      value="walking"
                      control={
                        <Checkbox
                          checked={hotel}
                          onClick={(e) =>
                            this.handleUpdateSessionPreferences(
                              "hotel",
                              e.target.checked
                            )
                          }
                          color="primary"
                          size="small"
                          style={{ width: 25 }}
                        />
                      }
                      label={
                        <span
                          style={{
                            fontSize: "30px",
                            fontFamily: "Teko",
                          }}
                        >
                          {"Hotel"}
                        </span>
                      }
                      labelPlacement="start"
                      className="locationCheckboxText"
                    />
                  </FormGroup>
                </FormControl>
              </div>
            </Collapse>
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
