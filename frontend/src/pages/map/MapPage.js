import React, { Component, Fragment } from "react";
import MapContainer from "./MapContainer";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import api from "../../api/api";
import { withRouter } from "react-router";
import Calculate from "../../components/Calculate";
import CircularProgress from "@material-ui/core/CircularProgress";

class MapPage extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, mapLoading: false };
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
    this.setState({ session: response.data, loading: false });
  }

  async handleAddPerson(name) {
    const { sessionId } = this.props.match.params;

    // this.setState({ loading: true });
    await api.postNewUser({ name, sessionId });
    const response = await api.getSession(sessionId);
    this.setState({ session: response.data });
  }

  async handleUpdatePerson(user) {
    const { sessionId } = this.props.match.params;
    // this.setState({ loading: true });
    await api.postUpdateUser(user);

    const { users } = this.state.session;
    const index = users.findIndex((usr) => usr._id == user._id);
    users[index] = user;
    this.setState({
      session: {
        ...this.state.session,
        users,
      },
    });
  }

  async handleUpdateSession(session) {
    this.setState({ session });
    await api.postUpdateSessionPreferences(
      session.id,
      session.locationPreferences
    );
  }

  handleCalculate = async () => {
    this.setState({ mapLoading: true });
    const { sessionId } = this.props.match.params;
    await api.getCalculate(sessionId);
    const response = await api.getSession(sessionId);
    this.setState({ mapLoading: false, session: response.data });
  };

  render() {
    return (
      <div>
        <Header />
        {!this.state.loading && (
          <Fragment>
            {this.state.mapLoading && (
              <div className="loading position-absolute d-flex justify-content-center align-items-center">
                <CircularProgress />
              </div>
            )}
            <MapContainer
              session={this.state.session}
              loading={this.state.loading}
            />
            <Sidebar
              loading={this.state.loading}
              session={this.state.session}
              addPerson={(name) => this.handleAddPerson(name)}
              updatePerson={(user) => this.handleUpdatePerson(user)}
              updateSession={(session) => this.handleUpdateSession(session)}
            />
          </Fragment>
        )}
        <Calculate onClick={this.handleCalculate} />
      </div>
    );
  }
}

export default withRouter(MapPage);
