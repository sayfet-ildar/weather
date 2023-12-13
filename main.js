const currentCity = document.querySelector(".currentCity");
const searchButton = document.querySelector(".search");
const buttonFavList = document.querySelector(".addCity");
const textInput = document.querySelector(".inputCity");
const citiesList = document.querySelector(".addedCities");
const feelsTemperature = document.querySelector("#feelsTemperature");
const sunriseTime = document.querySelector("#sunriseTime");
const sunsetTime = document.querySelector("#sunsetTime");
const forecast = document.querySelector(".forecast");
const currentTemperature = document.querySelector(".temperature");
const iconWeather = document.querySelector("#image");
const serverUrl = "https://api.openweathermap.org/data/2.5/forecast/";
const apiKey = "f660a2fb1e4bad108d6160b7f58c555f";

import { ERROR, WEATHER_DETAILS } from "./const.js";

function searchButtonClick(event) {
  event.preventDefault();
  fetchCityWeather(event);
  clearInput();
}

searchButton.addEventListener("click", searchButtonClick);
buttonFavList.addEventListener("click", addCityToFavourite);
citiesList.addEventListener("click", getWeatherForCityInList);

const list = [];

function renderList() {
  citiesList.innerHTML = "";
  const ul = document.createElement("ul");
  citiesList.appendChild(ul);

  list.forEach((city) => {
    createListItem(city, ul);
  });
}

function createListItem(city, parentElement) {
  const li = document.createElement("li");
  parentElement.appendChild(li);

  const span = document.createElement("span");
  span.className = "cityNameInList";
  span.textContent = city.name;
  li.appendChild(span);

  const deleteButton = document.createElement("button");
  deleteButton.className = "cross";
  li.appendChild(deleteButton);

  deleteButton.addEventListener("click", deleteCityFromFavourite);
}

function renderForecast(data) {
  forecast.innerHTML = "";
  const ul_forecast = document.createElement("ul");
  forecast.appendChild(ul_forecast);

  data.list.slice(0, 3).forEach(function (item) {
    createForecastItem(item, ul_forecast);
  });
}

function createForecastItem(item, parentElement) {
  const forecast_item = document.createElement("div");
  forecast_item.className = "forecast_item";
  parentElement.appendChild(forecast_item);

  const div_forecast = document.createElement("div");
  div_forecast.className = "div_forecast";
  forecast_item.appendChild(div_forecast);

  createListItemInForecast("li_time", getFormattedTime(item.dt), div_forecast);
  createListItemInForecast(
    "li_temperature",
    WEATHER_DETAILS.TEMPERATURE + item.main.temp.toFixed(0),
    div_forecast
  );
  createListItemInForecast(
    "li_feelsTemperature",
    WEATHER_DETAILS.FEELS + item.main.feels_like.toFixed(0),
    div_forecast
  );

  const img_container = document.createElement("div");
  img_container.className = "img_container";
  forecast_item.appendChild(img_container);

  const img_weatherPic = document.createElement("img");
  img_container.appendChild(img_weatherPic);
  img_weatherPic.src = `./icons/${item.weather[0].icon}.png`;
}

function createListItemInForecast(id, text, parentElement) {
  const li = document.createElement("li");
  li.id = id;
  parentElement.appendChild(li);
  li.textContent = text;
}

function clearInput() {
  document.querySelector(".inputCity").value = "";
  document.querySelector(".inputCity").focus();
}

function changeIconWeather(data) {
  iconWeather.src = `./icons/${data.list[0].weather[0].icon}.png`;
}

function getFormattedTime(time) {
  const date = new Date(time * 1000);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return hours + ":" + minutes;
}

function getWeatherDetails(data) {
  feelsTemperature.textContent =
    WEATHER_DETAILS.FEELS + data.list[0].main.feels_like.toFixed(0);

  sunriseTime.textContent =
    WEATHER_DETAILS.SUNRISE + getFormattedTime(data.city.sunrise);
  sunsetTime.textContent =
    WEATHER_DETAILS.SUNSET + getFormattedTime(data.city.sunset);
}

function fetchCityWeather() {
  const cityName = textInput.value.trim();
  const url = `${serverUrl}?q=${cityName}&appid=${apiKey}&units=metric`;

  fetch(url).then(handleResponse).then(handleData).catch(handleError);
}

function handleResponse(response) {
  if (!response.ok) {
    throw new Error(ERROR.VALID);
  }
  return response.json();
}

function handleData(data) {
  getTemperature(data);
  changeIconWeather(data);
  getWeatherDetails(data);
  renderForecast(data);
}

function handleError(error) {
  alert(error);
  clearInput();
}

function getTemperature(data) {
  currentCity.textContent = data.city.name;
  currentTemperature.textContent = data.list[0].main.temp.toFixed(0);
}

function addCityToFavourite(city) {
  const newCity = {
    name: city,
  };

  if (list.some((item) => item.name === currentCity.textContent)) {
    alert(ERROR.EXIST);
    clearInput();
  } else {
    newCity.name = currentCity.textContent;
    list.push(newCity);

    clearInput();
    renderList();
  }
}

function isCityInList(event, className) {
  if (!event.target.classList.contains(className)) return;
}

function deleteCityFromFavourite(event) {
  isCityInList(event, "cross");
  const liElement = event.target.closest("li");
  const cityNameInList = liElement.querySelector(".cityNameInList").textContent;

  const indexCityinList = list.findIndex(
    (city) => city.name === cityNameInList
  );

  list.splice(indexCityinList, 1);

  clearInput();
  renderList();
}

function getWeatherForCityInList(event) {
  isCityInList(event, "cityNameInList");
  const parentNode = event.target.parentNode;
  const cityNameInList = parentNode.querySelector(".cityNameInList");
  const cityName = cityNameInList.textContent;
  textInput.value = cityName;

  fetchCityWeather();
  clearInput();
}
