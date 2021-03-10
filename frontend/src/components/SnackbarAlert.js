import React, { Component } from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

class SnackbarAlert extends Component {
  render() {
    return (
      <Snackbar open={this.props.open} onClose={this.props.onClose}>
        <Alert
          severity={this.props.severity || "error"}
          variant={this.props.variant || "filled"}
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={this.props.onClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {this.props.message}
        </Alert>
      </Snackbar>
    );
  }
}

export default SnackbarAlert;
