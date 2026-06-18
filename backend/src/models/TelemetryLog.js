// 텔레메트리 로그 모델 (임시)
class TelemetryLog {
  constructor(id, missionId, droneId, timestamp) {
    this.id = id;
    this.mission_id = missionId;
    this.drone_id = droneId;
    this.timestamp = timestamp;
    this.location = { latitude: 0, longitude: 0 };
    this.altitude = 0; // meters
    this.speed = 0; // m/s
    this.battery_percentage = 0;
    this.gps_satellites = 0;
    this.signal_strength = 0; // dBm
    this.pump_intensity = 0; // 0-100%
    this.granule_rpm = 0;
    this.temperature = 0; // celsius
    this.created_at = new Date();
  }
}

module.exports = TelemetryLog;
