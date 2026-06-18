# SOONDRONE GCS 설치 및 빌드 가이드

## 📋 전제 조건

### 시스템 요구사항
- **OS**: Windows 10/11, macOS 11+, Linux (Ubuntu 20.04+)
- **RAM**: 최소 8GB (권장 16GB)
- **디스크**: 최소 20GB 여유 공간

### 필수 소프트웨어

#### 공통
- Git
- Docker & Docker Compose
- 텍스트 에디터 또는 IDE (VS Code, IntelliJ IDEA 등)

#### 백엔드 개발
- Node.js 18+ 또는 Python 3.9+
- npm 또는 yarn (Node.js의 경우)

#### 안드로이드 GCS 개발
- Qt Creator 5.15+
- Qt 5.15 SDK
- Android NDK (API 28+)
- Android SDK (API 28+)
- CMake 3.16+

#### 웹 대시보드 개발
- Node.js 18+
- npm 또는 yarn

---

## 🚀 빠른 시작 (5분)

### 1단계: 저장소 복제
```bash
git clone https://github.com/kimbutter630/SOONDRONE-GCS.git
cd SOONDRONE-GCS
```

### 2단계: 환경 파일 설정
```bash
cp backend/.env.example backend/.env
cp admin-dashboard/.env.example admin-dashboard/.env
```

### 3단계: Docker로 백엔드 실행
```bash
cd backend
docker-compose up -d
```

이제 다음 주소에서 접근 가능합니다:
- **API 서버**: http://localhost:3000
- **PostgreSQL**: localhost:5432

---

## 📦 개별 모듈 설치

### A. 백엔드 서버 (Node.js)

#### 설치
```bash
cd backend
npm install
```

#### 환경 변수 설정
```bash
cp .env.example .env
```

`.env` 파일 편집:
```env
# 데이터베이스
DB_HOST=localhost
DB_PORT=5432
DB_NAME=soondrone_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# 서버
NODE_ENV=development
PORT=3000

# Vworld API
VWORLD_API_KEY=your_vworld_api_key
```

#### 데이터베이스 초기화
```bash
npm run migrate
npm run seed
```

#### 실행

**개발 모드** (hot reload)
```bash
npm run dev
```

**프로덕션 모드**
```bash
npm run build
npm run start
```

#### 테스트
```bash
npm test
npm run test:coverage
```

---

### B. 관리자 대시보드 (React)

#### 설치
```bash
cd admin-dashboard
npm install
```

#### 환경 변수 설정
```bash
cp .env.example .env
```

`.env` 파일 편집:
```env
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
REACT_APP_KAKAO_MAP_KEY=your_kakao_map_key
```

#### 실행

**개발 모드**
```bash
npm start
```

브라우저: http://localhost:3000

**프로덕션 빌드**
```bash
npm run build
```

빌드 결과는 `build/` 디렉토리에 생성됩니다.

#### 테스트
```bash
npm test
npm run test:coverage
```

---

### C. 안드로이드 GCS (Qt/C++)

#### 1. Qt Creator 설정

1. **Qt Creator 다운로드 및 설치**
   - https://www.qt.io/download-open-source
   - Qt 5.15.x 선택

2. **Qt for Android 설치**
   - Qt Creator 메뉴: Help > About Qt Creator > Show Details
   - 또는 Qt Creator 내 SDK Manager에서 Android 컴포넌트 설치

3. **Android SDK/NDK 설정**
   - Qt Creator > Tools > Options > Devices > Android
   - SDK Manager, NDK, Java Development Kit 경로 설정

#### 2. 프로젝트 빌드

```bash
cd gcs-android
```

**명령어 빌드**
```bash
mkdir build && cd build
qt-cmake -DCMAKE_BUILD_TYPE=Release ..
cmake --build . --parallel
```

**APK 생성**
```bash
qt-cmake -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_TOOLCHAIN_FILE=$ANDROID_NDK/build/cmake/android.toolchain.cmake \
  -DANDROID_PLATFORM=android-28 \
  -DANDROID_ABI=armeabi-v7a \
  ..
```

#### 3. Qt Creator로 빌드 및 실행

1. Qt Creator에서 `gcs-android/CMakeLists.txt` 오픈
2. 좌측 Kit 선택에서 "Android (arm64-v8a)" 선택
3. 빌드 버튼 클릭 (Ctrl+B)
4. 실행 버튼으로 에뮬레이터 또는 디바이스에 배포

#### 4. 테스트

```bash
cd gcs-android
ctest --verbose
```

---

## 🐳 Docker를 이용한 통합 실행

### Docker Compose 실행

```bash
docker-compose up -d
```

#### docker-compose.yml 예시
```yaml
version: '3.8'
services:
  postgres:
    image: postgis/postgis:15-3.3
    environment:
      POSTGRES_DB: soondrone_db
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DB_HOST: postgres
      NODE_ENV: development
    depends_on:
      - postgres

  admindashboard:
    build: ./admin-dashboard
    ports:
      - "3001:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 종료
```bash
docker-compose down
```

---

## 🔍 개발 중 유용한 명령어

### 백엔드
```bash
# 데이터베이스 마이그레이션
npm run migrate:latest
npm run migrate:rollback

# 데이터베이스 시드
npm run seed

# 린트
npm run lint
npm run lint:fix

# 포맷팅
npm run format
```

### 웹 대시보드
```bash
# 빌드 최적화 분석
npm run analyze

# Storybook (컴포넌트 문서)
npm run storybook
```

### 안드로이드 GCS
```bash
# 정적 분석
cmake --build . --target lint

# 코드 포맷팅
clang-format -i src/**/*.cpp src/**/*.h
```

---

## 🐛 문제 해결

### 포트 충돌

**문제**: Port 3000 already in use

**해결**:
```bash
# 포트 사용 중인 프로세스 찾기
lsof -i :3000

# 프로세스 종료
kill -9 <PID>

# 또는 다른 포트 사용
PORT=3001 npm run dev
```

### 데이터베이스 연결 실패

**문제**: Connection refused to PostgreSQL

**해결**:
```bash
# Docker 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs postgres

# 재시작
docker-compose restart postgres
```

### Node 모듈 오류

**문제**: Module not found

**해결**:
```bash
# 캐시 정리
rm -rf node_modules package-lock.json
npm install
```

### Qt 빌드 오류

**문제**: CMake not found

**해결**:
```bash
# CMake 설치
brew install cmake  # macOS
sudo apt-get install cmake  # Linux
choco install cmake  # Windows

# Qt 경로 설정
export PATH=/path/to/qt/bin:$PATH
```

---

## 📚 다음 단계

1. [아키텍처 문서](ARCHITECTURE.md) 읽기
2. [API 명세서](API_SPEC.md) 확인
3. 첫 번째 이슈 생성 및 개발 시작

---

**문제가 발생하면 [GitHub Issues](https://github.com/kimbutter630/SOONDRONE-GCS/issues)에 질문해주세요!**