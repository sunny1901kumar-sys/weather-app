const searchButton = document.querySelector(".search-box button");
const cityInput = document.querySelector(".search-box input");
const cityName = document.querySelector(".weather-info h2");
const geoUrl = "https://geocoding-api.open-meteo.com/v1/search";
const weatherUrl = "https://api.open-meteo.com/v1/forecast";  // actual Weather API ka URl
const temperatureText = document.querySelector(".weather-info p");
const humidityText = document.querySelectorAll(".weather-info p")[1];
const weatherText = document.querySelectorAll(".weather-info p")[2];
const errorMessage = document.querySelector(".error-message");
const loadingMessage = document.querySelector(".loading-message");

function getWeatherDescription(code) {
    if (code === 0) {
        return "Clear Sky";
    }
    if (code >= 1 && code <= 3) {
        return "Cloudy";
    }
    if (code >= 51 && code <= 55) {
        return "Drizzle";
    }
    if (code >= 61 && code <= 65) {
        return "Rain";
    }
    return "Unknown Weather";
}

searchButton.addEventListener("click", async function(){
    const city = cityInput.value.trim(); // trim() -> input ke starting aur ending ke extra spaces remove karta hai.

    if(city === ""){
        errorMessage.textContent = "Please enter a city";
        return;
    }

    loadingMessage.textContent = "Loading...";
    errorMessage.textContent = "";  // "Purana error hata do, ab nayi request start ho rahi hai."
    try {
        cityName.textContent = city; // <h2> ke andar jo text hai, usko city ki value se replace karo.
        const url = `${geoUrl}?name=${city}&count=1`; // &count -> Hum API se ek matching result lene ke liye keh rahe hain.
        
        const response = await fetch(url); // url par request send karo   //  ++++++++ fetch() JavaScript ka built-in function hai jo kisi URL/API se data request karne ke liye use hota hai.
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            errorMessage.textContent = "City not found";
            loadingMessage.textContent = "";
            return;
        }

        const location = data.results[0]; // means results exist hi nhi karts
        const latitude = location.latitude; // location ek object hai
        const longitude = location.longitude;

        const weatherApiUrl = `${weatherUrl}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`;

        const weatherResponse = await fetch(weatherApiUrl);
        const weatherData = await weatherResponse.json();

        loadingMessage.textContent = "";

        const currentWeather = weatherData.current;

        const temperature = currentWeather.temperature_2m;
        temperatureText.textContent = `Temperatur: ${temperature}°C`;

        const humidity = currentWeather.relative_humidity_2m;
        humidityText.textContent = `Humidity: ${humidity}%`;

        const weatherCode = currentWeather.weather_code;

        const weatherDescription = getWeatherDescription(weatherCode);
        weatherText.textContent = `Weather: ${weatherDescription}`;
    }
    catch (error) {
       loadingMessage.textContent = "";
       errorMessage.textContent = "Something went wrong. Please try again.";
    }

});
/*
# 🌦️ Weather App — Quick Revision Flow

```text
USER ENTERS CITY
        ↓
cityInput.value
        ↓
.trim()
        ↓
Empty check
        ↓
City Name
        ↓
Geocoding API
        ↓
fetch(url)
        ↓
Promise
        ↓
await
        ↓
Response Object
        ↓
response.json()
        ↓
Promise
        ↓
await
        ↓
JSON Data
        ↓
data.results[0]
        ↓
latitude + longitude
        ↓
Weather API URL
        ↓
fetch(weatherApiUrl)
        ↓
Promise
        ↓
await
        ↓
Weather Response
        ↓
weatherResponse.json()
        ↓
Promise
        ↓
await
        ↓
Weather JSON Data
        ↓
data.current
        ↓
Temperature + Humidity + Weather Code
        ↓
getWeatherDescription(code)
        ↓
Weather Description
        ↓
DOM
        ↓
Screen par Weather Show
```

## 🔄 Error Handling Flow

```text
API Request
     ↓
   try
     ↓
Request successful?
   ↙       ↘
 YES       ERROR
  ↓          ↓
Data      catch(error)
  ↓          ↓
Weather    Error Message
  ↓
Screen
```

## 📌 Main Concepts Used

```text
HTML
 ↓
Structure

CSS
 ↓
Design

JavaScript
 ↓
DOM Manipulation
 ↓
Event Listener
 ↓
Fetch API
 ↓
Promise
 ↓
async / await
 ↓
try / catch
 ↓
API Data
 ↓
DOM Update
```

## 🌍 Two APIs

```text
CITY NAME
   ↓
Geocoding API
   ↓
Latitude + Longitude
   ↓
Weather API
   ↓
Temperature
Humidity
Weather Code
```

## 🧠 Important JavaScript Flow

```text
async
 ↓
Allows await

await fetch()
 ↓
Wait for API response

await response.json()
 ↓
Convert response into JSON data

try
 ↓
Code that may produce an error

catch
 ↓
Handle the error
```

## 🎯 One-Line Revision

```text
City → Geocoding API → Latitude/Longitude
     → Weather API → JSON Data
     → Extract Weather
     → DOM Update
```
*/