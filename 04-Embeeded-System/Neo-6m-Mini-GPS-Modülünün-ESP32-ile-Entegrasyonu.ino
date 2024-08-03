#include <TinyGPS++.h>
#include <HardwareSerial.h>

// Create a TinyGPS++ object
TinyGPSPlus gps;

// Define the hardware serial
HardwareSerial mySerial(1);

void setup() {
  // Start serial communication
  Serial.begin(115200);
  mySerial.begin(9600, SERIAL_8N1, 16, 17); // RX = 16, TX = 17
  Serial.println("Initializing GPS module...");
}

void loop() {
  // Read and process GPS data
  while (mySerial.available() > 0) {
    gps.encode(mySerial.read());
  }
  // Print GPS data to serial monitor
  if (gps.location.isUpdated()) {
    Serial.print("Latitude: "); Serial.println(gps.location.lat(), 6);
    Serial.print("Longitude: "); Serial.println(gps.location.lng(), 6);
  }
  delay(1000);
}
