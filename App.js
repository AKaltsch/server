require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();

const User = require("./Models/UserModel");

const MONGODB_URI = process.env.MONGODB_KEY;

app.use(cors());
app.use(express.json());

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.post("/api/register", async (req, res, next) => {
  try {
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: "duplicate name/email" });
  }
});

app.post("/api/login", async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.emaild,
    password: req.body.password,
  });
  if (user) {
    res.json({ status: "ok", user: true });
  } else {
    res.json({ status: "error", user: false });
  }
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => console.log(err));
