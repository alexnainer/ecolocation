import React, { Component } from "react";
import "./DepartureTimes.css";
import moment from "moment";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

class DepartureTimes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  departureTime = (durationSeconds) => {
    const { session } = this.props;
    const arrivalTime = moment(session.meetingPreferences.meetingDate);
    return arrivalTime.subtract(durationSeconds, "seconds").format("h:mm a");
  };

  handleClick = () => {
    console.log("click");
    this.setState({ show: !this.state.show });
  };
  render() {
    const { session } = this.props;
    console.log("session", session);
    console.log("session.users", session.users);

    if (!session.users?.length || !session.meetingPreferences?.meetingDate)
      return null;
    console.log("show", this.state.show);
    return (
      <div className="departure-times-container" onClick={this.handleClick}>
        <div className="departure-times-header">
          <div>Departure Times</div>
          <IconButton>
            {this.state.show ? (
              <KeyboardArrowDownIcon classes={{ root: "header-arrow" }} />
            ) : (
              <KeyboardArrowUpIcon classes={{ root: "header-arrow" }} />
            )}
          </IconButton>
        </div>
        <Collapse in={this.state.show}>
          <table className="users-container">
            {session.users.map((user) => {
              return (
                <tr className="user-text">
                  <td className="user-column">{user.name}</td>
                  <td className="user-column">
                    {this.departureTime(user.results.durationSeconds)}
                  </td>
                </tr>
              );
            })}
          </table>
        </Collapse>
      </div>
    );
  }
}
export default DepartureTimes;
