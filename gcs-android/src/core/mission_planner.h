#pragma once

#include <QObject>
#include <QList>
#include <QPointF>
#include <mavlink.h>

struct Waypoint {
    int sequence;
    double latitude;
    double longitude;
    float altitude;
    float speed;
    QString action;
    QVariantMap parameters;
};

class MissionPlanner : public QObject {
    Q_OBJECT
    
public:
    explicit MissionPlanner(QObject *parent = nullptr);
    
    // Survey 경로 생성
    QList<Waypoint> generateSurveyPath(
        const QList<QPointF> &fieldBoundary,
        float swathWidth,
        float flightAltitude,
        float flightSpeed,
        const QString &sweepDirection = "N-S"
    );
    
    // 미션 검증
    bool validateMission(const QList<Waypoint> &waypoints) const;
    
    // 예상 시간/거리 계산
    float calculateEstimatedDuration(const QList<Waypoint> &waypoints);
    float calculateTotalDistance(const QList<Waypoint> &waypoints);
    
private:
    // 보조 함수
    QList<QPointF> generateGridLines(const QList<QPointF> &boundary, float spacing, bool isNorthSouth);
    float calculateDistance(const QPointF &p1, const QPointF &p2);
};
