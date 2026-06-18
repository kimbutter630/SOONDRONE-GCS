// 미션 카트롤러
const { v4: uuidv4 } = require('uuid');

class MissionController {
  static async listMissions(req, res) {
    try {
      const { drone_id, operator_id, status, page = 1, limit = 20 } = req.query;

      const missions = [
        {
          id: 1,
          drone_id,
          operator_id,
          mission_type: 'spray',
          status: 'completed',
          total_area: 5000,
          total_spray_amount: 12.5,
          created_at: new Date()
        }
      ];

      res.status(200).json({
        data: missions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: missions.length
        }
      });
    } catch (error) {
      res.status(500).json({
        error: { code: 'SERVER_ERROR', message: error.message }
      });
    }
  }

  static async createMission(req, res) {
    try {
      const { drone_id, mission_type, field_boundary, waypoints, spray_settings } = req.body;

      if (!drone_id || !mission_type) {
        return res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: '필수 필드 누락' }
        });
      }

      const mission = {
        id: uuidv4(),
        drone_id,
        operator_id: req.user?.id || 1,
        mission_type,
        field_boundary,
        waypoints: waypoints || [],
        spray_settings: spray_settings || {},
        status: 'planned',
        total_area: 0,
        created_at: new Date()
      };

      res.status(201).json(mission);
    } catch (error) {
      res.status(500).json({
        error: { code: 'SERVER_ERROR', message: error.message }
      });
    }
  }

  static async generateSurvey(req, res) {
    try {
      const { field_boundary, swath_width, flight_altitude, flight_speed, sweep_direction = 'N-S' } = req.body;

      if (!field_boundary || !swath_width) {
        return res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: '필드 경계와 swath_width가 필요합니다' }
        });
      }

      const waypoints = [
        { sequence: 1, latitude: 37.4979, longitude: 127.0276, altitude: 100, speed: 10, action: 'TAKEOFF' },
        { sequence: 2, latitude: 37.4980, longitude: 127.0277, altitude: 100, speed: 10, action: 'WAYPOINT' },
        { sequence: 3, latitude: 37.4979, longitude: 127.0276, altitude: 0, speed: 0, action: 'LAND' }
      ];

      res.status(200).json({
        waypoints,
        total_distance: 2500,
        estimated_duration: 420,
        estimated_coverage_area: 5000
      });
    } catch (error) {
      res.status(500).json({
        error: { code: 'SERVER_ERROR', message: error.message }
      });
    }
  }

  static async startMission(req, res) {
    try {
      const { id } = req.params;

      res.status(200).json({
        id,
        status: 'executing',
        start_time: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        error: { code: 'SERVER_ERROR', message: error.message }
      });
    }
  }

  static async stopMission(req, res) {
    try {
      const { id } = req.params;

      res.status(200).json({
        id,
        status: 'completed',
        end_time: new Date().toISOString(),
        total_spray_amount: 12.5,
        actual_area_covered: 4950
      });
    } catch (error) {
      res.status(500).json({
        error: { code: 'SERVER_ERROR', message: error.message }
      });
    }
  }
}

module.exports = MissionController;
