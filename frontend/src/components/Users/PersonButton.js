import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import "./PersonButton.css";

class PersonButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  render() {
    return (
      <Card.Header className="people-list oddCard">
        <p onClick={() => this.props.onClick()} className="personTab">
          {this.props.name}
        </p>
      </Card.Header>
    );
  }
}

export default PersonButton;
