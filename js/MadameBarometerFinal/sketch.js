var link = "https://opendata-download-metanalys.smhi.se/api/category/mesan1g/version/2/geotype/point/lon/11.952311/lat/57.700728/data.json";

var pressure;

var sound;

var anim;
var animData;

const vackertInFrame = 0;
const vackertOutFrame = 1190;

const regnInFrame = 1160;
const regnOutFrame = 2230;

const ostadigtInFrame = 2160;
const ostadigtOutFrame = 3560;


var stateflag;
const regnFlag = 1;
const ostadigtFlag = 2;
const vackertFlag = 3;

var currentTime;

function preload(){
  sound = loadSound("testSong.mp3");

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
sound.setLoop(true);

loadAnim();
playHandler();

setCurrentTime();
//anim.play();

}

function draw(){

  if(getCurrentTime < day()+ '' + hour()  +'' + minute()){
    console.log("About to update");
    update();
  }

if((anim.currentFrame > vackertOutFrame) && (stateflag==vackertFlag)){
  playVackert();
}
else if((anim.currentFrame > regnOutFrame) && (stateflag==regnFlag)){
  playRegn();
}
else if((anim.currentFrame > ostadigtOutFrame) && (stateflag==ostadigtFlag)){
  playOstadigt();
}

var t = getCurrentTime();
console.log(t);



}

function update(){
  loadWeatherData();
  setPressure();
  setCurrentTime();
  playHandler();
}


function mousePressed() {
  fullscreen();
}

function loadAnim(){
  anim = bodymovin.loadAnimation(animData);
}

function loadWeatherData(){
  let url = link;
  weatherData = loadJSON(url);
}

function setPressure(){

var counter = 0;

do{

pressure = weatherData.timeSeries[counter].parameters[10].values[0] * 0.75006375541921; //0.75006375541921 is to convert air pressure from hpa to mercery

counter ++;

if(counter > 22){
  break;
}

}while(pressure < 1);

console.log("Pressure set to " + pressure);
console.log("counter is " + counter);

}

function getPressure(){
  return pressure;
}

function playHandler(){

  if(getPressure() < 749){
    console.log("In playHandler() about to play regn");
    stateflag = regnFlag;
    playRegn();
  }
  else if (getPressure() > 771){
    console.log("In playHandler() about to play vackert");
    stateflag = vackertFlag;
    playVackert();
  }else{
    console.log("In playHandler() about to play ostadigt");
    stateflag = ostadigtFlag;
    playOstadigt();
  }

}

function playVackert(){
    anim.goToAndStop(vackertInFrame, true);
    setTimeout(function(){ anim.goToAndPlay(vackertInFrame, true); }, 4000);    
}

function playRegn(){
  anim.goToAndStop(regnInFrame, true);
  setTimeout(function(){ anim.goToAndPlay(regnInFrame, true); }, 3000);
}

function playOstadigt(){
  anim.goToAndPlay(ostadigtInFrame, true);
}

function setCurrentTime(){
  currentTime = day()+ '' + hour()  +'' + minute() ;
}

function getCurrentTime(){
  return currentTime;
}