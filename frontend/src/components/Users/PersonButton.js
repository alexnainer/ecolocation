import React, { Component, Fragment } from "react";
import Card from "react-bootstrap/Card";
import "./PersonButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPencilAlt,
    faCheck,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Input } from "@material-ui/core";

class PersonButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            editingName: "",
        };
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

    handleEditNameClick = () => {
        this.setState({ editing: true, editingName: this.props.name });
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

    render() {
        const { editing } = this.state;
        return (
            <Card.Header
                className={`people-list ${this.getButtonColour()}`}
                onClick={() => this.props.onClick()}
            >
                {editing ? (
                    <Fragment>
                        <Input
                            value={this.state.editingName}
                            onChange={(e) =>
                                this.handleNameChange(e.target.value)
                            }
                        />
                        <FontAwesomeIcon
                            onClick={this.handleSaveEdit}
                            icon={faCheck}
                        />
                        <FontAwesomeIcon
                            onClick={this.handleCancelEdit}
                            icon={faTimes}
                        />
                    </Fragment>
                ) : (
                    <Fragment>
                        <p className="personTab">{this.props.name}</p>
                        <FontAwesomeIcon
                            className="pencil-button"
                            onClick={this.handleEditNameClick}
                            icon={faPencilAlt}
                        />
                    </Fragment>
                )}
            </Card.Header>
        );
    }
}

export default PersonButton;
