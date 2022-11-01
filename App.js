require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();

const User = require("./Models/UserModel");

const MONGODB_URI = process.env.MONGODB_KEY;
const SECRET = process.env.SECRET_KEY;

app.use(cors());
app.use(express.json());

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.post("/api/register", async (req, res, next) => {
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: "duplicate name/email" });
  }
});

app.post("/api/login", async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.json({ status: "error", error: "Invalid Login" });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (validPassword) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      SECRET
    );

    res.json({ status: "ok", user: token });
  } else {
    res.json({ status: "error", user: false });
  }
});

app.get("/api/quote", async (req, res, next) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return res.json({ status: "ok", quote: user.quote });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.post("/api/quote", async (req, res, next) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, SECRET);
    const email = decoded.email;
    const user = await User.updateOne(
      { email: email },
      { $set: { quote: req.body.quote } }
    );

    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.get("*", () => {
  // send the index.html from built folder
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => console.log(err));
