let searchInp = document.querySelector(".search");
let city = document.querySelector(".city");
let day = document.querySelector(".day");
let calendar = document.querySelector(".calendar");
let humidity = document.querySelector(".humiditiy-value");
let wind = document.querySelector(".wind-value");
let pressure = document.querySelector(".pressure-value");
let image = document.querySelector(".weather_image");
let temperaature = document.querySelector(".temperature-value");
let forecastBlock = document.querySelector(".weather_forecast");
let suggestions = document.querySelector("#suggestions");

// API variable
let weatherAPIKey = "9f512c2cc3dfb9f3b96f7273cd240aea";
let weatherBaseEndpoint =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" +
  weatherAPIKey;

let forecastBaseEndpoint =
  "https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=" +
  weatherAPIKey;

// array for images
let weatherImages = [
  {
    url: "images/clear-sky.png",
    ids: [800],
  },
  {
    url: "images/broken-clouds1.png",
    ids: [803, 804],
  },
  {
    url: "images/few-clouds1.png",
    ids: [801],
  },
  {
    url: "images/mist.png",
    ids: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
  },
  {
    url: "images/rain1.png",
    ids: [500, 501, 502, 503, 504],
  },
  {
    url: "images/scattered-clouds.png",
    ids: [802],
  },
  {
    url: "images/shower-rain.png",
    ids: [520, 521, 522, 531, 300, 301, 302, 310, 311, 312, 313, 314, 321],
  },
  {
    url: "images/snow1.png",
    ids: [511, 600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
  },
  {
    url: "images/thunderstorm1.png",
    ids: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
  },
];

//  API Connection for weather today section
let getWeatherByCityName = async (cityString) => {
  let city;
  if (cityString.includes(",")) {
    city =
      cityString.substring(0, cityString.indexOf(",")) +
      cityString.substring(cityString.lastIndexOf(","));
  } else {
    city = cityString;
  }
  let endpoint = weatherBaseEndpoint + "&q=" + city;
  let response = await fetch(endpoint);
  if (response.status !== 200) {
    alert("City not found !");
    return;
  }
  let weather = await response.json();
  return weather;
};

//  API Connection for forecast section
let getForecastByCityID = async (id) => {
  let endpoint = forecastBaseEndpoint + "&id=" + id;
  let result = await fetch(endpoint);
  let forecast = await result.json();
  let forecastList = forecast.list;
  let daily = [];

  forecastList.forEach((day) => {
    let date = new Date(day.dt_txt.replace(" ", "T"));
    let hours = date.getHours();
    if (hours === 12) {
      daily.push(day);
    }
  });
  return daily;
};

let weatherForCity = async (city) => {
  let weather = await getWeatherByCityName(city);
  if (!weather) {
    return;
  }
  let cityID = weather.id;
  updateCurrentWeather(weather);
  let forecast = await getForecastByCityID(cityID);
  updateForecast(forecast);
};
//  set city weather info
searchInp.addEventListener("keydown", async (e) => {
  if (e.keyCode === 13) {
    weatherForCity(searchInp.value);
  }
});

// API Connection for search Input
searchInp.addEventListener("input", async () => {
  let endpoint = searchInp.value;
  let result = await (await fetch(endpoint)).json();
  suggestions.innerHTML = "";
  let cities = result._embedded["city:search-results"];
  let length = cities.length > 5 ? 5 : cities.length;
  for (let i = 0; i < length; i++) {
    let option = document.createElement("option");
    option.value = cities[i].matching_full_name;
    suggestions.appendChild(option);
  }
});

// update weather details
let updateCurrentWeather = (data) => {
  city.textContent = data.name + ", " + data.sys.country;
  day.textContent = dayOfWeak();
  calendar.textContent = calenderInfo();
  humidity.textContent = data.main.humidity;
  pressure.textContent = data.main.pressure;
  wind.textContent = windInfo(data);
  temperaature.textContent =
    data.main.temp > 0
      ? "+" + Math.round(data.main.temp)
      : Math.round(data.main.temp);

  let imgID = data.weather[0].id;
  weatherImages.forEach((obj) => {
    if (obj.ids.includes(imgID)) {
      image.src = obj.url;
    }
  });
};

// update forecast weather details
let updateForecast = (forecast) => {
  forecastBlock.innerHTML = "";
  forecast.forEach((day) => {
    let iconUrl =
      "http://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png";
    let dayName = dayOfWeak(day.dt * 1000);
    let temperature =
      day.main.temp > 0
        ? "+" + Math.round(day.main.temp)
        : Math.round(day.main.temp);
    let forecatItem = `
            <article class="item">
                <img src="${iconUrl}" alt="${day.weather[0].description}" class="icon">
                <h3 class="forecast_day">${dayName}</h3>
                <p class="forecast_temperature"><span class="value">${temperature}</span> &deg;C</p>
            </article>
        `;
    forecastBlock.insertAdjacentHTML("beforeend", forecatItem);
  });
};

// get day info
let dayOfWeak = (dt = new Date().getTime()) => {
  return new Date(dt).toLocaleDateString("en-EN", { weekday: "long" });
};

// get calender info
let calenderInfo = () => {
  return new Date().toLocaleDateString("en-EN", { calendar: "long" });
};

// get wind info
let windInfo = (data) => {
  let windDirection;
  let deg = data.wind.deg;
  if (deg > 45 && deg <= 135) {
    windDirection = "East";
  } else if (deg > 135 && deg <= 225) {
    windDirection = "South";
  } else if (deg > 225 && deg <= 315) {
    windDirection = "West";
  } else {
    windDirection = "North";
  }
  return windDirection + ", " + data.wind.speed;
};

// initial city for hanoi
let init = () => {
  weatherForCity("Hanoi").then(() => (document.body.style.filter = "blur(0)"));
};

init();