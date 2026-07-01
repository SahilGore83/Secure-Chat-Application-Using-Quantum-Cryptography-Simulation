import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import "../styles/Chats.css";

const ChatsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [keyId, setKeyId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  // Load all users except logged-in user
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get("/chat/chats");
        setContacts(res.data);
      } catch (err) {
        console.error("Failed to load chats", err);
      }
    };

    fetchContacts();
  }, []);

  // Search filter by username
  const filteredContacts = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();
    if (!value) return contacts;

    return contacts.filter((contact) =>
      contact.username?.toLowerCase().includes(value)
    );
  }, [contacts, searchTerm]);

  const loadMessages = async (contactId) => {
    try {
      const msgRes = await api.get(`/chat/messages/${contactId}`);
      setMessages(msgRes.data);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  // Start QKD + load messages when a user is selected
  useEffect(() => {
    if (!selectedContact) return;

    const startQkdAndLoadMessages = async () => {
      try {
        const qkdRes = await api.post("/qkd/session", {
          toUserId: selectedContact._id,
        });
        setKeyId(qkdRes.data.keyId);

        await loadMessages(selectedContact._id);
      } catch (err) {
        console.error("Failed to start QKD or load messages", err);
      }
    };

    startQkdAndLoadMessages();
  }, [selectedContact]);

  // Polling for new messages
  useEffect(() => {
    if (!selectedContact) return;

    const interval = setInterval(() => {
      loadMessages(selectedContact._id);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedContact]);

  const handleSend = async () => {
    if (!text.trim() || !selectedContact || !keyId) return;

    try {
      const res = await api.post("/chat/messages", {
        to: selectedContact._id,
        body: text,
        keyId,
      });

      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="qchat-shell">
      {/* LEFT APP SIDEBAR */}
      <div className="qchat-app-sidebar">
        <div className="qchat-logo">Qchat</div>
        <div className="qchat-app-icons">
          <div className="qchat-icon-row">≡</div>
          <div className="qchat-icon-row">💬</div>
          <div className="qchat-icon-row">⚙</div>
        </div>
        <div
          className="qchat-app-user"
          onClick={() => navigate("/profile")}
          style={{ cursor: "pointer" }}
        >
          🙂
        </div>
      </div>

      {/* MIDDLE CHATS PANEL */}
      <div className="qchat-chats-panel">
        <div className="qchat-chats-header">Chats</div>

        <div className="qchat-search-wrapper">
          <input
            className="qchat-search-input"
            placeholder="Search people by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="qchat-chats-divider" />

        <div className="qchat-chats-list">
          <ChatSidebar
            contacts={filteredContacts}
            selectedContact={selectedContact}
            onSelect={setSelectedContact}
          />

          {filteredContacts.length === 0 && (
            <div className="qchat-no-results">No users found</div>
          )}
        </div>
      </div>

      {/* RIGHT MAIN PANEL */}
      <div className="qchat-main-panel">
        <div className="qchat-main-topbar" />

        {!selectedContact ? (
          <div className="qchat-main-center">
            <h2>Qchat for you!!!!!</h2>
            <p>send and receive message with</p>
            <p>using quantum key cryptography</p>
            <p className="qchat-main-foot">
              end to end secured with cryptography
            </p>
          </div>
        ) : (
          <ChatWindow
            contact={selectedContact}
            messages={messages}
            text={text}
            setText={setText}
            onSend={handleSend}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};

export default ChatsPage;