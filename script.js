// Update clock every second
setInterval(updateClock, 1000);
updateClock();

//set weather fetch interval to 10 minutes
setInterval(fetchDetailedWeather, 60000);
fetchDetailedWeather();

//initialize bus fetch
init();