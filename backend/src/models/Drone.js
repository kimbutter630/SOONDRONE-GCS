// 드론 모델 (임시)
class Drone {
  constructor(id, serialNumber, model, manufacturer, owner_id) {
    this.id = id;
    this.serial_number = serialNumber;
    this.model = model;
    this.manufacturer = manufacturer;
    this.owner_id = owner_id;
    this.battery_capacity = 0; // mAh
    this.max_flight_time = 0; // seconds
    this.max_speed = 0; // m/s
    this.max_altitude = 0; // meters
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}

module.exports = Drone;
