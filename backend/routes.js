const express = require("express");
const router = express.Router();
// const dataParser = require("./dataParser");
const api = require("./api");
const sessions = require("./sessions");
const users = require("./users");
const driver = require("./calculator");

const log = require("debug")("routes");
const logError = require("debug")("routes:error");

router.get("/session/new", async (req, res) => {
  const result = await sessions.getSession();

  res.send(result);
});

router.get("/login", async (req, res) => {
  res
    .writeHead(200, {
      "Set-Cookie": "token=encryptedstring; HttpOnly",
      "Access-Control-Allow-Credentials": "true",
    })
    .send();
});

router.get("/private", async (req, res) => {
  log("req.cookies.token", req.cookies.token);
  if (!req.cookies.token) return res.status(401).send();
  res.status(200).json({ secret: "Ginger ale is a specific Root Beer" });
});

router.get("/session/:sessionId", async (req, res) => {
  // const { query } = req;
  const { sessionId } = req.params;

  const result = await sessions.getSession(sessionId);
  //console.log("result", result);
  res.send(result);
});

router.put("/session/:sessionId/preferences/:type", async (req, res) => {
  const { query } = req;
  const { body } = req;
  const { sessionId, type } = req.params;

  log("type", type);

  let result;
  switch (type) {
    case "location":
      result = await sessions.updateSessionLocation(sessionId, body);
      break;
    case "meeting":
      result = await sessions.updateSessionMeeting(sessionId, body);
      break;
    default:
      res.sendStatus(404);
  }

  res.send(result);
});

router.get("/session/:sessionId/calculate", async (req, res) => {
  // const { query } = req;
  const { sessionId } = req.params;
  log("Calculating for", sessionId);
  await driver(sessionId);
  // const result = await sessions.getSession(sessionId);
  res.sendStatus(200);
});

router.post("/user/new", async (req, res) => {
  const { body } = req;
  const result = await users.createUser(body);
  res.send(result);
});

router.put("/user/:userId", async (req, res) => {
  const { body } = req;
  const result = await users.updateUser(body);
  res.send(result);
});

router.delete("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  await users.deleteUser(userId);
  res.sendStatus(200);
});

module.exports = router;
