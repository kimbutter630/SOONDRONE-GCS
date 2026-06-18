// 드론 관리 라우트 (기본 구조)
const express = require('express');
const router = express.Router();

// GET /api/drones
router.get('/', (req, res) => {
  // TODO: 드론 목록 조회 로직 구현
  res.status(200).json({
    data: [],
    total: 0
  });
});

// POST /api/drones
router.post('/', (req, res) => {
  // TODO: 드론 등록 로직 구현
  res.status(201).json({
    message: 'Drone registration endpoint',
    body: req.body
  });
});

// GET /api/drones/:id
router.get('/:id', (req, res) => {
  // TODO: 드론 상세 조회 로직 구현
  res.status(200).json({
    id: req.params.id,
    message: 'Drone detail endpoint'
  });
});

// GET /api/drones/:id/status
router.get('/:id/status', (req, res) => {
  // TODO: 드론 실시간 상태 조회 로직 구현
  res.status(200).json({
    id: req.params.id,
    is_connected: false,
    location: { latitude: 0, longitude: 0, altitude: 0 },
    battery: { percentage: 0, voltage: 0, current: 0 },
    gps: { satellites: 0, hdop: 0, vdop: 0 },
    radio: { rssi: 0, noise: 0, remrssi: 0 },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
