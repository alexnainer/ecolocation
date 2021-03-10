import React, { Component } from "react";
import "./manifest.css";

class Manifest extends Component {
  render() {
    const { session } = this.props;
    return (
      <div className="manifestContainer">
        <p className="textStyleTitle">
          User - Departure - Time
        </p>
        { session.results.endpoint && 
            session.users.map((user) => {
                return (
                    <table className="textStyleCont">
                        <tr>
                            <td>{user.name} - </td>
                            <td>?Arive? - </td>
                            <td>{user.results.durationSeconds}</td>
                        </tr>
                    </table>
                );
            })}
      </div>
    );
  }
}
export default Manifest;
