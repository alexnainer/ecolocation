import React, { Component, Fragment } from "react";
import MapContainer from "./MapContainer";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import api from "../../api/api";
import { withRouter } from "react-router";
import Calculate from "../../components/Calculate";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert } from "@material-ui/lab";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

class MapPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      mapLoading: false,
      hasCalculated: false,
      session: { results: {} },
      validFieldsError: false,
      missingUsersError: false,
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

  handleCalculate = async () => {
    if (this.isFieldsValid()) {
      this.setState({ mapLoading: true });
      const { sessionId } = this.props.match.params;
      await api.getCalculate(sessionId);
      const response = await api.getSession(sessionId);
      this.setState({
        mapLoading: false,
        session: response.data,
        hasCalculated: true,
      });
    } else {
      this.setState({ validFieldsError: true });
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
        <Snackbar
          open={this.state.validFieldsError}
          onClose={() => this.setState({ validFieldsError: false })}
        >
          <Alert
            severity="error"
            variant="filled"
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => this.setState({ validFieldsError: false })}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            Missing user fields
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

export default withRouter(MapPage);
