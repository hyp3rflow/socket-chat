import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { io } from 'socket.io-client';
import GlobalStyle from './components/GlobalStyle';
import UserCount from './components/UserCount';
import ChatTop from './components/ChatTop';

const PageTemplate = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const AppWrapper = styled.div`
  width: 400px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 14px;
  box-shadow: 0px 6px 12px 0px rgba(20, 20, 20, 0.2);
  background-color: #fff;
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  input {
    flex: 1;
    border: 1px solid #d7d7d7;
    border-radius: 5px;
    padding: 8px;

    :focus {
      outline: 0;
    }
  }

  button {
    margin-left: 10px;
    padding: 4px 6px;
    font-weight: bold;
    background-color: #fff;
    border: 1px solid #d7d7d7;
    border-radius: 5px;

    :hover {
      background-color: #f8f9fa;
    }

    :active {
      background-color: #e9ecef;
    }

    :focus {
      outline: 0;
    }
  }
`;

const TopWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & + ${InputWrapper} {
    margin-top: 14px;
  }
`;

const Chat = styled.div`
  width: 100%;
  padding: 14px 0;

  & + & {
    border-top: 1px solid #d7d7d7;
  }
`;

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
      <GlobalStyle />
      <PageTemplate>
        <AppWrapper>
          <TopWrapper>
            <ChatTop />
            <UserCount userCount={userCount} />
          </TopWrapper>
          {chat.map((line) => (
            <Chat key={line}>{line}</Chat>
          ))}
          <InputWrapper>
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
          </InputWrapper>
        </AppWrapper>
      </PageTemplate>
    </>
  );
};

export default App;
