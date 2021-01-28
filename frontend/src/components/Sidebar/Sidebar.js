import React, { Component, Fragment } from "react";
import "./Sidebar.css";
import Card from "react-bootstrap/Card";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import SearchBar from "../SearchBar";
import PersonButton from "../Users/PersonButton";
import AddPersonButton from "../Users/AddPersonButton";
import LocationPreferences from "./LocationPreferences";

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
    this.props.updateSession(session);
  };

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
        <LocationPreferences
          session={this.props.session}
          handleUpdateSessionPreferences={this.handleUpdateSessionPreferences}
        />
      </div>
    );
  }
}

export default Sidebar;
