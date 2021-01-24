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

  postUpdateSessionPreferences(sessionId, preferences) {
    return axios.post(`/session/${sessionId}/preferences`, preferences);
  },

  postNewUser({ name, sessionId }) {
    console.log("name", name);
    return axios.post(`/user/new`, { name, sessionId });
  },

  postUpdateUser(user) {
    return axios.post(`/user/${user._id}`, user);
  },

  getCalculate(id) {
    return axios.get(`/session/${id}/calculate`);
  },
};

export default api;
