require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();

const MONGODB_URI = process.env.MONGODB_KEY;

app.use(cors());
app.use(express.json());

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.post("/api/register", (req, res, next) => {
  console.log(req.body);
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => console.log(err));
