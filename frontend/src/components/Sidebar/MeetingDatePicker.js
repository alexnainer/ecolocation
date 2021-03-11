import React, { Component } from "react";
import "./MeetingDatePicker.css";
import { Input } from "@material-ui/core";
import DayUtils from "@date-io/dayjs";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import dayjs from "dayjs";

class MeetingDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meetingDate: {},
    };
  }

  handleDateChange = (date) => {
    this.setState({ meetingDate: date });
  };

  handleDateClose = () => {
    const date = this.state.meetingDate || this.props.meetingDate || dayjs();
    this.props.onDateSelect(date);
  };

  render() {
    return (
      <div className="date-picker-container">
        {this.props.meetingDate ? (
          <MuiPickersUtilsProvider utils={DayUtils}>
            <DateTimePicker
              onChange={this.handleDateChange}
              onClose={this.handleDateClose}
              value={this.props.meetingDate}
              variant="inline"
            />
          </MuiPickersUtilsProvider>
        ) : (
          <Input
            readOnly
            value="Set meeting time"
            onClick={() => this.props.onDateSelect(dayjs())}
          />
        )}
      </div>
    );
  }
}

export default MeetingDatePicker;
