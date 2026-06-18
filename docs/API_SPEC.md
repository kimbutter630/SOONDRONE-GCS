# SOONDRONE GCS API 명세서

## 개요

- **Base URL**: `https://api.soondrone.local/api`
- **인증**: JWT Bearer Token
- **응답 형식**: JSON
- **버전**: v1.0

---

## 인증 (Authentication)

### 회원가입
```http
POST /auth/register

Request Body:
{
  "username": "pilot_name",
  "email": "pilot@example.com",
  "password": "secure_password",
  "role": "operator"  # 선택: admin, operator, viewer
}

Response (201 Created):
{
  "id": 1,
  "username": "pilot_name",
  "email": "pilot@example.com",
  "role": "operator",
  "status": "pending",
  "created_at": "2026-06-18T10:30:00Z"
}
```

### 로그인
```http
POST /auth/login

Request Body:
{
  "username": "pilot_name",
  "password": "secure_password"
}

Response (200 OK):
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "expires_in": 900,  # 초 단위
  "user": {
    "id": 1,
    "username": "pilot_name",
    "email": "pilot@example.com",
    "role": "operator"
  }
}
```

### 토큰 갱신
```http
POST /auth/refresh

Request Body:
{
  "refresh_token": "eyJhbGc..."
}

Response (200 OK):
{
  "access_token": "eyJhbGc...",
  "expires_in": 900
}
```

---

## 사용자 관리 (Users)

### 사용자 목록 조회 (관리자)
```http
GET /users?status=pending&page=1&limit=20
Authorization: Bearer {access_token}

Response (200 OK):
{
  "data": [
    {
      "id": 1,
      "username": "pilot_name",
      "email": "pilot@example.com",
      "role": "operator",
      "status": "pending",
      "created_at": "2026-06-18T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "pages": 1
  }
}
```

### 사용자 상세 조회
```http
GET /users/:id
Authorization: Bearer {access_token}

Response (200 OK):
{
  "id": 1,
  "username": "pilot_name",
  "email": "pilot@example.com",
  "role": "operator",
  "status": "active",
  "drones": [1, 2],  # 소유 드론 ID
  "created_at": "2026-06-18T10:30:00Z",
  "updated_at": "2026-06-18T12:00:00Z"
}
```

### 사용자 권한 설정 (관리자)
```http
PUT /users/:id/role
Authorization: Bearer {access_token}

Request Body:
{
  "role": "operator",
  "status": "active"  # pending, active, suspended
}

Response (200 OK):
{
  "id": 1,
  "username": "pilot_name",
  "role": "operator",
  "status": "active"
}
```

---

## 드론 관리 (Drones)

### 드론 등록
```http
POST /drones
Authorization: Bearer {access_token}

Request Body:
{
  "serial_number": "DJI-12345",
  "model": "Matrice 300 RTK",
  "manufacturer": "DJI",
  "battery_capacity": 5050,  # mAh
  "max_flight_time": 1800,    # 초
  "max_speed": 20,            # m/s
  "max_altitude": 7000        # m
}

Response (201 Created):
{
  "id": 1,
  "serial_number": "DJI-12345",
  "model": "Matrice 300 RTK",
  "manufacturer": "DJI",
  "owner_id": 1,
  "battery_capacity": 5050,
  "max_flight_time": 1800,
  "max_speed": 20,
  "max_altitude": 7000,
  "created_at": "2026-06-18T10:30:00Z"
}
```

### 드론 목록 조회
```http
GET /drones?owner_id=1&status=active
Authorization: Bearer {access_token}

Response (200 OK):
{
  "data": [
    {
      "id": 1,
      "serial_number": "DJI-12345",
      "model": "Matrice 300 RTK",
      "owner": {
        "id": 1,
        "username": "pilot_name"
      },
      "status": "active"
    }
  ],
  "total": 1
}
```

### 드론 실시간 상태
```http
GET /drones/:id/status
Authorization: Bearer {access_token}

Response (200 OK):
{
  "id": 1,
  "is_connected": true,
  "location": {
    "latitude": 37.4979,
    "longitude": 127.0276,
    "altitude": 150.5
  },
  "battery": {
    "percentage": 85.5,
    "voltage": 50.4,
    "current": 12.3
  },
  "gps": {
    "satellites": 12,
    "hdop": 0.8,
    "vdop": 1.2
  },
  "radio": {
    "rssi": -85,  # dBm
    "noise": -100,
    "remrssi": -92
  },
  "attitude": {
    "roll": 0.5,
    "pitch": 0.3,
    "yaw": 45.0
  },
  "speed": 5.2,  # m/s
  "timestamp": "2026-06-18T10:30:00Z"
}
```

---

## 미션 관리 (Missions)

### 미션 생성
```http
POST /missions
Authorization: Bearer {access_token}

Request Body:
{
  "drone_id": 1,
  "mission_type": "spray",  # spray, survey, mapping
  "field_boundary": {
    "type": "Polygon",
    "coordinates": [[[
      [127.0276, 37.4979],
      [127.0286, 37.4979],
      [127.0286, 37.4989],
      [127.0276, 37.4989],
      [127.0276, 37.4979]
    ]]]
  },
  "waypoints": [
    {
      "sequence": 1,
      "latitude": 37.4979,
      "longitude": 127.0276,
      "altitude": 100,
      "speed": 10,
      "action": "WAYPOINT"
    }
  ],
  "spray_settings": {
    "pump_intensity": 80,  # 0-100
    "granule_rpm": 1500
  }
}

Response (201 Created):
{
  "id": 1,
  "drone_id": 1,
  "operator_id": 1,
  "mission_type": "spray",
  "status": "planned",
  "total_area": 5000,  # m²
  "waypoint_count": 15,
  "created_at": "2026-06-18T10:30:00Z"
}
```

### 자동 경로 생성 (Survey)
```http
POST /missions/generate-survey
Authorization: Bearer {access_token}

Request Body:
{
  "field_boundary": { ... },
  "swath_width": 15,        # 노즐 폭 (m)
  "flight_altitude": 100,   # m
  "flight_speed": 10,       # m/s
  "sweep_direction": "N-S"  # N-S, E-W, NE-SW, NW-SE
}

Response (200 OK):
{
  "waypoints": [
    {
      "sequence": 1,
      "latitude": 37.4979,
      "longitude": 127.0276,
      "altitude": 100,
      "speed": 10,
      "action": "WAYPOINT"
    },
    ...
  ],
  "total_distance": 2500,  # m
  "estimated_duration": 420,  # 초
  "estimated_coverage_area": 5000  # m²
}
```

### 미션 시작
```http
POST /missions/:id/start
Authorization: Bearer {access_token}

Response (200 OK):
{
  "id": 1,
  "status": "executing",
  "start_time": "2026-06-18T10:35:00Z"
}
```

### 미션 중지
```http
POST /missions/:id/stop
Authorization: Bearer {access_token}

Response (200 OK):
{
  "id": 1,
  "status": "completed",
  "end_time": "2026-06-18T11:15:00Z",
  "total_spray_amount": 12.5,  # L
  "actual_area_covered": 4950  # m²
}
```

---

## 텔레메트리 (Telemetry)

### 텔레메트리 데이터 업로드
```http
POST /telemetry
Authorization: Bearer {access_token}

Request Body:
{
  "mission_id": 1,
  "drone_id": 1,
  "data": [
    {
      "timestamp": "2026-06-18T10:35:00Z",
      "latitude": 37.4979,
      "longitude": 127.0276,
      "altitude": 100.5,
      "speed": 5.2,
      "battery_percentage": 85,
      "gps_satellites": 12,
      "signal_strength": -85,
      "pump_intensity": 80,
      "granule_rpm": 1500,
      "temperature": 25.3
    },
    ...
  ]
}

Response (201 Created):
{
  "id": 100,
  "mission_id": 1,
  "records_count": 120,
  "time_range": {
    "start": "2026-06-18T10:35:00Z",
    "end": "2026-06-18T11:15:00Z"
  },
  "created_at": "2026-06-18T11:20:00Z"
}
```

### 텔레메트리 데이터 조회
```http
GET /telemetry?mission_id=1&start_time=2026-06-18T10:00:00Z&end_time=2026-06-18T12:00:00Z
Authorization: Bearer {access_token}

Response (200 OK):
{
  "data": [
    {
      "timestamp": "2026-06-18T10:35:00Z",
      "latitude": 37.4979,
      "longitude": 127.0276,
      "altitude": 100.5,
      "speed": 5.2,
      "battery_percentage": 85,
      "gps_satellites": 12,
      "signal_strength": -85,
      "pump_intensity": 80,
      "granule_rpm": 1500,
      "temperature": 25.3
    },
    ...
  ],
  "total": 120
}
```

---

## 에러 응답

### 표준 에러 형식
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  }
}
```

### 에러 코드

| HTTP Status | Code | 설명 |
|-------------|------|------|
| 400 | VALIDATION_ERROR | 입력값 검증 실패 |
| 401 | UNAUTHORIZED | 인증 필요 |
| 403 | FORBIDDEN | 권한 없음 |
| 404 | NOT_FOUND | 리소스 없음 |
| 409 | CONFLICT | 중복 리소스 |
| 500 | SERVER_ERROR | 서버 오류 |

---

## WebSocket API (실시간 업데이트)

### 연결
```
ws://api.soondrone.local:3000/ws?token={access_token}
```

### 메시지 형식

**클라이언트 -> 서버**
```json
{
  "type": "subscribe",
  "channel": "drone:1",  # 드론 ID 구독
  "event": "telemetry"
}
```

**서버 -> 클라이언트**
```json
{
  "type": "message",
  "channel": "drone:1",
  "event": "telemetry",
  "data": {
    "timestamp": "2026-06-18T10:35:00Z",
    "latitude": 37.4979,
    "longitude": 127.0276,
    "battery_percentage": 85,
    ...
  }
}
```

---

## Rate Limiting

모든 API 요청은 다음 헤더로 제한됩니다:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1623985200
```

- 기본 제한: 1시간에 1000 요청
- 초과 시: 429 Too Many Requests

---

## 요청 예시

### cURL
```bash
# 로그인
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "pilot", "password": "pass"}'

# 드론 목록 조회
curl -X GET http://localhost:3000/api/drones \
  -H "Authorization: Bearer {token}"
```

### JavaScript (Fetch)
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'pilot', password: 'pass' })
});
const data = await response.json();
```

---

**마지막 업데이트**: 2026-06-18

자세한 사항은 [Swagger 문서](http://localhost:3000/api-docs)를 참고하세요.