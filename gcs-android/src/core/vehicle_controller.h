#pragma once

#include <QObject>
#include "mavlink_handler.h"
#include <mavlink.h>

class VehicleController : public QObject {
    Q_OBJECT
    
public:
    explicit VehicleController(MAVLinkHandler *mavlinkHandler, QObject *parent = nullptr);
    
public slots:
    // 기본 제어
    void arm();
    void disarm();
    void takeoff(float altitude);
    void land();
    void returnToLaunch();
    
    // 속도 제어
    void setThrottle(float value); // 0-100%
    void setYaw(float value);      // -180 ~ 180
    
    // 농업용 제어
    void setPumpIntensity(float intensity); // 0-100%
    void setGranuleRotation(float rpm);     // RPM
    
    // 미션 관리
    void uploadMission(const QString &missionJson);
    void startMission();
    void pauseMission();
    void resumeMission();
    void abortMission();
    
signals:
    void commandAcknowledged(int commandId);
    void commandFailed(int commandId, int result);
    
private:
    void sendCommand(uint16_t commandId, float param1 = 0, float param2 = 0,
                    float param3 = 0, float param4 = 0);
    
    MAVLinkHandler *m_mavlinkHandler;
    uint8_t m_systemId;
    uint8_t m_componentId;
};
