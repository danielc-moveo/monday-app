import React from 'react';
import { Header3, IconBtn } from '../ui/Layouts';
import { ReactComponent as TrashIcon } from '../ui/icons/TrashSmall.svg';
import { ReactComponent as TimeIcon } from '../ui/icons/Time.svg';
import styled from 'styled-components';
import Loader from 'monday-ui-react-core/dist/Loader';
import { useState } from 'react';

const Box = styled.div`
  margin-bottom: 10px;
  padding: 20px;
  border-bottom: ${({ theme }) => `1px solid ${theme.borderBottom}`};
  max-height:213px;
  min-height:213px;
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
    pointer-events: ${({ isDeleteAllowed }) => !isDeleteAllowed && 'none'};
    opacity: ${({ isDeleteAllowed }) => !isDeleteAllowed && '20%'};
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

const Message = ({
  currentUpdateId,
  setCurrentupdateId,
  userId,
  created_at,
  handleDeleteVmFromDb,
  formatTime,
  updateId,
  assetSrc,
  creator,
  body,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    setCurrentupdateId(updateId);
    await handleDeleteVmFromDb(updateId);
    setIsDeleting(false);
  };
  const isLoading = isDeleting && currentUpdateId === updateId;
  return (
    <>
      {assetSrc && (
        <Box>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <BoxHeader isDeleteAllowed={creator.id.toString() === userId}>
                <img src={creator.photo_tiny} alt="" />
                <Text className="creator">{creator.name}</Text>
                <HourAndIconsContainer>
                  <IconBtn className="time-icon ">
                    <TimeIcon />
                  </IconBtn>
                  <Text className="time ">{formatTime(created_at)}</Text>
                  <IconBtn className="trash-icon" onClick={handleDelete}>
                    <TrashIcon />
                  </IconBtn>
                </HourAndIconsContainer>
              </BoxHeader>
              <div>
                <Title>{body}</Title>
                <audio src={assetSrc} controls />
              </div>
            </>
          )}
        </Box>
      )}
    </>
  );
};

export default Message;
