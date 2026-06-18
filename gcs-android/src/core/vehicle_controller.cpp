#include "vehicle_controller.h"
#include <QDebug>

VehicleController::VehicleController(MAVLinkHandler *mavlinkHandler, QObject *parent)
    : QObject(parent), m_mavlinkHandler(mavlinkHandler), m_systemId(1), m_componentId(1)
{
}

void VehicleController::arm()
{
    sendCommand(MAV_CMD_COMPONENT_ARM_DISARM, 1); // arm
    qDebug() << "ARM command sent";
}

void VehicleController::disarm()
{
    sendCommand(MAV_CMD_COMPONENT_ARM_DISARM, 0); // disarm
    qDebug() << "DISARM command sent";
}

void VehicleController::takeoff(float altitude)
{
    sendCommand(MAV_CMD_NAV_TAKEOFF, 0, 0, 0, 0, 0, 0, altitude);
    qDebug() << "TAKEOFF command sent with altitude:" << altitude;
}

void VehicleController::land()
{
    sendCommand(MAV_CMD_NAV_LAND);
    qDebug() << "LAND command sent";
}

void VehicleController::returnToLaunch()
{
    sendCommand(MAV_CMD_NAV_RETURN_TO_LAUNCH);
    qDebug() << "RETURN_TO_LAUNCH command sent";
}

void VehicleController::setThrottle(float value)
{
    // 값 범위 확인 (0-100)
    value = qBound(0.0f, value, 100.0f);
    // TODO: MAVLink 스로틀 제어 메시지 구현
    qDebug() << "Throttle set to:" << value << "%";
}

void VehicleController::setYaw(float value)
{
    // 값 범위 확인 (-180 ~ 180)
    while (value > 180) value -= 360;
    while (value < -180) value += 360;
    // TODO: MAVLink 요(Yaw) 제어 메시지 구현
    qDebug() << "Yaw set to:" << value << "degrees";
}

void VehicleController::setPumpIntensity(float intensity)
{
    // 액제 펌프 강도 설정 (0-100%)
    intensity = qBound(0.0f, intensity, 100.0f);
    // TODO: MAVLink 커스텀 메시지로 펌프 강도 전송
    qDebug() << "Pump intensity set to:" << intensity << "%";
}

void VehicleController::setGranuleRotation(float rpm)
{
    // 입제 살포기 회전속도 설정
    rpm = qBound(0.0f, rpm, 5000.0f);
    // TODO: MAVLink 커스텀 메시지로 RPM 전송
    qDebug() << "Granule rotation set to:" << rpm << "RPM";
}

void VehicleController::uploadMission(const QString &missionJson)
{
    // TODO: JSON 미션 데이터를 파싱하여 MAVLink MISSION_ITEM 메시지로 전송
    qDebug() << "Mission upload started";
}

void VehicleController::startMission()
{
    sendCommand(MAV_CMD_MISSION_START);
    qDebug() << "MISSION_START command sent";
}

void VehicleController::pauseMission()
{
    sendCommand(MAV_CMD_DO_PAUSE_CONTINUE, 0); // pause
    qDebug() << "MISSION_PAUSE command sent";
}

void VehicleController::resumeMission()
{
    sendCommand(MAV_CMD_DO_PAUSE_CONTINUE, 1); // continue
    qDebug() << "MISSION_RESUME command sent";
}

void VehicleController::abortMission()
{
    sendCommand(MAV_CMD_DO_SET_MODE, 1, MAV_MODE_MANUAL_ARMED);
    qDebug() << "MISSION_ABORT command sent";
}

void VehicleController::sendCommand(uint16_t commandId, float param1, float param2,
                                    float param3, float param4)
{
    mavlink_message_t message;
    mavlink_command_long_t cmd = {};
    
    cmd.target_system = m_systemId;
    cmd.target_component = m_componentId;
    cmd.command = commandId;
    cmd.confirmation = 0;
    cmd.param1 = param1;
    cmd.param2 = param2;
    cmd.param3 = param3;
    cmd.param4 = param4;
    
    mavlink_msg_command_long_encode(m_systemId, m_componentId, &message, &cmd);
    m_mavlinkHandler->sendMessage(message);
}
