// 인증 카트롤러
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

class AuthController {
  static async register(req, res) {
    try {
      const { username, email, password, role = 'operator' } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: '필수 필드가 누락되었습니다',
            details: { username, email, password }
          }
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: '유효한 이메일 형식이 아닙니다'
          }
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        id: uuidv4(),
        username,
        email,
        password_hash: hashedPassword,
        role,
        status: 'pending',
        created_at: new Date()
      });

      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        created_at: user.created_at
      });
    } catch (error) {
      res.status(500).json({
        error: {
          code: 'SERVER_ERROR',
          message: error.message
        }
      });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: '사용자명과 비밀번호가 필요합니다'
          }
        });
      }

      const accessToken = jwt.sign(
        { userId: 'user_id', username, role: 'operator' },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRE || '15m' }
      );

      const refreshToken = jwt.sign(
        { userId: 'user_id' },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
      );

      res.status(200).json({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 900,
        user: {
          id: 'user_id',
          username,
          email: 'user@example.com',
          role: 'operator'
        }
      });
    } catch (error) {
      res.status(500).json({
        error: {
          code: 'SERVER_ERROR',
          message: error.message
        }
      });
    }
  }

  static async refreshToken(req, res) {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'refresh_token이 필요합니다'
          }
        });
      }

      try {
        const decoded = jwt.verify(
          refresh_token,
          process.env.JWT_SECRET || 'secret'
        );

        const accessToken = jwt.sign(
          { userId: decoded.userId },
          process.env.JWT_SECRET || 'secret',
          { expiresIn: process.env.JWT_EXPIRE || '15m' }
        );

        res.status(200).json({
          access_token: accessToken,
          expires_in: 900
        });
      } catch (err) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: '토큰이 유효하지 않습니다'
          }
        });
      }
    } catch (error) {
      res.status(500).json({
        error: {
          code: 'SERVER_ERROR',
          message: error.message
        }
      });
    }
  }
}

module.exports = AuthController;
