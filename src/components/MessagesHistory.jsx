import React from "react";
import { useState } from "react";
import styled from "styled-components";
import Message from "./Message";
import useFormatTime from "./hooks/useFormatTime";
import { deleteVmFromDb } from "../api/monday/utils/delete-voice";

const Container = styled.div`
  color: ${({ theme }) => theme.color};
  margin-bottom: 30px;
`;

const MessagesHistory = ({
  mondayUserInstance,
  messagesHistory,
  setMessagesHistory,
  userId,
}) => {
  const [currentUpdateId, setCurrentupdateId] = useState(null);

  const handleDeleteVmFromDb = async (updateId) => {
    const { msg, deletedUpdateId } = await deleteVmFromDb(
      mondayUserInstance,
      updateId
    );
    if (msg === "success") {
      setMessagesHistory((prev) => {
        let newMessagesHistory = [...prev];
        newMessagesHistory = messagesHistory.filter(
          (message) => message.id !== deletedUpdateId
        );
        return newMessagesHistory;
      });
    }
  };
  const formatTime = useFormatTime();
  return (
    <Container>
      {messagesHistory.map(
        ({ id: updateId, assets, body, created_at, creator }, i) => {
          return (
            <Message
              key={i}
              currentUpdateId={currentUpdateId}
              creator={creator}
              setCurrentupdateId={setCurrentupdateId}
              userId={userId}
              created_at={created_at}
              handleDeleteVmFromDb={handleDeleteVmFromDb}
              formatTime={formatTime}
              updateId={updateId}
              assetSrc={assets[0].public_url}
              body={body}
            />
          );
        }
      )}
    </Container>
  );
};

export default MessagesHistory;
