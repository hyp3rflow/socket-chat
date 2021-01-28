import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string>();
  const [userCount, setUserCount] = useState<number>();
  const [chat, setChat] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const pushChat = (content: string) => {
    if (chat.length === 10)
      setChat((prevChat) => prevChat.slice(1, 10).concat(content));
    else setChat((prevChat) => prevChat.concat(content));
  };

  const { current: socket } = useRef(
    io('http://localhost:3000', { path: '/chat' })
  );

  useEffect(() => {
    socket.emit('login');
    socket.on('login', (data) => {
      setUserCount(data.userCount);
    });

    socket.on('new user', (data) => {
      setUserCount(data.userCount);
      pushChat(`새로운 유저가 접속했습니다. - 유저 ${data.userCount}명`);
    });

    socket.on('disconnect user', (data) => {
      setUserCount(data.userCount);
      pushChat(`유저가 채팅방을 나갔습니다. - 유저 ${data.userCount}명`);
    });

    socket.on('chat', (data) => {
      pushChat(`${data.userName}: ${data.chat}`);
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      <div>사용자 수: {userCount}</div>
      {chat.map((line) => (
        <div key={line}>{line}</div>
      ))}
      <input
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
      />
      {userName ? (
        <button
          type="submit"
          onClick={() => {
            socket.emit('chat', { userName, chat: inputValue });
            setInputValue('');
          }}
        >
          제출!
        </button>
      ) : (
        <button
          type="submit"
          onClick={() => {
            setUserName(inputValue);
            setInputValue('');
          }}
        >
          로그인
        </button>
      )}
    </>
  );
};

export default App;
