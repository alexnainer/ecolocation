const express = require("express");
const router = express.Router();
// const dataParser = require("./dataParser");
const api = require("./api");
const sessions = require("./sessions");

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

module.exports = router;
