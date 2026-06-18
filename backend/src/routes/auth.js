// 인증 라우트 (기본 구조)
const express = require('express');
const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  // TODO: 회원가입 로직 구현
  res.status(201).json({
    message: 'User registration endpoint',
    body: req.body
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  // TODO: 로그인 로직 구현
  res.status(200).json({
    message: 'User login endpoint',
    access_token: 'placeholder_token',
    refresh_token: 'placeholder_refresh_token',
    expires_in: 900
  });
});

// POST /api/auth/refresh
router.post('/refresh', (req, res) => {
  // TODO: 토큰 갱신 로직 구현
  res.status(200).json({
    message: 'Token refresh endpoint',
    access_token: 'new_placeholder_token',
    expires_in: 900
  });
});

module.exports = router;
