export {
  localStorageList,
  getCityFromStorage,
  localStorageCurrentCity,
  getCurrentCity,
};
import { list, textInput } from "./main.js";

function localStorageList() {
  const citiesString = JSON.stringify(list);
  localStorage.setItem("cityNames", citiesString);
}
function getCityFromStorage() {
  return JSON.parse(localStorage.getItem("cityNames")) || [];
}

function localStorageCurrentCity() {
  localStorage.setItem("lastCity", textInput.value);
}
function getCurrentCity() {
  return localStorage.getItem("lastCity");
}
