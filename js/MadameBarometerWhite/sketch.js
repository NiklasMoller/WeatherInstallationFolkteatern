var link = "https://opendata-download-metanalys.smhi.se/api/category/mesan1g/version/2/geotype/point/lon/11.952311/lat/57.700728/data.json";

var pressure, sound, anim, animData, stateflag, loopCounter, weatherData, counter;

const vackertInFrame = 0;
const vackertOutFrame = 1190;

const regnInFrame = 1160;
const regnOutFrame = 2230;

const ostadigtInFrame = 2160;
const ostadigtOutFrame = 3400;

const endFrame = 3500;

const regnFlag = 1;
const ostadigtFlag = 2;
const vackertFlag = 3;

const numberOfLoopIterations = 5;

const toMercury = 0.75006375541921;

function preload(){
  sound = loadSound("song.mp3");

  animData = {
    container: document.getElementById('bm'),
    renderer: 'svg',
    loop: true,
    autoplay: false,
    path: 'laterFinal5aug.json'
    };

    loadWeatherData();
}


function setup() {

setPressure();

sound.play();
sound.setVolume(0.5);
sound.setLoop(true);

loadAnim();
playHandler();

loopCounter = 0;

}

function draw(){

if((anim.currentFrame > vackertOutFrame) && (stateflag==vackertFlag)){
  playVackert();
  loopCounter++;
  checkForUpdate(loopCounter);
}
else if((anim.currentFrame > regnOutFrame) && (stateflag==regnFlag)){
  playRegn();
  loopCounter++;
  checkForUpdate(loopCounter);
}
else if((anim.currentFrame > ostadigtOutFrame) && (stateflag==ostadigtFlag)){
  playOstadigt();
  loopCounter++;
  checkForUpdate(loopCounter);
}else if(anim.currentFrame > endFrame){
  console.log("Current frame greater than endframe. Went to playhandler()");
  playHandler();
}

}

function mousePressed() {
  console.log("Setting fullscreen");
  let fs = fullscreen();
  fullscreen(!fs);
}

function checkForUpdate(lc){
  if(lc > numberOfLoopIterations){
    console.log("About to update");
    update();
    loopCounter = 0;
}
}

function update(){
  loadWeatherData();
  setTimeout(function(){ setPressure(); }, 4000); //Delay to let JSON data load
  setTimeout(function(){ setStateflag(); }, 5000);
}

/*
function mousePressed() {
  fullscreen();
}
*/

function loadAnim(){
  anim = bodymovin.loadAnimation(animData);
}

function loadWeatherData(){
  let url = link;
  weatherData = loadJSON(url);
}

function setPressure(){

counter = 0;

do{

pressure = weatherData.timeSeries[counter].parameters[10].values[0] * toMercury; // Convert air pressure from hpa to mercery

counter++;

if(counter > 22){
  break;
}

}while(pressure < 1);

console.log("Pressure set to " + pressure);
console.log("Weather Data is from " + counter + " hour ago");

}

function getPressure(){
  return pressure;
}

function setStateflag(){
  if(getPressure() < 749){
    stateflag = regnFlag;
  }
  else if (getPressure() > 771){
    stateflag = vackertFlag;
  }else{
    stateflag = ostadigtFlag;
  }
}

function playHandler(){

  setStateflag();

  if(stateflag == regnFlag){
    console.log("In playHandler() about to play regn");
    playRegn();
  }
  else if (stateflag == vackertFlag){
    console.log("In playHandler() about to play vackert");
    playVackert();
  }else if (stateflag == ostadigtFlag){
    console.log("In playHandler() about to play ostadigt");
    playOstadigt();
  }

}

function playVackert(){
    console.log("Playing vackert");
    anim.goToAndStop(vackertInFrame, true);
    setTimeout(function(){ anim.goToAndPlay(vackertInFrame, true); }, 4000);    
}

function playRegn(){
  console.log("Playing regn");
  anim.goToAndStop(regnInFrame, true);
  setTimeout(function(){ anim.goToAndPlay(regnInFrame, true); }, 3000);
}

function playOstadigt(){
  console.log("Playing ostadigt");
  anim.goToAndPlay(ostadigtInFrame, true);
}

