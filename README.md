# SOONDRONE GCS System

농업용 드론 지상통제소(Ground Control Station) 시스템

QGroundControl(QGC) 기반 안드로이드 GCS 앱과 관리자 홈페이지를 통합한 농업용 방제 드론 전용 통제 시스템

## 📋 프로젝트 개요

### 핵심 목표
- **농업용 방제 드론 특화 GCS** - 액제 펌프, 입제 살포기 제어
- **지적도 기반 자동 방제** - Vworld 지적도 API 연동
- **조종기 통합 지원** - MK15, VD32, UniRc7 텔레메트리 연결
- **중앙집중식 관리** - 관리자 대시보드를 통한 드론/사용자/작업 이력 관리

## 🏗️ 프로젝트 구조

```
SOONDRONE-GCS/
├── gcs-android/              # 안드로이드 GCS (Qt/QML + C++)
├── admin-dashboard/          # 관리자 홈페이지 (React/Vue.js)
├── backend/                  # API 서버 (Node.js/Spring Boot)
├── docs/                     # 기술 문서
├── scripts/                  # 설치 및 유틸리티 스크립트
└── README.md
```

## 🛠️ 기술 스택

### 안드로이드 GCS
- **프레임워크**: Qt 5.15+ (C++/QML)
- **통신 프로토콜**: MAVLink
- **영상 스트리밍**: GStreamer
- **맵 서비스**: Vworld 지적도 API
- **조종기 연동**: USB, Bluetooth, Wi-Fi/UDP

### 관리자 대시보드
- **프론트엔드**: React 18+ 또는 Vue.js 3+
- **상태 관리**: Redux / Pinia
- **지도 시각화**: Leaflet + Kakao Maps API
- **UI 라이브러리**: Material-UI / Tailwind CSS

### 백엔드 서버
- **런타임**: Node.js 18+ 또는 Python 3.9+
- **프레임워크**: Express.js 또는 FastAPI
- **데이터베이스**: PostgreSQL 13+ (PostGIS 확장팩)
- **인증**: JWT (JSON Web Token)
- **API 문서**: Swagger/OpenAPI

## 📦 주요 기능

### Phase 1: 기본 GCS 기능
- [ ] 배터리, GPS, 송수신기 감도 실시간 모니터링
- [ ] 카메라 영상 스트리밍 (RTSP/UDP)
- [ ] 조종기 텔레메트리 연결 (MK15, VD32, UniRc7)
- [ ] 비행 경로 계획 및 수동 조종
- [ ] 사용자 로그인/회원가입

### Phase 2: 농업용 특화 기능
- [ ] 액제 펌프/입제 살포기 제어 UI
- [ ] Vworld 지적도 통합
- [ ] Survey 알고리즘 (자동 방제 경로 생성)
- [ ] 작업 파라미터 설정 (살포량, 속도 등)

### Phase 3: 관리자 대시보드
- [ ] 회원 관리 시스템 (승인, 권한)
- [ ] 드론 및 장비 관리
- [ ] 방제 이력 데이터 시각화
- [ ] 비행 경로 재생 및 분석

### Phase 4: 통합 및 최적화
- [ ] 성능 테스트
- [ ] 보안 감사
- [ ] 배포 자동화 (CI/CD)

## 🚀 빠른 시작

### 전제 조건
- Git
- Docker & Docker Compose
- Node.js 18+ (또는 Python 3.9+)
- Qt Creator 5.15+

### 설치

#### 1. 저장소 복제
```bash
git clone https://github.com/kimbutter630/SOONDRONE-GCS.git
cd SOONDRONE-GCS
```

#### 2. 환경 설정
```bash
cp backend/.env.example backend/.env
cp admin-dashboard/.env.example admin-dashboard/.env
```

#### 3. Docker 환경 실행
```bash
cd backend
docker-compose up -d
```

#### 4. 각 모듈별 설치

**백엔드 서버**
```bash
cd backend
npm install
npm run dev
```

**관리자 대시보드**
```bash
cd admin-dashboard
npm install
npm start
```

**안드로이드 GCS**
```bash
cd gcs-android
qt-cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
```

자세한 설정 가이드는 [SETUP_GUIDE.md](docs/SETUP_GUIDE.md)를 참고하세요.

## 📚 문서

- [아키텍처 설계](docs/ARCHITECTURE.md)
- [설치 및 빌드 가이드](docs/SETUP_GUIDE.md)
- [API 명세서](docs/API_SPEC.md)
- [MAVLink 통신 가이드](docs/MAVLINK_GUIDE.md)
- [Vworld 지적도 연동](docs/VWORLD_INTEGRATION.md)

## 🔧 개발 가이드

### 브랜치 전략
```
main                    # 안정화된 릴리즈 버전
├── develop            # 개발 진행 중
├── feature/*          # 기능 개발
├── bugfix/*           # 버그 수정
└── release/*          # 릴리즈 준비
```

### 커밋 메시지 규칙
```
[타입] 제목

body (선택사항)
footer (선택사항)

타입: feat, fix, docs, style, refactor, test, chore
```

예시:
```
[feat] Add MAVLink telemetry handler

Implement MAVLink message parsing for battery, GPS, and radio status.
Supports Pixhawk FC and ArduPilot firmware.

Closes #12
```

## 📋 이슈 및 PR

이슈 생성 시 다음 템플릿을 사용해주세요:
- **버그 리포트**: 문제 재현 방법, 예상 동작, 실제 동작
- **기능 요청**: 사용 시나리오, 예상 효과, 구현 방안

PR 병합 조건:
- [ ] 테스트 코드 작성
- [ ] 기존 테스트 통과
- [ ] 코드 리뷰 승인
- [ ] 문서 업데이트

## 🔐 보안

- 민감한 정보(API 키, 패스워드)는 `.env` 파일에서 관리
- 모든 API 요청에 JWT 토큰 인증 필수
- HTTPS 사용 권장
- 데이터베이스 암호화

## 📞 기술 지원

질문이나 버그 리포트는 [GitHub Issues](https://github.com/kimbutter630/SOONDRONE-GCS/issues)에서 해주세요.

## 📄 라이선스

[MIT License](LICENSE)

## 👥 팀

- **프로젝트 관리자**: kimbutter630

---

**마지막 업데이트**: 2026-06-18