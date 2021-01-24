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
    this.state = {};
  }

  handleAddPerson = () => {
    console.log("add person", this.props);
    this.props.addPerson(`Person ${this.props.session.users.length + 1}`);
  };

  handlePersonSelected = (user) => {
    this.setState({ currentUser: user });
    console.log("user", user);
  };

  render() {
    console.log("session", this.props.session);
    const distanceOptions = [
      { value: "0", label: "No Limit" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
    ];

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
          <SearchBar />
          <p className="preferenceTextHeaders">Method of Transportation</p>
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value="walking"
                control={
                  <Checkbox
                    color="primary"
                    size="small"
                    style={{ width: 25 }}
                  />
                }
                label="Walking"
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
                label="Bicycle"
                width="1px"
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
                label="Car"
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
                label="Carpool"
                labelPlacement="start"
                className="checkboxText"
              />
            </FormGroup>
          </FormControl>
          <p className="preferenceTextHeaders">Max Travel Distance [km]</p>
          <Form inline>
            <Form.Label
              className="my-1 mr-2"
              htmlFor="inlineFormCustomSelectPref"
            >
              Walking
            </Form.Label>
            <Form.Control
              as="select"
              className="my-1 mr-sm-2 testFix"
              id="inlineFormCustomSelectPref"
              custom
            >
              <option value="0">No Limit</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </Form.Control>
          </Form>
        </div>

        {/* LOCATION PREFERENCES */}
        <div className="locationPreferencesHeader">
          <p className="preferenceText">Location Preferences</p>
        </div>
        <div className="locationUnderline"></div>
        <div className="locationPreferences"></div>
      </div>
    );
  }
}

export default Sidebar;
