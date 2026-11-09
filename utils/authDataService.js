import axios from "axios";

const BASE_URL = "http://10.0.2.2:4000/";

export function login(username, password) {
  return axios.post(`${BASE_URL}auth/login`, {
    username,
    password,
  });
}

export function createUser(username, password) {
  return axios.post(`${BASE_URL}auth/signup`, {
    username,
    password,
  });
}

export function getNewToken(token) {
  return axios.post(`${BASE_URL}auth/token`, {
    token,
  });
}

export function logout(token) {
  return axios.delete(`${BASE_URL}auth/logout`, {
    token,
  });
}

export function getPosts(token) {
  return axios.get(`${BASE_URL}posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}