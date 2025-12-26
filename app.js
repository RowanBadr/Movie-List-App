const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");
const router = require("./routes");

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");


mongoose
  .connect("mongodb://127.0.0.1:27017/moviesdb")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));


passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ username });
    if (!user) return done(null, false);
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return done(null, false);
    return done(null, user);
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id).then((user) => done(null, user))
);


app.use("/", router);


app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);









