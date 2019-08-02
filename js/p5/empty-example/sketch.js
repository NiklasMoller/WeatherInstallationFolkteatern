//https://github.com/gdsports/imu-wifi
// https://github.com/gdsports/p5-js-ws281x
// https://tttapa.github.io/ESP8266/Chap14%20-%20WebSocket.html
//https://tttapa.github.io/ESP8266/Chap09%20-%20Web%20Server.html
//https://www.smhi.se/kunskapsbanken/hur-mats-lufttryck-1.23830

//https://p5js.org/examples/math-sine-wave.html
// https://p5js.org/examples/math-noise-wave.html?source=post_page---------------------------
// https://www.openprocessing.org/sketch/612834/
// https://www.openprocessing.org/sketch/182402
// https://www.openprocessing.org/sketch/202174
//https://gamedevelopment.tutsplus.com/tutorials/make-a-splash-with-dynamic-2d-water-effects--gamedev-236

var sound;

function preload(){
  sound = loadSound("message1.mp3");
}


function setup() {
  createCanvas(600,600);

  textFont("Arial");
textSize(22);

}

function draw(){
  background(200);
    text("Regn", 200, 200);

}

function mousePressed() {
/*  if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
  */

sound.play();

}
