import React from "react";

const MessagesHistory = ({ messagesHistory }) => {
  return (
    <div>
      {messagesHistory.map((message, i) => (
        <div style={{ marginBottom: "10px" }}>
          <div>
            <div style={{ color: "white", marginBottom: "4px" }}>
              {`${message.creatorName} ${i + 1}`}
            </div>
          </div>
          <div>
            <audio src={message.assetSrc} controls />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesHistory;
