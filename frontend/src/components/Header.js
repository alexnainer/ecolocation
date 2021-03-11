import React, { Component } from "react";
import "./Header.css";
import logo from "../images/ecoLocation3.png";
import Image from "react-bootstrap/Image";
import profilePic from "../images/profilePic.jpg";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AccountMenu from "./accountMenu.js";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAccountMenu: false,
    };
  }

  handleAccountClick = () => {
    this.setState({
      showAccountMenu: true,
    });
    console.log(this.state.showAccountMenu);
  };

  render() {
    return (
      <div className="headerIndex">
        <div className="headerUpperline"></div>
        <Container fluid className="d-flex justify-content-center align-items-center header-container">
          <Row className="w-100">
            <Col xs={3}></Col>
            <Col xs={6} className="d-flex justify-content-center">
              <img src={logo} alt="logo" className="logoResize" />
            </Col>
            <Col xs={3} className="d-flex justify-content-center align-items-center">
              <Image
                onclick={this.handleAccountClick}
                src={profilePic}
                className="profilePicResize"
                roundedCircle
                fluid
              />
            </Col>
          </Row>
        </Container>
        <div className="headerUnderline"></div>
        <AccountMenu show={this.state.showAccountMenu} />
      </div>
    );
  }
}

export default Header;
