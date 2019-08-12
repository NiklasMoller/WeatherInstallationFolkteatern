//https://arduinojson.org/
// https://github.com/esp8266/Arduino/blob/master/doc/libraries.rst

#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <Servo.h>

#include "Secrets.h"

Servo servo;

char ssid[] = mySSID;        
char pass[] = myPASSWORD;   

WiFiClient client;

// Open Weather Map API server name
const char server[] = "api.openweathermap.org";

String nameOfCity = "Gothenburg,SWE"; 

String apiKey = myApiKey;

String text;

float pressure;

int jsonend = 0;
boolean startJson = false;
int status = WL_IDLE_STATUS;

#define JSON_BUFF_DIMENSION 2500

unsigned long lastConnectionTime = 0.5 * 60 * 1000;     // last time you connected to the server, in milliseconds
const unsigned long postInterval = 0.5 * 60 * 1000;  // posting interval of 10 minutes  (10L * 1000L; 10 seconds delay for testing)

//Sleep time in seconds
const int sleepTimeS = 30;

void setup() {

  Serial.begin(9600);
 
  text.reserve(JSON_BUFF_DIMENSION);
  
  WiFi.begin(ssid,pass);
  Serial.println("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi Connected");
  printWiFiStatus();

  pressure = 0;

  servo.attach(2); // attaches the servo on GPIO2 to the servo object
  delay(200);
}

void loop() { 
  

/*
  if (millis() - lastConnectionTime > postInterval) {
    // note the time that the connection was made:
    Serial.println("WENT INTO IF STATEMENT");
    lastConnectionTime = millis();
    makehttpRequest();
  }
*/


/*
    Serial.print("PREASSURE IS: ");
    Serial.println(getPressure());

    do{
      makehttpRequest();
    }while(getPressure() == 0);
    
    Serial.print("PREASSURE IS: ");
    Serial.println(getPressure());

*/



    servo.write(180);
    Serial.println("Wrote to 180");
    delay(3000);
    servo.write(0);
    Serial.println("Wrote to 0");
    delay(3000);

    servo.write(90);
    Serial.println("Wrote to 90");
    delay(3000);

    //Serial.println("I'm awake but now I will sleep. GOODNIGHT!");
    ESP.deepSleep(10e6, WAKE_RF_DEFAULT);
    delay(2000);
    
}

// print Wifi status
void printWiFiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}

// to request data from OWM
void makehttpRequest() {
  // close any connection before send a new request to allow client make connection to server
  client.stop();

  // if there's a successful connection:
  if (client.connect(server, 80)) {
     Serial.println("connecting TO SERVER...");
    // send the HTTP PUT request:
    client.println("GET /data/2.5/forecast?q=" + nameOfCity + "&APPID=" + apiKey + "&mode=json&units=metric&cnt=2 HTTP/1.1");
    client.println("Host: api.openweathermap.org");
    client.println("User-Agent: ArduinoWiFi/1.1");
    client.println("Connection: close");
    client.println();
    
    unsigned long timeout = millis();
    while (client.available() == 0) {
      if (millis() - timeout > 5000) {
        Serial.println(">>> Client Timeout !");
        client.stop();
        return;
      }
    }
    
    char c = 0;
    jsonend = 0;
    
    while (client.available()) {
      c = client.read();
      
      // since json contains equal number of open and close curly brackets, this means we can determine when a json is completely received  by counting
      // the open and close occurences,
      //Serial.println("READING THE JSON DATA");
      Serial.print(c);
      if (c == '{') {
        startJson = true;         // set startJson true to indicate json message has started
        jsonend++;
      }
      if (c == '}') {
        jsonend--;
      }
      if (startJson == true) {
        text += c;
        
      }
      // if jsonend = 0 then we have have received equal number of curly braces 
      if (jsonend == 0 && startJson == true) {
        Serial.println("ABOUT TO PARSE JSON");
        Serial.println("PRINTING THE TEXT " + text);
        parseJson(text.c_str());  // parse c string text in parseJson function
        text = "";                // clear text string for the next time
        startJson = false;        // set startJson to false to indicate that a new message has not yet started
      }
    }
  }
  else {
    // if no connction was made:
    Serial.println("connection failed");
    return;
  }
}

//to parse json data recieved from OWM
void parseJson(const char * jsonString) {

  Serial.println("PARSING THE JSON DATA");
  
  const size_t bufferSize =  2*JSON_ARRAY_SIZE(1) + JSON_ARRAY_SIZE(2) + 4*JSON_OBJECT_SIZE(1) + 3*JSON_OBJECT_SIZE(2) + 2*JSON_OBJECT_SIZE(4) + JSON_OBJECT_SIZE(5) + JSON_OBJECT_SIZE(6) + 2*JSON_OBJECT_SIZE(7) + 2*JSON_OBJECT_SIZE(8) + 540;
  
  //DynamicJsonBuffer jsonBuffer(bufferSize);
  DynamicJsonDocument doc(bufferSize);

  deserializeJson(doc, jsonString);

const char* cod = doc["cod"]; 
float message = doc["message"]; 
int cnt = doc["cnt"]; 

JsonObject list_0 = doc["list"][0];
long list_0_dt = list_0["dt"]; 

JsonObject list_0_main = list_0["main"];
float list_0_main_temp = list_0_main["temp"]; 
float list_0_main_temp_min = list_0_main["temp_min"]; 
float list_0_main_temp_max = list_0_main["temp_max"]; 
float list_0_main_pressure = list_0_main["pressure"]; // for example 1018.67
float list_0_main_sea_level = list_0_main["sea_level"]; 
float list_0_main_grnd_level = list_0_main["grnd_level"]; 
int list_0_main_humidity = list_0_main["humidity"]; 
float list_0_main_temp_kf = list_0_main["temp_kf"]; 

Serial.print("PRESSURE FROM PARSED JSON IS: ");
Serial.println(list_0_main_pressure);

setPressure(list_0_main_pressure);

}

void setPressure(float parsedPressure){

if(!parsedPressure == pressure){
  pressure = parsedPressure;
}
  
}

float getPressure(){
  return pressure;
}
