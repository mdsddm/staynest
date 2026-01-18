const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

// Signup Get Route
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});
// Signup Get Route
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      await User.register(newUser, password);
      req.flash("success", "Welcome to StayNest!");
      res.redirect("/listings");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }),
);

// Login Get Route
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});
// Login Post Route
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to StayNest!");
    res.redirect("/listings");
  },
);
// Logout Route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
});
module.exports = router;
