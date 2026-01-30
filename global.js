const el = {
    clock: document.getElementById("clock"),

    weatherTemp: document.getElementById("weather-temp"),
    weatherFeels: document.getElementById("weather-feelslike"),
    weatherWind: document.getElementById("weather-wind"),
    weatherHumidity: document.getElementById("weather-humidity"),
    weatherPrecip: document.getElementById("weather-precipitation"),
    weatherDesc: document.getElementById("weather-description"),
    weatherIcon: document.getElementById("weather-icon"),
    weatherForecast: document.getElementById("weather-forecast"),

    busTitle: document.getElementById("bus-title"),
    busTable: document.getElementById("bus-table"),
    busContainer: document.getElementById("bus-container"),

    slideDots: document.querySelectorAll('.slide-dot')
};

function setHTML(el, html) {
    if (el.innerHTML !== html) {
        el.innerHTML = html;
    }
}