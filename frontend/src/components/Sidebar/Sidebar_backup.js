import React, { Component, Fragment } from "react";
import "./Sidebar.css";
import Card from "react-bootstrap/Card";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import Collapse from "@material-ui/core/Collapse";
import SearchBar from "./SearchBar";
import PersonButton from "./Users/PersonButton";
import AddPersonButton from "./Users/AddPersonButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   currentUser: {
      //     preferences: {
      //       carpool: false,
      //       maxWalkDistance: 0,
      //       maxCarDistance: 0,
      //       maxBicycleDistance: 0,
      //     },
      //     location: {
      //       searchString: "",
      //     },
      //   },
      showUserPreferences: false,
      currentUserIndex: -1,
    };
  }

  handleAddPerson = () => {
    this.props.addPerson(`Person ${this.props.session.users.length + 1}`);
  };

  handlePersonSelected = (index) => {
    // this.setState({ currentUser: user });
    this.setState({ currentUserIndex: index, showUserPreferences: true });
  };

  async handleUpdateDistance(type, distance) {
    // await this.setState({
    //   currentUser: {
    //     ...this.state.currentUser,
    //     preferences: {
    //       ...this.state.currentUser.preferences,
    //       [type]: distance,
    //     },
    //   },
    // });
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
    // const { currentUser } = this.state;

    const {
      currentUserIndex,
      showUserPreferences,
      showLocationPreferences,
    } = this.state;
    let currentUser, maxWalkDistance, maxBicycleDistance, maxCarDistance;

    if (currentUserIndex >= 0) {
      currentUser = this.props.session?.users[currentUserIndex];
      ({
        maxWalkDistance,
        maxBicycleDistance,
        maxCarDistance,
      } = currentUser?.preferences);
    }

    const { session } = this.props;
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
          {/* USER PREFERENCES */}
          <div className="user-preferences-container">
            <div className="userPreferencesHeader">
              <p className="preferenceText">Your Preferences</p>
              <IconButton
                onClick={() =>
                  this.setState({ showUserPreferences: !showUserPreferences })
                }
              >
                {showUserPreferences ? (
                  <KeyboardArrowDownIcon classes={{ root: "header-arrow" }} />
                ) : (
                  <KeyboardArrowUpIcon classes={{ root: "header-arrow" }} />
                )}
              </IconButton>
            </div>
            <div className="userUnderline"></div>
            <Collapse
              in={this.state.showUserPreferences}
              classes={{ container: "collapse-container" }}
            >
              <div className="userPreferences">
                <p className="preferenceTextHeaders">Location</p>
                <SearchBar
                  searchString={currentUser?.location.searchString || ""}
                  onSearchChange={(searchString) =>
                    this.handleSearchChange(searchString)
                  }
                  onLocationChange={(location, searchString) =>
                    this.handleLocationChange(location, searchString)
                  }
                />
                <p className="preferenceTextHeaders">
                  Method of Transportation
                </p>
                <FormControl component="fieldset">
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      value="walking"
                      control={
                        <Checkbox
                          checked={maxWalkDistance > 0}
                          onClick={() =>
                            this.handleUpdateDistance(
                              "maxWalkDistance",
                              maxWalkDistance > 0 ? 0 : 1
                            )
                          }
                          color="primary"
                          size="small"
                          style={{ width: 25 }}
                        />
                      }
                      label={<span className="methodText">{"Walking"}</span>}
                      labelPlacement="start"
                      className="checkboxText"
                    />
                    <FormControlLabel
                      value="walking"
                      control={
                        <Checkbox
                          checked={maxBicycleDistance > 0}
                          onClick={() =>
                            this.handleUpdateDistance(
                              "maxBicycleDistance",
                              maxBicycleDistance > 0 ? 0 : 5
                            )
                          }
                          color="primary"
                          size="small"
                          style={{ width: 25 }}
                        />
                      }
                      label={<span className="methodText">{"Bicycle"}</span>}
                      width="1px"
                      labelPlacement="start"
                      className="checkboxText"
                    />
                    <FormControlLabel
                      value="walking"
                      control={
                        <Checkbox
                          checked={maxCarDistance > 0}
                          onClick={() =>
                            this.handleUpdateDistance(
                              "maxCarDistance",
                              maxCarDistance > 0 ? 0 : 50
                            )
                          }
                          color="primary"
                          size="small"
                          style={{ width: 25 }}
                        />
                      }
                      label={<span className="methodText">{"Car"}</span>}
                      labelPlacement="start"
                      className="checkboxText"
                    />
                    <FormControlLabel
                      value="walking"
                      control={
                        <Checkbox
                          color="primary"
                          size="small"
                          style={{ width: 25 }}
                        />
                      }
                      label={<span className="methodText">{"Carpool"}</span>}
                      labelPlacement="start"
                      className="checkboxText"
                    />
                  </FormGroup>
                </FormControl>
                <p className="preferenceTextHeaders">
                  Max Travel Distance [km]
                </p>
                <Form>
                  <Form.Label className="maxTravelText">Walking</Form.Label>
                  <Form.Control
                    as="select"
                    className="boxFix"
                    custom
                    value={maxWalkDistance}
                    onChange={(e) =>
                      this.handleUpdateDistance(
                        "maxWalkDistance",
                        parseInt(e.target.value)
                      )
                    }
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value={500}>No Limit</option>
                  </Form.Control>
                  <Form.Label
                    className="my-1 mr-2 maxTravelText"
                    htmlFor="inlineFormCustomSelectPref"
                  >
                    Bicycle
                  </Form.Label>
                  <Form.Control
                    as="select"
                    className="boxFix"
                    id="inlineFormCustomSelectPref"
                    custom
                    value={maxBicycleDistance}
                    onChange={(e) =>
                      this.handleUpdateDistance(
                        "maxBicycleDistance",
                        parseInt(e.target.value)
                      )
                    }
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value={500}>No Limit</option>
                  </Form.Control>
                  <div className="testFix">
                    <Form.Label
                      className="my-1 mr-2 maxTravelText"
                      htmlFor="inlineFormCustomSelectPref"
                    >
                      Car
                    </Form.Label>
                    <Form.Control
                      as="select"
                      className="boxFix"
                      id="inlineFormCustomSelectPref"
                      custom
                      value={maxCarDistance}
                      onChange={(e) =>
                        this.handleUpdateDistance(
                          "maxCarDistance",
                          parseInt(e.target.value)
                        )
                      }
                    >
                      <option value="0">0</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="40">40</option>
                      <option value="50">50</option>
                      <option value="60">60</option>
                      <option value="70">70</option>
                      <option value="80">80</option>
                      <option value="90">90</option>
                      <option value="100">100</option>
                      <option value={500}>No Limit</option>
                    </Form.Control>
                  </div>
                </Form>
              </div>
            </Collapse>
          </div>

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
              in={this.state.showLocationPreferences}
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
