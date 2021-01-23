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
};

export default api;
