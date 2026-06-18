#!/bin/bash

# SOONDRONE GCS Setup Script
# 초기 환경 설정을 자동으로 수행합니다.

set -e

echo "🚀 SOONDRONE GCS 초기 설정 시작..."
echo ""

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 체크 함수
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 설치됨"
        return 0
    else
        echo -e "${RED}✗${NC} $1 설치 필요"
        return 1
    fi
}

# 1. 필수 프로그램 확인
echo "📋 필수 프로그램 확인..."
check_command "git"
check_command "docker"
check_command "docker-compose"
check_command "node"
echo ""

# 2. 환경 파일 설정
echo "⚙️  환경 파일 생성..."
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓${NC} backend/.env 생성됨"
else
    echo -e "${YELLOW}⚠${NC} backend/.env 이미 존재합니다"
fi

if [ ! -f "admin-dashboard/.env" ]; then
    cp admin-dashboard/.env.example admin-dashboard/.env
    echo -e "${GREEN}✓${NC} admin-dashboard/.env 생성됨"
else
    echo -e "${YELLOW}⚠${NC} admin-dashboard/.env 이미 존재합니다"
fi
echo ""

# 3. 백엔드 설정
echo "📦 백엔드 초기화..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "npm 패키지 설치 중..."
    npm install
    echo -e "${GREEN}✓${NC} 백엔드 패키지 설치 완료"
else
    echo -e "${YELLOW}⚠${NC} node_modules 이미 존재합니다"
fi
cd ..
echo ""

# 4. 웹 대시보드 설정
echo "💻 웹 대시보드 초기화..."
cd admin-dashboard
if [ ! -d "node_modules" ]; then
    echo "npm 패키지 설치 중..."
    npm install
    echo -e "${GREEN}✓${NC} 웹 대시보드 패키지 설치 완료"
else
    echo -e "${YELLOW}⚠${NC} node_modules 이미 존재합니다"
fi
cd ..
echo ""

# 5. Docker 시작
echo "🐳 Docker 서비스 시작..."
if command -v docker-compose &> /dev/null; then
    docker-compose up -d
    echo -e "${GREEN}✓${NC} Docker 서비스 시작됨"
    echo ""
    echo "📊 현재 실행 중인 서비스:"
    docker-compose ps
fi
echo ""

# 완료 메시지
echo -e "${GREEN}✅ 초기 설정 완료!${NC}"
echo ""
echo "🎯 다음 단계:"
echo "  1. 백엔드: cd backend && npm run dev"
echo "  2. 웹 대시보드: cd admin-dashboard && npm start"
echo ""
echo "📚 문서:"
echo "  - 아키텍처: docs/ARCHITECTURE.md"
echo "  - 설치 가이드: docs/SETUP_GUIDE.md"
echo "  - API 명세: docs/API_SPEC.md"
echo ""
echo "💬 문제 발생 시: https://github.com/kimbutter630/SOONDRONE-GCS/issues"
