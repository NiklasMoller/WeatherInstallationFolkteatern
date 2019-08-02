var link = "https://opendata-download-metanalys.smhi.se/api/category/mesan1g/version/2/geotype/point/lon/11.952311/lat/57.700728/data.json";

//let weather;
function preload() {
  let url = link;
  weatherData = loadJSON(url);
}

function setup() {
  createCanvas(400, 400);
  //noLoop();

  //getting the hour to retrieve the data from
  var r = getRetrieveHour(hour());
  console.log("RETRIEVE HOUR IS " + r);

  //Only for developing
  var staticPressure = weatherData.timeSeries[r].parameters[10].values[0];
  console.log("Static pressure: " + staticPressure);

  //Getting the right pressure im Mercury
  var pressure = getPressure(r);
  console.log("Current pressure is: " + pressure);

  var mercury = hpaToMercury(pressure);
  console.log("Mercury is " + mercury);

  stateHandler(mercury);

  console.log("1035 in mercery is " + hpaToMercury(1035));


}

function draw() {

if((hour() == 01) || (hour() == 09) || (hour() == 17)){
  updatePage();
}

}

function getRetrieveHour(h){

if((h == 17)|| (h==1) || (h==9)){
return 0;
}
else if((h == 18)|| (h==2) || (h==10)){
  return 1;
}
else if((h == 19)|| (h==3) || (h==11)){
  return 2;
}
else if((h == 20)|| (h==4) || (h==12)){
  return 3;
}
else if((h == 21)|| (h==5) || (h==13)){
  return 4;
}
else if((h == 22)|| (h==6) || (h==14)){
  return 5;
}
else if((h == 23)|| (h==7) || (h==15)){
  return 6;
}
else if((h == 0)|| (h==8) || (h==16)){
  return 7;
}
}


function getPressure(retrieveHour){

  var h = retrieveHour;

  pressure = weatherData.timeSeries[h].parameters[10].values[0];

  if(pressure == 0){

  if(h<7){
    getPressure(h+1);
  }else{
    getPressure(0);
  }

}

  return pressure;
}

function hpaToMercury(hpa){
return hpa * 0.75006375541921;
}

function stateHandler(currentPressure){

if(currentPressure < 746){
  drawRegn();
}
else if (currentPressure > 774){
  drawVackert();
}else{
  drawOstadigt();
}

}


function drawRegn(){
  console.log(" -- REGN -- ");
}

function drawOstadigt(){
  console.log(" -- OSTADIGT -- ");
}

function drawVackert(){
  console.log(" -- VACKERT -- ");
}

function updatePage(){
  var currentPressure = getPressure(0);
  stateHandler(hpaToMercury(currentPressure));
  console.log("Updated Page");
}
