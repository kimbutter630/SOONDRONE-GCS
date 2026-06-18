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
            text: "설정"
            font.pixelSize: 28
            font.bold: true
            color: "#1976d2"
        }
        
        GroupBox {
            title: "통신 설정"
            Layout.fillWidth: true
            
            ColumnLayout {
                anchors.fill: parent
                spacing: 10
                
                RowLayout {
                    Text { text: "연결 방식:" }
                    ComboBox {
                        model: ["Serial Port", "UDP", "TCP"]
                        Layout.fillWidth: true
                    }
                }
                
                RowLayout {
                    Text { text: "포트 또는 주소:" }
                    TextField {
                        placeholderText: "/dev/ttyUSB0 또는 IP:PORT"
                        Layout.fillWidth: true
                    }
                }
                
                RowLayout {
                    Text { text: "보드레이트:" }
                    ComboBox {
                        model: ["9600", "38400", "57600", "115200"]
                        currentIndex: 3
                    }
                }
            }
        }
        
        Item { Layout.fillHeight: true }
    }
}
