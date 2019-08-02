var text2;

let img, myText;
function preload() {
  img = loadImage('barometer2.jpg');
}
function setup() {
  createCanvas(1200, 700);
  background(155); // Must be here, else overrides everything else

  textSize(50);

  image(img, 0, 0, img.width / 3, img.height / 3);



  hej(text2);
  


//setText('HELLO WORLD');

//setTimeout(hej(myText), 3000);

//setText(myText, 3000);

  
}

function hej(someText){
  text(someText, 200, 200);
}

function draw(){
//text('HELLO WORLD', 150, 350);
  //setTimeout(text.remove(),3000);


  text("HEJA NIKLAS KOM IGEN", 200, 200);
  
  setTimeout(setText, 3000);

  counter ++;
//text(text, 150, 300);
//setTimeout(text.remove(), 2000);

  //text('HELLO WORLD', 150, 350);


}

var myWords = ["First array", "Second Array"]
var counter = 0;
function setText(){
  text(myWords[counter], 150, 350);
  //setTimeout(someText.remove(), timeout);
 

}
