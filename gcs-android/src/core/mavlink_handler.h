#pragma once

#include <QObject>
#include <QSerialPort>
#include <QTcpSocket>
#include <QThread>
#include <mavlink.h>

class MAVLinkHandler : public QObject {
    Q_OBJECT
    
public:
    explicit MAVLinkHandler(QObject *parent = nullptr);
    ~MAVLinkHandler();
    
    // 연결 관리
    void openSerialConnection(const QString &portName, int baudrate = 115200);
    void openUDPConnection(const QString &host, int port = 14550);
    void closeConnection();
    bool isConnected() const { return m_connected; }
    
    // 메시지 송수신
    void sendMessage(const mavlink_message_t &message);
    
signals:
    void connected();
    void disconnected();
    void messageReceived(const mavlink_message_t &message);
    void errorOccurred(const QString &error);
    
private slots:
    void onSerialDataAvailable();
    void onTCPDataAvailable();
    void onSerialError();
    void onTCPError();
    
private:
    void processMAVLinkData(const QByteArray &data);
    
    QSerialPort *m_serialPort;
    QTcpSocket *m_tcpSocket;
    bool m_connected;
    mavlink_status_t m_mavlinkStatus;
    QThread m_receiverThread;
};
