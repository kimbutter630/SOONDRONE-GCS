// 사용자 관리 라우트 (기본 구조)
const express = require('express');
const router = express.Router();

// GET /api/users
router.get('/', (req, res) => {
  // TODO: 사용자 목록 조회 로직 구현
  res.status(200).json({
    data: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0
    }
  });
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  // TODO: 특정 사용자 조회 로직 구현
  res.status(200).json({
    id: req.params.id,
    message: 'User detail endpoint'
  });
});

// PUT /api/users/:id/role
router.put('/:id/role', (req, res) => {
  // TODO: 사용자 역할 및 상태 업데이트 로직 구현
  res.status(200).json({
    message: 'User role update endpoint',
    id: req.params.id,
    body: req.body
  });
});

module.exports = router;
