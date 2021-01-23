import React, { Component } from "react";
import "./Header.css";

class Header extends Component {
  render() {
    return (
      <div className="d-flex justify-content-center pb-3">
        <h1 className="header px-4">Alekx Health</h1>
        {/* <FontAwesomeIcon icon={faStarOfLife} style={{ color: "red" }} /> */}
      </div>
    );
  }
}

export default Header;
