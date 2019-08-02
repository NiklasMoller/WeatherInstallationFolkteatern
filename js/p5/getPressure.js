let weather;
function preload() {
  // Get the most recent earthquake in the database
  let url =
   'https://api.openweathermap.org/data/2.5/weather?q=Gothenburg,swe&appid=511178ef1b4a771e21e1e5d3c42da50d';
  weatherData = loadJSON(url);
}

function setup() {
  noLoop();
}

function draw() {


  let pressure = weatherData.main.pressure;

  text(pressure, 10, 30);

}
