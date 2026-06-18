// 드론 카트롤러
const { v4: uuidv4 } = require('uuid');

class DroneController {
  static async listDrones(req, res) {
    try {
      const { owner_id, status, page = 1, limit = 20 } = req.query;

      const drones = [
        {
          id: 1,
          serial_number: 'DJI-M300-001',
          model: 'Matrice 300 RTK',
          manufacturer: 'DJI',
          owner_id: 1,
          battery_capacity: 5050,
          max_flight_time: 1800,
          max_speed: 20,
          max_altitude: 7000,
          status: 'active',
          created_at: new Date()
        }
      ];

      res.status(200).json({
        data: drones,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: drones.length,
          pages: Math.ceil(drones.length / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        error: { code: 'SERVER_ERROR', message: error.message }
      });
    }
  }

  static async getDroneDetail(req, res) {
    try {
      const { id } = req.params;

      const drone = {
        id,
        serial_number: 'DJI-M300-001',
        model: 'Matrice 300 RTK',
        manufacturer: 'DJI',
        owner_id: 1,
        battery_capacity: 5050,
        max_flight_time: 1800,
        max_speed: 20,
        max_altitude: 7000,
        status: 'active',
        created_at: new Date()
      };

      res.status(200).json(drone);
    } catch (error) {
      res.status(500).json({
        error: { code: 'SERVER_ERROR', message: error.message }
      });
    }
  }

  static async getDroneStatus(req, res) {
    try {
      const { id } = req.params;

      const status = {
        id,
        is_connected: true,
        location: {
          latitude: 37.4979,
          longitude: 127.0276,
          altitude: 150.5
        },
        battery: {
          percentage: 85.5,
          voltage: 50.4,
          current: 12.3
        },
        gps: {
          satellites: 12,
          hdop: 0.8,
          vdop: 1.2
        },
        radio: {
          rssi: -85,
          noise: -100,
          remrssi: -92
        },
        attitude: {
          roll: 0.5,
          pitch: 0.3,
          yaw: 45.0
        },
        speed: 5.2,
        timestamp: new Date().toISOString()
      };

      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({
        error: { code: 'SERVER_ERROR', message: error.message }
      });
    }
  }

  static async createDrone(req, res) {
    try {
      const { serial_number, model, manufacturer, battery_capacity, max_flight_time, max_speed, max_altitude } = req.body;

      if (!serial_number || !model) {
        return res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'serial_number과 model은 필수입니다' }
        });
      }

      const newDrone = {
        id: uuidv4(),
        serial_number,
        model,
        manufacturer: manufacturer || '',
        battery_capacity: battery_capacity || 0,
        max_flight_time: max_flight_time || 0,
        max_speed: max_speed || 0,
        max_altitude: max_altitude || 0,
        owner_id: req.user?.id || 1,
        created_at: new Date()
      };

      res.status(201).json(newDrone);
    } catch (error) {
      res.status(500).json({
        error: { code: 'SERVER_ERROR', message: error.message }
      });
    }
  }

  static async updateDrone(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedDrone = { id, ...updateData, updated_at: new Date() };

      res.status(200).json(updatedDrone);
    } catch (error) {
      res.status(500).json({
        error: { code: 'SERVER_ERROR', message: error.message }
      });
    }
  }

  static async deleteDrone(req, res) {
    try {
      const { id } = req.params;
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        error: { code: 'SERVER_ERROR', message: error.message }
      });
    }
  }
}

module.exports = DroneController;
