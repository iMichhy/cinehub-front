import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "./url";

function login(user){
    return axios.post(API_URL + "auth/login", user)
}

function register(user){
    return axios.post(API_URL + "auth/register", user)
}

function isConnected(){
    const token = window.localStorage.getItem("token");
    if(token){
        try {
            const decoded = jwtDecode(token);
            if(decoded.exp * 1000 > Date.now()){
                axios.defaults.headers["Authorization"] = "Bearer " + token;
                return true;
            }
        } catch (error) {
        }
        logout();
    }
    return false;
}

function getUser() {
    if (isConnected()){
        const token = window.localStorage.getItem("token");
        const decoded = jwtDecode(token);
        return decoded.user;
    }
    return null;
}

function logout(){
    window.localStorage.removeItem("token");
    delete axios.defaults.headers["Authorization"];
}

export default {
    login,
    register,
    isConnected,
    getUser,
    logout
};