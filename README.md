# Voice Control Smart Home Automation System

A complete IoT project that combines hardware (Arduino + Bluetooth) with software (Web interface with voice control) to create a smart home automation system.

## Project Overview

This project allows you to control your home appliances using voice commands through a web interface. The system consists of:

- **Hardware**: Arduino Uno with Bluetooth module and relay for controlling appliances
- **Backend**: Node.js server for handling API requests and Bluetooth communication
- **Frontend**: Modern web interface with voice recognition capabilities
- **Voice Control**: Integration with Web Speech API for hands-free control

## Features

- 🔊 Voice control for all appliances
- 🌐 Web-based interface accessible from any device
- 📱 Responsive design for mobile and desktop
- 🔄 Real-time status updates
- 🎛️ Manual control buttons as backup
- 📊 Device status monitoring
- 🔐 Voice authentication system (only trained voices can control)
- 🚨 Security alerts for unauthorized access attempts

## Hardware Components

Based on your setup:
- Arduino Uno/Nano
- HC-05/HC-06 Bluetooth Module
- Relay Module (4-channel)
- Light bulb or other appliances
- Jumper wires and breadboard
- 9V battery for power

## Software Requirements

- Node.js (v14 or higher)
- Arduino IDE
- Modern web browser with microphone support

## Project Structure

```
voice-control-smart-home/
├── frontend/           # Web interface
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/            # Node.js server
│   ├── server.js
│   └── package.json
├── arduino/            # Arduino code
│   └── smart_home.ino
├── hardware-docs/      # Hardware documentation
│   └── setup-guide.md
└── README.md
```

## Quick Start

### 1. Hardware Setup
1. Upload the Arduino code to your board
2. Connect your appliances to the relay module
3. Power on the Arduino and ensure Bluetooth is working

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```

### 3. Frontend Setup
Open `frontend/index.html` in your web browser

### 4. Voice Control Setup
1. Ensure your browser has microphone permissions
2. Click the microphone button and say commands like:
   - "Turn on light"
   - "Turn off light"
   - "Light on"
   - "Light off"

## Supported Voice Commands

- **Light Control**: "turn on light", "turn off light", "light on", "light off"
- **Fan Control**: "turn on fan", "turn off fan", "fan on", "fan off"
- **TV Control**: "turn on tv", "turn off tv", "tv on", "tv off"
- **All Devices**: "turn on everything", "turn off everything"

## 🔐 Voice Authentication System

This system includes advanced voice authentication to ensure only authorized users can control your smart home:

### How It Works
1. **Voice Training**: Users must complete a voice training session
2. **Voice Pattern Analysis**: The system analyzes voice characteristics like:
   - Speech confidence levels
   - Word pronunciation patterns
   - Speech rhythm and timing
   - Word length patterns
3. **Authentication**: Each voice command is compared against trained voice signatures
4. **Security Alerts**: Unauthorized attempts trigger visual and console alerts

### Voice Training Process
1. Click the "Train Your Voice" button
2. Speak the following phrases clearly:
   - "turn on light"
   - "turn off fan"
   - "turn on tv"
   - "turn off everything"
   - "hello smart home"
3. The system captures your unique voice characteristics
4. Training data is stored locally in your browser

### Security Features
- **Access Control**: Only trained voices can execute commands
- **Pattern Matching**: Uses multiple voice characteristics for authentication
- **Security Alerts**: Unauthorized attempts show visual alerts
- **Local Storage**: Voice signatures are stored locally for privacy
- **Threshold-based**: Configurable similarity threshold for authentication

## API Endpoints

- `GET /devices` - Get all device statuses
- `POST /device/:id` - Control a specific device
- `GET /bluetooth/status` - Check Bluetooth connection

## Troubleshooting

1. **Bluetooth not connecting**: Check if HC-05/HC-06 is properly paired
2. **Voice not recognized**: Ensure microphone permissions are granted
3. **Devices not responding**: Verify relay connections and Arduino code

## Future Enhancements

- Mobile app development
- Integration with Google Assistant/Alexa
- Energy monitoring
- Scheduling features
- Multiple room support

## Contributing

Feel free to enhance this project by adding new features or improving the code!

## License

This project is for educational purposes.
