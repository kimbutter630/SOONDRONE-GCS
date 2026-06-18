#pragma once

#include <QObject>
#include "mavlink_handler.h"
#include <mavlink.h>

struct TelemetryData {
    double latitude;
    double longitude;
    float altitude;
    float speed;
    float battery_percentage;
    int gps_satellites;
    float signal_strength;
    float heading;
    float roll;
    float pitch;
    float yaw;
    float temperature;
};

class TelemetryManager : public QObject {
    Q_OBJECT
    
public:
    explicit TelemetryManager(MAVLinkHandler *mavlinkHandler, QObject *parent = nullptr);
    
    // 텔레메트리 데이터 접근자
    TelemetryData currentTelemetry() const { return m_currentTelemetry; }
    bool isArmed() const { return m_armed; }
    QString modeString() const { return m_modeString; }
    
signals:
    void telemetryUpdated(const TelemetryData &data);
    void armedStatusChanged(bool armed);
    void modeChanged(const QString &mode);
    void systemStatusChanged(int status);
    
public slots:
    void onMAVLinkMessage(const mavlink_message_t &message);
    
private:
    void handleSystemStatus(const mavlink_sys_status_t &sysStatus);
    void handleHeartbeat(const mavlink_heartbeat_t &heartbeat);
    void handleGPSRawInt(const mavlink_gps_raw_int_t &gpsRaw);
    void handleAttitude(const mavlink_attitude_t &attitude);
    void handleVfrHud(const mavlink_vfr_hud_t &vfrHud);
    void handleRadioStatus(const mavlink_radio_status_t &radioStatus);
    
    MAVLinkHandler *m_mavlinkHandler;
    TelemetryData m_currentTelemetry;
    bool m_armed;
    QString m_modeString;
};
