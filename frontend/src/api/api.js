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

  postNewUser({ name, sessionId }) {
    console.log("name", name);
    return axios.post(`/user/new`, { name, sessionId });
  },
};

export default api;
