#include "telemetry_manager.h"
#include <QDebug>
#include <cmath>

TelemetryManager::TelemetryManager(MAVLinkHandler *mavlinkHandler, QObject *parent)
    : QObject(parent), m_mavlinkHandler(mavlinkHandler), m_armed(false)
{
    connect(mavlinkHandler, &MAVLinkHandler::messageReceived, this, &TelemetryManager::onMAVLinkMessage);
}

void TelemetryManager::onMAVLinkMessage(const mavlink_message_t &message)
{
    switch (message.msgid) {
    case MAVLINK_MSG_ID_HEARTBEAT: {
        mavlink_heartbeat_t heartbeat;
        mavlink_msg_heartbeat_decode(&message, &heartbeat);
        handleHeartbeat(heartbeat);
        break;
    }
    case MAVLINK_MSG_ID_SYS_STATUS: {
        mavlink_sys_status_t sysStatus;
        mavlink_msg_sys_status_decode(&message, &sysStatus);
        handleSystemStatus(sysStatus);
        break;
    }
    case MAVLINK_MSG_ID_GPS_RAW_INT: {
        mavlink_gps_raw_int_t gpsRaw;
        mavlink_msg_gps_raw_int_decode(&message, &gpsRaw);
        handleGPSRawInt(gpsRaw);
        break;
    }
    case MAVLINK_MSG_ID_ATTITUDE: {
        mavlink_attitude_t attitude;
        mavlink_msg_attitude_decode(&message, &attitude);
        handleAttitude(attitude);
        break;
    }
    case MAVLINK_MSG_ID_VFR_HUD: {
        mavlink_vfr_hud_t vfrHud;
        mavlink_msg_vfr_hud_decode(&message, &vfrHud);
        handleVfrHud(vfrHud);
        break;
    }
    case MAVLINK_MSG_ID_RADIO_STATUS: {
        mavlink_radio_status_t radioStatus;
        mavlink_msg_radio_status_decode(&message, &radioStatus);
        handleRadioStatus(radioStatus);
        break;
    }
    default:
        break;
    }
}

void TelemetryManager::handleHeartbeat(const mavlink_heartbeat_t &heartbeat)
{
    bool wasArmed = m_armed;
    m_armed = heartbeat.base_mode & MAV_MODE_FLAG_ARMED_ARMED;
    
    if (wasArmed != m_armed) {
        emit armedStatusChanged(m_armed);
    }
    
    // 비행 모드 설정
    if (heartbeat.autopilot == MAV_AUTOPILOT_ARDUPILOT) {
        // ArduPilot 모드 처리
        m_modeString = QString("Mode %1").arg(heartbeat.custom_mode);
    }
    
    emit modeChanged(m_modeString);
}

void TelemetryManager::handleSystemStatus(const mavlink_sys_status_t &sysStatus)
{
    m_currentTelemetry.battery_percentage = sysStatus.battery_remaining;
    emit systemStatusChanged(sysStatus.system_status);
    emit telemetryUpdated(m_currentTelemetry);
}

void TelemetryManager::handleGPSRawInt(const mavlink_gps_raw_int_t &gpsRaw)
{
    m_currentTelemetry.latitude = gpsRaw.lat / 1e7;
    m_currentTelemetry.longitude = gpsRaw.lon / 1e7;
    m_currentTelemetry.altitude = gpsRaw.alt / 1000.0f;
    m_currentTelemetry.gps_satellites = gpsRaw.satellites_visible;
    emit telemetryUpdated(m_currentTelemetry);
}

void TelemetryManager::handleAttitude(const mavlink_attitude_t &attitude)
{
    m_currentTelemetry.roll = attitude.roll * 180.0f / M_PI;
    m_currentTelemetry.pitch = attitude.pitch * 180.0f / M_PI;
    m_currentTelemetry.yaw = attitude.yaw * 180.0f / M_PI;
    emit telemetryUpdated(m_currentTelemetry);
}

void TelemetryManager::handleVfrHud(const mavlink_vfr_hud_t &vfrHud)
{
    m_currentTelemetry.speed = vfrHud.groundspeed;
    m_currentTelemetry.heading = vfrHud.heading;
    emit telemetryUpdated(m_currentTelemetry);
}

void TelemetryManager::handleRadioStatus(const mavlink_radio_status_t &radioStatus)
{
    m_currentTelemetry.signal_strength = radioStatus.rssi;
    emit telemetryUpdated(m_currentTelemetry);
}
