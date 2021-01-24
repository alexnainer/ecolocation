import React, { Component } from "react";
import MapContainer from "./MapContainer";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import api from "../../api/api";
import { withRouter } from "react-router";

class MapPage extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentDidMount() {
    const { sessionId } = this.props.match.params;

    let response;
    if (sessionId) {
      response = await api.getSession(sessionId);
    } else {
      response = await api.getNewSession();
      this.props.history.push(`/${response.data.id}`);
    }
    this.setState({ loading: false, session: response.data });
  }

  async handleAddPerson(name) {
    const { sessionId } = this.props.match.params;

    this.setState({ loading: true });
    await api.postNewUser({ name, sessionId });
    const response = await api.getSession(sessionId);
    this.setState({ loading: false, session: response.data });
  }

  async handleUpdatePerson(user) {
    await api.postUpdateUser(user);
  }

  render() {
    return (
      <div>
        <Header />
        <MapContainer />
        <Sidebar
          loading={this.state.loading}
          session={this.state.session}
          addPerson={(name) => this.handleAddPerson(name)}
          updatePerson={(user) => this.handleUpdatePerson(user)}
        />
      </div>
    );
  }
}

export default withRouter(MapPage);
