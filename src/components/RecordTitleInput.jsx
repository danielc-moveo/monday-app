import React, { useRef, useState } from "react";
import { Colors } from "../ui/Colors";
import styled from "styled-components";

const TitleInput = styled.input`
  margin-top: 20px;
  padding: 8px;
  border-radius: 5px;
  width: 65%;
  border-color: ${Colors.blue};
  height: 20px;
`;
const AddBtn = styled.button`
  margin-top: 40px;
  color: ${Colors.white};
  border-radius: 5px;
  width: 70%;
  height: 40px;
  background-color: ${Colors.blue};
  border: none;
  outline: none;
  cursor: pointer;
`;

export const RecordTitleInput = ({ handleAdd, blob }) => {
  const [title, setTitle] = useState("");

  const handleChange = (e) => {
    setTitle(e.target.value);
  };
  return (
    <>
      <TitleInput
        type={Text}
        placeholder={"Add your title for your voice description"}
        value={title}
        onChange={(e) => handleChange(e)}
      />
      <AddBtn onClick={() => handleAdd(title, blob)}>ADD</AddBtn>
    </>
  );
};
