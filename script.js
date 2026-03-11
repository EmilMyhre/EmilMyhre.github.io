
// Update clock every second
setInterval(UpdateClock, 10000);

//Update background
setInterval(UpdateBackground, 12300);

//set weather fetch interval to 10 minutes
setInterval(fetchDetailedWeather, 60000);
fetchDetailedWeather();

//initialize bus fetch
init();