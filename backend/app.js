const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { User } = require("./models/user");
const { Idea } = require("./models/idea");

const app = express();
const port = process.env.PORT || "5001";

mongoose.connect("mongodb://localhost:27017/buildmyidea", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    //should use OAuth in production
    //type: 'OAuth2',
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD,
    //clientId: process.env.OAUTH_CLIENTID,
    //clientSecret: process.env.OAUTH_CLIENT_SECRET,
    //refreshToken: process.env.OAUTH_REFRESH_TOKEN
  },
});


const bmiRootDir = __dirname.substring(0, __dirname.length - 8);
app.use(express.static(bmiRootDir + "/dist"));
app.use(bodyParser.json());

app.use((req,res,next) => {
	res.status(404).sendFile(`${bmiRootDir}/build/index.html`);
});

app.get('/', (req, res) => {
  res.sendFile(`${bmiRootDir}/build/index.html`);
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, identity) => {
    if (err) return res.sendStatus(403);
    req.name = identity.name;
    next();
  });
}

// API
const blocked_usernames = ['myIdeas','idea','login','register','newIdea','editIdea'];
app.post("/api/register", (req, res) => {
  User.exists({ username: req.body.username }).then((exists) => {
    if (exists || blocked_usernames.inlcudes(req.body.username))
      res.status(500).send("username unavailable");
  }).then(() => {
    User.exists({ email: req.body.email }).then((exists) => {
      if (exists) res.status(500).send("email taken")
    })
  }).then(() => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      const newUser = new User({
        email: req.body.email,
        username: req.body.username,
        password: hash
      })
      newUser.save()
      const accessToken = jwt.sign({name:newUser.username},process.env.ACCESS_TOKEN_SECRET);
      const refreshToken = jwt.sign({name:newUser.username},process.env.REFRESH_TOKEN_SECRET);
      newUser.refreshTokens.push(refreshToken);
      user.save();
      res.json({
        access_token: accessToken,
        refresh_token: refreshToken,
        username: newUser.username
      });
    })
  }).catch((e) => {
    console.log(e);
    res.status(500).send({ error: "Error when adding user" });
  });
})
