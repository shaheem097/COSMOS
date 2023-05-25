const { response } = require("express");
const adminHelper = require("../../helpers/adminHelper");

module.exports = {
  coupon: (req, res) => {
    let cadded = req.session.cadded;
    req.session.cadded = false;
    let cdel = req.session.coupondel;
    req.session.coupondel = false;
    let cerr = req.session.couponerr;
    req.session.couponerr = false;

    adminHelper.getcoupons().then((coupons) => {
      res.render("admin/coupon", { cadded, coupons, cdel, cerr });
    });
  },

  addcoupon: (req, res) => {
    let word = req.body.code;
    word = word.toUpperCase();
    req.body.code = word;

    adminHelper.addcoupon(req.body).then((err) => {
      if (err) {
        req.session.couponerr = true;
        req.session.cadded = false;
      } else {
        req.session.couponerr = false;
        req.session.cadded = true;
      }
      res.redirect("/admin/coupon");
    });
  },

  deltecoupon: (req, res) => {
    adminHelper.deletecoupon(req.params.id).then(() => {
      req.session.coupondel = true;
      res.redirect("/admin/coupon");
    });
  },
};
