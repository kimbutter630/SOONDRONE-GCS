// 미션 모델 (임시)
class Mission {
  constructor(id, droneId, operatorId, missionType) {
    this.id = id;
    this.drone_id = droneId;
    this.operator_id = operatorId;
    this.mission_type = missionType; // spray, survey, mapping
    this.status = 'planned'; // planned, executing, completed, cancelled
    this.field_boundary = null; // GeoJSON Polygon
    this.waypoints = [];
    this.start_time = null;
    this.end_time = null;
    this.total_area = 0; // m²
    this.total_spray_amount = 0; // L
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}

module.exports = Mission;
