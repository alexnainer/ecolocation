import React, { Component, Fragment } from 'react';
import "./Sidebar.css";
import Card from 'react-bootstrap/Card'
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Form from 'react-bootstrap/Form'
import Select from 'react-select';
import Card from "react-bootstrap/Card";
import SearchBar from "./SearchBar";


class Sidebar extends Component {
  render() {
    const distanceOptions = [
        { value: '0', label: 'No Limit' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
      ];
    return (
      <div className="sidebar-container">
            <div className="meeting-header">
                <h1 className="meeting-text">-- In your meeting --</h1>
            </div>
            <div className="list-container">
                    <Card.Header className="people-list oddCard" >
                        <p className="personTab">Person 1</p>
                    </Card.Header>
                    <Card.Header className="people-list evenCard" >
                        <p className="personTab">Person 2</p>
                    </Card.Header>
                    <Card.Header className="people-list oddCard" >
                        <p className="personTab">Person 3</p>
                    </Card.Header>
                    <Card.Header className="people-list evenCard" >
                        <p className="personTab">Person 4</p>
                    </Card.Header>
                    <Card.Header className="people-list oddCard" >
                        <p className="personTab">Person 3</p>
                    </Card.Header>
                    <Card.Header className="people-list evenCard" >
                        <p className="personTab">Person 3</p>
                    </Card.Header>
                    <Card.Header className="people-list oddCard" >
                        <p className="personTab">Person 3</p>
                    </Card.Header>

                    <Card.Header className="people-list evenCard" >
                        <p className="personTab">Person 3</p>
                    </Card.Header>
                    <Card.Header className="people-list oddCard" >
                        <p className="personTab">Person 3</p>
                    </Card.Header>
                    <Card.Header className="people-list evenCard" >
                        <p className="personTab">Person 3</p>
                    </Card.Header>
                    <Card.Header className="people-list oddCard" >
                        <p className="personTab">Person 3</p>
                    </Card.Header>
            </div>
            <div className="addPerson">
                <Card.Header className="addCard">
                    <p className="addToList">+ Click Here To Add a Person +</p>
                </Card.Header>
            </div>

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
                            control={<Checkbox color="primary" size="small" style={{ width: 25}}/>}
                            label={<span className="methodText">{"Walking"}</span>}
                            labelPlacement="start"
                            className="checkboxText"
                        />
                        <FormControlLabel
                            value="walking"
                            control={<Checkbox color="primary" size="small" style={{ width: 25}} />}
                            label={<span className="methodText">{"Bicycle"}</span>}
                            width="1px"
                            labelPlacement="start"
                            className="checkboxText"
                        />
                        <FormControlLabel
                            value="walking"
                            control={<Checkbox color="primary" size="small" style={{ width: 25}}/>}
                            label={<span className="methodText">{"Car"}</span>}
                            labelPlacement="start"
                            className="checkboxText"
                        />
                        <FormControlLabel
                            value="walking"
                            control={<Checkbox color="primary" size="small" style={{ width: 25}}/>}
                            label={<span className="methodText">{"Carpool"}</span>}
                            labelPlacement="start"
                            className="checkboxText"
                        />
                    </FormGroup>
                </FormControl>
                <p className="preferenceTextHeaders">Max Travel Distance [km]</p>
                <Form>
                    <Form.Label className="maxTravelText">
                        Walking
                    </Form.Label>
                    <Form.Control
                        as="select"
                        className="boxFix"
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
                    <Form.Label className="my-1 mr-2 maxTravelText" htmlFor="inlineFormCustomSelectPref">
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
                        <Form.Label className="my-1 mr-2 maxTravelText" htmlFor="inlineFormCustomSelectPref">
                            Car
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
                    </div>
                </Form>
            </div>

                        {/* LOCATION PREFERENCES */}
            <div className="locationPreferencesHeader">
                    <p className="preferenceText">Location Preferences</p>
            </div>
            <div className="locationUnderline">
            </div>
            <div className="locationPreferences">
            <FormControl component="fieldset">
                    <FormGroup aria-label="position" row>
                        <FormControlLabel
                            value="walking"
                            control={<Checkbox color="primary" size="small" style={{ width: 25}}/>}
                            label={<span style={{ fontSize: '30px', fontFamily: "Teko"}}>{"Public Buildings"}</span>}
                            labelPlacement="start"
                            className="locationCheckboxText"
                        />
                        <FormControlLabel
                            value="walking"
                            control={<Checkbox color="primary" size="small" style={{ width: 25}} />}
                            label={<span style={{ fontSize: '30px', fontFamily: "Teko"}}>{"Outdoors"}</span>}
                            width="1px"
                            labelPlacement="start"
                            className="locationCheckboxText"
                        />                       
                         <FormControlLabel
                            value="walking"
                            control={<Checkbox color="primary" size="small" style={{ width: 25 }} />}
                            label={<span style={{ fontSize: '30px', fontFamily: "Teko"}}>{"Restaurants"}</span>}
                            labelPlacement="start"
                            className="locationCheckboxText"
                        />
                        <FormControlLabel
                            value="walking"
                            control={<Checkbox color="primary" size="small" style={{ width: 25 }} />}
                            label={<span style={{ fontSize: '30px', fontFamily: "Teko"}}>{"Café"}</span>}
                            labelPlacement="start"
                            className="locationCheckboxText"
                        />
                        <FormControlLabel
                            value="walking"
                            control={<Checkbox color="primary" size="small" style={{ width: 25}}/>}
                            label={<span style={{ fontSize: '30px', fontFamily: "Teko"}}>{"Gov. Buildings"}</span>}
                            labelPlacement="start"
                            className="locationCheckboxText"
                        />
                        <FormControlLabel
                            value="walking"
                            control={<Checkbox color="primary" size="small" style={{ width: 25}}/>}
                            label={<span style={{ fontSize: '30px', fontFamily: "Teko"}}>{"Hotel"}</span>}
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
