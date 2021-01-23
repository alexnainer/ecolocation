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

    let response, session;
    if (sessionId) {
      response = await api.getSession(sessionId);
    } else {
      response = await api.getNewSession();
      this.props.history.push(`/${response.data.id}`);
    }
    this.setState({ loading: false });
  }

  render() {
    return (
      <div>
        <Header />
        <MapContainer />
        <Sidebar loading={this.state.loading} />
      </div>
    );
  }
}

export default withRouter(MapPage);
