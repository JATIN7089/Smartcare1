/**
 * Sensor Simulator & Wearable Integration Service
 * 
 * Provides simulated telemetry stream for demonstrating the Well-being Monitor
 * and future Bluetooth Low Energy (BLE) / Web Bluetooth integration.
 * 
 * DISCLAIMER:
 * These are purely simulated demonstration values for interface testing.
 * They are NOT actual physiological measurements and are NOT used to diagnose any medical condition.
 */

export class SensorSimulator {
  constructor() {
    this.connected = false;
    this.intervalId = null;
    this.listeners = [];
    this.deviceInfo = {
      name: 'NER-CareBand BLE (Simulation)',
      battery: 84,
      firmware: 'v2.4-Demo',
      mac: 'E2:8F:90:31:C4:AA'
    };
  }

  connect(callback) {
    this.connected = true;
    if (callback) this.listeners.push(callback);

    let tick = 0;
    this.intervalId = setInterval(() => {
      tick++;
      // Subtle natural fluctuations around healthy resting baselines
      const hr = Math.round(72 + Math.sin(tick * 0.2) * 4 + (Math.random() * 2 - 1));
      const resp = Math.round(14 + Math.sin(tick * 0.1) * 2);
      const hrv = Math.round(58 + Math.cos(tick * 0.15) * 6);
      const gsr = (3.2 + Math.sin(tick * 0.05) * 0.3).toFixed(2); // microsiemens

      const telemetry = {
        timestamp: new Date().toLocaleTimeString(),
        heartRate: hr, // bpm
        respiratoryRate: resp, // breaths/min
        heartRateVariability: hrv, // ms
        skinConductance: Number(gsr), // µS
        isCalm: resp <= 16 && hr <= 80,
        signalQuality: 'Good (98%)',
        isSimulation: true
      };

      this.listeners.forEach(cb => cb(telemetry));
    }, 1500);

    return this.deviceInfo;
  }

  disconnect() {
    this.connected = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.listeners = [];
  }
}

export const sensorSimulator = new SensorSimulator();
