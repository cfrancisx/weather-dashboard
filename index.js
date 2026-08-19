const apiKey = "27997d1ec9b774e3c98c3dbe0133bdf4"
const result = document.getElementById("result")
const weatherForm = document.getElementById("weather-form")
const cityInput = document.getElementById("city-input")
const weatherEffects = document.getElementById("weather-effects")

const weatherClassMap = {
    Rain: "weather-rain",
    Drizzle: "weather-rain",
    Thunderstorm: "weather-thunderstorm",
    Snow: "weather-snow",
    Clear: "weather-clear",
    Clouds: "weather-clouds"
}

function triggerResultAnimation() {
    result.classList.remove("animate-in");
    void result.offsetWidth;
    result.classList.add("animate-in");
}

weatherForm.addEventListener("submit", function(e) {
    e.preventDefault()
    const city = cityInput.value;
    getWeather(city);
})

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    result.innerHTML = "Loading ...."
    triggerResultAnimation();
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod === "404") {
            result.innerHTML = `City Not Found`
            triggerResultAnimation();
            return;
        }
        console.log(data)
        updateWeatherEffect(data.weather[0].main)
        result.innerHTML = `${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`
        triggerResultAnimation();
    } catch (error) {
        console.log(error)
    }
}

function updateWeatherEffect(condition) {
    weatherEffects.className = "";
    void weatherEffects.offsetWidth;
    const effectClass = weatherClassMap[condition]
    if (effectClass) {
        weatherEffects.classList.add(effectClass)
    }
}