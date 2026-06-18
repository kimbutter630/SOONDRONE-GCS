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
        
        Text {
            text: "드론 제어"
            font.pixelSize: 28
            font.bold: true
            color: "#1976d2"
        }
        
        // 기본 제어
        GroupBox {
            title: "기본 제어"
            Layout.fillWidth: true
            
            RowLayout {
                anchors.fill: parent
                spacing: 10
                
                Button { text: "🚁 ARM"; onClicked: vehicleController.arm() }
                Button { text: "✋ DISARM"; onClicked: vehicleController.disarm() }
                Button { text: "⬆️ TAKEOFF"; onClicked: vehicleController.takeoff(100) }
                Button { text: "⬇️ LAND"; onClicked: vehicleController.land() }
                Button { text: "🏠 RTL"; onClicked: vehicleController.returnToLaunch() }
            }
        }
        
        // 농업용 제어
        GroupBox {
            title: "농업용 제어"
            Layout.fillWidth: true
            
            ColumnLayout {
                anchors.fill: parent
                spacing: 10
                
                RowLayout {
                    Text { text: "액제 펌프 강도:" }
                    Slider {
                        from: 0
                        to: 100
                        Layout.fillWidth: true
                        onValueChanged: vehicleController.setPumpIntensity(value)
                    }
                    Text { text: Math.round(parent.children[1].value) + "%" }
                }
                
                RowLayout {
                    Text { text: "입제 살포기 RPM:" }
                    Slider {
                        from: 0
                        to: 5000
                        Layout.fillWidth: true
                        onValueChanged: vehicleController.setGranuleRotation(value)
                    }
                    Text { text: Math.round(parent.children[1].value) + " RPM" }
                }
            }
        }
        
        Item { Layout.fillHeight: true }
    }
}
