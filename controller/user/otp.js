const { response } = require("express");
const userHelper = require("../../helpers/userHelper");

module.exports = {
  loginwithotp: (req, res) => {
    console.log("ajaxiscoming");
    let phone = req.body.phone;
    console.log(phone);
    if (req.session.user) {
      res.redirect("/");
    } else {
      userHelper.loginwithotp(phone).then((response) => {
        if (response.err) {
          req.session.otperr = true;
          res.json({ login: false });
        } else {
          req.session.userdata = response.userdata;
          req.session.user = true;
          res.json({ login: true });
        }
      });
    }
  },
  otplogin: (req, res) => {
    if (req.session.user) {
      res.redirect("/");
    } else {
      let err = req.session.err;
      req.session.err = false;

      res.render("user/otplogin", { err });
    }
  },
  checknumber: (req, res) => {
    if (req.session.user) {
      res.redirect("/");
    } else {
      console.log("etheeeeeeeeee");
      let number = req.body.number; // Access the number from req.body

      userHelper
        .checkphonenumber(number)
        .then((response) => {
          if (response.check) {
            console.log("number verified");
            // Number is registered
            res.json({ registered: true });
          } else {
            req.session.numbercheckerr = true;
            console.log("number not registerd");
            // Number is not registered
            res.json({ registered: false });
          }
        })
        .catch((error) => {
          console.log("Error checking phone number:", error);
          res.status(500).json({ error: "Internal server error" });
        });
    }
  },
};
