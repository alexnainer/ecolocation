const express = require("express");
const router = express.Router();
// const dataParser = require("./dataParser");
const api = require("./api");

router.get("/example", async (req, res) => {
  const { query } = req;
  
  const result = dataParser.calculate();

  res.send(result);
});


module.exports = router;
