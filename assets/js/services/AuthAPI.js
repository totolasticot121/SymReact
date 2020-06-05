import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "../config";


// Logout (delete localStorage token and authorization in request header)
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

// Authentification http request and token storage in localStorage and axios
function authenticate(credentials) {
    return axios
        .post(LOGIN_API, credentials)
        .then((response) => response.data.token)
        .then((token) => {
            window.localStorage.setItem("authToken", token);
            setAxiosToken(token);
        });
}

// Store jwt token in axios headers
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

// At app loading, check and set jwt token
function setUp() {
    const token = window.localStorage.getItem("authToken");

    if (token) {
        const jwtData = jwtDecode(token);

        if (jwtData.exp * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        }
    }
}

// Check if authenticated or not thanks to token
function isAuth() {
    const token = window.localStorage.getItem("authToken");

    if (token) {
        const jwtData = jwtDecode(token);

        if (jwtData.exp * 1000 > new Date().getTime()) {
            return true;
        }
        return false;
    }
    return false;
}

export default {
    authenticate,
    logout,
    isAuth,
    setUp,
};
