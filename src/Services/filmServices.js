import axios from "axios";
import { API_URL } from "./url";

function getAll() {
    return axios.get(API_URL + "films");
}

function getShowing() {
    return axios.get(API_URL + "films/showing");
}

function getById(id) {
    return axios.get(API_URL + "films/" + id);
}

function insert(film) {
    return axios.post(API_URL + "films", film);
}

function update(id, film) {
    return axios.patch(API_URL + "films/" + id, film);
}

function deleteFilm(id) {
    return axios.delete(API_URL + "films/" + id);
}

export default {
    getAll,
    getShowing,
    getById,
    insert,
    update,
    deleteFilm
};