import axios from "axios";

const url = process.env.REACT_APP_BACKEND_URL;

axios.defaults.baseURL = `${url}/api/v1.0/ontario`;

const api = {

    getSomething() {
        return axios.get(`/example`);
    },

};

export default api;
