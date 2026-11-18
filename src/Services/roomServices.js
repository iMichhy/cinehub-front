import axios from "axios";
import { API_URL } from "./url";

function getAll() {
    return axios.get(API_URL + "rooms");
}

function getById(id) {
    return axios.get(API_URL + "rooms/" + id);
}

function insert(room) {
    return axios.post(API_URL + "rooms", room);
}

function update(id, room) {
    return axios.patch(API_URL + "rooms/" + id, room);
}

function deleteRoom(id) {
    return axios.delete(API_URL + "rooms/" + id);
}

export default {
    getAll,
    getById,
    insert,
    update,
    deleteRoom
};