import React from "react";
import { useState, useCallback } from "react";
import Loader from "../ui/Loader";
import styled from "styled-components";
import Message from "./Message";

const Container = styled.div`
  color: ${({ theme }) => theme.color};
  margin-bottom: 30px;
`;

const MessagesHistory = ({
  messagesHistory,
  handleDeleteVmFromDb,
  isDeleting,
  userId,
  mondayUserInstance,
}) => {
  const [currentUpdateId, setCurrentupdateId] = useState(null);

  const formatTime = useCallback((time) => {
    var today = new Date();
    var createTime = new Date(time);
    var diffMs = today - createTime; // milliseconds between now & createTime
    var diffDays = Math.floor(diffMs / 86400000); // days
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

    if (diffDays === 0) {
      if (diffHrs === 0) {
        if (diffMins < 5) return "just now";
        else return `${diffMins}m`;
      } else return `${diffHrs}h`;
    } else if (diffDays < 30) {
      return `${diffDays}d`;
    }

    const partialDate = createTime.toDateString().split(" ");
    return `${partialDate[1]} ${partialDate[2]}`;
  }, []);

  return (
    <Container>
      {messagesHistory.map(
        ({ id: updateId, assets, body, created_at, creator }, i) => {
          return isDeleting && currentUpdateId === updateId ? (
            <Loader />
          ) : (
            <Message
              creator={creator}
              setCurrentupdateId={setCurrentupdateId}
              userId={userId}
              created_at={created_at}
              handleDeleteVmFromDb={handleDeleteVmFromDb}
              formatTime={formatTime}
              updateId={updateId}
              assetSrc={assets[0].public_url}
              mondayUserInstance={mondayUserInstance}
              body={body}
            />
          );
        }
      )}
    </Container>
  );
};

export default MessagesHistory;
