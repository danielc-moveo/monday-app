import React, { useState } from "react";
import { Colors } from "../ui/Colors";
import styled from "styled-components";

const TitleInput = styled.input`
  margin-top: 24px;
  padding: 8px;
  border-radius: 5px;
  width: 340px;
  border-color: ${Colors.blue} !important;
  border-style: solid;
  height: 20px;

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;
const AddBtn = styled.button`
  margin-top: 48px;
  color: ${Colors.white};
  border-radius: 5px;
  width: 360px;
  height: 40px;
  background-color: ${Colors.blue};
  border: none;
  outline: none;
  cursor: ${({ disabled }) => !disabled && "pointer"};
  pointer-events: ${({ disabled }) => disabled && "none"};
  opacity: ${({ disabled }) => disabled && "20%"};
`;

export const RecordTitleInput = ({ handleAdd, blob }) => {
  const [title, setTitle] = useState("");

  const handleChange = (e) => {
    setTitle(e.target.value);
  };
  return (
    <>
      <TitleInput
        placeholder={"Name your Voice Description"}
        value={title}
        onChange={(e) => handleChange(e)}
      />
      <AddBtn disabled={!title} onClick={() => handleAdd(title, blob)}>
        Add
      </AddBtn>
    </>
  );
};
