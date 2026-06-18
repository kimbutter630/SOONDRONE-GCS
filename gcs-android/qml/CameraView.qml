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
            text: "카메라"
            font.pixelSize: 28
            font.bold: true
            color: "#1976d2"
        }
        
        // 비디오 스트림
        Rectangle {
            Layout.fillWidth: true
            Layout.fillHeight: true
            color: "#000"
            radius: 4
            
            Text {
                anchors.centerIn: parent
                text: "📷 비디오 스트림\n(GStreamer RTSP 통합 예정)"
                textFormat: Text.PlainText
                horizontalAlignment: Text.AlignHCenter
                color: "#666"
                font.pixelSize: 16
            }
        }
    }
}
