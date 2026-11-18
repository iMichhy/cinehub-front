import axios from "axios";
import { API_URL } from "./url";

function getAll() {
    return axios.get(API_URL + "reservations");
}

function getMe() {
    return axios.get(API_URL + "reservations/me");
}

function getByScreening(screeningId) {
    return axios.get(API_URL + "reservations/screening/" + screeningId);
}

function insert(reservation) {
    return axios.post(API_URL + "reservations", reservation);
}

function deleteReservation(id) {
    return axios.delete(API_URL + "reservations/" + id);
}

export default {
    getAll,
    getMe,
    getByScreening,
    insert,
    deleteReservation
};