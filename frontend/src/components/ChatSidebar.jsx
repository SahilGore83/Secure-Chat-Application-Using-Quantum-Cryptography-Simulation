import React from "react";

const ChatSidebar = ({ contacts, selectedContact, onSelect }) => {
  return (
    <>
      {contacts.map((c) => (
        <div
          key={c._id}
          className={`qchat-chat-item ${
            selectedContact?._id === c._id ? "active" : ""
          }`}
          onClick={() => onSelect(c)}
        >
          <img
            src={c.avatarUrl || "/default-avatar.png"}
            alt={c.username}
            className="qchat-chat-avatar"
          />
          <div className="qchat-chat-texts">
            <div className="qchat-chat-name">{c.username}</div>
            <div className="qchat-chat-preview">Tap to open chat</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatSidebar;
