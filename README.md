<div align="center">

# 🔐 Qchat
### *Secure Chat Application Using Quantum Cryptography Simulation*

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Python](https://img.shields.io/badge/Security%20Layer-Python%20%2B%20FastAPI-3776AB?style=for-the-badge&logo=python&logoColor=white)
![AES](https://img.shields.io/badge/Encryption-AES--256--GCM-6A5ACD?style=for-the-badge)

A modern secure chat application that combines a **React web interface**, **Node.js backend**, **MongoDB Atlas**, and a **Python FastAPI BB84 simulation service** to demonstrate quantum-inspired secure messaging.

</div>

---

## 📌 Overview

**Qchat** is a full-stack secure messaging system built as an academic project to explore how a **BB84-inspired quantum key distribution simulation** can be integrated into a real-world chat application architecture.

Instead of storing plaintext messages, Qchat encrypts chat messages using **AES-256-GCM**, where the session key is derived from a **Python-based BB84 simulation service**.

---

## ✨ Features

- 👤 User registration and login
- 🔑 JWT-based authentication
- 💬 Two-user secure chat interface
- 🔄 Auto-refreshing messages using polling
- 🧠 Separate Python BB84 service for key generation
- 🔐 AES-256-GCM encryption and decryption
- 🗄️ MongoDB stores encrypted messages only
- ⚙️ Profile / settings page
- 🧪 Easy testing with two browser sessions on the same system

---

## 🏗️ System Architecture

Qchat is built using a **3-part architecture**:

### 1. Frontend Layer
Built with **React + Vite**
- Register page
- Login page
- Chats page
- Profile / settings page
- API communication using Axios
- JWT stored in browser local storage

### 2. Backend Layer
Built with **Node.js + Express**
- Authentication routes
- Chat routes
- QKD session route
- JWT middleware
- MongoDB Atlas integration
- Communication with Python BB84 service

### 3. Security Layer
Built with **Python + FastAPI**
- BB84 simulation engine
- Key generation and in-memory key store
- AES-256-GCM encryption
- AES-256-GCM decryption
- Endpoints:
  - `/bb84/session`
  - `/bb84/encrypt`
  - `/bb84/decrypt`

---

## 🔄 How Secure Messaging Works

1. User A opens a chat with User B.
2. Frontend asks backend to create a QKD session.
3. Backend calls the Python BB84 service.
4. Python simulates BB84 and generates a shared key.
5. Python returns a `keyId` to Node backend.
6. When a message is sent:
   - Frontend sends plaintext + `keyId` to backend.
   - Backend sends plaintext to Python service.
   - Python encrypts the message using **AES-256-GCM**.
   - Backend stores only:
     - `keyId`
     - `iv`
     - `tag`
     - `ciphertext`
7. When messages are retrieved:
   - Backend fetches encrypted data from MongoDB.
   - Backend sends encrypted data to Python service.
   - Python decrypts the message and returns plaintext.
   - Frontend displays the readable message.

✅ **Plaintext is never stored in the database for new messages.**

---

## 🗃️ Database Design

### `users` collection
Stores:
- `username`
- `phone`
- `passwordHash`
- `about`
- `avatarUrl`
- `createdAt`
- `updatedAt`

### `messages` collection
Stores:
- `from`
- `to`
- `keyId`
- `iv`
- `tag`
- `ciphertext`
- `createdAt`
- `updatedAt`

---

## 🧰 Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcryptjs
- JSON Web Token (JWT)
- CORS
- dotenv
- Nodemailer

### BB84 Service
- Python
- FastAPI
- Uvicorn
- PyCryptodome
- Pydantic

---

## 📁 Project Structure

```text
QCHAT_APP_/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── bb84-service/
│   ├── bb84/
│   ├── models/
│   ├── store/
│   ├── main.py
│   └── requirements.txt
│
└── README.md


🚀 Getting Started


1. Clone the repository


git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd QCHAT_APP_


2. Run the Frontend


cd frontend
npm install
npm run dev


Frontend runs on:

http://localhost:5173
or sometimes:

http://localhost:5174


3. Run the Backend


Create a .env file in backend/:



MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
QKD_SERVICE_URL=http://localhost:8001
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173


Run:



cd backend
npm install
npm run dev


Backend runs on:

http://localhost:5000


4. Run the BB84 Python Service


cd bb84-service
python -m venv .venv


Activate virtual environment:



Windows
.venv\Scripts\activate


macOS/Linux
source .venv/bin/activate


Install dependencies:



pip install -r requirements.txt


Run the service:



uvicorn main:app --reload --port 8001


BB84 service runs on:

http://localhost:8001


Health check:



curl http://127.0.0.1:8001/health


🧪 Testing Two Users on One System


To test a real conversation between two users:



Open one normal browser window and log in as User A
Open one incognito/private window and log in as User B
Open chats in both windows
Send messages between them


Polling updates the messages automatically after a short delay.



🔒 Security Highlights


Passwords are hashed using bcrypt
Login authentication uses JWT
Messages are encrypted using AES-256-GCM
Session keys are derived using a BB84-inspired protocol simulation
MongoDB stores encrypted fields only for new messages


⚠️ Current Limitation


The BB84 service currently stores generated keys in memory only.



This means:

If the Python service restarts,
old keyId values are lost,
and previously encrypted messages cannot be decrypted unless persistent key storage is added.


This is acceptable for a prototype/demo version, but production systems would require a secure persistent key store.



🔮 Future Improvements


WebSocket / Socket.IO support for true real-time chat
Persistent BB84 session key storage
Email verification support
Online / offline presence
Last seen and message delivery indicators
Group chats and media sharing
Better profile persistence


🎯 Project Objective


Build a simple, modern chat app that lets people talk in real time while their messages are protected using a BB84-inspired quantum key and strong encryption behind the scenes.



👨‍💻 Author


Sahil Gore
