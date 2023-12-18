import { WEATHER_DETAILS } from "./const.js";
export { getFormattedTime, getWeatherDetails };
const TIME = {
  SECOND_TO_MINUTE: 60,
  MSEC_TO_SECOND: 1000,
};

const feelsTemperature = document.querySelector("#feelsTemperature");
const sunriseTime = document.querySelector("#sunriseTime");
const sunsetTime = document.querySelector("#sunsetTime");

function getFormattedTime(time) {
  const date = new Date(time * TIME.MSEC_TO_SECOND);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return hours + ":" + minutes;
}

function getWeatherDetails(data) {
  const userDate = new Date();
  const userTimezoneOffset =
    userDate.getTimezoneOffset() * TIME.SECOND_TO_MINUTE;
  const timezoneOffsetFromJSON = data.city.timezone;
  const FeelslikeTemperatureFromJSON = data.list[0].main.feels_like;
  const cityTimezoneOffset = timezoneOffsetFromJSON + userTimezoneOffset;

  const formattedSunriseTime = getFormattedTime(
    data.city.sunrise + cityTimezoneOffset
  );
  const formattedSunsetTime = getFormattedTime(
    data.city.sunset + cityTimezoneOffset
  );

  feelsTemperature.textContent =
    WEATHER_DETAILS.FEELS + FeelslikeTemperatureFromJSON.toFixed(0);
  sunriseTime.textContent = WEATHER_DETAILS.SUNRISE + formattedSunriseTime;
  sunsetTime.textContent = WEATHER_DETAILS.SUNSET + formattedSunsetTime;
}
