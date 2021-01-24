import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import "./AddPersonButton.css";

class AddPersonButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    console.log("props", this.props);
  }

  render() {
    return (
      <div className="addPerson">
        <Card.Header className="addCard">
          <p onClick={() => this.props.onClick()} className="addToList">
            + Click Here To Add a Person +
          </p>
        </Card.Header>
      </div>
    );
  }
}

export default AddPersonButton;
