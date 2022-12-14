const CURRENT_LOCATION = document.getElementsByClassName(
  "weather-content__overview"
)[0];
const CURRENT_TEMP = document.getElementsByClassName(
  "weather-content__temp"
)[0];
const FORECAST = document.getElementsByClassName("component__forecast-box")[0];

const appid = "a92e9499a2b4fcc83a9190df4ccff3a0";

function getWeatherData(position) {
  const headers = new Headers();
  const URL = `https://api.openweathermap.org/data/2.5/forecast/daily?${position}&cnt=7&units=imperial&APPID=${appid}`;

  return fetch(URL, {
    method: "GET",
    headers: headers,
  }).then((data) => data.json());
}

function applyIcon(icon) {
  let selectedIcon;
  switch (icon) {
    case "01d":
      selectedIcon = "wi-day-sunny";
      break;
    case "01n":
      selectedIcon = "wi-night-clear";
      break;
    case "02d":
    case "02n":
      selectedIcon = "wi-cloudy";
      break;
    case "03d":
    case "03n":
    case "04d":
    case "04n":
      selectedIcon = "wi-night-cloudy";
      break;
    case "09d":
    case "09n":
      selectedIcon = "wi-showers";
      break;
    case "10d":
    case "10n":
      selectedIcon = "wi-rain";
      break;
    case "11d":
    case "11n":
      selectedIcon = "wi-thunderstorm";
      break;
    case "13d":
    case "13n":
      selectedIcon = "wi-snow";
      break;
    case "50d":
    case "50n":
      selectedIcon = "wi-fog";
      break;
    default:
      selectedIcon = "wi-meteor";
  }
  return selectedIcon;
}

renderData = (location, forecast) => {
  // render city, current weather description and temp
  const currentWeather = forecast[0].weather[0];
  const widgetHeader = `<h1>${location.name}</h1><small>${currentWeather.description}</small>`;
  console.log(forecast[0].temp.day);
  CURRENT_TEMP.innerHTML = `<i class="wi ${applyIcon(
    currentWeather.icon
  )}"></i> ${Math.round(forecast[0].temp.day)} <i class="wi wi-degrees"></i>`;
  CURRENT_LOCATION.innerHTML = widgetHeader;

  // render each daily forecast
  forecast.forEach((day) => {
    let date = new Date(day.dt * 1000);
    let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    let name = days[date.getDay()];
    let dayBlock = document.createElement("div");
    console.log(day);
    dayBlock.className = "forecast__item";
    dayBlock.innerHTML = `<div class="forecast-item__heading">${name}</div>
      <div class="forecast-item__info"><i class="wi ${applyIcon(
        day.weather[0].icon
      )}"></i> <span class="degrees">${Math.round(
      day.temp.day
    )}<i class="wi wi-degrees"></i></span></div>`;
    FORECAST.appendChild(dayBlock);
  });
};

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coordinates = `lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
      getWeatherData(coordinates).then((weatherData) => {
        const city = weatherData.city;
        const dailyForecast = weatherData.list;

        renderData(city, dailyForecast);
      });
    },
    (e) => console.log(e)
  );
} else {
  console.log("unable to retrieve location from browser");
}
