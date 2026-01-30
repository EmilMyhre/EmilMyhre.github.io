// CLOCK
function updateClock() {
  const now = new Date();
  
  document.getElementById("clock").textContent =
    now.toLocaleTimeString("no-NO", { 
      hour12: false,
      timeZone: "Europe/Oslo"
    });
}

setInterval(updateClock, 1000);
updateClock();

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
    document.getElementById("weather-temp").textContent = `${temp}°`;
    document.getElementById("weather-feelslike").textContent = `${feelsLike}°`;
    document.getElementById("weather-wind").textContent = `${wind} m/s`;
    document.getElementById("weather-humidity").textContent = `${humidity}%`;
    document.getElementById("weather-precipitation").textContent = `${precipitation.toFixed(1)} mm`;

    const symbolCode = current.data.next_1_hours?.summary.symbol_code || current.data.next_6_hours?.summary.symbol_code || 'partlycloudy';
    const description = getWeatherDescription(symbolCode);
    const icon = getWeatherIcon(symbolCode);
    
    document.getElementById("weather-description").textContent = description;
    document.getElementById("weather-icon").textContent = icon;

    // Update
    updateWeatherForecast(data.properties.timeseries);

  } catch (error) {
    console.error("Detailed weather error:", error);
    document.getElementById("weather-description").textContent = "Kunne ikke hente værdata";
    document.getElementById("weather-temp").textContent = "--°";
  }
}


// fjerna den fakkas BAKGRUNN SLIDESHOWet


function getWeatherIcon(symbolCode) {
  const baseSymbol = symbolCode.split('_')[0];
  
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
  return icons[baseSymbol] || '⛅';
}

function getWeatherDescription(symbolCode) {
  const baseSymbol = symbolCode.split('_')[0];
  
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
  return descriptions[baseSymbol] || 'Skyet';
}

function updateWeatherForecast(timeseries) {
  const forecastContainer = document.getElementById("weather-forecast");
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

  forecastContainer.innerHTML = forecastHTML;
}

async function fetchWeather() {
  try {
    const res = await fetch(
      "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=63.359&lon=10.393"
    );
    const data = await res.json();

    const temp = Math.round(data.properties.timeseries[0].data.instant.details.air_temperature);
    document.getElementById("weather").textContent = `${temp}°C  •  Tiller Videregående Skole`;
    
    fetchDetailedWeather();
  } catch (error) {
    console.error("Weather fetch error:", error);
    document.getElementById("weather").textContent = "Værdata utilgjengelig";
  }
}

document.addEventListener('DOMContentLoaded', function() {
  fetchDetailedWeather();
});

// Update 2
setInterval(fetchWeather, 3);

// BUS STOPS CONFIG
// Stoppesteder befinner seg i URL'en i entur kartet; https://entur.no/kart
const STOPS = [
  { id: "NSR:StopPlace:44029", name: "Tillerterminalen" },
  { id: "NSR:StopPlace:41587", name: "Tiller VGS" },
  { id: "NSR:StopPlace:44031", name: "City Syd E6" }
];

let currentStopIndex = 0;

// BUS FETCH FUNCTION - TIMEZONE FIX
async function fetchBus(stopId) {
  try {
    const res = await fetch(
      "https://api.entur.io/journey-planner/v3/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ET-Client-Name": "tiller-screen"
        },
        body: JSON.stringify({
          query: `
            {
              stopPlace(id: "${stopId}") {
                name
                estimatedCalls(timeRange: 3600, numberOfDepartures: 10) {
                  expectedDepartureTime
                  destinationDisplay { frontText }
                  serviceJourney { line { publicCode } }
                }
              }
            }
          `
        })
      }
    );

    const json = await res.json();
    
    if (!json.data || !json.data.stopPlace) {
      throw new Error("Invalid API response");
    }
    
    const calls = json.data.stopPlace.estimatedCalls;
    
    // USE TIMEZONE INSTEAD OF DEVICE
    const now = new Date();
    const trondheimTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Oslo" }));

    const rows = calls.slice(0, 6).map(call => {
      const line = call.serviceJourney.line.publicCode;
      const dest = call.destinationDisplay.frontText;

      const dep = new Date(call.expectedDepartureTime);
      
      const diffMin = Math.max(0, Math.round((dep - trondheimTime) / 60000));

      const exact = dep.toLocaleTimeString("no-NO", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Oslo"
      });

      let urgencyClass = "";
      if (diffMin <= 5) {
        urgencyClass = "soon";
      } else if (diffMin <= 15) {
        urgencyClass = "medium";
      } else {
        urgencyClass = "later";
      }

      return `
        <div class="bus-row">
          <div class="bus-exact">${exact}</div>
          <div><span class="bus-line">${line}</span></div>
          <div class="bus-dest">${dest}</div>
          <div class="bus-time ${urgencyClass}">${diffMin === 0 ? "Nå" : diffMin + " min"}</div>
        </div>
      `;
    });

    return rows.join("");

  } catch (err) {
    console.error("Bus fetch error:", err);
    return "<div style='padding:20px;'>Bus info unavailable</div>";
  }
}

async function updateSlideshow() {
  const stop = STOPS[currentStopIndex];

  document.querySelectorAll('.slide-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentStopIndex);
  });

  const container = document.getElementById("bus-container");
  container.classList.add("fade-out");

  setTimeout(async () => {
    try {
      const html = await fetchBus(stop.id);

      document.getElementById("bus-title").textContent = stop.name;
      document.getElementById("bus-table").innerHTML = html;

      container.classList.remove("fade-out");
      container.classList.add("fade-in");

      setTimeout(() => {
        container.classList.remove("fade-in");
      }, 800);
    } catch (error) {
      console.error("Slideshow error:", error);
      container.classList.remove("fade-out");
      container.classList.add("fade-in");
      setTimeout(() => {
        container.classList.remove("fade-in");
      }, 800);
    }
  }, 800);

  currentStopIndex = (currentStopIndex + 1) % STOPS.length;
}

function initDotNavigation() {
  document.querySelectorAll('.slide-dot').forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentStopIndex = index;
      updateSlideshow();
    });
  });
}

function init() {
  initDotNavigation();
  updateSlideshow();
  setInterval(updateSlideshow, 15000);
}

document.addEventListener('DOMContentLoaded', init);