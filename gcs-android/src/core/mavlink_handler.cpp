#include "mavlink_handler.h"
#include <QDebug>
#include <QThread>

MAVLinkHandler::MAVLinkHandler(QObject *parent)
    : QObject(parent), m_serialPort(nullptr), m_tcpSocket(nullptr), m_connected(false)
{
    mavlink_status_t_init(&m_mavlinkStatus);
}

MAVLinkHandler::~MAVLinkHandler()
{
    closeConnection();
}

void MAVLinkHandler::openSerialConnection(const QString &portName, int baudrate)
{
    if (!m_serialPort) {
        m_serialPort = new QSerialPort(this);
        connect(m_serialPort, &QSerialPort::readyRead, this, &MAVLinkHandler::onSerialDataAvailable);
        connect(m_serialPort, QOverload<QSerialPort::SerialPortError>::of(&QSerialPort::error),
                this, &MAVLinkHandler::onSerialError);
    }
    
    m_serialPort->setPortName(portName);
    m_serialPort->setBaudRate(baudrate);
    m_serialPort->setDataBits(QSerialPort::Data8);
    m_serialPort->setParity(QSerialPort::NoParity);
    m_serialPort->setStopBits(QSerialPort::OneStop);
    
    if (m_serialPort->open(QIODevice::ReadWrite)) {
        m_connected = true;
        emit connected();
        qDebug() << "Serial connection established on" << portName << "at" << baudrate << "baud";
    } else {
        emit errorOccurred("Failed to open serial port: " + m_serialPort->errorString());
    }
}

void MAVLinkHandler::openUDPConnection(const QString &host, int port)
{
    if (!m_tcpSocket) {
        m_tcpSocket = new QTcpSocket(this);
        connect(m_tcpSocket, &QTcpSocket::readyRead, this, &MAVLinkHandler::onTCPDataAvailable);
        connect(m_tcpSocket, QOverload<QAbstractSocket::SocketError>::of(&QTcpSocket::error),
                this, &MAVLinkHandler::onTCPError);
    }
    
    m_tcpSocket->connectToHost(host, port);
}

void MAVLinkHandler::closeConnection()
{
    if (m_serialPort && m_serialPort->isOpen()) {
        m_serialPort->close();
    }
    if (m_tcpSocket && m_tcpSocket->state() == QTcpSocket::ConnectedState) {
        m_tcpSocket->disconnectFromHost();
    }
    m_connected = false;
    emit disconnected();
}

void MAVLinkHandler::sendMessage(const mavlink_message_t &message)
{
    // MAVLink 메시지를 버퍼로 변환
    uint8_t buffer[MAVLINK_MAX_PACKET_LEN];
    uint16_t len = mavlink_msg_to_send_buffer(buffer, &message);
    
    if (m_serialPort && m_serialPort->isOpen()) {
        m_serialPort->write(reinterpret_cast<const char*>(buffer), len);
    }
    if (m_tcpSocket && m_tcpSocket->state() == QTcpSocket::ConnectedState) {
        m_tcpSocket->write(reinterpret_cast<const char*>(buffer), len);
    }
}

void MAVLinkHandler::onSerialDataAvailable()
{
    QByteArray data = m_serialPort->readAll();
    processMAVLinkData(data);
}

void MAVLinkHandler::onTCPDataAvailable()
{
    QByteArray data = m_tcpSocket->readAll();
    processMAVLinkData(data);
}

void MAVLinkHandler::processMAVLinkData(const QByteArray &data)
{
    mavlink_message_t message;
    
    for (const uint8_t byte : data) {
        if (mavlink_frame_char_received(&m_mavlinkStatus, byte, &message, nullptr)) {
            emit messageReceived(message);
        }
    }
}

void MAVLinkHandler::onSerialError()
{
    emit errorOccurred("Serial error: " + m_serialPort->errorString());
}

void MAVLinkHandler::onTCPError()
{
    emit errorOccurred("TCP error: " + m_tcpSocket->errorString());
}
