// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const messages = {}; // { subject1: [...], subject2: [...] }

app.get("/chat/:subject", (req, res) => {
  const subject = req.params.subject;
  res.json(messages[subject] || []);
});

app.post("/chat/:subject", (req, res) => {
  const subject = req.params.subject;
  const { author, text } = req.body;
  if (!messages[subject]) messages[subject] = [];
  const newMessage = { author, text };
  messages[subject].push(newMessage);
  res.status(201).json(newMessage);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
