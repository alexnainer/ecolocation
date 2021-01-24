import React, { Component } from "react";
import "./Header.css";
import logo from '../images/ecoLocation.png';

class Header extends Component {
  render() {
    return (
      <div className="headerIndex">
        <div className="headerUpperline"></div>
        <div className="d-flex justify-content-center pb-3 header-container">
          <img src={logo} className="logoResize" alt="logo" />
          {/* <FontAwesomeIcon icon={faStarOfLife} style={{ color: "red" }} /> */}
        </div>
        <div className="headerUnderline"></div>
      </div>
    );
  }
}

export default Header;
