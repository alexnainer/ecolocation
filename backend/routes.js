const express = require("express");
const router = express.Router();
// const dataParser = require("./dataParser");
const api = require("./api");
const sessions = require("./sessions");
const users = require("./users");
const driver = require("./calculator");

router.get("/session/new", async (req, res) => {
  const result = await sessions.getSession();

  res.send(result);
});

router.get("/session/:sessionId", async (req, res) => {
  // const { query } = req;
  const { sessionId } = req.params;

  const result = await sessions.getSession(sessionId);
  res.send(result);
});

router.get("/session/:sessionId/calculate", async (req, res) => {
  // const { query } = req;
  const { sessionId } = req.params;
  driver(sessionId);
  const result = await sessions.getSession(sessionId);
  res.send(result);
});

router.post("/user/new", async (req, res) => {
  const { body } = req;
  const result = await users.createUser(body.name);
  res.send(result);
});

router.post("/user/:userId", async (req, res) => {
  const { userId, body } = req;
  const result = await users.updateUser({ userId, body });
  res.send(result);
});

module.exports = router;
