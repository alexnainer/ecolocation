import React, { Component, Fragment } from "react";
import "./Sidebar.css";
import Card from "react-bootstrap/Card";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import SearchBar from "./SearchBar";
import PersonButton from "./Users/PersonButton";
import AddPersonButton from "./Users/AddPersonButton";

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
    // console.log("add person", this.props);
    this.props.addPerson(`Person ${this.props.session.users.length + 1}`);
  };

  handlePersonSelected = (user) => {
    this.setState({ currentUser: user });
    // console.log("user", user);
  };

  async handleUpdateDistance(type, distance) {
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
  }

  handleSearchChange = async (searchString) => {
    console.log("search change", searchString);
    this.setState(
      {
        currentUser: {
          ...this.state.currentUser,
          location: {
            ...this.state.currentUser.location,
            searchString,
          },
        },
      },
      () => console.log("currentUser", this.state.currentUser)
    );
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
    // console.log("type, value", type, value);
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
    const { currentUser } = this.state;
    const {
      maxWalkDistance,
      maxBicycleDistance,
      maxCarDistance,
    } = currentUser.preferences;

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
        <div className="meeting-header">
          <h1 className="meeting-text">-- In your meeting --</h1>
        </div>
        <div className="list-container">
          {!this.props.loading &&
            this.props.session.users.map((user) => {
              return (
                <PersonButton
                  onClick={() => this.handlePersonSelected(user)}
                  name={user.name}
                  key={user._id}
                />
              );
            })}
        </div>
        <AddPersonButton onClick={this.handleAddPerson} />

        {/* USER PREFERENCES */}
        <div className="userPreferencesHeader">
          <p className="preferenceText">Your Preferences</p>
        </div>
        <div className="userUnderline"></div>
        <div className="userPreferences">
          <p className="preferenceTextHeaders">Location</p>
          <SearchBar
            searchString={this.state.currentUser.location.searchString || ""}
            onSearchChange={(searchString) =>
              this.handleSearchChange(searchString)
            }
            onLocationChange={(location, searchString) =>
              this.handleLocationChange(location, searchString)
            }
          />
          <p className="preferenceTextHeaders">Method of Transportation</p>
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
          <p className="preferenceTextHeaders">Max Travel Distance [km]</p>
          <Form>
            <Form.Label className="maxTravelText">Walking</Form.Label>
            <Form.Control as="select" className="boxFix" custom>
              <option value="0">No Limit</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="3">4</option>
              <option value="3">5</option>
              <option value="3">6</option>
              <option value="3">7</option>
              <option value="3">8</option>
              <option value="3">9</option>
              <option value="3">10</option>
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
            >
              <option value="0">No Limit</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="3">4</option>
              <option value="3">5</option>
              <option value="3">6</option>
              <option value="3">7</option>
              <option value="3">8</option>
              <option value="3">9</option>
              <option value="3">10</option>
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
              >
                <option value="0">No Limit</option>
                <option value="1">10</option>
                <option value="2">20</option>
                <option value="3">30</option>
                <option value="3">40</option>
                <option value="3">50</option>
                <option value="3">60</option>
                <option value="3">70</option>
                <option value="3">80</option>
                <option value="3">90</option>
                <option value="3">100</option>
              </Form.Control>
            </div>
          </Form>
        </div>

        {/* LOCATION PREFERENCES */}
        <div className="locationPreferencesHeader">
          <p className="preferenceText">Location Preferences</p>
        </div>
        <div className="locationUnderline"></div>
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
                  <span style={{ fontSize: "30px", fontFamily: "Teko" }}>
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
                  <span style={{ fontSize: "30px", fontFamily: "Teko" }}>
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
                  <span style={{ fontSize: "30px", fontFamily: "Teko" }}>
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
                  <span style={{ fontSize: "30px", fontFamily: "Teko" }}>
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
                  <span style={{ fontSize: "30px", fontFamily: "Teko" }}>
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
                  <span style={{ fontSize: "30px", fontFamily: "Teko" }}>
                    {"Hotel"}
                  </span>
                }
                labelPlacement="start"
                className="locationCheckboxText"
              />
            </FormGroup>
          </FormControl>
        </div>
      </div>
    );
  }
}

export default Sidebar;
