#include "DHTesp.h"
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#ifdef ESP32
#pragma message(THIS EXAMPLE IS FOR ESP8266 ONLY!)
#error Select ESP8266 board.
#endif


const char* ssid     = "";
const char* password = "";

int wifiStatus;
DHTesp dht;

void setup()
{
  Serial.begin(115200);
  Serial.println();
  Serial.println("Status\tHumidity (%)\tTemperature (C)\t(F)\tHeatIndex (C)\t(F)");
  String thisBoard= ARDUINO_BOARD;
  Serial.println(thisBoard);

  // Autodetect is not working reliable, don't use the following line
  // dht.setup(17);
  // use this instead:
  dht.setup(16, DHTesp::DHT22); // Connect DHT sensor to GPIO 17
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
}

void loop()
{
  delay(dht.getMinimumSamplingPeriod());

  float humidity = dht.getHumidity();
  float temperature = dht.getTemperature();

  Serial.print(dht.getStatusString());
  Serial.print("\t");
  Serial.print(humidity, 1);
  Serial.print("\t\t");
  Serial.print(temperature, 1);
  Serial.print("\t\t");
  Serial.print(dht.toFahrenheit(temperature), 1);
  Serial.print("\t\t");
  Serial.print(dht.computeHeatIndex(temperature, humidity, false), 1);
  Serial.print("\t\t");
  Serial.println(dht.computeHeatIndex(dht.toFahrenheit(temperature), humidity, true), 1);
  char result[20];
  dtostrf(dht.toFahrenheit(temperature), 6,2,result);
  char humidityChar[20];
  dtostrf(humidity, 6,2,humidityChar);
  String humidityStr = "\", \"humidity\":\"";
  String beginStr = "{\"temp\": \"";
  String endStr = "\"}";
  String request = beginStr += result;
  request.concat(humidityStr);
  request.concat(humidity);
  request.concat(endStr);
  Serial.println(request);
  if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status

    HTTPClient http;    //Declare object of class HTTPClient

    http.begin("http://:3000/api/update");      //Specify request destination
    http.addHeader("Content-Type", "application/json");  //Specify content-type header

    int httpCode = http.POST(request);   //Send the request
    String payload = http.getString();                  //Get the response payload

    Serial.println(httpCode);   //Print HTTP return code
    Serial.println(payload);    //Print request response payload

    http.end();  //Close connection

  }else{

    Serial.println("Error in WiFi connection");

  }
  delay(5000);
}
