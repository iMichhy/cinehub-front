import axios from "axios";
import { API_URL } from "./url";

function getAll() {
    return axios.get(API_URL + "screenings");
}

function getByFilm(filmId) {
    return axios.get(API_URL + "screenings/film/" + filmId);
}

function getById(id) {
    return axios.get(API_URL + "screenings/" + id);
}

function insert(screening) {
    return axios.post(API_URL + "screenings", screening);
}

function update(id, screening) {
    return axios.patch(API_URL + "screenings/" + id, screening);
}

function deleteScreening(id) {
    return axios.delete(API_URL + "screenings/" + id);
}

export default {
    getAll,
    getByFilm,
    getById,
    insert,
    update,
    deleteScreening
};