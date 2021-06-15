import React from "react";
import { useState } from "react";
import styled from "styled-components";
import Loader from "../ui/Loader";

const Container = styled.div`
  color: ${({ theme }) => theme.color};
  margin-bottom: 30px;
`;

const Box = styled.div`
  margin-bottom: 10px;
  padding: 20px;
  border-bottom: 1px solid white;
`;

const BoxHeader = styled.div`
  display: flex;
  margin-bottom: 27px;
  & img {
    margin-right: 10px;
    border-radius: 50%;
  }

  .vertical-center {
    line-height: 30px;
  }

  & .creator {
    text-transform: capitalize;
  }

  & .time-icon {
    margin-right: 5px;
  }

  & .time {
    margin-right: 10px;
  }

  & .trash-icon {
    cursor: pointer;
  }
`;

const Title = styled.div`
  text-transform: capitalize;
  margin-bottom: 19px;
`;

const HourAndIconContainer = styled.div`
  margin-left: auto;
`;

const MessagesHistory = ({
  messagesHistory,
  handleDeleteVmFromDb,
  isDeleting,
}) => {
  const [currentUpdateId, setCurrentupdateId] = useState(null);

  return (
    <Container>
      {messagesHistory.map(
        ({ id: updateId, assets, creator, body, created_at }, i) =>
          isDeleting && currentUpdateId === updateId ? (
            <Loader />
          ) : (
            <Box key={i}>
              <BoxHeader>
                <img src={creator.photo_tiny} alt="" />
                <span className="creator vertical-center">{creator.name}</span>
                <HourAndIconContainer>
                  <span className="time-icon vertical-center">i</span>
                  <span className="time vertical-center">{created_at}</span>
                  <span
                    className="trash-icon  vertical-center"
                    onClick={() => {
                      setCurrentupdateId(updateId);
                      handleDeleteVmFromDb(updateId);
                    }}
                  >
                    trash
                  </span>
                </HourAndIconContainer>
              </BoxHeader>
              <div>
                <Title>{body}</Title>
                <audio src={assets[0].public_url} controls />
              </div>
            </Box>
          )
      )}
    </Container>
  );
};

export default MessagesHistory;
