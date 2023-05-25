const { response } = require("express");
const userHelper = require("../../helpers/userHelper");

module.exports = {
  usersignup: (req, res) => {
    if (req.session.user) {
      res.redirect("/login");
    } else {
      let exphone = req.session.exphone;
      let exemail = req.session.exemail;

      req.session.exphone = false;
      req.session.exemail = false;
      if (exemail) {
        res.render("user/signup", { exemail });
      } else if (exphone) {
        res.render("user/signup", { exphone });
      } else {
        res.render("user/signup");
      }
    }
  },

  postusersignup: (req, res) => {
    console.log("ddddddddd");

    userHelper.signup(req.body).then((response) => {
      console.log(response);
      userid = response.usercreated._id;
      console.log(userid);

      userHelper.creatwallet(userid).then((wallet) => {
        if (response.exemail) {
          req.session.exemail = true;
          res.redirect("/signup");
        } else if (response.exphone) {
          req.session.exphone = true;
          res.redirect("/signup");
        } else {
          req.session.signup = true;
          res.redirect("/login");
        }
      });
    });
  },
};
