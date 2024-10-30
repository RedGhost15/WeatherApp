const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-button");
const notFound = document.querySelector("#not-found");
const searchCity = document.querySelector("#search-city");
const weatherInfo = document.querySelector("#weather-info");
const cityText = document.querySelector("#city-text");
const tempText = document.querySelector("#temp-text");
const conditions = document.querySelector("#condition-text");
const humidityText = document.querySelector("#humidity-value-text");
const feelsLike = document.querySelector("#feels-value-text");
const windText = document.querySelector("#wind-value-text");
const minTemp = document.querySelector("#minTemp-value-text");
const maxTemp = document.querySelector("#maxTemp-value-text");
const pressureText = document.querySelector("#pressure-value-text");
const weatherImg = document.querySelector(".weather-summary-img");
const currentDate = document.querySelector("#current-date-text");
const forecastItmCont = document.querySelector("#forecast-items-container");

const apiKey = "7e213c5305198a051ba15dd1eedab697";


document.addEventListener("DOMContentLoaded", () => {
    showDisplaySection(searchCity);
});

searchButton.addEventListener("click", () => {
    if (cityInput.value.trim() != "") {
        updateWeatherInfo(cityInput.value);
        cityInput.value = "";
        cityInput.blur();
    }
});

cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && cityInput.value.trim() != "") {
        updateWeatherInfo(cityInput.value);
        cityInput.value = "";
        cityInput.blur();
    }
});

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

function getWeatherIcon(id) {
    if (id >= 200 && id <= 232) return "thunderstorms.svg";
    if (id >= 300 && id <= 321) return "drizzle.svg";
    if (id >= 500 && id <= 531) return "showers.svg";
    if (id >= 600 && id <= 622) return "snow.svg";
    if (id === 800) return "sunny.svg";  // Clear weather
    if (id === 801 || id === 802) return "clear-cloudy.svg";
    if (id >= 803 && id <= 804) return "cloudy.svg";
    if (id >= 700 && id <= 781) return "foggy.svg";
    return "haze-day.svg";  // Default
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: "short",
        day: "2-digit",
        month: "short",
    };

    return currentDate.toLocaleDateString("en-GB", options);
}

async function updateWeatherInfo(city) {
    try {
        const weatherData = await getFetchData("weather", city);

        if (weatherData.cod != 200) {
            showDisplaySection(notFound);
            return;
        }

        const {
            name: country,
            main: {temp, humidity, feels_like, pressure, temp_max, temp_min},
            weather: [{id, main}],
            wind: { speed },
        } = weatherData;

        cityText.textContent = country;
        tempText.textContent = Math.round(temp) + "°C";
        conditions.textContent = main;
        humidityText.textContent = humidity + "%";
        feelsLike.textContent = Math.round(feels_like) + "°C";
        windText.textContent = speed + "M/s";
        minTemp.textContent = Math.round(temp_min) + "°C";
        maxTemp.textContent = Math.round(temp_max) + "°C";
        pressureText.textContent = pressure + " mb";

        currentDate.textContent = getCurrentDate();
        weatherImg.src = `assets/weather-icons/${getWeatherIcon(id)}`;

        await updateForecastInfo(city) 
        
        showDisplaySection(weatherInfo);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        showDisplaySection(notFound);
    }
}

async function updateForecastInfo(city) {
    const forecastsData = await getFetchData("forecast", city)

    const timeTaken = "12:00:00"
    const todayDate = new Date().toISOString().split("T")[0]


    forecastItmCont.innerHTML = ""
    forecastsData.list.forEach(forecastsWeather => {
        if (forecastsWeather.dt_txt.includes(timeTaken) && !forecastsWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastsWeather)
        }
        
    })
    
    
}

function updateForecastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: "2-digit",
        month: "short",
    }

    const dateResult = dateTaken.toLocaleDateString("en-GB", dateOption)

    const forecastItem = `
        <div class="forecast-item" id="forecast-item">
                <p class="forecast-item-date regular-text" id="forecast-item-date">${dateResult}</p>
                <p class="forecast-item-temp" id="forecast-item-temp">${Math.round(temp) + "°C"}</p>
                <img src="/assets/weather-icons/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
        </div>
    `

    forecastItmCont.insertAdjacentHTML("beforeend", forecastItem)

}

function showDisplaySection(activeSection) {
    [weatherInfo, searchCity, notFound].forEach(section => {
        section.style.display = "none";
    });

    activeSection.style.display = "flex";
}

const hideBtn = document.getElementById("hide-btn")
const weatherMainDiv = document.getElementById("weather-conditions-main")


hideBtn.addEventListener("click", () => {
    weatherMainDiv.classList.toggle("active")
})
