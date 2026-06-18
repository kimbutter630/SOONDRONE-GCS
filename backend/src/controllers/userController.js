// 사용자 카트롤러
const { v4: uuidv4 } = require('uuid');

class UserController {
  static async listUsers(req, res) {
    try {
      const { status, role, page = 1, limit = 20 } = req.query;

      const users = [
        {
          id: 1,
          username: 'admin',
          email: 'admin@soondrone.local',
          role: 'admin',
          status: 'active',
          created_at: new Date()
        },
        {
          id: 2,
          username: 'pilot1',
          email: 'pilot1@soondrone.local',
          role: 'operator',
          status: 'active',
          created_at: new Date()
        }
      ];

      res.status(200).json({
        data: users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: users.length
        }
      });
    } catch (error) {
      res.status(500).json({
        error: { code: 'SERVER_ERROR', message: error.message }
      });
    }
  }

  static async getUserDetail(req, res) {
    try {
      const { id } = req.params;

      const user = {
        id,
        username: 'pilot1',
        email: 'pilot1@soondrone.local',
        role: 'operator',
        status: 'active',
        drones: [1, 2],
        created_at: new Date()
      };

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        error: { code: 'SERVER_ERROR', message: error.message }
      });
    }
  }

  static async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role, status } = req.body;

      if (!role || !status) {
        return res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: '역할과 상태가 필요합니다' }
        });
      }

      res.status(200).json({
        id,
        role,
        status,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        error: { code: 'SERVER_ERROR', message: error.message }
      });
    }
  }

  static async deleteUser(req, res) {
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

module.exports = UserController;
