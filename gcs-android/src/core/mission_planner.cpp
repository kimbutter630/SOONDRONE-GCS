#include "mission_planner.h"
#include <cmath>
#include <algorithm>
#include <QDebug>

const float EARTH_RADIUS_M = 6371000.0f; // 미터 단위

MissionPlanner::MissionPlanner(QObject *parent)
    : QObject(parent)
{
}

QList<Waypoint> MissionPlanner::generateSurveyPath(
    const QList<QPointF> &fieldBoundary,
    float swathWidth,
    float flightAltitude,
    float flightSpeed,
    const QString &sweepDirection)
{
    QList<Waypoint> waypoints;
    
    if (fieldBoundary.size() < 3) {
        qWarning() << "Field boundary must have at least 3 points";
        return waypoints;
    }
    
    // 스윕 방향에 따른 격자선 생성
    bool isNorthSouth = (sweepDirection == "N-S" || sweepDirection == "NE-SW");
    QList<QPointF> gridLines = generateGridLines(fieldBoundary, swathWidth, isNorthSouth);
    
    int sequence = 0;
    
    // 첫 번째 웨이포인트 (홈 포지션)
    Waypoint homeWP;
    homeWP.sequence = sequence++;
    homeWP.latitude = fieldBoundary[0].y();
    homeWP.longitude = fieldBoundary[0].x();
    homeWP.altitude = flightAltitude;
    homeWP.speed = flightSpeed;
    homeWP.action = "TAKEOFF";
    waypoints.append(homeWP);
    
    // 격자선을 따라 웨이포인트 생성
    for (int i = 0; i < gridLines.size(); ++i) {
        Waypoint wp;
        wp.sequence = sequence++;
        wp.latitude = gridLines[i].y();
        wp.longitude = gridLines[i].x();
        wp.altitude = flightAltitude;
        wp.speed = flightSpeed;
        wp.action = "WAYPOINT";
        waypoints.append(wp);
    }
    
    // 착륙 웨이포인트
    Waypoint landWP;
    landWP.sequence = sequence++;
    landWP.latitude = fieldBoundary[0].y();
    landWP.longitude = fieldBoundary[0].x();
    landWP.altitude = 0;
    landWP.speed = 0;
    landWP.action = "LAND";
    waypoints.append(landWP);
    
    return waypoints;
}

bool MissionPlanner::validateMission(const QList<Waypoint> &waypoints) const
{
    if (waypoints.isEmpty()) {
        qWarning() << "Mission has no waypoints";
        return false;
    }
    
    for (const auto &wp : waypoints) {
        if (wp.latitude < -90 || wp.latitude > 90) {
            qWarning() << "Invalid latitude:" << wp.latitude;
            return false;
        }
        if (wp.longitude < -180 || wp.longitude > 180) {
            qWarning() << "Invalid longitude:" << wp.longitude;
            return false;
        }
    }
    
    return true;
}

float MissionPlanner::calculateEstimatedDuration(const QList<Waypoint> &waypoints)
{
    if (waypoints.size() < 2) return 0;
    
    float totalDistance = 0;
    for (int i = 0; i < waypoints.size() - 1; ++i) {
        totalDistance += calculateDistance(
            QPointF(waypoints[i].longitude, waypoints[i].latitude),
            QPointF(waypoints[i+1].longitude, waypoints[i+1].latitude)
        );
    }
    
    // 평균 속도가 10 m/s라고 가정
    return totalDistance / 10.0f;
}

float MissionPlanner::calculateTotalDistance(const QList<Waypoint> &waypoints)
{
    float totalDistance = 0;
    for (int i = 0; i < waypoints.size() - 1; ++i) {
        totalDistance += calculateDistance(
            QPointF(waypoints[i].longitude, waypoints[i].latitude),
            QPointF(waypoints[i+1].longitude, waypoints[i+1].latitude)
        );
    }
    return totalDistance;
}

QList<QPointF> MissionPlanner::generateGridLines(const QList<QPointF> &boundary, float spacing, bool isNorthSouth)
{
    QList<QPointF> gridPoints;
    
    // 간단한 격자 생성 (상세 구현은 GIS 라이브러리 사용 권장)
    float minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
    
    for (const auto &p : boundary) {
        minLat = std::min(minLat, (float)p.y());
        maxLat = std::max(maxLat, (float)p.y());
        minLon = std::min(minLon, (float)p.x());
        maxLon = std::max(maxLon, (float)p.x());
    }
    
    // TODO: 실제 격자 생성 로직 구현
    
    return gridPoints;
}

float MissionPlanner::calculateDistance(const QPointF &p1, const QPointF &p2)
{
    // Haversine 공식으로 거리 계산
    float lat1 = p1.y() * M_PI / 180.0f;
    float lat2 = p2.y() * M_PI / 180.0f;
    float deltaLat = (p2.y() - p1.y()) * M_PI / 180.0f;
    float deltaLon = (p2.x() - p1.x()) * M_PI / 180.0f;
    
    float a = std::sin(deltaLat / 2) * std::sin(deltaLat / 2) +
              std::cos(lat1) * std::cos(lat2) *
              std::sin(deltaLon / 2) * std::sin(deltaLon / 2);
    float c = 2 * std::atan2(std::sqrt(a), std::sqrt(1 - a));
    
    return EARTH_RADIUS_M * c;
}
