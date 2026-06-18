import QtQuick 2.15
import QtQuick.Window 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

ApplicationWindow {
    id: mainWindow
    visible: true
    width: 1280
    height: 800
    title: "SOONDRONE GCS - Ground Control Station"
    
    color: "#f5f5f5"
    
    // 메인 레이아웃
    RowLayout {
        anchors.fill: parent
        anchors.margins: 0
        spacing: 0
        
        // 좌측 사이드바
        Rectangle {
            width: 250
            color: "#1976d2"
            
            ColumnLayout {
                anchors.fill: parent
                anchors.margins: 10
                spacing: 10
                
                Text {
                    text: "SOONDRONE GCS"
                    color: "white"
                    font.pixelSize: 18
                    font.bold: true
                }
                
                Rectangle {
                    height: 1
                    color: "#42a5f5"
                }
                
                Button {
                    text: "📊 대시보드"
                    Layout.fillWidth: true
                    onClicked: stackView.push("DashboardView.qml")
                }
                
                Button {
                    text: "🗺️ 지도"
                    Layout.fillWidth: true
                    onClicked: stackView.push("MapView.qml")
                }
                
                Button {
                    text: "📷 카메라"
                    Layout.fillWidth: true
                    onClicked: stackView.push("CameraView.qml")
                }
                
                Button {
                    text: "🎮 제어"
                    Layout.fillWidth: true
                    onClicked: stackView.push("ControlPanel.qml")
                }
                
                Button {
                    text: "⚙️ 설정"
                    Layout.fillWidth: true
                    onClicked: stackView.push("SettingsPanel.qml")
                }
                
                Item { Layout.fillHeight: true }
            }
        }
        
        // 우측 메인 콘텐츠
        StackView {
            id: stackView
            Layout.fillWidth: true
            Layout.fillHeight: true
            
            initialItem: DashboardView {}
        }
    }
}
