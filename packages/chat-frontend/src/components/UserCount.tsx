import React from 'react';
import styled from 'styled-components';

const UserCountWrapper = styled.div`
  padding: 12px 18px;
  font-size: 18px;
  font-weight: bold;
  height: 50px;
  border-radius: 25px;
  background-color: #a5d8ff;
  color: #1864ab;
`;

interface UserCountProps {
  userCount: number;
}

const UserCount: React.FC<UserCountProps> = (props) => {
  const { userCount } = props;

  return (
    <UserCountWrapper>
      현재 접속자수: <span>{userCount}</span>
    </UserCountWrapper>
  );
};

export default UserCount;
