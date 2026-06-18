import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

Rectangle {
    width: parent.width
    height: parent.height
    color: "#f5f5f5"
    
    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 20
        spacing: 20
        
        // 헤더
        Text {
            text: "대시보드"
            font.pixelSize: 28
            font.bold: true
            color: "#1976d2"
        }
        
        // 텔레메트리 카드들
        GridLayout {
            columns: 4
            spacing: 15
            
            // 배터리
            Rectangle {
                width: 200
                height: 120
                color: "white"
                border.color: "#e0e0e0"
                radius: 4
                
                ColumnLayout {
                    anchors.fill: parent
                    anchors.margins: 10
                    
                    Text {
                        text: "배터리"
                        font.pixelSize: 14
                        color: "#666"
                    }
                    
                    Text {
                        text: "85%"
                        font.pixelSize: 32
                        font.bold: true
                        color: "#4caf50"
                    }
                    
                    ProgressBar {
                        value: 0.85
                        Layout.fillWidth: true
                    }
                }
            }
            
            // GPS
            Rectangle {
                width: 200
                height: 120
                color: "white"
                border.color: "#e0e0e0"
                radius: 4
                
                ColumnLayout {
                    anchors.fill: parent
                    anchors.margins: 10
                    
                    Text {
                        text: "GPS 위성"
                        font.pixelSize: 14
                        color: "#666"
                    }
                    
                    Text {
                        text: "12"
                        font.pixelSize: 32
                        font.bold: true
                        color: "#1976d2"
                    }
                    
                    Text {
                        text: "신호: 양호"
                        font.pixelSize: 12
                        color: "#999"
                    }
                }
            }
            
            // 속도
            Rectangle {
                width: 200
                height: 120
                color: "white"
                border.color: "#e0e0e0"
                radius: 4
                
                ColumnLayout {
                    anchors.fill: parent
                    anchors.margins: 10
                    
                    Text {
                        text: "속도"
                        font.pixelSize: 14
                        color: "#666"
                    }
                    
                    Text {
                        text: "5.2 m/s"
                        font.pixelSize: 32
                        font.bold: true
                        color: "#ff9800"
                    }
                    
                    Text {
                        text: "정상"
                        font.pixelSize: 12
                        color: "#999"
                    }
                }
            }
            
            // 고도
            Rectangle {
                width: 200
                height: 120
                color: "white"
                border.color: "#e0e0e0"
                radius: 4
                
                ColumnLayout {
                    anchors.fill: parent
                    anchors.margins: 10
                    
                    Text {
                        text: "고도"
                        font.pixelSize: 14
                        color: "#666"
                    }
                    
                    Text {
                        text: "100.5 m"
                        font.pixelSize: 32
                        font.bold: true
                        color: "#2196f3"
                    }
                    
                    Text {
                        text: "정상"
                        font.pixelSize: 12
                        color: "#999"
                    }
                }
            }
        }
        
        // 제어 버튼들
        Rectangle {
            height: 80
            color: "white"
            border.color: "#e0e0e0"
            radius: 4
            Layout.fillWidth: true
            
            RowLayout {
                anchors.fill: parent
                anchors.margins: 10
                spacing: 10
                
                Button {
                    text: "🚁 ARM"
                    Layout.preferredWidth: 100
                    onClicked: vehicleController.arm()
                }
                
                Button {
                    text: "✋ DISARM"
                    Layout.preferredWidth: 100
                    onClicked: vehicleController.disarm()
                }
                
                Button {
                    text: "⬆️ 이륙"
                    Layout.preferredWidth: 100
                    onClicked: vehicleController.takeoff(100)
                }
                
                Button {
                    text: "⬇️ 착륙"
                    Layout.preferredWidth: 100
                    onClicked: vehicleController.land()
                }
                
                Button {
                    text: "🏠 귀환"
                    Layout.preferredWidth: 100
                    onClicked: vehicleController.returnToLaunch()
                }
                
                Item { Layout.fillWidth: true }
            }
        }
        
        Item { Layout.fillHeight: true }
    }
}
