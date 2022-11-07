//jshint esversion:6
require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();
const DB = process.env.DATABASE_URL;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("home");
});

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB connection sucessful");
  });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secret = process.env.SECRET;

const User = new mongoose.model("User", userSchema);

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    const Newuser = new User({
      email: req.body.username,
      password: hash,
    });
    Newuser.save(function (err) {
      if (err) {
        console.log(err);
      }
      res.render("secrets");
    });
  });
});

app.post("/login", (req, res) => {
  const password = req.body.password;

  User.findOne({ email: req.body.username }, (err, found) => {
    if (err) {
      console.log(err);
    } else {
      if (found) {
        bcrypt.compare(password, found.password, (err, result) => {
          if (result === true) {
            res.render("secrets");
          }
        });
      }
    }
  });
});
app.listen(process.env.PORT || 5000, () => {
  console.log("server is running");
});
