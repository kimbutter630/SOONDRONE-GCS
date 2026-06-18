cmake_minimum_required(VERSION 3.16)
project(SoondroneGCS)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt5 COMPONENTS 
  Core 
  Gui 
  Quick 
  Network 
  Concurrent 
  Sql
  Multimedia
REQUIRED)

# 주요 소스 파일
set(SOURCES
  src/main.cpp
  src/core/mavlink_handler.cpp
  src/core/telemetry_manager.cpp
  src/core/vehicle_controller.cpp
  src/core/mission_planner.cpp
  src/ui/custom_widgets.cpp
  src/plugins/vworld_map_provider.cpp
)

set(HEADERS
  src/core/mavlink_handler.h
  src/core/telemetry_manager.h
  src/core/vehicle_controller.h
  src/core/mission_planner.h
  src/ui/custom_widgets.h
  src/plugins/vworld_map_provider.h
)

set(QML_FILES
  qml/MainWindow.qml
  qml/DashboardView.qml
  qml/CameraView.qml
  qml/MapView.qml
  qml/ControlPanel.qml
  qml/SettingsPanel.qml
)

add_executable(${PROJECT_NAME} 
  ${SOURCES}
  ${HEADERS}
  ${QML_FILES}
  resources/qml.qrc
)

target_link_libraries(${PROJECT_NAME} 
  Qt5::Core
  Qt5::Gui
  Qt5::Quick
  Qt5::Network
  Qt5::Concurrent
  Qt5::Sql
  Qt5::Multimedia
)

# Android 설정
if(ANDROID)
  add_library(TelemetryService SHARED
    android/src/TelemetryService.java
  )
endif()
