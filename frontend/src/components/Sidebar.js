import React, { Component } from "react";
import "./Sidebar.css";
import Card from "react-bootstrap/Card";
import SearchBar from "./SearchBar";

class Sidebar extends Component {
  render() {
    return (
      <div className="sidebar-container">
        <div className="meeting-header">
          <h1 className="meeting-text">-- In your meeting --</h1>
        </div>
        <div className="list-container">
          <Card.Header className="people-list oddCard">
            <p className="personTab">Person 1</p>
          </Card.Header>
          <Card.Header className="people-list evenCard">
            <p className="personTab">Person 2</p>
          </Card.Header>
          <Card.Header className="people-list oddCard">
            <p className="personTab">Person 3</p>
          </Card.Header>
          <Card.Header className="people-list evenCard">
            <p className="personTab">Person 4</p>
          </Card.Header>
          <Card.Header className="people-list oddCard">
            <p className="personTab">Person 3</p>
          </Card.Header>
          <Card.Header className="people-list evenCard">
            <p className="personTab">Person 3</p>
          </Card.Header>
          <Card.Header className="people-list oddCard">
            <p className="personTab">Person 3</p>
          </Card.Header>

          <Card.Header className="people-list evenCard">
            <p className="personTab">Person 3</p>
          </Card.Header>
          <Card.Header className="people-list oddCard">
            <p className="personTab">Person 3</p>
          </Card.Header>
          <Card.Header className="people-list evenCard">
            <p className="personTab">Person 3</p>
          </Card.Header>
          <Card.Header className="people-list oddCard">
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
