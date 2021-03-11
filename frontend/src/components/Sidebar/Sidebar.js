import React, { Component, Fragment } from "react";
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
import MeetingDatePicker from "./MeetingDatePicker";
import Slide from "@material-ui/core/Slide";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { Fade } from "@material-ui/core";

import dayjs from "dayjs";
class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUserPreferences: false,
      showLocationPreferences: false,
      currentUserIndex: -1,
      showSidebar: true,
    };
  }

  handleAddPerson = () => {
    this.props.addPerson(`Person ${this.props.session.users.length + 1}`);
  };

  handlePersonSelected = (index) => {
    const { currentUserIndex } = this.state;
    const sameIndexSelected = currentUserIndex === index;
    this.setState({
      currentUserIndex: sameIndexSelected ? -1 : index,
      showUserPreferences: !sameIndexSelected,
      showLocationPreferences: !sameIndexSelected,
    });
  };

  setShowUserPreferences = (show) => {
    this.setState({
      showUserPreferences: show,
    });
  };

  handleUpdateTransportation = (type, distance) => {
    const { currentUserIndex } = this.state;
    const currentUser = this.props.session.users[currentUserIndex];
    const user = {
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        [type]: distance,
      },
    };

    this.props.updatePerson(user);
  };

  handlePersonNameChange = (name, index) => {
    const user = {
      ...this.props.session.users[index],
      name,
    };
    this.props.updatePerson(user);
  };

  handleDeletePerson = (userId, index) => {
    this.props.deletePerson(userId, index);
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
    const { currentUserIndex } = this.state;
    const currentUser = this.props.session.users[currentUserIndex];
    const user = {
      ...currentUser,
      location: {
        searchString,
        geoJson: location,
      },
    };

    this.props.updatePerson(user);
  };

  handleUpdateSessionDate = (date) => {
    const dateTime = dayjs(date).format();
    const meetingPreferences = {
      ...this.props.session.meetingPreferences,
      meetingDate: dateTime,
    };
    this.props.updateSessionMeeting(meetingPreferences);
  };

  handleUpdateSessionPreferences = (type, value) => {
    const locationPreferences = {
      ...this.props.session.locationPreferences,
      [type]: value,
    };
    this.props.updateSessionLocation(locationPreferences);
  };

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

    const meetingDate = session.meetingPreferences?.meetingDate || "";

    return (
      <Fragment>
        <Slide in={this.state.showSidebar} direction="right">
          <div className="sidebar-container">
            <div className="meeting-container">
              <div className="meeting-header">
                <h1 className="meeting-text">-- In your meeting --</h1>
                <MeetingDatePicker
                  onDateSelect={this.handleUpdateSessionDate}
                  meetingDate={meetingDate}
                />
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
                        deletePerson={() =>
                          this.handleDeletePerson(user._id, index)
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
                updateTransportation={this.handleUpdateTransportation}
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
                  <div className="preferenceText">Location Preferences</div>
                  <IconButton
                    classes={{ root: "header-arrow-button" }}
                    onClick={() =>
                      this.setState({
                        showLocationPreferences: !showLocationPreferences,
                      })
                    }
                  >
                    {showLocationPreferences ? (
                      <KeyboardArrowDownIcon
                        classes={{ root: "header-arrow-icon" }}
                      />
                    ) : (
                      <KeyboardArrowUpIcon
                        classes={{ root: "header-arrow-icon" }}
                      />
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
            <IconButton
              onClick={() =>
                this.setState({ showSidebar: !this.state.showSidebar })
              }
              classes={{ root: "hide-button hide-button-open" }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </div>
        </Slide>
        <Fade in={!this.state.showSidebar}>
          <IconButton
            onClick={() =>
              this.setState({ showSidebar: !this.state.showSidebar })
            }
            classes={{ root: "hide-button hide-button-closed" }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Fade>
      </Fragment>
    );
  }
}

export default Sidebar;
