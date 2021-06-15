import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Header3, IconBtn } from "../ui/Layouts";
import { ReactComponent as TrashIcon } from "../ui/icons/TrashSmall.svg";
import { ReactComponent as TimeIcon } from "../ui/icons/Time.svg";

import Loader from "../ui/Loader";

const Container = styled.div`
  color: ${({ theme }) => theme.color};
  margin-bottom: 30px;
`;

const Box = styled.div`
  margin-bottom: 10px;
  padding: 20px;
  border-bottom: ${({ theme }) => `1px solid ${theme.borderBottom}`};
`;

const BoxHeader = styled.div`
  display: flex;
  margin-bottom: 27px;
  align-items: center;
  & img {
    margin-right: 10px;
    border-radius: 50%;
    height: 30px;
    width: 30px;
  }

  .vertical-center {
    /* line-height: 30px; */
  }

  & .creator {
    text-transform: capitalize;
  }

  & .time-icon {
    margin-right: 5px;
    width: 30px;
    height: 30px;
    pointer-events: none;
  }

  & .time {
    margin-right: 10px;
  }

  & .trash-icon {
    svg {
      width: 30px;
      height: 30px;
    }
  }
`;

const Title = styled.div`
  text-transform: capitalize;
  margin-bottom: 19px;
`;

const HourAndIconsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const Text = styled(Header3)``;

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
                <Text className="creator">{creator.name}</Text>
                <HourAndIconsContainer>
                  <IconBtn className="time-icon ">
                    <TimeIcon />
                  </IconBtn>
                  <Text className="time ">{created_at}</Text>
                  <IconBtn
                    className="trash-icon"
                    onClick={() => {
                      setCurrentupdateId(updateId);
                      handleDeleteVmFromDb(updateId);
                    }}
                  >
                    <TrashIcon />
                  </IconBtn>
                </HourAndIconsContainer>
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
