/*
 * Voice Control Smart Home Automation System - Backend Server
 * Handles API requests and communicates with Arduino via Bluetooth
 */

const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Device configuration
const devices = [
  { id: 'light', name: 'Light', pin: 2, state: 0 },
  { id: 'fan', name: 'Fan', pin: 3, state: 0 },
  { id: 'tv', name: 'TV', pin: 4, state: 0 },
  { id: 'device4', name: 'Device 4', pin: 5, state: 0 }
];

// Bluetooth connection
let arduinoPort = null;
let parser = null;

// Helper: Try to find Arduino Bluetooth port dynamically
async function findBluetoothPort(preferredPort = 'COM3') {
  try {
    const ports = await SerialPort.list();
    if (ports.length === 0) {
      console.warn('⚠️ No serial ports found.');
      return null;
    }
    
    // Try to find preferred port first
    const preferred = ports.find(p => p.path === preferredPort);
    if (preferred) return preferred.path;
    
    // Otherwise, pick a likely candidate by manufacturer or friendlyName
    // Adjust this filtering based on your device
    const candidate = ports.find(p =>
      (p.manufacturer && p.manufacturer.toLowerCase().includes('arduino')) ||
      (p.friendlyName && p.friendlyName.toLowerCase().includes('arduino')) ||
      p.path.toLowerCase().includes('usbserial') ||
      p.path.toLowerCase().includes('com')
    );
    return candidate ? candidate.path : ports[0].path;
  } catch (err) {
    console.error('❌ Error listing serial ports:', err);
    return null;
  }
}

// ✅ Safe Bluetooth Initialization
async function initializeBluetooth() {
  const BAUD_RATE = 9600;
  const portName = await findBluetoothPort();

  if (!portName) {
    console.warn('⚠️ Bluetooth device not found. Running without Arduino connection.');
    return;
  }

  try {
    arduinoPort = new SerialPort({ path: portName, baudRate: BAUD_RATE });

    arduinoPort.on('open', () => {
      console.log(`✅ Bluetooth connected to Arduino on ${portName}`);
    });

    arduinoPort.on('error', (err) => {
      console.error('❌ Bluetooth connection error:', err.message);
    });

    parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\n' }));
    parser.on('data', (data) => {
      console.log('📡 Arduino:', data.trim());
    });
  } catch (error) {
    console.error('⚠️ Bluetooth initialization failed:', error.message);
  }
}

// ✅ Send command safely
function sendCommand(command) {
  if (arduinoPort && arduinoPort.isOpen) {
    arduinoPort.write(command + '\n', (err) => {
      if (err) {
        return console.error('❌ Failed to send command:', err.message);
      }
      console.log('📤 Sent to Arduino:', command);
    });
  } else {
    console.warn('⚠️ Cannot send command — Arduino not connected.');
  }
}

// API Routes

app.get('/api/devices', (req, res) => {
  res.json({
    success: true,
    devices: devices,
    bluetoothConnected: arduinoPort ? arduinoPort.isOpen : false
  });
});

app.post('/api/device/:id', (req, res) => {
  const deviceId = req.params.id;
  const { state } = req.body;

  const device = devices.find(d => d.id === deviceId);

  if (!device) {
    return res.status(404).json({
      success: false,
      message: 'Device not found'
    });
  }

  if (typeof state !== 'number' || (state !== 0 && state !== 1)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid state. Must be 0 (off) or 1 (on)'
    });
  }

  device.state = state;

  const command = `${deviceId} ${state === 1 ? 'on' : 'off'}`;
  sendCommand(command);

  res.json({
    success: true,
    message: `${device.name} turned ${state === 1 ? 'ON' : 'OFF'}`,
    device: device
  });
});

app.post('/api/voice-command', (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({
      success: false,
      message: 'Command is required'
    });
  }

  const processedCommand = command.toLowerCase().trim();
  console.log('🎤 Voice command received:', processedCommand);
  sendCommand(processedCommand);

  res.json({
    success: true,
    message: 'Voice command sent to Arduino',
    command: processedCommand
  });
});

app.get('/api/bluetooth/status', (req, res) => {
  res.json({
    success: true,
    connected: arduinoPort ? arduinoPort.isOpen : false,
    port: arduinoPort ? arduinoPort.path : null
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Voice Control Smart Home Server Started');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🔗 API endpoints available at http://localhost:${PORT}/api`);
  console.log('📱 Frontend can be accessed at http://localhost:3000');
});

// Bluetooth init (async)
initializeBluetooth();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  if (arduinoPort && arduinoPort.isOpen) {
    arduinoPort.close(() => {
      console.log('✅ Serial port closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
