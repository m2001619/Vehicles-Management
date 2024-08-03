#include <WiFi.h>
#include <WebSocketsClient.h>

// Wi-Fi credentials
const char* ssid = "*********"; // wifi Ağ ismi
const char* password = "*********"; // wifi Ağ şifresi

// WebSocket server URL and port
const char* ws_host = "**************"; // server host domain 
const uint16_t ws_port = 80;
const char* ws_path = "/";

// WebSocket client
WebSocketsClient webSocket;

void setup() {
  // Start serial communication
  Serial.begin(115200);
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("WiFi connected");
  
  // Initialize WebSocket
  webSocket.begin(ws_host, ws_port, ws_path);
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
}

void loop() {
  // WebSocket loop
  webSocket.loop();

  delay(1000);
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
