const express = require("express");
const cors = require("cors");

const app = express();

//test save

app.use(cors());
app.use(express.json());

app.post("/api/register", (req, res, next) => {
  console.log(req.body);
});

app.listen(4000, () => {
  console.log("server is running on port 4000");
});
