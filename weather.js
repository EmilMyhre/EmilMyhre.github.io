//Weather

// Weather Icons
const icons = {
    'clearsky': '☀️',
    'fair': '🌤️',
    'partlycloudy': '⛅',
    'cloudy': '☁️',
    'lightrainshowers': '🌦️',
    'rainshowers': '🌧️',
    'heavyrainshowers': '⛈️',
    'lightrain': '🌦️',
    'rain': '🌧️',
    'heavyrain': '⛈️',
    'lightsnow': '🌨️',
    'snow': '❄️',
    'heavysnow': '❄️⛄',
    'fog': '🌫️',
    'lightsleetshowers': '🌧️',
    'sleetshowers': '🌧️❄️',
    'lightsleet': '🌧️❄️',
    'sleet': '🌧️❄️'
};



// Weather Descriptions
const descriptions = {
    'clearsky': 'Klart vær',
    'fair': 'Delvis skyet',
    'partlycloudy': 'Delvis skyet',
    'cloudy': 'Skyet',
    'lightrainshowers': 'Lette regnbyger',
    'rainshowers': 'Regnbyger',
    'heavyrainshowers': 'Kraftige regnbyger',
    'lightrain': 'Lett regn',
    'rain': 'Regn',
    'heavyrain': 'Kraftig regn',
    'lightsnow': 'Lett snø',
    'snow': 'Snø',
    'heavysnow': 'Kraftig snø',
    'fog': 'Tåke',
    'lightsleetshowers': 'Lette sluddbyger',
    'sleetshowers': 'Sluddbyger',
    'lightsleet': 'Lett sludd',
    'sleet': 'Sludd'
};

function getWeatherIcon(symbolCode = '') {

  return icons[symbolCode.split('_')[0]] ?? '⛅';
}

function getWeatherDescription(symbolCode = '') {
  return descriptions[symbolCode.split('_')[0]] ?? 'Skyet';
}

// weather widget
async function fetchDetailedWeather() {
    try {
        const res = await fetch(
            "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=63.3569&lon=10.380"
        );
        const data = await res.json();

        const current = data.properties.timeseries[0];
        const details = current.data.instant.details;

        // Current weather
        const temp = Math.round(details.air_temperature);
        const feelsLike = Math.round(details.wind_chill_temperature || details.air_temperature);
        const wind = details.wind_speed.toFixed(1);
        const humidity = details.relative_humidity;
        const pressure = details.air_pressure_at_sea_level;

        // next hours
        const precipitation = current.data.next_1_hours?.details.precipitation_amount || 0;

        // Vær Widget
        el.weatherTemp.textContent = `${temp}°`;
        el.weatherFeels.textContent = `${feelsLike}°`;
        el.weatherWind.textContent = `${wind} m/s`;
        el.weatherHumidity.textContent = `${humidity}%`;
        el.weatherPrecip.textContent = `${precipitation.toFixed(1)} mm`;

        const symbolCode = current.data.next_1_hours?.summary.symbol_code || current.data.next_6_hours?.summary.symbol_code || 'partlycloudy';
        const description = getWeatherDescription(symbolCode);
        const icon = getWeatherIcon(symbolCode);

        el.weatherDesc.textContent = description;
        el.weatherIcon.textContent = icon;

        // Update
        updateWeatherForecast(data.properties.timeseries);

    } catch (error) {
        console.error("Detailed weather error:", error);
        el.weatherDesc.textContent = "Kunne ikke hente værdata";
        el.weatherTemp.textContent = "--°";
    }
}


// Weather Forecast for next hours
function updateWeatherForecast(timeseries) {
    const forecastItems = timeseries.slice(1, 4);

    const forecastHTML = forecastItems.map((hour) => {
        const time = new Date(hour.time);
        const temp = Math.round(hour.data.instant.details.air_temperature);
        const symbolCode = hour.data.next_1_hours?.summary.symbol_code || 'partlycloudy';
        const icon = getWeatherIcon(symbolCode);

        return `
      <div class="box" class="weather-detail">
        <div class="detail-label">${time.getHours()}:00</div>
        <div class="weather-icon">${icon}</div>
        <div class="detail-label">${temp}°</div>
      </div>
    `;
    }).join('');

    setHTML(el.weatherForecast, forecastHTML);
}