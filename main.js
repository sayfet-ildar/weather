const currentCity = document.querySelector(".currentCity");
const search = document.querySelector(".search");
const buttonFavList = document.querySelector(".addCity");
const textInput = document.querySelector(".inputCity");
const citiesList = document.querySelector(".addedCities");
const cityNameInList = document.querySelector(".cityNameInList");

const ERROR = {
  VALID: "Please enter a valid city name",
  EXIST: "This city is already on the list.",
};

search.addEventListener("click", function (event) {
  event.preventDefault();
  searchCity(event);
  clearInput();
});

buttonFavList.addEventListener("click", addCityToList);
citiesList.addEventListener("click", getWeatherForCity);

let list = [];

function renderList() {
  citiesList.innerHTML = "";
  const ul = document.createElement("ul");
  citiesList.appendChild(ul);

  list.forEach((city) => {
    const li = document.createElement("li");
    ul.appendChild(li);

    const span = document.createElement("span");
    span.className = "cityNameInList";
    span.textContent = city.name;
    li.appendChild(span);

    const deleteButton = document.createElement("button");
    deleteButton.className = "cross";
    li.appendChild(deleteButton);

    deleteButton.addEventListener("click", deleteTask);
  });
}

function clearInput() {
  document.querySelector(".inputCity").value = "";
  document.querySelector(".inputCity").focus();
}

function checkTemp(data) {
  currentCity.textContent = data.name;
  const currentTemperature = document.querySelector(".temperature");
  currentTemperature.textContent = (data.main.temp - 273.15).toFixed(0) + "°";
}

function checkIcon(data) {
  const iconWeather = document.querySelector("#image");
  iconWeather.src = `./icons/${data.weather[0].icon}.png`;
}

function searchCity() {
  const serverUrl = "https://api.openweathermap.org/data/2.5/weather";
  const cityName = textInput.value.trim();
  const apiKey = "f660a2fb1e4bad108d6160b7f58c555f";
  const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw ERROR.VALID;
      }
      return response.json();
    })
    .then((data) => {
      checkTemp(data);
      checkIcon(data);
    })
    .catch((event) => {
      alert(event);
      clearInput();
    });
}

function addCityToList(city) {
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

function checkTargetCity(event, className) {
  if (!event.target.classList.contains(className)) return;
}

function deleteTask(event) {
  checkTargetCity(event, "cross");
  const liElement = event.target.closest("li");
  const cityNameInList = liElement.querySelector(".cityNameInList").textContent;
  list = list.filter((name) => name.name !== cityNameInList);

  clearInput();
  renderList();
}

function checkCityInList(event) {
  const parentNode = event.target.parentNode;
  return parentNode.querySelector(".cityNameInList");
}

function getWeatherForCity(event) {
  checkTargetCity(event, "cityNameInList");

  const cityNameInList = checkCityInList(event);
  const cityName = cityNameInList.textContent;
  textInput.value = cityName;

  searchCity();
  clearInput();
}
