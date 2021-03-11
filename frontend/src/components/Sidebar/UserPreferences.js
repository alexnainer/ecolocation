import React, { Component, Fragment } from "react";
import "./UserPreferences.css";
import Card from "react-bootstrap/Card";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import SearchBar from "../SearchBar";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";

class UserPreferences extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    const { currentUser } = this.props;
    let maxWalkDistance, maxBicycleDistance, maxCarDistance;

    if (currentUser) {
      ({
        maxWalkDistance,
        maxBicycleDistance,
        maxCarDistance,
      } = currentUser?.preferences);
    }

    return (
      <div className="user-preferences-container">
        <div className="userPreferencesHeader">
          <div className="preferenceText">Your Preferences</div>
          <IconButton
            onClick={() => this.props.setShow(!this.props.show)}
            classes={{ root: "header-arrow-button" }}
          >
            {this.props.show ? (
              <KeyboardArrowDownIcon classes={{ root: "header-arrow-icon" }} />
            ) : (
              <KeyboardArrowUpIcon classes={{ root: "header-arrow-icon" }} />
            )}
          </IconButton>
        </div>
        <div className="userUnderline"></div>
        <Collapse
          in={this.props.show}
          classes={{ container: "collapse-container" }}
        >
          <div className="userPreferences">
            <p className="preferenceTextHeaders">Location</p>
            <SearchBar
              searchString={currentUser?.location.searchString || ""}
              onSearchChange={(searchString) =>
                this.props.handleSearchChange(searchString)
              }
              onLocationChange={(location, searchString) =>
                this.props.handleLocationChange(location, searchString)
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
                        this.props.updateTransportation(
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
                        this.props.updateTransportation(
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
                        this.props.updateTransportation(
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
                  this.props.updateTransportation(
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
                  this.props.updateTransportation(
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
                    this.props.updateTransportation(
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
    );
  }
}

export default UserPreferences;
