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

router.post("/session/:sessionId/preferences", async (req, res) => {
  const { query } = req;
  const { body } = req;
  const { sessionId } = req.params;

  const result = await sessions.updateSessionPreferences(sessionId, body);
  console.log("result prefs", result);

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

router.post("/user/:userId", async (req, res) => {
  const { body } = req;
  const result = await users.updateUser(body);
  res.send(result);
});

module.exports = router;
