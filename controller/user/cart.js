const { response } = require("express");
const userHelper = require("../../helpers/userHelper");

module.exports = {
  viewcart: (req, res) => {
    let userdata = req.session.userdata;

    userHelper.viewcart(userdata._id).then((response) => {
      req.session.cartitems = response;
      let cart = response.data;
      let outforcart = req.session.outforcart;

      if (response.empty) {
        res.render("user/cart", { userdata, empty: true });
      } else {
        res.render("user/cart", { userdata, cart, empty: false, outforcart });
      }
    });
  },
  addtocartfromshop: (req, res) => {
    let pid = req.params.id;

    let uid = req.session.userdata._id;

    const previousUrl = req.header("Referer");
    userHelper.addtocartfromhome(pid, uid).then((exist) => {
      if (exist) {
        req.session.exist = true;
      } else {
        req.session.itemadded = true;
      }

      res.json({ status: true });
    });
  },
  addtocart: (req, res) => {
    const previousUrl = req.header("Referer");
    console.log("//?????????/////");
    req.session.couponapplied = false;

    let pid = req.body.pid;
    let offer = req.body.offer;
    let offprice = req.body.offprice;
    let userid = req.session.userdata._id;
    let qty = req.body.qty;
    console.log(qty + "qtyyy");
    userHelper
      .addtocart(req.params.id, userid, qty, offer, offprice, pid)
      .then((more) => {
        if (more) {
          req.session.more = true;
        }

        req.session.itemadded = true;
        res.redirect(previousUrl);
      });
  },

  cartupdate: (req, res) => {
    let qty = req.body.qty;
    let pid = req.body.pid;
    let uid = req.session.userdata._id;
    userHelper.cartupdate(qty, pid, uid).then(() => {
      res.json({ success: true });
    });
  },

  deletecartitem: (req, res) => {
    userHelper.deletecartitem(req.params.id).then(() => {
      res.redirect("/cart");
    });
  },

  clearcart: (req, res) => {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaa");

    userHelper.clearcart(req.params.id).then(() => {
      res.redirect("/cart");
    });
  },
};
