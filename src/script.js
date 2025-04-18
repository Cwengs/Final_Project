let apiKey = "34b84ca9710baa6a1c25cet48o6efff9";
let currentCity = "Paris";
let currentUnit = "metric";

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  if (minutes < 10) minutes = `0${minutes}`;

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecastHtml = "";

  response.data.daily.slice(0, 5).forEach(function (day) {
    forecastHtml += `
      <div class="forecast-day">
        <div class="forecast-date">${formatDay(day.time)}</div>
        <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
        <div class="forecast-temp">
          <strong>${Math.round(day.temperature.maximum)}º</strong> | 
          ${Math.round(day.temperature.minimum)}º
        </div>
      </div>
    `;
  });

  forecastElement.innerHTML = forecastHtml;
}

function getForecast(city) {
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=${currentUnit}`;
  axios.get(apiUrl).then(displayForecast);
}

function refreshWeather(response) {
  let temperature = Math.round(response.data.temperature.current);
  let city = response.data.city;
  let description = response.data.condition.description;
  let humidity = `${response.data.temperature.humidity}%`;
  let wind = `${response.data.wind.speed} km/h`;
  let icon = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;
  let date = new Date(response.data.time * 1000);

  document.querySelector("#temperature").innerHTML = temperature;
  document.querySelector("#city").innerHTML = city;
  document.querySelector("#description").innerHTML = description;
  document.querySelector("#humidity").innerHTML = humidity;
  document.querySelector("#wind-speed").innerHTML = wind;
  document.querySelector("#icon").innerHTML = icon;
  document.querySelector("#time").innerHTML = formatDate(date);

  getForecast(city);
}

function searchCity(city) {
  currentCity = city;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${currentUnit}`;
  axios
    .get(apiUrl)
    .then(refreshWeather)
    .catch(() => {
      alert("City not found. Please try again.");
    });
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-form-input").value;
  searchCity(city);
}

document.querySelector("#theme-toggle").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  document.querySelector(".weather-app").classList.toggle("dark-mode");
  document.querySelector(".search-form-input").classList.toggle("dark-mode");
  document.querySelector(".search-form-button").classList.toggle("dark-mode");
  this.textContent = document.body.classList.contains("dark-mode")
    ? "☀️"
    : "🌙";
});

document.querySelector("#unit-toggle").addEventListener("click", function () {
  currentUnit = currentUnit === "metric" ? "imperial" : "metric";
  this.textContent = currentUnit === "metric" ? "Switch to °F" : "Switch to °C";
  searchCity(currentCity);
});

document
  .querySelector("#search-form")
  .addEventListener("submit", handleSearchSubmit);
searchCity(currentCity);
