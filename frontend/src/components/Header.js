import React, { Component } from "react";
import "./Header.css";

class Header extends Component {
  render() {
    return (
      <div className="headerIndex">
        <div className="headerUpperline"></div>
        <div className="d-flex justify-content-center pb-3 header-container">
          <h1 className="header px-4">[environMEET logo]</h1>
          {/* <FontAwesomeIcon icon={faStarOfLife} style={{ color: "red" }} /> */}
        </div>
        <div className="headerUnderline"></div>
      </div>
    );
  }
}

export default Header;
