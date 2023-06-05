import React from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";

// Render phần đầu của khung chat, bao gồm title và description (Active time)

const CustomerHeader = ({ chat }) => {
  // console.log("Header:", chat)
  return (
    <div className="chat-header">
      <div className="flexbetween">
        <ChatBubbleLeftRightIcon className="icon-chat" />
        <h3 className="header-text">{chat.title}</h3>
      </div>
      <div className="flexbetween">
        {/* <PhoneIcon className="icon-phone" /> */}
        {chat.description !== "⬅️ ⬅️ ⬅️" ? (
          <p className="header-text">{chat.description}</p>
        ) : (
          <p className="header-text">No chat selected</p>
        )}
      </div>
    </div>
  );
};

export default CustomerHeader;
