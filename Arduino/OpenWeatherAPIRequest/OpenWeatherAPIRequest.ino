#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <Servo.h>

#include "Secrets.h"

#define RTCMEMORYPOS 64
#define JSON_BUFF_DIMENSION 2500

extern "C" {
#include "user_interface.h" // this is for the RTC memory read/write functions
}

typedef struct {
  int previousPosition;
} rtcStore;

rtcStore rtcMem;

int buckets;

Servo servo;

char ssid[] = mySSIDNM;
char pass[] = myPASSWORDNM;

WiFiClient client;

// Open Weather Map API server name
const char server[] = "api.openweathermap.org";

const float toMercury = 0.75006375541921;

String nameOfCity = "Gothenburg,SWE";

String apiKey = myApiKey;

String text;

float pressure;

const float defaultPosition = 90;

int jsonend = 0;
boolean startJson = false;
int status = WL_IDLE_STATUS;

//unsigned long lastConnectionTime = 0.5 * 60 * 1000;     // last time you connected to the server, in milliseconds
//const unsigned long postInterval = 0.5 * 60 * 1000;  // posting interval of 10 minutes  (10L * 1000L; 10 seconds delay for testing)

//Sleep time in seconds
const int sleepTimeS = 30;

void setup() {

  Serial.begin(9600);

  int servoPos;

  buckets = (sizeof(rtcMem) / 4);
  if (buckets == 0) buckets = 1;

  system_rtc_mem_read(RTCMEMORYPOS, &rtcMem, sizeof(rtcMem));
  //servoPos = rtcMem.previousPosition;

  Serial.print("READING FROM RTC MEMORY. POSITION IS: ");

  Serial.println();

  servo.attach(2); // attaches the servo on GPIO2 to the servo object
  delay(2000);


  if ((!servoPos == NULL) && (servoPos < 180)) {
    Serial.println();
    Serial.print("Writing servo to ");
    Serial.print(servoPos);
    Serial.print(" from RTC MEMORY position.");
    servo.write(servoPos);
    Serial.println();
  }
  else {
    Serial.println();
    Serial.println("Writing servo to default position 90");
    Serial.println();
    servo.write(defaultPosition);
  }

  text.reserve(JSON_BUFF_DIMENSION);

  WiFi.begin(ssid, pass);
  Serial.println("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi Connected");
  printWiFiStatus();

  pressure = 0;

  makehttpRequest(); //Doing first query from Open Weather Map
  delay(3000);
  
  if (getPressureMercury() == 0) {
    Serial.println("Doing second query from Open Weather Map");
    makehttpRequest(); //Doing second query from Open Weather Map if the first one wasn't sucessful
    delay(3000);
  }
 
  Serial.print("PRESSURE IN MERCURY IS ");
  Serial.println(getPressureMercury());
  delay(500);

  if (getPressureMercury() > 730) {
    rtcMem.previousPosition = getServoPosition();
    servoPos = getServoPosition();
    servo.write(servoPos);
    system_rtc_mem_write(RTCMEMORYPOS, &rtcMem, 4); //Storing variable in RTC memory
    Serial.println();
    Serial.print("Query from OPEN WEATHERMAP sucessful. New servoposition is ");
    Serial.println(servoPos);
    Serial.println();

  }

  Serial.println("ABOUT TO SLEEP");
  delay(100);
  ESP.deepSleep(1800e6, WAKE_RF_DEFAULT); //Sleeps for 30 min
  
}

void loop() {


  /*
    if (millis() - lastConnectionTime > postInterval) {
      // note the time that the connection was made:
      lastConnectionTime = millis();
      makehttpRequest();
    }
  */


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
        Serial.println("ABOUT TO PARSE JSON DATA");
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

  Serial.println("PARSING THROUGH THE JSON DATA");

  const size_t bufferSize =  2 * JSON_ARRAY_SIZE(1) + JSON_ARRAY_SIZE(2) + 4 * JSON_OBJECT_SIZE(1) + 3 * JSON_OBJECT_SIZE(2) + 2 * JSON_OBJECT_SIZE(4) + JSON_OBJECT_SIZE(5) + JSON_OBJECT_SIZE(6) + 2 * JSON_OBJECT_SIZE(7) + 2 * JSON_OBJECT_SIZE(8) + 540;

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

void setPressure(float parsedPressure) {

  if (!parsedPressure == pressure) {
    pressure = parsedPressure;
  }

}

float getPressure() {
  return pressure;
}

float getPressureMercury() {
  return getPressure() * toMercury;
}

int getServoPosition() {

  /*The servo positions a pointer at a given number on a board. The numbers don't have a
    symetric positioning in relationship to each other which made it impossible to write an algorithm
    to position the servo. This explaines the many if statements below*/

  float m = getPressureMercury();

  if (m < 730) {
    return 180;
  }
  else if (m < 731.5 ) {
    return 175;
  } else if (m < 733) {
    return 170;
  } else if (m < 735) {
    return 165;
  } else if (m < 736.5) {
    return 160;
  } else if (m < 738) {
    return 155;
  } else if (m < 740) {
    return 150;
  } else if (m < 741) {
    return 145;
  } else if (m < 743) {
    return 140;
  } else if (m < 745) {
    return 135;
  } else if (m < 747) {
    return 130;
  } else if (m < 749) {
    return 125;
  } else if (m < 750) {
    return 120;
  } else if (m < 752) {
    return 115;
  } else if (m < 754) {
    return 110;
  } else if (m < 756) {
    return 105;
  } else if (m < 757) {
    return 100;
  } else if (m < 760) {
    return 95;
  } else if (m < 762) {
    return 90;
  } else if (m < 764) {
    return 85;
  } else if (m < 765.5) {
    return 80;
  } else if (m < 768) {
    return 75;
  } else if (m < 770) {
    return 70;
  } else if (m < 772) {
    return 65;
  } else if (m < 773) {
    return 60;
  } else if (m < 776) {
    return 55;
  } else if (m < 778) {
    return 50;
  } else if (m < 780) {
    return 45;
  } else if (m < 781) {
    return 40;
  } else if (m < 783) {
    return 35;
  } else if (m < 784) {
    return 30;
  } else if (m < 786) {
    return 25;
  } else if (m < 788) {
    return 20;
  } else if (m < 789) {
    return 15;
  } else if (m < 790) {
    return 10;
  } else {
    return 90;
  }


}
