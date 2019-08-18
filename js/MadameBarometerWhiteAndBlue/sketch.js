var link = "https://opendata-download-metanalys.smhi.se/api/category/mesan1g/version/2/geotype/point/lon/11.952311/lat/57.700728/data.json";

var pressure, sound, anim, animData, stateflag, loopCounter, weatherData, counter, blueToggle, vackertToggle, regnToggle, ostadigtToggle;

const vackertInFrame = 30;
const vackertOutFrame = 1150;

const vackertBlueInFrame = 3700;
const vackertBlueOutFrame = 7360;

const regnInFrame = 1180;
const regnOutFrame = 2140;

const regnBlueInFrame = 7640;
const regnBlueOutFrame = 10770;

const ostadigtInFrame = 2195;
const ostadigtOutFrame = 3425;

const ostadigtBlueInFrame = 11900;
const ostadigtBlueOutFrame = 15950;

const endFrame = 16000;

const regnFlag = 1;
const ostadigtFlag = 2;
const vackertFlag = 3;

const numberOfLoopIterations = 5;

const toMercury = 0.75006375541921;

function preload() {
  sound = loadSound("song.mp3");

  animData = {
    container: document.getElementById('bm'),
    renderer: 'svg',
    loop: true,
    autoplay: false,
    path: '18aug.json'
  };

  loadWeatherData();
}


function setup() {

  setPressure();
  setStateflag();
  sound.play();
  sound.setVolume(0.5);
  sound.setLoop(true);

  loadAnim();
  anim.play();

  blueToggle = false;
  vackertToggle = false;
  regnToggle = false;
  ostadigtToggle = false;

}




function draw() {


  if (stateflag == vackertFlag) {

   
    if (blueToggle === false) {
      setBlueToggleTrue();
      console.log("1. Playing blue according to stateflag Vackert");
      playBlueVackert();
    }


    if (anim.currentFrame > vackertBlueOutFrame) {

      console.log("AFTER PLAYING Vackert IN BLUE: PLAYING Regn");
      playRegn();
      setRegnToggleTrue();
    }


    if ((anim.currentFrame > regnOutFrame) && (anim.currentFrame < ostadigtInFrame) && (ostadigtToggle === false)) {
      console.log("Playing regn after playing vackert");
      playOstadigt();
      setOstadigtToggleTrue();
    }

    if ((anim.currentFrame > ostadigtOutFrame) && (ostadigtToggle === true)) {
      setAllTogglesFalse();
      update();
      console.log("Setting all toggles to false");
    }


  }
  else if (stateflag == regnFlag) {


    if (blueToggle === false) {
      setBlueToggleTrue();
      console.log("1. Playing BLUE with stateflag REGN");
      playBlueRegn();
    }


    if (anim.currentFrame > regnBlueOutFrame) {

      console.log("After playing Regn in blue: Playing Vackert");
      playVackert();
      setVackertToggleTrue();
    }


    if ((anim.currentFrame > vackertOutFrame) && (anim.currentFrame < regnInFrame) && (ostadigtToggle === false)) {
      console.log("Playing ostadigt after playing Vackert");
      playOstadigt();
      setOstadigtToggleTrue();
    }

    if ((anim.currentFrame > ostadigtOutFrame) && (ostadigtToggle === true)) {
      setAllTogglesFalse();
      update();
      console.log("Setting all toggles to false");
    }


  }
  else if (stateflag == ostadigtFlag) {

    if (blueToggle === false) {
      setBlueToggleTrue();
      console.log("1. Playing blue according to stateflag OSTADIGT");
      playBlueOstadigt();
    }
    
    if (anim.currentFrame > ostadigtBlueOutFrame) {

      console.log("AFTER PLAYING OSTADIGT IN BLUE: PLAYING Vackert");
      playVackert();
      setVackertToggleTrue();
    }
    
    if ((anim.currentFrame > vackertOutFrame) && (anim.currentFrame < regnInFrame) && (regnToggle === false)) {
      console.log("Playing regn after playing vackert");
      playRegn();
      setRegnToggleTrue();
    }
    
    if ((anim.currentFrame > regnOutFrame) && (regnToggle === true)) {
      setAllTogglesFalse();
      update();
      console.log("Setting all toggles to false");
    }

  }
   

  if(anim.currentFrame > endFrame){
    setAllTogglesFalse();
  }


}


function setBlueToggleTrue() {
  blueToggle = true;
}

function setBlueToggleFalse() {
  blueToggle = false;
}

function setVackertToggleTrue() {
  vackertToggle = true;
}

function setVackertToggleFalse() {
  vackertToggle = false;
}

function setRegnToggleTrue() {
  regnToggle = true;
}

function setRegnToggleFalse() {
  regnToggle = false;
}

function setOstadigtToggleTrue() {
  ostadigtToggle = true;
}

function setOstadigtToggleFalse() {
  ostadigtToggle = false;
}

function setAllTogglesFalse() {
  setBlueToggleFalse();
  setOstadigtToggleFalse();
  setRegnToggleFalse();
  setVackertToggleFalse();
}



function mousePressed() {
  console.log("Setting fullscreen");
  let fs = fullscreen();
  fullscreen(!fs);
}

function update() {
  loadWeatherData();
  setTimeout(function () { setPressure(); }, 4000); //Delay to let JSON data load
  setTimeout(function () { setStateflag(); }, 5000);
}


function loadAnim() {
  anim = bodymovin.loadAnimation(animData);
}

function loadWeatherData() {
  let url = link;
  weatherData = loadJSON(url);
}

function setPressure() {

  counter = 0;
  pressure = 0;

  do {

    pressure = weatherData.timeSeries[counter].parameters[10].values[0] * toMercury; // Convert air pressure from hpa to mercery

    counter++;

    if (counter > 22) {
      break;
    }

  } while (pressure < 500);

  console.log("Pressure set to " + pressure);
  console.log("Weather Data is from " + counter + " hour ago");

}

function getPressure() {
  return pressure;
}

function setStateflag() {
  if (getPressure() < 749) {
    stateflag = regnFlag;
  }
  else if (getPressure() > 771) {
    stateflag = vackertFlag;
  } else {
    stateflag = ostadigtFlag;
  }
}

function playVackert() {
  console.log("Playing vackert");
  anim.goToAndStop(vackertInFrame, true);
  setTimeout(function(){ anim.goToAndPlay(vackertInFrame, true); }, 3000);    
}

function playBlueVackert() {
  console.log("Playing vackert in blue");
  anim.goToAndStop(vackertBlueInFrame, true);
  setTimeout(function(){ anim.goToAndPlay(vackertBlueInFrame, true); }, 3000);    
}

function playRegn() {
  console.log("Playing regn");
  anim.goToAndStop(regnInFrame, true);
  setTimeout(function(){ anim.goToAndPlay(regnInFrame, true); }, 3000);
}

function playBlueRegn() {
  console.log("Playing regn in blue");
  anim.goToAndStop(regnBlueInFrame, true);
  setTimeout(function(){ anim.goToAndPlay(regnBlueInFrame, true); }, 3000);
}

function playOstadigt() {
  console.log("Playing ostadigt");
  anim.goToAndStop(ostadigtInFrame, true);
  setTimeout(function(){ anim.goToAndPlay(ostadigtInFrame, true); }, 3000);
}

function playBlueOstadigt() {
  console.log("Playing ostadigt in blue");
  anim.goToAndStop(ostadigtBlueInFrame, true);
  setTimeout(function(){ anim.goToAndPlay(ostadigtBlueInFrame, true); }, 3000);
}
