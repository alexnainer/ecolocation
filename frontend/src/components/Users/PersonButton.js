import React, { Component, Fragment } from "react";
import Card from "react-bootstrap/Card";
import "./PersonButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faCheck,
  faTimes,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Input } from "@material-ui/core";
import AlertDialog from "../Generic/AlertDialog";

class PersonButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      editingName: "",
      showDeleteDialog: false,
    };
    this.nameRef = React.createRef();
  }

  getButtonColour = () => {
    if (this.props.selected) {
      return "selected";
    } else if (this.props.index % 2 == 0) {
      return "oddCard";
    } else {
      return "evenCard";
    }
  };

  handleEditNameClick = (e) => {
    e.stopPropagation();
    this.setState({ editing: true, editingName: this.props.name });
    setTimeout(() => {
      this.nameRef.current.focus();
    }, 0);
  };

  handleNameChange = (value) => {
    this.setState({ editingName: value });
  };

  handleSaveEdit = () => {
    this.setState({ editing: false });
    this.props.onPersonNameChange(this.state.editingName);
  };

  handleCancelEdit = () => {
    this.setState({ editing: false });
  };

  handleClick = () => {
    if (!this.state.editing) this.props.onClick();
  };

  handleDeleteClick = (e) => {
    e.stopPropagation();
    this.setState({ showDeleteDialog: true });
  };

  handleDelete = () => {
    this.props.deletePerson();
  };

  handleKeydown = (e) => {
    if (e.code === "Enter") this.handleSaveEdit();
  };

  render() {
    const { editing } = this.state;
    return (
      <Fragment>
        <Card.Header
          className={`people-list ${this.getButtonColour()}`}
          onClick={this.handleClick}
        >
          <Input
            style={{ display: editing ? "" : "none" }}
            value={this.state.editingName}
            onChange={(e) => this.handleNameChange(e.target.value)}
            inputRef={this.nameRef}
            onKeyDown={this.handleKeydown}
          />
          {editing ? (
            <Fragment>
              <FontAwesomeIcon onClick={this.handleSaveEdit} icon={faCheck} />
              <FontAwesomeIcon onClick={this.handleCancelEdit} icon={faTimes} />
            </Fragment>
          ) : (
            <Fragment>
              <p className="personTab">{this.props.name}</p>
              <div className="actions-buttons">
                <FontAwesomeIcon
                  style={{ marginRight: "10px" }}
                  onClick={this.handleEditNameClick}
                  icon={faPencilAlt}
                />
                <FontAwesomeIcon
                  onClick={this.handleDeleteClick}
                  icon={faTrashAlt}
                />
              </div>
            </Fragment>
          )}
        </Card.Header>
        <AlertDialog
          open={this.state.showDeleteDialog}
          onClose={() => this.setState({ showDeleteDialog: false })}
          onAgree={this.handleDelete}
          title={"Confirm Delete"}
          message={`Are you sure you want to delete ${this.props.name}?`}
          agreeText="Delete"
          denyText="Cancel"
        />
      </Fragment>
    );
  }
}

export default PersonButton;
