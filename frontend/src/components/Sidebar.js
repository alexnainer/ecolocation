import React, { Component } from "react";
import "./Sidebar.css";

class Sidebar extends Component {
  render() {
    return (
      <div className="sidebar-container">
          <div className="meeting-header">
                <h1 className="meeting-text">-- In your meeting --</h1>
            </div>
      </div>
    );
  }
}

export default Sidebar;