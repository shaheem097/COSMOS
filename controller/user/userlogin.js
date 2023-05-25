const { response } = require("express");
const userHelper = require("../../helpers/userHelper");

module.exports = {
  userlogin: (req, res) => {
    if (req.session.user) {
      res.redirect("/");
    } else {
      let loginerr = req.session.loginerr;
      let block = req.session.userblock;
      let signup = req.session.signup;

      req.session.userblock = false;
      req.session.loginerr = false;
      req.session.signup = false;

      if (loginerr && block != true) {
        res.render("user/login", { loginerr });
      } else if (signup) {
        res.render("user/login", { signup });
      } else if (block) {
        res.render("user/login", { block });
      } else {
        res.render("user/login");
      }
    }
  },

  postuserlogin: (req, res) => {
    userHelper.forlogin(req.body).then((response) => {
      if (response.login) {
        const previousUrl = req.header("aaaaaaa");

        req.session.user = true;
        req.session.userdata = response.userdata;

        res.redirect("/");
      } else {
        req.session.loginerr = true;
        req.session.user = false;
        if (response.block) {
          req.session.userblock = true;
        }
        res.redirect("/login");
      }
    });
  },

  userlogout: (req, res) => {
    req.session.user = false;
    req.session.userdata = null;
    res.redirect("/");
  },
};
