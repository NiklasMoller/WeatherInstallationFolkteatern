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

var i;

function preload(){
  sound = loadSound("testSong.mp3");

  animData = {
    container: document.getElementById('bm'),
    renderer: 'svg',
    loop: true,
    autoplay: false,
    path: 'laterFinal5aug.json'
    };
}


function setup() {

//background(200);

sound.play();
sound.setVolume(0.5);
sound.setLoop(true);

loadAnim();
anim.play();

i = 2;

if(i==vackertFlag){
  anim.goToAndPlay(vackertInFrame, true);
}
else if(i==regnFlag){
  anim.goToAndPlay(regnInFrame, true);
}
else if(i==ostadigtFlag){
  anim.goToAndPlay(ostadigtInFrame, true);
}

}

function draw(){

/*
if((anim.currentFrame > vackertOutFrame) && (i==0)){
  anim.goToAndPlay(vackertInFrame, true);
}
else if((anim.currentFrame > regnOutFrame) && (i==1)){
  anim.goToAndPlay(regnInFrame, true);
}
else if((anim.currentFrame > ostadigtOutFrame) && (i==2)){
  anim.goToAndPlay(ostadigtInFrame, true);
}
*/

}


function mousePressed() {
    console.log("MOUSE PRESSED");
    let fs = fullscreen();
    fullscreen(!fs);
  
}


function loadAnim(){
  anim = bodymovin.loadAnimation(animData);
}

//Logic for handling different states
function setFlag(flag){
  stateflag = flag;
}

function getFlag(){
  return flag;
}

function regn(){
  if (flag == 1){
    return true;
  }else return false;
}

function ostadigt(){
  if (flag == 2){
    return true;
  }else return false;
}

function vackert(){
  if (flag == 3){
    return true;
  }else return false;
}
