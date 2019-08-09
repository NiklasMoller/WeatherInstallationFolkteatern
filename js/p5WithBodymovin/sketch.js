var sound;

var anim;
var animData;

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

sound.play();

loadAnim();
anim.play();

i = 1;
}

function draw(){

/*
if((anim.currentFrame > 120) && (i==0)){
  anim.goToAndPlay(0, true);
}
else if((anim.currentFrame > 240) && (i==1)){
  anim.goToAndPlay(140, true);
}
*/

}

function mousePressed() {
  i = 0;
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
