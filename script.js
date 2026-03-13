
// Update clock every second
UpdateClock();
setInterval(UpdateClock, 1000);

//Update background
setInterval(UpdateBackground, 12300);

//set weather fetch interval to 1 minute
setInterval(fetchDetailedWeather, 60000);
fetchDetailedWeather();

//initialize bus fetch
init();