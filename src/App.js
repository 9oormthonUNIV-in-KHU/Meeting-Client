// src/App.js
import React from 'react';
import ChatRoom from './ChatRoom';

function App() {
    // 원하는 채팅방 ID를 지정 (예: "1234")
    const roomId = '1234';

    return (
        <div>
            <h1>채팅 예제</h1>
            <ChatRoom roomId={roomId} />
        </div>
    );
}

export default App;
