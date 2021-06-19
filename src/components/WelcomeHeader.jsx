import React from 'react';
import { Header1, Header2 } from '../ui/Layouts';
import styled from 'styled-components';

const Title = styled(Header1)`
  font-weight: bold;
`;

const Subtitle = styled(Header2)`
  margin-top: 0;
  margin-bottom: 50px;
`;

export const WelcomeHeader = () => {
  return (
    <>
      <Title>Welcome to Voice Description!</Title>
      <Subtitle>A more effective way to explain your task to others</Subtitle>
    </>
  );
};
