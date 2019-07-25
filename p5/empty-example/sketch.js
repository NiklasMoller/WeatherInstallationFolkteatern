//https://github.com/gdsports/imu-wifi
// https://github.com/gdsports/p5-js-ws281x
// https://tttapa.github.io/ESP8266/Chap14%20-%20WebSocket.html
//https://tttapa.github.io/ESP8266/Chap09%20-%20Web%20Server.html
//https://www.smhi.se/kunskapsbanken/hur-mats-lufttryck-1.23830
//


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


/*
Att göra...
- Kolla på hur man uppdaterar väderdatan!
- Skapa GIT och pusha upp både Arduinon och p5.js







*/
