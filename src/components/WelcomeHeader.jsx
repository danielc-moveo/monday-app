import React from "react";
import { Colors } from "../ui/Colors";
import { Header1, Header2, Header3, FlexedColCenter } from "../ui/Layouts";
import styled from "styled-components";

const Title = styled(Header1)``;
const Subtitle = styled(Header2)``;

export const WelcomeHeader = () => {
  return (
    <>
      <Title>Welcome to Voice Description!</Title>
      <Subtitle>A more effective way to explain your task to others</Subtitle>
    </>
  );
};
