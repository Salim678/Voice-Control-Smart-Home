/*
 * Voice Control Smart Home - Frontend JavaScript
 * Handles voice recognition, API calls, and UI updates
 * Enhanced with Voice Authentication
 */

class SmartHomeController {
    constructor() {
        this.devices = [];
        this.recognition = null;
        this.isListening = false;
        this.isAuthenticated = false;
        this.voiceTrained = false;
        this.voiceSignatures = [];
        this.apiBaseUrl = 'http://localhost:3001/api';

        this.initializeEventListeners();
        this.initializeVoiceRecognition();
        this.loadDevices();
        this.startStatusUpdates();
        this.checkVoiceTraining();
    }

    initializeEventListeners() {
        // Voice button
        const voiceBtn = document.getElementById('voiceBtn');
        voiceBtn.addEventListener('click', () => {
            this.toggleVoiceRecognition();
        });

        // Voice training button
        const trainBtn = document.getElementById('trainVoiceBtn');
        if (trainBtn) {
            trainBtn.addEventListener('click', () => {
                this.startVoiceTraining();
            });
        }

        // Keyboard shortcut (Space bar)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                this.toggleVoiceRecognition();
            }
        });
    }

    initializeVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();

            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceStatus('Listening...', 'listening');
                this.showVoiceFeedback('🎤 Listening... Speak now!');
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.processVoiceCommand(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.updateVoiceStatus('Voice error', 'error');
                this.showVoiceFeedback('❌ Error: ' + event.error);
                this.isListening = false;
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceStatus('Voice control ready', 'ready');
                this.showVoiceFeedback('');
            };
        } else {
            this.updateVoiceStatus('Voice not supported', 'error');
            this.showVoiceFeedback('❌ Voice recognition not supported in this browser');
        }
    }

    toggleVoiceRecognition() {
        if (!this.recognition) return;

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    processVoiceCommand(transcript) {
        const command = transcript.toLowerCase().trim();
        this.showVoiceFeedback(`📝 Heard: "${transcript}"`);

        console.log('Processing voice command:', command);

        // Send command to backend
        fetch(`${this.apiBaseUrl}/voice-command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command: command })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.showVoiceFeedback(`✅ Command sent: ${command}`);
                // Refresh device states after a short delay
                setTimeout(() => this.loadDevices(), 1000);
            } else {
                this.showVoiceFeedback(`❌ Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error sending voice command:', error);
            this.showVoiceFeedback('❌ Failed to send command');
        });
    }

    async loadDevices() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/devices`);
            const data = await response.json();

            if (data.success) {
                this.devices = data.devices;
                this.updateConnectionStatus(data.bluetoothConnected);
                this.renderDevices();
            }
        } catch (error) {
            console.error('Error loading devices:', error);
            this.updateConnectionStatus(false);
        }
    }

    renderDevices() {
        const devicesGrid = document.getElementById('devicesGrid');

        devicesGrid.innerHTML = this.devices.map(device => `
            <div class="device-card" data-device-id="${device.id}">
                <span class="device-icon">${this.getDeviceIcon(device.id)}</span>
                <div class="device-name">${device.name}</div>
                <div class="device-controls">
                    <button class="btn btn-off ${device.state === 0 ? 'disabled' : ''}"
                            onclick="smartHome.controlDevice('${device.id}', 0)">
                        OFF
                    </button>
                    <button class="btn btn-on ${device.state === 1 ? 'disabled' : ''}"
                            onclick="smartHome.controlDevice('${device.id}', 1)">
                        ON
                    </button>
                </div>
                <div class="device-status">
                    Status: <strong>${device.state === 1 ? 'ON' : 'OFF'}</strong>
                </div>
            </div>
        `).join('');
    }

    getDeviceIcon(deviceId) {
        const icons = {
            'light': '💡',
            'fan': '🌀',
            'tv': '📺',
            'device4': '🔌'
        };
        return icons[deviceId] || '⚡';
    }

    async controlDevice(deviceId, state) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/device/${deviceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ state: state })
            });

            const data = await response.json();

            if (data.success) {
                this.showVoiceFeedback(`✅ ${data.message}`);
                this.loadDevices(); // Refresh device states
            } else {
                this.showVoiceFeedback(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error('Error controlling device:', error);
            this.showVoiceFeedback('❌ Failed to control device');
        }
    }

    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connectionStatus');
        const indicator = statusElement.querySelector('.status-indicator');
        const text = statusElement.querySelector('span:last-child');

        if (connected) {
            indicator.classList.add('connected');
            text.textContent = 'Connected to Arduino';
            statusElement.style.background = 'rgba(64, 192, 87, 0.2)';
        } else {
            indicator.classList.remove('connected');
            text.textContent = 'Disconnected from Arduino';
            statusElement.style.background = 'rgba(255, 107, 107, 0.2)';
        }
    }

    updateVoiceStatus(message, status) {
        const voiceStatus = document.getElementById('voiceStatus');
        const text = voiceStatus.querySelector('span:last-child');

        text.textContent = message;

        voiceStatus.className = 'voice-status';
        if (status) {
            voiceStatus.classList.add(status);
        }
    }

    showVoiceFeedback(message) {
        const feedbackElement = document.getElementById('voiceFeedback');
        feedbackElement.textContent = message;

        // Clear feedback after 3 seconds
        setTimeout(() => {
            if (feedbackElement.textContent === message) {
                feedbackElement.textContent = '';
            }
        }, 3000);
    }

    startStatusUpdates() {
        // Update device status every 5 seconds
        setInterval(() => {
            this.loadDevices();
        }, 5000);
    }

    extractVoiceSignature(results, confidence) {
        // Extract voice characteristics for authentication
        const signature = {
            confidence: confidence,
            length: results[0].transcript.length,
            timestamp: Date.now(),
            // We can add more sophisticated features here
            wordCount: results[0].transcript.split(' ').length,
            hasNumbers: /\d/.test(results[0].transcript),
            avgWordLength: results[0].transcript.split(' ').reduce((sum, word) => sum + word.length, 0) / results[0].transcript.split(' ').length
        };

        return signature;
    }

    async processVoiceCommand(transcript, voiceSignature) {
        const command = transcript.toLowerCase().trim();
        this.showVoiceFeedback(`📝 Heard: "${transcript}"`);

        console.log('Processing voice command:', command);

        // Check if voice is trained
        if (!this.voiceTrained) {
            this.showVoiceFeedback('⚠️ Please train your voice first using the "Train Voice" button');
            return;
        }

        // Authenticate voice
        const isAuthenticated = await this.authenticateVoice(voiceSignature);

        if (!isAuthenticated) {
            this.showVoiceFeedback('❌ Voice not recognized. Access denied.');
            this.showSecurityAlert();
            return;
        }

        // Send command to backend
        fetch(`${this.apiBaseUrl}/voice-command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command: command })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.showVoiceFeedback(`✅ Command executed: ${command}`);
                // Refresh device states after a short delay
                setTimeout(() => this.loadDevices(), 1000);
            } else {
                this.showVoiceFeedback(`❌ Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error sending voice command:', error);
            this.showVoiceFeedback('❌ Failed to send command');
        });
    }

    async authenticateVoice(voiceSignature) {
        if (this.voiceSignatures.length === 0) {
            return false;
        }

        // Simple authentication based on voice characteristics
        const threshold = 0.7; // Adjust based on testing

        for (let signature of this.voiceSignatures) {
            let matchScore = 0;
            let totalFeatures = 0;

            // Compare confidence
            if (Math.abs(voiceSignature.confidence - signature.confidence) < 0.2) {
                matchScore += 0.3;
            }
            totalFeatures += 0.3;

            // Compare speech patterns
            if (Math.abs(voiceSignature.avgWordLength - signature.avgWordLength) < 1.0) {
                matchScore += 0.2;
            }
            totalFeatures += 0.2;

            // Compare word count patterns
            if (Math.abs(voiceSignature.wordCount - signature.wordCount) <= 1) {
                matchScore += 0.2;
            }
            totalFeatures += 0.2;

            // Compare speech length
            if (Math.abs(voiceSignature.length - signature.length) < 5) {
                matchScore += 0.3;
            }
            totalFeatures += 0.3;

            const similarity = matchScore / totalFeatures;

            if (similarity >= threshold) {
                console.log('Voice authenticated with similarity:', similarity);
                return true;
            }
        }

        console.log('Voice authentication failed');
        return false;
    }

    async startVoiceTraining() {
        this.showVoiceFeedback('🎤 Starting voice training... Please speak the training phrases clearly.');

        const trainingPhrases = [
            'turn on light',
            'turn off fan',
            'turn on tv',
            'turn off everything',
            'hello smart home'
        ];

        this.voiceSignatures = [];
        let currentPhrase = 0;

        const trainNextPhrase = () => {
            if (currentPhrase >= trainingPhrases.length) {
                this.completeVoiceTraining();
                return;
            }

            this.showVoiceFeedback(`🎤 Say: "${trainingPhrases[currentPhrase]}"`);

            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                const confidence = event.results[0][0].confidence;
                const voiceSignature = this.extractVoiceSignature(event.results[0], confidence);

                // Check if the phrase matches
                if (transcript.includes(trainingPhrases[currentPhrase])) {
                    this.voiceSignatures.push(voiceSignature);
                    this.showVoiceFeedback(`✅ Training phrase ${currentPhrase + 1} recorded`);
                    currentPhrase++;
                    setTimeout(trainNextPhrase, 1000);
                } else {
                    this.showVoiceFeedback('❌ Please say the exact phrase. Try again.');
                    setTimeout(trainNextPhrase, 1000);
                }
            };

            recognition.onerror = () => {
                this.showVoiceFeedback('❌ Training error. Please try again.');
                setTimeout(trainNextPhrase, 1000);
            };

            recognition.start();
        };

        trainNextPhrase();
    }

    completeVoiceTraining() {
        if (this.voiceSignatures.length >= 3) {
            this.voiceTrained = true;
            localStorage.setItem('voiceTrained', 'true');
            localStorage.setItem('voiceSignatures', JSON.stringify(this.voiceSignatures));

            this.showVoiceFeedback('✅ Voice training completed! You can now use voice commands.');
            this.updateVoiceStatus('Voice trained and ready', 'authenticated');
            this.showTrainingComplete();
        } else {
            this.showVoiceFeedback('❌ Voice training failed. Please try again.');
        }
    }

    checkVoiceTraining() {
        const trained = localStorage.getItem('voiceTrained');
        const signatures = localStorage.getItem('voiceSignatures');

        if (trained && signatures) {
            this.voiceTrained = true;
            this.voiceSignatures = JSON.parse(signatures);
            this.updateVoiceStatus('Voice trained and ready', 'authenticated');
        } else {
            this.updateVoiceStatus('Voice training required', 'training-needed');
        }
    }

    showSecurityAlert() {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'security-alert';
        alertDiv.innerHTML = `
            <div class="alert-content">
                <h3>🚨 Security Alert</h3>
                <p>Unauthorized voice command detected!</p>
                <p>Only trained voices can control this system.</p>
                <button onclick="this.parentElement.parentElement.remove()">Dismiss</button>
            </div>
        `;

        document.body.appendChild(alertDiv);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 10000);
    }

    showTrainingComplete() {
        const trainingDiv = document.createElement('div');
        trainingDiv.className = 'training-complete';
        trainingDiv.innerHTML = `
            <div class="training-content">
                <h3>🎉 Voice Training Complete!</h3>
                <p>Your voice has been successfully registered.</p>
                <p>You can now control your smart home with voice commands.</p>
                <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
            </div>
        `;

        document.body.appendChild(trainingDiv);
    }
}

// Global function for quick command buttons
function sendVoiceCommand(command) {
    if (window.smartHome) {
        window.smartHome.processVoiceCommand(command);
    }
}

// Initialize the smart home controller when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.smartHome = new SmartHomeController();
});
