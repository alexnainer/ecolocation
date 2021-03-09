import React, { Component, Fragment } from "react";
import MapContainer from "./MapContainer";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../api/api";
import { withRouter } from "react-router";
import Calculate from "../../components/Calculate";
import CircularProgress from "@material-ui/core/CircularProgress";
import SnackbarAlert from "../../components/SnackbarAlert";

class MapPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      mapLoading: false,
      hasCalculated: false,
      session: { results: {} },
    };
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

    await api.postNewUser({ name, sessionId });
    const response = await api.getSession(sessionId);
    this.setState({ session: response.data });
  }

  async handleUpdatePerson(user) {
    const { sessionId } = this.props.match.params;

    const { users } = this.state.session;
    const index = users.findIndex((usr) => usr._id == user._id);
    users[index] = user;
    this.setState({
      session: {
        ...this.state.session,
        users,
      },
    });
    api.postUpdateUser(user);
  }

  async handleUpdateSession(session) {
    this.setState({ session });
    await api.postUpdateSessionPreferences(
      session.id,
      session.locationPreferences
    );
  }

  isFieldsValid = () => {
    for (const user of this.state.session.users) {
      console.log("user", user);
      if (!user.location?.geoJson?.coordinates?.length) return false;

      const {
        maxWalkDistance,
        maxCarDistance,
        maxBicycleDistance,
      } = user.preferences;

      if (!(maxWalkDistance || maxCarDistance || maxBicycleDistance))
        return false;
    }
    return true;
  };

  isLocationPreferencesValid = () => {
    const {
      cafe,
      outdoors,
      government,
      restaurant,
      hotel,
      publicBuilding,
    } = this.state.session.locationPreferences;
    return (
      cafe || outdoors || government || restaurant || hotel || publicBuilding
    );
  };

  handleCalculate = async () => {
    if (!this.state.session.users.length) {
      this.setState({ missingUsersError: true });
    } else if (!this.isFieldsValid()) {
      this.setState({ validFieldsError: true });
    } else if (!this.isLocationPreferencesValid()) {
      this.setState({ locationPreferencesError: true });
    } else {
      this.setState({ mapLoading: true });
      const { sessionId } = this.props.match.params;
      await api.getCalculate(sessionId);
      const response = await api.getSession(sessionId);
      this.setState({
        mapLoading: false,
        session: response.data,
        hasCalculated: true,
      });
    }
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
        <Calculate
          onClick={this.handleCalculate}
          session={this.state.session}
          hasCalculated={this.state.hasCalculated}
        />
        <SnackbarAlert
          open={this.state.validFieldsError}
          onClose={() => this.setState({ validFieldsError: false })}
          severity="error"
          message="Missing user fields"
        />
        <SnackbarAlert
          open={this.state.missingUsersError}
          onClose={() => this.setState({ missingUsersError: false })}
          severity="error"
          message="At least 1 user is required"
        />
        <SnackbarAlert
          open={this.state.locationPreferencesError}
          onClose={() => this.setState({ locationPreferencesError: false })}
          severity="error"
          message="At least 1 location preference is required"
        />
      </div>
    );
  }
}

export default withRouter(MapPage);
