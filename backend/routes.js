const express = require("express");
const router = express.Router();
// const dataParser = require("./dataParser");
const api = require("./api");
const sessions = require("./sessions");
const users = require("./users");
const driver = require("./calculator");

const log = require("debug")("server");
const logError = require("debug")("server:error");

router.get("/session/new", async (req, res) => {
    const result = await sessions.getSession();

    res.send(result);
});

router.get("/session/:sessionId", async (req, res) => {
    const { sessionId } = req.params;
    let result;
    try {
        result = await sessions.getSession(sessionId);
    } catch (e) {
        logError(e);
        res.sendStatus(500);
    }
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
    const { sessionId } = req.params;
    log("Calculating for", sessionId);
    try {
        await driver(sessionId);
    } catch (e) {
        logError(e);
        res.sendStatus(500);
    }
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
