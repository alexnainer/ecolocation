const express = require("express");
const app = express();
const port = 3001;

require("dotenv").config();

const cors = require("cors");

app.use(cors());
app.options("*", cors());

const router = require("./routes");
app.use("/api/v1.0", router);

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
