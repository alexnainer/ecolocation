import axios from "axios";

const url = process.env.REACT_APP_BACKEND_URL;

axios.defaults.baseURL = `${url}/api/v1.0`;

const api = {
  getNewSession() {
    return axios.get(`/session/new`);
  },

  getSession(id) {
    return axios.get(`/session/${id}`);
  },

  putUpdateSessionLocation(sessionId, preferences) {
    console.log("sessionId, preferences", sessionId, preferences);
    return axios.put(`/session/${sessionId}/preferences/location`, preferences);
  },

  putUpdateSessionMeeting(sessionId, preferences) {
    console.log("sessionId, preferences", sessionId, preferences);
    return axios.put(`/session/${sessionId}/preferences/meeting`, preferences);
  },

  postNewUser({ name, sessionId }) {
    console.log("name", name);
    return axios.post(`/user/new`, { name, sessionId });
  },

  putUpdateUser(user) {
    return axios.put(`/user/${user._id}`, user);
  },

  deleteUser(userId) {
    return axios.delete(`/user/${userId}`);
  },

  getCalculate(id) {
    return axios.get(`/session/${id}/calculate`);
  },
};

export default api;
