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
            text: "지도"
            font.pixelSize: 28
            font.bold: true
            color: "#1976d2"
        }
        
        // 지도 영역
        Rectangle {
            Layout.fillWidth: true
            Layout.fillHeight: true
            color: "#e0e0e0"
            border.color: "#999"
            radius: 4
            
            Text {
                anchors.centerIn: parent
                text: "🗺️ 지도 표시 영역\n(Vworld 지적도 통합 예정)"
                textFormat: Text.PlainText
                horizontalAlignment: Text.AlignHCenter
                color: "#999"
                font.pixelSize: 16
            }
        }
    }
}
