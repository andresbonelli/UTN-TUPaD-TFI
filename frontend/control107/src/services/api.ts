// export const API_URL = "http://localhost:8080/api/v1";

import axios from "axios";

export const API_URL = "http://localhost:8080/api/v1";

export const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});