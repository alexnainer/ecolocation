import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import "./PersonButton.css";

class PersonButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  getButtonColour = () => {
    if (this.props.selected) {
      return "selected";
    } else if (this.props.index % 2 == 0) {
      return "oddCard";
    } else {
      return "evenCard";
    }
  };

  render() {
    return (
      <Card.Header className={`people-list ${this.getButtonColour()}`}>
        <p onClick={() => this.props.onClick()} className="personTab">
          {this.props.name}
        </p>
      </Card.Header>
    );
  }
}

export default PersonButton;
