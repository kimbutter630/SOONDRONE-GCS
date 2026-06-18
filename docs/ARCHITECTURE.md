# SOONDRONE GCS 아키텍처 설계

## 시스템 전체 구조

```
┌─────────────────────────────────────────────────────────────┐
│                    드론 (Drone)                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  FC (Flight Controller): Pixhawk/Cube Orange         │  │
│  │  - MAVLink 프로토콜 지원                             │  │
│  │  - ArduPilot/PX4 펌웨어                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
    ┌────────┐        ┌─────────┐      ┌──────────┐
    │ 텔레메트리 │      │ 카메라    │      │ 살포장비  │
    │ 모듈    │        │ 모듈     │      │ 센서     │
    └────────┘        └─────────┘      └──────────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
         ┌─────────────┐          ┌──────────────┐
         │  조종기      │          │  지상통제소   │
         │ (RC Remote) │          │  (GCS App)   │
         │ MK15/VD32   │          │  Android     │
         └─────────────┘          └──────────────┘
              │                         │
              └─────────────┬───────────┘
                            │
                  ┌─────────┴─────────┐
                  ▼                   ▼
            ┌──────────┐        ┌──────────────┐
            │ Telemetry│        │   Backend    │
            │ Log Upload      │   Server     │
            └──────────┘        └──────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
         ┌─────────────┐        ┌──────────┐          ┌──────────┐
         │ PostgreSQL  │        │ API      │          │ WebSocket│
         │ (PostGIS)   │        │ Server   │          │ Server   │
         └─────────────┘        └──────────┘          └──────────┘
              │                       │                       │
              └───────────────────────┼───────────────────────┘
                                      │
                           ┌──────────┴──────────┐
                           ▼                     ▼
                      ┌──────────────┐     ┌──────────────┐
                      │ Admin        │     │ Mobile Web   │
                      │ Dashboard    │     │ Interface    │
                      │ (React/Vue)  │     │ (React)      │
                      └──────────────┘     └──────────────┘
```

## 모듈별 상세 설계

### 1. 안드로이드 GCS (Qt/QML)

#### 디렉토리 구조
```
gcs-android/
├── CMakeLists.txt
├── src/
│   ├── core/
│   │   ├── mavlink_handler.h/cpp      # MAVLink 통신 관리
│   │   ├── telemetry_manager.h/cpp    # 텔레메트리 수집 및 관리
│   │   ├── vehicle_controller.h/cpp   # 드론 제어 명령
│   │   ├── mission_planner.h/cpp      # 미션 계획 및 웨이포인트
│   │   └── survey_algorithm.h/cpp     # 자동 방제 경로 생성
│   ├── ui/
│   │   ├── qml/
│   │   │   ├── MainWindow.qml         # 메인 윈도우
│   │   │   ├── DashboardView.qml      # 대시보드 (텔레메트리)
│   │   │   ├── CameraView.qml         # 카메라 영상
│   │   │   ├── MapView.qml            # 지도 및 지적도
│   │   │   ├── ControlPanel.qml       # 비행 제어 패널
│   │   │   ├── SettingsPanel.qml      # 설정 패널
│   │   │   └── components/            # 재사용 가능한 컴포넌트
│   │   └── custom_widgets.h/cpp       # 커스텀 UI 위젯
│   ├── plugins/
│   │   ├── vworld_map_provider.h/cpp  # Vworld 지적도
│   │   ├── gstreamer_integration.h    # GStreamer 통합
│   │   └── remote_controller.h/cpp    # 조종기 연동
│   ├── network/
│   │   ├── telemetry_link.h/cpp       # 텔레메트리 링크
│   │   └── auth_client.h/cpp          # API 인증
│   └── main.cpp
├── android/
│   ├── AndroidManifest.xml
│   ├── build.gradle
│   └── src/
│       └── TelemetryService.java      # 백그라운드 서비스
├── resources/
│   └── qml.qrc
└── README.md
```

#### 주요 클래스 설계

**MAVLinkHandler**
```cpp
class MAVLinkHandler {
    void openConnection(const QString& portOrIP, int baudrate);
    void closeConnection();
    void sendMessage(const mavlink_message_t& message);
    void onMessageReceived(const mavlink_message_t& message);
    
    signals:
        void telemetryUpdated(const TelemetryData& data);
        void errorOccurred(const QString& error);
};
```

**VehicleController**
```cpp
class VehicleController {
    void arm();
    void disarm();
    void takeoff(float altitude);
    void land();
    void setThrottle(float value);  // 0-100%
    void setPumpIntensity(float intensity);  // 액제 펌프
    void setGranuleRotation(float rpm);      // 입제 살포기
    void uploadMission(const QList<Waypoint>& waypoints);
    void startMission();
    void pauseMission();
    void resumeMission();
};
```

**SurveyAlgorithm**
```cpp
class SurveyAlgorithm {
    // 지적도 경계(Polygon)에서 자동으로 지그재그 경로 생성
    QList<Waypoint> generateGridPath(
        const QPolygonF& fieldBoundary,
        float swathWidth,              // 노즐 폭 (미터)
        float flightAltitude,          // 비행 고도
        float flightSpeed,             // 비행 속도
        SweepDirection direction       // 비행 방향
    );
};
```

### 2. 백엔드 API 서버 (Node.js/Express)

#### 디렉토리 구조
```
backend/
├── package.json
├── .env.example
├── docker-compose.yml
├── src/
│   ├── server.js              # 메인 서버 엔트리
│   ├── config/
│   │   ├── database.js        # DB 연결 설정
│   │   ├── auth.js            # 인증 설정 (JWT)
│   │   └── constants.js       # 상수 정의
│   ├── models/
│   │   ├── User.js            # 사용자 모델
│   │   ├── Drone.js           # 드론 기체 모델
│   │   ├── Mission.js         # 미션 모델
│   │   └── TelemetryLog.js    # 텔레메트리 로그 모델
│   ├── routes/
│   │   ├── auth.js            # 인증 라우트
│   │   ├── users.js           # 사용자 관리
│   │   ├── drones.js          # 드론 관리
│   │   ├── missions.js        # 미션 관리
│   │   └── telemetry.js       # 텔레메트리 데이터
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── droneController.js
│   │   ├── missionController.js
│   │   └── telemetryController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT 검증
│   │   ├── errorHandler.js    # 에러 처리
│   │   └── validation.js      # 입력 검증
│   ├── utils/
│   │   ├── db.js              # 데이터베이스 유틸
│   │   ├── mavlink_parser.js  # MAVLink 파싱
│   │   └── gis_processor.js   # GIS 데이터 처리
│   └── services/
│       ├── telemetryService.js    # 텔레메트리 처리
│       └── missionService.js      # 미션 관리 로직
└── tests/
    ├── unit/
    └── integration/
```

#### 주요 API 엔드포인트

```
인증
POST   /api/auth/register      # 회원가입
POST   /api/auth/login         # 로그인
POST   /api/auth/refresh       # 토큰 갱신

사용자 관리
GET    /api/users              # 사용자 목록 (관리자)
GET    /api/users/:id          # 사용자 상세
PUT    /api/users/:id          # 사용자 수정
DELETE /api/users/:id          # 사용자 삭제
PUT    /api/users/:id/role     # 권한 설정

드론 관리
GET    /api/drones             # 드론 목록
POST   /api/drones             # 드론 등록
GET    /api/drones/:id         # 드론 상세
PUT    /api/drones/:id         # 드론 정보 수정
DELETE /api/drones/:id         # 드론 삭제
GET    /api/drones/:id/status  # 드론 실시간 상태

미션 관리
GET    /api/missions           # 미션 목록
POST   /api/missions           # 미션 생성
GET    /api/missions/:id       # 미션 상세
PUT    /api/missions/:id       # 미션 수정
DELETE /api/missions/:id       # 미션 삭제
POST   /api/missions/:id/start # 미션 시작
POST   /api/missions/:id/stop  # 미션 중지

텔레메트리 로그
GET    /api/telemetry         # 텔레메트리 데이터 조회
POST   /api/telemetry         # 텔레메트리 데이터 업로드
GET    /api/telemetry/:id     # 특정 로그 상세
```

### 3. 관리자 대시보드 (React)

#### 디렉토리 구조
```
admin-dashboard/
├── package.json
├── .env.example
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── index.js
│   ├── App.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx       # 메인 대시보드
│   │   ├── Login.jsx           # 로그인
│   │   ├── Users.jsx           # 사용자 관리
│   │   ├── Drones.jsx          # 드론 관리
│   │   ├── Missions.jsx        # 미션 이력
│   │   ├── Analytics.jsx       # 통계 및 분석
│   │   └── Settings.jsx        # 시스템 설정
│   ├── components/
│   │   ├── UserManagement/
│   │   │   ├── UserList.jsx
│   │   │   ├── UserDetail.jsx
│   │   │   └── UserApproval.jsx
│   │   ├── DroneManagement/
│   │   │   ├── DroneList.jsx
│   │   │   ├── DroneDetail.jsx
│   │   │   └── DroneStatus.jsx
│   │   ├── MissionHistory/
│   │   │   ├── MissionList.jsx
│   │   │   ├── MissionDetail.jsx
│   │   │   ├── MissionMap.jsx
│   │   │   └── FlightReplay.jsx
│   │   ├── MapVisualization/
│   │   │   ├── LeafletMap.jsx
│   │   │   ├── FlightTrack.jsx
│   │   │   └── FieldBoundary.jsx
│   │   ├── Charts/
│   │   │   ├── BatteryChart.jsx
│   │   │   ├── SprayChart.jsx
│   │   │   └── SpeedChart.jsx
│   │   └── Common/
│   │       ├── Header.jsx
│   │       ├── Sidebar.jsx
│   │       └── Footer.jsx
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── droneSlice.js
│   │   │   ├── missionSlice.js
│   │   │   └── uiSlice.js
│   │   └── index.js
│   ├─�� api/
│   │   ├── client.js           # Axios 인스턴스
│   │   ├── auth.js             # 인증 API
│   │   ├── drones.js           # 드론 API
│   │   ├── missions.js         # 미션 API
│   │   └── telemetry.js        # 텔레메트리 API
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useDrones.js
│   │   └── useMissions.js
│   ├── utils/
│   │   ├── dateFormatter.js
│   │   ├── mapHelper.js
│   │   └── validators.js
│   ├── styles/
│   │   ├── index.css
│   │   └── themes.css
│   └── assets/
│       ├── images/
│       └── icons/
└── README.md
```

## 데이터베이스 스키마 (PostgreSQL + PostGIS)

### 주요 테이블

```sql
-- 사용자 테이블
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'operator', 'viewer') DEFAULT 'operator',
    status ENUM('pending', 'active', 'suspended') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 드론 테이블
CREATE TABLE drones (
    id SERIAL PRIMARY KEY,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    model VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100),
    owner_id INT REFERENCES users(id),
    battery_capacity FLOAT,
    max_flight_time FLOAT,
    max_speed FLOAT,
    max_altitude FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 미션 테이블
CREATE TABLE missions (
    id SERIAL PRIMARY KEY,
    drone_id INT REFERENCES drones(id),
    operator_id INT REFERENCES users(id),
    field_boundary GEOMETRY(POLYGON),  -- PostGIS
    mission_type ENUM('spray', 'survey', 'mapping'),
    status ENUM('planned', 'executing', 'completed', 'cancelled') DEFAULT 'planned',
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    total_area FLOAT,  -- m²
    total_spray_amount FLOAT,  -- L
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 웨이포인트 테이블
CREATE TABLE waypoints (
    id SERIAL PRIMARY KEY,
    mission_id INT REFERENCES missions(id),
    sequence INT,
    location GEOMETRY(POINT),  -- PostGIS
    altitude FLOAT,
    speed FLOAT,
    action VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 텔레메트리 로그 테이블
CREATE TABLE telemetry_logs (
    id SERIAL PRIMARY KEY,
    mission_id INT REFERENCES missions(id),
    drone_id INT REFERENCES drones(id),
    timestamp TIMESTAMP,
    location GEOMETRY(POINT),  -- PostGIS
    altitude FLOAT,
    speed FLOAT,
    battery_percentage FLOAT,
    gps_satellites INT,
    signal_strength FLOAT,
    pump_intensity FLOAT,
    granule_rpm FLOAT,
    temperature FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 통신 흐름

### 1. 로그인 흐름
```
GCS App
  ├─ 입력: username, password
  └─ POST /api/auth/login
       ├─ 검증
       ├─ JWT 토큰 발급
       └─ 응답: {access_token, refresh_token, user_data}
```

### 2. 텔레메트리 수집 및 업로드
```
Drone (FC)
  ├─ MAVLink 메시지 송신
  └─> 조종기 또는 GCS App (수신)
       ├─ 로컬 저장 (버퍼)
       └─> Backend Server
            └─ POST /api/telemetry
                 └─ 데이터베이스 저장
```

### 3. 웹소켓 실시간 업데이트
```
GCS App 또는 Web Dashboard
  ├─ WebSocket 연결
  └─> Backend Server
       ├─ 드론 상태 변경 감지
       └─ 실시간 푸시 (배터리, 위치, 상태)
```

## 보안 설계

1. **인증**: JWT (JSON Web Token)
   - Access Token (15분)
   - Refresh Token (7일)

2. **권한 제어**: Role-based Access Control (RBAC)
   - admin: 모든 권한
   - operator: 드론 조종, 미션 관리
   - viewer: 조회만 가능

3. **데이터 암호화**
   - 비밀번호: bcrypt 해싱
   - 통신: HTTPS/TLS
   - 민감 데이터: 데이터베이스 레벨 암호화

4. **API 보안**
   - Rate limiting
   - CORS 설정
   - Input validation
   - SQL injection 방지 (ORM 사용)

## 배포 전략

### 개발 환경
```bash
Docker Compose로 로컬 DB + API 서버 실행
```

### 프로덕션 환경
```bash
Kubernetes 또는 Docker Swarm
- Backend: 다중 인스턴스
- PostgreSQL: 주/보조 복제
- Redis: 캐싱 및 세션
- Nginx: 로드 밸런싱
```

---

이 아키텍처는 확장성, 안정성, 보안을 고려하여 설계되었습니다.
각 모듈은 독립적으로 개발/테스트할 수 있으며, API를 통해 느슨하게 결합됩니다.