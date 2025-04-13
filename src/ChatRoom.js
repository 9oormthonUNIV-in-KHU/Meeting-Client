// src/ChatRoom.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './ChatRoom.css';  // CSS 파일 import

const ChatRoom = ({ roomId }) => {
    const [messages, setMessages] = useState([]);
    const [inputNameValue, setInputNameValue] = useState('');
    const [inputMessageValue, setInputMessageValue] = useState('');

    const clientRef = useRef(null);

    const connect = () => {
        const socketUrl = 'http://localhost:8080/ws';
        const sock = new SockJS(socketUrl);

        const client = new Client({
            webSocketFactory: () => sock,
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                // 연결 성공 시 /sub/chat/{roomId}를 구독
                client.subscribe(`/sub/chat/${roomId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();
        clientRef.current = client;
    };

    const disconnect = () => {
        if (clientRef.current) {
            clientRef.current.deactivate();
        }
    };

    const fetchMessages = () => {
        axios.get(`http://localhost:8080/chat/${roomId}`)
            .then(response => setMessages(response.data.message))
            .catch(error => console.error("메시지 로딩 에러:", error));
    };

    const sendMessage = () => {
        if (clientRef.current && inputNameValue && inputMessageValue) {
            const body = {
                id: roomId,
                name: inputNameValue,
                message: inputMessageValue
            };
            clientRef.current.publish({
                destination: '/pub/chat',
                body: JSON.stringify(body),
            });
            setInputMessageValue('');
        }
    };

    useEffect(() => {
        connect();
        fetchMessages();
        return () => disconnect();
    }, [roomId]);

    return (
        <div className="chat-container">
            <div className="chat-header">
                채팅방: {roomId}
            </div>
            <div className="chat-body">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message ${msg.name === inputNameValue ? 'own-message' : ''}`}
                    >
                        <span className="chat-message-sender">{msg.name}</span>:
                        <span className="chat-message-text"> {msg.message}</span>
                    </div>
                ))}
            </div>
            <div className="chat-footer">
                <input
                    className="chat-input"
                    type="text"
                    placeholder="이름 입력"
                    value={inputNameValue}
                    onChange={(e) => setInputNameValue(e.target.value)}
                />
                <input
                    className="chat-input"
                    type="text"
                    placeholder="메시지 입력"
                    value={inputMessageValue}
                    onChange={(e) => setInputMessageValue(e.target.value)}
                />
                <button className="chat-send-button" onClick={sendMessage}>전송</button>
            </div>
        </div>
    );
};

export default ChatRoom;
