import axios from "axios";
import { API_URL } from "./url";

function getAll() {
    return axios.get(API_URL + "users");
}

function getMe() {
    return axios.get(API_URL + "users/me");
}

function getById(id) {
    return axios.get(API_URL + "users/" + id);
}

function update(id, user) {
    return axios.patch(API_URL + "users/" + id, user);
}

function deleteUser(id) {
    return axios.delete(API_URL + "users/" + id);
}

export default {
    getAll,
    getMe,
    getById,
    update,
    deleteUser
};