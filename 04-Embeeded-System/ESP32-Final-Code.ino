#include <WiFi.h>
#include <WebSocketsClient.h>
#include <BluetoothSerial.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>

// Wi-Fi credentials
const char* ssid = "*********"; // wifi Ağ ismi
const char* password = "*********"; // wifi Ağ şifresi

// WebSocket server URL and ports
const char* ws_host = "**************"; // server host domain 
const uint16_t ws_port = 80;
const char* location_ws_path = "/UPDATE_VEHICLE_LOCATION";
const char* info_ws_path = "/UPDATE_VEHICLE_INFO";

// Bluetooth setup
BluetoothSerial SerialBT;

// WebSocket clients for location and OBD-II info
WebSocketsClient locationWebSocket;
WebSocketsClient infoWebSocket;

// GPS setup
TinyGPSPlus gps;
HardwareSerial mySerial(1);

// Vehicle ID (replace with actual ID)
const char* vehicleId = "65856b6cfea735370f50abeb";

void setup() {
  Serial.begin(115200);
  SerialBT.begin("obd-2")
  Serial.println("ESP32 OBD-II Scanner");
  
  // Attempt to connect to the ELM327 device
  bool connected = SerialBT.connect("obd-2");
  if (connected) {
    Serial.println("Connected to ELM327");
  } else {
    Serial.println("Failed to connect to ELM327");
    while (true) {
      delay(1000); // Do nothing, just wait indefinitely
    }
  }
  
  // Send initialization commands to ELM327
  sendCommand("ATZ");  // Reset all
  sendCommand("ATE0"); // Echo Off
  sendCommand("ATL0"); // Linefeed Off
  sendCommand("ATH0"); // Headers Off
  sendCommand("ATS0"); // Spaces Off
  sendCommand("ATSP0"); // Set Protocol to Auto
  
  // Initialize GPS
  mySerial.begin(9600, SERIAL_8N1, 16, 17); // RX = 16, TX = 17
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");

  // Initialize WebSocket clients
  locationWebSocket.begin(ws_host, ws_port, location_ws_path);
  locationWebSocket.onEvent(webSocketEvent);
  locationWebSocket.setReconnectInterval(5000);
  infoWebSocket.begin(ws_host, ws_port, info_ws_path);
  infoWebSocket.onEvent(webSocketEvent);
  infoWebSocket.setReconnectInterval(5000);
}

void loop() {
  // WebSocket loops
  locationWebSocket.loop();
  infoWebSocket.loop();
  
  if (SerialBT.connected()) {
    // Request and parse various OBD-II data
    String speedResponse = sendCommand("010D");
    int speed = parseSpeed(speedResponse);
    
    String rpmResponse = sendCommand("010C");
    int rpm = parseRPM(rpmResponse);
    
    String tempResponse = sendCommand("0105");
    int temp = parseTemperature(tempResponse);
    
    String fuelResponse = sendCommand("012F");
    float fuelLevel = parseFuelLevel(fuelResponse);
    
    String mafResponse = sendCommand("0110");
    float maf = parseMAF(mafResponse);
    
    String throttleResponse = sendCommand("0111");
    float throttle = parseThrottle(throttleResponse);
    
    String runTimeResponse = sendCommand("011F");
    int runTime = parseRunTime(runTimeResponse);
    
    String oilTempResponse = sendCommand("F1");
    int oilTemp = parseOilTemperature(oilTempResponse);
    
    String batteryVoltageResponse = sendCommand("042");
    float batteryVoltage = parseBatteryVoltage(batteryVoltageResponse);
    
    String oxygenSensorResponse = sendCommand("014");
    float oxygenSensor = parseOxygenSensor(oxygenSensorResponse);
    
    String fuelConsumptionResponse = sendCommand("05E");
    float fuelConsumption = parseFuelConsumption(fuelConsumptionResponse);
    
    String vinResponse = sendCommand("0902");
    String vin = parseVIN(vinResponse);
    
    // Read GPS data
    while (mySerial.available() > 0) {
      gps.encode(mySerial.read());
    }
    if (gps.location.isUpdated()) {
      double latitude = gps.location.lat();
      double longitude = gps.location.lng();
      // Send GPS data via WebSocket
      sendLocationData(latitude, longitude);

      // Send OBD-II data via WebSocket
      sendOBDData(speed, rpm, temp, fuelLevel, maf, throttle, runTime, oilTemp, batteryVoltage, oxygenSensor, fuelConsumption, vin);
    }
  } else {
    Serial.println("Not connected to ELM327");
  }
  delay(5000); // Repeat every 5 seconds
}

void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("WebSocket Disconnected");
      break;
    case WStype_CONNECTED:
      Serial.println("WebSocket Connected");
      break;
    case WStype_TEXT:
      Serial.printf("WebSocket Text: %s\n", payload);
      break;
  }
}

String sendCommand(const char* command) {
  SerialBT.println(command);
  delay(100); // Wait for the response
  String response = "";
  while (SerialBT.available()) {
    char c = SerialBT.read();
    response += c;
  }
  Serial.print("Sent: ");
  Serial.println(command);
  Serial.print("Response: ");
  Serial.println(response);
  return response;
}

void sendLocationData(double latitude, double longitude) {
  // Create JSON formatted string for location data
  String jsonString = "{\"id\":\"";
  jsonString += vehicleId;
  jsonString += "\",\"latitude\":";
  jsonString += latitude;
  jsonString += ",\"longitude\":";
  jsonString += longitude;
  jsonString += "}";

  // Send data via WebSocket
  locationWebSocket.sendTXT(jsonString);
}

void sendOBDData(int speed, int rpm, int temp, float fuelLevel, float maf, float throttle, int runTime, int oilTemp, float batteryVoltage, float oxygenSensor, float fuelConsumption, String vin) {
  // Create JSON formatted string for OBD-II data
  String jsonString = "{\"id\":\"";
  jsonString += vehicleId;
  jsonString += "\",\"speed\":";
  jsonString += speed;
  jsonString += ",\"rpm\":";
  jsonString += rpm;
  jsonString += ",\"temp\":";
  jsonString += temp;
  jsonString += ",\"fuelLevel\":";
  jsonString += fuelLevel;
  jsonString += ",\"maf\":";
  jsonString += maf;
  jsonString += ",\"throttle\":";
  jsonString += throttle;
  jsonString += ",\"runTime\":";
  jsonString += runTime;
  jsonString += ",\"oilTemp\":";
  jsonString += oilTemp;
  jsonString += ",\"batteryVoltage\":";
  jsonString += batteryVoltage;
  jsonString += ",\"oxygenSensor\":";
  jsonString += oxygenSensor;
  jsonString += ",\"fuelConsumption\":";
  jsonString += fuelConsumption;
  jsonString += ",\"vin\":\"";
  jsonString += vin;
  jsonString += "\"}";
  // Send data via WebSocket
  infoWebSocket.sendTXT(jsonString);
}

int parseSpeed(String response) {
  int speed = 0;
  if (response.length() > 4) {
    String speedStr = response.substring(6, 8);
    speed = strtol(speedStr.c_str(), NULL, 16);
  }
  return speed;
}

int parseRPM(String response) {
  int rpm = 0;
  if (response.length() > 4) {
    String A = response.substring(6, 8);
    String B = response.substring(9, 11);
    rpm = ((strtol(A.c_str(), NULL, 16) * 256) + strtol(B.c_str(), NULL, 16)) / 4;
  }
  return rpm;
}

int parseTemperature(String response) {
  int temp = 0;
  if (response.length() > 4) {
    String tempStr = response.substring(6, 8);
    temp = strtol(tempStr.c_str(), NULL, 16) - 40;
  }
  return temp;
}

float parseFuelLevel(String response) {
  float fuelLevel = 0;
  if (response.length() > 4) {
    String fuelStr = response.substring(6, 8);
    fuelLevel = (strtol(fuelStr.c_str(), NULL, 16) * 100) / 255.0;
  }
  return fuelLevel;
}

float parseMAF(String response) {
  float maf = 0;
  if (response.length() > 4) {
    String A = response.substring(6, 8);
    String B = response.substring(9, 11);
    maf = ((strtol(A.c_str(), NULL, 16) * 256) + strtol(B.c_str(), NULL, 16)) / 100.0;
  }
  return maf;
}

float parseThrottle(String response) {
  float throttle = 0;
  if (response.length() > 4) {
    String throttleStr = response.substring(6, 8);
    throttle = (strtol(throttleStr.c_str(), NULL, 16) * 100) / 255.0;
  }
  return throttle;
}

int parseRunTime(String response) {
  int runTime = 0;
  if (response.length() > 4) {
    String A = response.substring(6, 8);
    String B = response.substring(9, 11);
    runTime = (strtol(A.c_str(), NULL, 16) * 256) + strtol(B.c_str(), NULL, 16);
  }
  return runTime;
}

int parseOilTemperature(String response) {
  int oilTemp = 0;
  if (response.length() > 4) {
    String oilTempStr = response.substring(6, 8);
    oilTemp = strtol(oilTempStr.c_str(), NULL, 16) - 40; // Adjust offset as needed
  }
  return oilTemp;
}

float parseBatteryVoltage(String response) {
  float batteryVoltage = 0;
  if (response.length() > 4) {
    String batteryStr = response.substring(6, 8);
    batteryVoltage = strtol(batteryStr.c_str(), NULL, 16) * 0.1; // Adjust multiplier as needed
  }
  return batteryVoltage;
}

float parseOxygenSensor(String response) {
  float oxygenSensor = 0;
  if (response.length() > 4) {
    String oxygenStr = response.substring(6, 8);
    oxygenSensor = strtol(oxygenStr.c_str(), NULL, 16); // Adjust calculation as needed
  }
  return oxygenSensor;
}

float parseFuelConsumption(String response) {
  float fuelConsumption = 0;
  if (response.length() > 4) {
    String fuelStr = response.substring(6, 8);
    fuelConsumption = strtol(fuelStr.c_str(), NULL, 16) * 0.1; // Adjust multiplier as needed
  }
  return fuelConsumption;
}

String parseVIN(String response) {
  // VIN is usually longer and might be split into multiple parts
  // Adjust parsing logic based on actual response format
  return response.substring(6); // Adjust index as needed
}
