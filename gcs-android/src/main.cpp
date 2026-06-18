#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <iostream>

#include "core/mavlink_handler.h"
#include "core/telemetry_manager.h"
#include "core/vehicle_controller.h"

int main(int argc, char *argv[])
{
    // Qt 애플리케이션 생성
    QGuiApplication app(argc, argv);
    
    // QML 엔진 생성
    QQmlApplicationEngine engine;
    const QUrl url(QStringLiteral("qrc:/qml/MainWindow.qml"));
    
    // 핵심 모듈 인스턴스 생성
    MAVLinkHandler mavlinkHandler;
    TelemetryManager telemetryManager(&mavlinkHandler);
    VehicleController vehicleController(&mavlinkHandler);
    
    // QML에 C++ 객체 노출
    engine.rootContext()->setContextProperty("telemetryManager", &telemetryManager);
    engine.rootContext()->setContextProperty("vehicleController", &vehicleController);
    
    // QML 로드
    engine.load(url);
    if (engine.rootObjects().isEmpty())
        return -1;
    
    // 신호 연결
    QObject::connect(&mavlinkHandler, &MAVLinkHandler::messageReceived,
                     &telemetryManager, &TelemetryManager::onMAVLinkMessage);
    
    std::cout << "🚀 SOONDRONE GCS Android Started" << std::endl;
    
    return app.exec();
}
