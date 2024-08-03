#include "BluetoothSerial.h"

BluetoothSerial SerialBT;

void setup() {
  Serial.begin(115200);
  
  SerialBT.begin("obd-2");
  Serial.println("ESP32 OBD-II Scanner");
  
  // Attempt to connect to the ELM327 device
  bool connected = SerialBT.connect("OBDII"); // Replace with your ELM327 device name
  
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
}

void loop() {
  if (SerialBT.connected()) {
    // Request and parse various OBD-II data
    
    // Request vehicle speed (PID 0D)
    String speedResponse = sendCommand("010D");
    int speed = parseSpeed(speedResponse);
    Serial.print("Vehicle Speed: ");
    Serial.print(speed);
    Serial.println(" km/h");
    
    // Request engine RPM (PID 0C)
    String rpmResponse = sendCommand("010C");
    int rpm = parseRPM(rpmResponse);
    Serial.print("Engine RPM: ");
    Serial.print(rpm);
    Serial.println(" RPM");

    // Request engine coolant temperature (PID 05)
    String tempResponse = sendCommand("0105");
    int temp = parseTemperature(tempResponse);
    Serial.print("Engine Coolant Temperature: ");
    Serial.print(temp);
    Serial.println(" °C");
    
    // Request fuel level input (PID 2F)
    String fuelResponse = sendCommand("012F");
    float fuelLevel = parseFuelLevel(fuelResponse);
    Serial.print("Fuel Level: ");
    Serial.print(fuelLevel);
    Serial.println(" %");
    
    // Request mass air flow rate (PID 10)
    String mafResponse = sendCommand("0110");
    float maf = parseMAF(mafResponse);
    Serial.print("Mass Air Flow Rate: ");
    Serial.print(maf);
    Serial.println(" g/s");
    
    // Request throttle position (PID 11)
    String throttleResponse = sendCommand("0111");
    float throttle = parseThrottle(throttleResponse);
    Serial.print("Throttle Position: ");
    Serial.print(throttle);
    Serial.println(" %");
    
    // Request run time since engine start (PID 1F)
    String runTimeResponse = sendCommand("011F");
    int runTime = parseRunTime(runTimeResponse);
    Serial.print("Run Time Since Engine Start: ");
    Serial.print(runTime);
    Serial.println(" seconds");
    
    // Add more PID requests as needed
  } else {
    Serial.println("Not connected to ELM327");
  }
  delay(5000); // Repeat every 5 seconds
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
