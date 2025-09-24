# Hardware Setup Guide - Voice Control Smart Home

## Overview

This guide will help you set up the hardware components for your Voice Control Smart Home Automation System.

## Components Required

### Essential Components
- **Arduino Board** (Uno, Nano, or Mega)
- **Bluetooth Module** (HC-05 or HC-06)
- **Relay Module** (4-channel, 5V)
- **Jumper Wires** (Male to Male, Male to Female)
- **Breadboard** (optional, for prototyping)
- **Power Supply** (9V battery or USB power)

### Appliances to Control
- Light bulb with socket
- Fan
- TV or other electronic devices
- Any other appliance you want to control

## Wiring Diagram

### Arduino Pin Connections

| Arduino Pin | Component | Description |
|-------------|-----------|-------------|
| 5V | Bluetooth VCC | Power for Bluetooth module |
| GND | Bluetooth GND | Ground for Bluetooth module |
| Pin 10 (RX) | Bluetooth TX | Receive data from Bluetooth |
| Pin 11 (TX) | Bluetooth RX | Send data to Bluetooth |
| Pin 2 | Relay 1 (IN1) | Control Light |
| Pin 3 | Relay 2 (IN2) | Control Fan |
| Pin 4 | Relay 3 (IN3) | Control TV |
| Pin 5 | Relay 4 (IN4) | Control Device 4 |
| 5V | Relay VCC | Power for relay module |
| GND | Relay GND | Ground for relay module |

### Relay Connections to Appliances

**⚠️ IMPORTANT SAFETY WARNING:**
- Always be careful when working with high voltage
- Make sure to turn off power before making connections
- Use appropriate wire gauges for your appliances
- Consider using a qualified electrician for permanent installations

#### Relay Module to Light Bulb:
1. Connect one wire from the light bulb socket to the COM (Common) pin of Relay 1
2. Connect the other wire from the light bulb socket to the NO (Normally Open) pin of Relay 1
3. The light bulb will turn ON when the relay is activated

#### Relay Module to Fan:
1. Connect one wire from the fan to the COM pin of Relay 2
2. Connect the other wire from the fan to the NO pin of Relay 2
3. The fan will turn ON when the relay is activated

#### Relay Module to TV:
1. Connect one wire from the TV power cord to the COM pin of Relay 3
2. Connect the other wire from the TV power cord to the NO pin of Relay 3
3. The TV will turn ON when the relay is activated

## Step-by-Step Setup

### Step 1: Prepare the Arduino
1. Install Arduino IDE on your computer
2. Connect your Arduino to the computer via USB
3. Upload the provided `smart_home.ino` code to your Arduino

### Step 2: Connect the Bluetooth Module
1. Connect Bluetooth module to Arduino as shown in the table above
2. Make sure the Bluetooth module is properly powered (3.3V or 5V depending on your module)
3. The LED on the Bluetooth module should blink (indicating it's ready to pair)

### Step 3: Connect the Relay Module
1. Connect relay module to Arduino as shown in the table above
2. Make sure the relay module is powered from the Arduino's 5V pin
3. Do NOT connect high voltage to the relay module yet

### Step 4: Pair the Bluetooth Module
1. Go to your computer's Bluetooth settings
2. Scan for available devices
3. Look for "HC-05" or "HC-06" (the default name)
4. Pair with the device (default password is usually "1234" or "0000")
5. Note the COM port number assigned to the Bluetooth device

### Step 5: Update Backend Configuration
1. Open `backend/server.js`
2. Find the line: `const BLUETOOTH_PORT = 'COM3';`
3. Change 'COM3' to the COM port number you noted in step 4
4. Save the file

### Step 6: Connect Appliances (Final Step)
1. **TEST FIRST:** Upload Arduino code and test relay functionality with LED before connecting appliances
2. Connect your appliances to the relay modules as described above
3. Make sure all connections are secure
4. Test each appliance individually

## Testing the Setup

### Test 1: Arduino and Bluetooth
1. Open Arduino IDE Serial Monitor
2. Set baud rate to 9600
3. Send commands like "light on" and "light off"
4. You should see the relay clicking and the Serial Monitor responding

### Test 2: Full System Test
1. Start the backend server: `cd backend && npm start`
2. Open the frontend in your browser
3. Try the voice commands or button controls
4. Check if appliances respond correctly

## Troubleshooting

### Bluetooth Connection Issues
- **Problem:** Can't pair Bluetooth module
  - **Solution:** Check if the module is powered correctly and the LED is blinking
  - **Solution:** Try different baud rates (9600, 38400, etc.)
  - **Solution:** Reset the Bluetooth module by disconnecting and reconnecting power

### Relay Not Working
- **Problem:** Relay not clicking when commanded
  - **Solution:** Check all wire connections
  - **Solution:** Verify the relay module is getting 5V power
  - **Solution:** Test with a multimeter to check continuity

### Appliances Not Turning On/Off
- **Problem:** Connected appliance doesn't respond
  - **Solution:** Double-check the wiring to the relay's COM and NO pins
  - **Solution:** Ensure the appliance is plugged into a working power source
  - **Solution:** Test the appliance directly (without relay) to ensure it works

### Voice Recognition Not Working
- **Problem:** Browser doesn't recognize voice commands
  - **Solution:** Ensure microphone permissions are granted
  - **Solution:** Try using Chrome or Edge browser
  - **Solution:** Check if your microphone is working in other applications

## Safety Precautions

1. **Electrical Safety:**
   - Never work on live circuits
   - Use appropriate insulation for all wires
   - Keep water away from electrical components

2. **Fire Safety:**
   - Don't overload relays beyond their rated capacity
   - Use fuses or circuit breakers
   - Monitor the system when first testing

3. **Personal Safety:**
   - Wear safety glasses when working with wires
   - Work in a well-ventilated area
   - Keep a fire extinguisher nearby

## Power Consumption

- **Arduino Uno:** ~50mA
- **Bluetooth Module:** ~30mA
- **Relay Module:** ~20mA per relay (when activated)
- **Total:** Approximately 100-200mA depending on active relays

## Cost Estimation

- Arduino Uno: ₹400-600
- HC-05 Bluetooth Module: ₹250-400
- 4-Channel Relay Module: ₹150-250
- Jumper Wires: ₹50-100
- Breadboard: ₹100-150
- **Total Estimated Cost:** ₹950-1500

## Next Steps

Once your hardware is set up and tested:

1. Start the backend server
2. Open the web interface
3. Test voice commands
4. Customize the system for your specific needs
5. Consider adding more sensors or devices

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all connections match the wiring diagram
3. Test each component individually
4. Check the console logs in your browser and backend server

Happy building! 🏠🤖
