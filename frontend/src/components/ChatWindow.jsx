import React from "react";

const ChatWindow = ({ contact, messages, text, setText, onSend, currentUser }) => {
  if (!contact) {
    return null;
  }

  return (
    <div className="qchat-main-chat-area">
      <div className="qchat-main-chat-header">{contact.username}</div>

      <div className="qchat-main-chat-body">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`qchat-bubble ${
              m.from === currentUser.id ? "me" : "them"
            }`}
          >
            {m.body}
          </div>
        ))}
      </div>

      <div className="qchat-main-chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={onSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;