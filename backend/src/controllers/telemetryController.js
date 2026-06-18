// 텔레메트리 카트롤러
const { v4: uuidv4 } = require('uuid');

class TelemetryController {
  static async uploadTelemetry(req, res) {
    try {
      const { mission_id, drone_id, data } = req.body;

      if (!mission_id || !drone_id || !data || data.length === 0) {
        return res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: '필수 필드 누락' }
        });
      }

      const logId = uuidv4();

      res.status(201).json({
        id: logId,
        mission_id,
        records_count: data.length,
        time_range: {
          start: data[0].timestamp,
          end: data[data.length - 1].timestamp
        },
        created_at: new Date().toISOString()
      });

      // WebSocket 브로드캐스트
      if (global.broadcastTelemetry) {
        global.broadcastTelemetry({
          mission_id,
          drone_id,
          records_count: data.length
        });
      }
    } catch (error) {
      res.status(500).json({
        error: { code: 'SERVER_ERROR', message: error.message }
      });
    }
  }

  static async getTelemetryData(req, res) {
    try {
      const { mission_id, drone_id, start_time, end_time, page = 1, limit = 100 } = req.query;

      const data = [
        {
          timestamp: new Date().toISOString(),
          latitude: 37.4979,
          longitude: 127.0276,
          altitude: 100.5,
          speed: 5.2,
          battery_percentage: 85,
          gps_satellites: 12,
          signal_strength: -85,
          pump_intensity: 80,
          granule_rpm: 1500,
          temperature: 25.3
        }
      ];

      res.status(200).json({
        data,
        total: data.length,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        error: { code: 'SERVER_ERROR', message: error.message }
      });
    }
  }

  static async getTelemetryDetail(req, res) {
    try {
      const { id } = req.params;

      const logData = {
        id,
        mission_id: 1,
        drone_id: 1,
        records_count: 120,
        data: []
      };

      res.status(200).json(logData);
    } catch (error) {
      res.status(500).json({
        error: { code: 'SERVER_ERROR', message: error.message }
      });
    }
  }
}

module.exports = TelemetryController;
