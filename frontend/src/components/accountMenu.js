import React, { Component, Fragment } from "react";
import Fade from "@material-ui/core/Fade";

class AccountMenu extends Component {
  render() {
    return (
      <Fade in={this.props.show}>
        <Fragment>{/* <div>balls</div>
          <div>balls</div>
          <div>balls</div> */}</Fragment>
      </Fade>
    );
  }
}

export default AccountMenu;
