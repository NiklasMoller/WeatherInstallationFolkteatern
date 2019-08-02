// https://web.archive.org/web/20160418004149/http://freespace.virgin.net/hugo.elias/graphics/x_water.htm
// https://gist.github.com/ds604/228483d2498cdfdf79ef9df22676b899

  let cols, rows,
    current = [], //init array with length 0 - gives us an array named current  with length 0
    previous = [], //init array with length 0 - gives us an array named previous with length 0
    damping = 0.9;

  function mouseDragged() {
    current[mouseX][mouseY] = 255
  }

  function setup() {
    pixelDensity(1)
    createCanvas(200, 200)
    cols = width;
    rows = height;

    //Initializing the current and previous array
    for (let i = 0; i < cols; i++) {
      current[i] = []  // init a multidimensional array
      previous[i] = []
      for (let j = 0; j < rows; j++) {
        current[i][j] = 0  //Give all pixels in the multidimensional array value 0. Value 0 is BLACK?
        previous[i][j] = 0
      }
    }

    //Now. The above did
    //1. Created two multidimensional arrays
    // every position in the multidemsional array is set to 0 (I assume black);

    previous[100][100] = 255  //initialize a water ripple at pixel 100,100 with value 255
    //value 255 only has to do with size
    // Bigger number will take more iterations to move to zero


  }

  function draw() {
    background(0) //not sure if this one is needed
    loadPixels() //load all current data into the pixels array
    for (let i = 1; i < cols - 1; i++) {
      for (let j = 1; j < rows - 1; j++) {
        current[i][j] =                                           //Setting a value to the current array at position [i][j]
          (previous[i - 1][j] + previous[i + 1][j] +
            previous[i][j - 1] + previous[i][j + 1] +
            previous[i - 1][j - 1] + previous[i - 1][j + 1] +
            previous[i + 1][j - 1] + previous[i + 1][j + 1]
          ) / 4 - current[i][j];
        current[i][j] = current[i][j] * damping  //The value that we set for current[i][j] should for each iteration move towards 0
        let index = (i + j * cols) * 4;
        pixels[index + 0] = current[i][j] * 255  //R    Let the pixel at position[index]
        pixels[index + 1] = current[i][j] * 255  //G
        pixels[index + 2] = current[i][j] * 255  //B
        pixels[index + 3] = 255 //A How much you can see trough the pixel  - this turns the black into grey for example! From 0 - 255.
      }
    }
    updatePixels()
    
    //swap buffers
    let temp = previous
    previous = current
    current = temp
  }



//Vad vill jag göra?
/*
Skapa en metod som jag kan kalla på.
När man kallar på metoden ska en vattendroppe skapas

Man ska kunna specificera:
x och y koordinaten
storleken på vattendroppens radie




*/
