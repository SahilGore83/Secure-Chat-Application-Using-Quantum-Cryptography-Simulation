const express = require("express");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const Message = require("../models/Message");
const qkdApi = require("../utils/qkdClient");

const router = express.Router();

// GET /api/chat/chats
// Returns list of all users except the current one
router.get("/chats", auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select(
      "username avatarUrl phone"
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/chat/messages/:userId
router.get("/messages/:userId", auth, async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const myId = req.user.id;

    const rows = await Message.find({
      $or: [
        { from: myId, to: otherUserId },
        { from: otherUserId, to: myId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    const messages = [];

    for (const m of rows) {
      // Legacy messages without encryption fields
      if (!m.keyId || !m.iv || !m.ciphertext || !m.tag) {
        messages.push({
          _id: m._id,
          from: m.from,
          to: m.to,
          body: m.body || "",
          createdAt: m.createdAt,
        });
        continue;
      }

      // New encrypted messages -> decrypt via BB84
      try {
        const decRes = await qkdApi.post("/bb84/decrypt", {
          keyId: m.keyId,
          iv: m.iv,
          ciphertext: m.ciphertext,
          tag: m.tag,
        });

        messages.push({
          _id: m._id,
          from: m.from,
          to: m.to,
          body: decRes.data.plaintext,
          createdAt: m.createdAt,
        });
      } catch (e) {
        console.error(
          "Decrypt failed for message",
          m._id,
          e.response?.data || e.message
        );
        messages.push({
          _id: m._id,
          from: m.from,
          to: m.to,
          body: "[unable to decrypt]",
          createdAt: m.createdAt,
        });
      }
    }

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/chat/messages
router.post("/messages", auth, async (req, res) => {
  try {
    const { to, body, keyId } = req.body;
    if (!to || !body || !keyId) {
      return res
        .status(400)
        .json({ message: "to, body, keyId are required" });
    }

    const encRes = await qkdApi.post("/bb84/encrypt", {
      keyId,
      plaintext: body,
    });

    const { iv, ciphertext, tag } = encRes.data;

    const msg = await Message.create({
      from: req.user.id,
      to,
      keyId,
      iv,
      tag,
      ciphertext,
    });

    res.status(201).json({
      _id: msg._id,
      from: msg.from,
      to: msg.to,
      body,
      createdAt: msg.createdAt,
    });
  } catch (err) {
    console.error("Send message error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;



