const apiKey = "27997d1ec9b774e3c98c3dbe0133bdf4"
const result = document.getElementById("result")
const weatherForm = document.getElementById("weather-form")
const cityInput = document.getElementById("city-input")
const weatherEffects = document.getElementById("weather-effects")
const unsplashKey = "4TO6wZrhOklH3vnvojkPUvaQxvTkoTo9Rbq0CFxuDjU"
const cityDescription = document.getElementById("city-description")
const suggestionsList = document.getElementById("suggestions-list")
const readMoreBtn = document.getElementById("read-more-btn")
let debounceTimer;
let latestRequestId = 0;

readMoreBtn.addEventListener("click", function() {
    cityDescription.classList.toggle("expanded")
    if (cityDescription.classList.contains("expanded")) {
        readMoreBtn.textContent = "Show less"
    } else {
        readMoreBtn.textContent = "Read more"
    }
})

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
    const requestId = ++latestRequestId;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    result.innerHTML = "Loading ...."
    triggerResultAnimation();
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (requestId !== latestRequestId) return;
        
        if (data.cod === "404") {
            result.innerHTML = `City Not Found`
            triggerResultAnimation();
            return;
        }
        console.log(data)
        updateWeatherEffect(data.weather[0].main)
        getCityDescription(city)
        getCityPhoto(city)
        result.innerHTML = `${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`
        triggerResultAnimation();
    } catch (error) {
        console.log(error)
    }
}

async function getWeatherByCoords(lat, lon, displayName) {
    const requestId = ++latestRequestId;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    result.innerHTML = `Loading ....`
    triggerResultAnimation();
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (requestId !== latestRequestId) 
            return;

        updateWeatherEffect(data.weather[0].main)
        getCityDescription(displayName)
        getCityPhoto(displayName)
        result.innerHTML = `${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`
        triggerResultAnimation();
    } catch (error) {
    console.log(error)
    }
}

async function getCityDescription(city) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${city}`
    try {
        const response = await fetch(url);
        const data = await response.json();
        cityDescription.innerHTML = `${data.extract}`
        cityDescription.innerHTML = `${data.extract}`
        cityDescription.classList.remove("expanded")
        readMoreBtn.textContent = "Read more"
        readMoreBtn.style.display = "inline-block"
    } catch (error) {
        console.log(error)
    }
}

cityInput.addEventListener("input", function() {
    clearTimeout(debounceTimer)

    const query = cityInput.value

    if (query === "") {
        suggestionsList.innerHTML =""
        return;
    }

    debounceTimer = setTimeout(function() {
        getSuggestions(query)
    }, 300)
})

async function getSuggestions(query) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
    try {
        const response = await fetch(url);
        const data = await response.json();

        suggestionsList.innerHTML = ""

        data.forEach(function (entry) {
            const li = document.createElement("li")
            li.textContent = `${entry.name}, ${entry.country}`

            li.addEventListener("click", function() {
                cityInput.value = entry.name
                suggestionsList.innerHTML = ""
                getWeatherByCoords(entry.lat, entry.lon, entry.name)
            })
            suggestionsList.appendChild(li)
        })
    } catch (error) {
        console.log(error)
    }
}

async function getCityPhoto(city) {
    const url =`https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashKey}`
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results.length === 0) {
            return;
        }
            const photoUrl = data.results[0].urls.regular;
            document.body.style.backgroundImage = `url("${photoUrl}")`;
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