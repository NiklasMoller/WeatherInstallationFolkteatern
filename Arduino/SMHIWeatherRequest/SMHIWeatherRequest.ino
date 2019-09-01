//https://arduinojson.org/

#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>

#include "Secrets.h"

char ssid[] = mySSID;        
char pass[] = myPASSWORD;   

WiFiClient client;

String text;

float pressure;

int jsonend = 0;
boolean startJson = false;
int status = WL_IDLE_STATUS;

#define JSON_BUFF_DIMENSION 2500

unsigned long lastConnectionTime = 0.5 * 60 * 1000;     // last time you connected to the server, in milliseconds
const unsigned long postInterval = 0.5 * 60 * 1000;  // posting interval of 10 minutes  (10L * 1000L; 10 seconds delay for testing)

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
}

void loop() { 
  
  //OWM requires 10mins between request intervals
  //check if 10mins has passed then conect again and pull
  if (millis() - lastConnectionTime > postInterval) {
    // note the time that the connection was made:
    lastConnectionTime = millis();
    makehttpRequest();
  }
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

  //client.setTimeout(10000);
  if (!client.connect("opendata-download-metanalys.smhi.se", 80)) {
    Serial.println(F("Connection failed"));
    return;
  }
  Serial.println(F("Connected to server!"));



    // Send HTTP request
  client.println(F("GET /api/category/mesan1g/version/2/approvedtime.json"));
  //client.println(F("Host: opendata-download-metanalys.smhi.se"));
  //client.println(F("Connection: close"));
  if (client.println() == 0) {
    Serial.println(F("Failed to send request"));
    return;
  }else{
    Serial.println("Success sending SMHI request");
  }

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

    //-------------//

  
/*

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
  */
}

//to parse json data recieved from OWM
void parseJson(const char * jsonString) {

  Serial.println("PARSING THE JSON DATA");
  
  const size_t bufferSize =  584*JSON_ARRAY_SIZE(1) + JSON_ARRAY_SIZE(2) + 16*JSON_ARRAY_SIZE(23) + JSON_ARRAY_SIZE(24) + 6*JSON_ARRAY_SIZE(26) + JSON_ARRAY_SIZE(29) + JSON_ARRAY_SIZE(30) + 25*JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(4) + 583*JSON_OBJECT_SIZE(5) + 31170;
  
  //DynamicJsonBuffer jsonBuffer(bufferSize);
  DynamicJsonDocument doc(bufferSize);

  deserializeJson(doc, jsonString);

/*
const char* cod = doc["cod"]; 
float message = doc["message"]; 
int cnt = doc["cnt"]; 
*/

const char* approvedTime = doc["approvedTime"]; // "2019-07-26T11:39:24Z"
const char* referenceTime = doc["referenceTime"]; // "2019-07-26T11:00:00Z"





Serial.print("APPROVED TIME FROM SMHI IS: ");
Serial.println(approvedTime);

//setPressure(list_0_main_pressure);

}

void setPressure(float parsedPressure){

if(!parsedPressure == pressure){
  pressure = parsedPressure;
}
  
}

float getPressure(){
  return pressure;
}
