const { response } = require("express");
const userHelper = require("../../helpers/userHelper");
module.exports = {
  homepage: (req, res) => {
    req.session.start = true;

    userHelper.getallproducts().then((response) => {
      let allproducts = response;
      req.session.allproducts = allproducts;
      req.session.start = true;
      let userdata = req.session.userdata;
      userHelper.getallbanners().then((responseb) => {
        let banner = responseb;
        userHelper.getcategory().then((cdata) => {
          res.render("user/index", { userdata, banner, allproducts, cdata });
        });
      });
    });
  },
  contact: (req, res) => {
    if (req.session.user) {
      let userdata = req.session.userdata;
      res.render("user/contact", { userdata });
    } else {
      res.render("user/contact");
    }
  },
  block: (req, res) => {
    req.session.blockpage = false;
    res.render("user/blocked");
  },

  userprofile: (req, res) => {
    let userdata = req.session.userdata;
    let uid = req.session.userdata._id;
    let update = req.session.updated;
    let address = req.session.newaddress;
    console.log(userdata);
    let del = req.session.addel;
    req.session.addel = false;
    req.session.newaddress = false;
    req.session.updated = false;
    let gotoOrder = req.session.gotoOrder;
    req.session.gotoOrder = false;

    userHelper.getaddressbyid(uid).then((data) => {
      userHelper.getorders(uid).then((orders) => {
        userHelper.findWallet(uid).then((wallet) => {
          orders = orders.reverse();
          res.render("user/profile", {
            orders,
            userdata,
            address,
            data,
            update,
            del,
            gotoOrder,
            wallet,
          });
        });
      });
    });
  },

  updateprofile: (req, res) => {
    userHelper.updateprofile(req.params.id, req.body).then((response) => {
      req.session.updated = response.updated;
      req.session.userdata = response.data;
      res.redirect("/profile");
    });
  },

  search: (req, res) => {
    userHelper.search(req.body.search).then((data) => {
      console.log(req.body.search);
      let key = req.body.search;
      let empty = false;
      console.log(data);

      if (data.length == 0) {
        empty = true;
      } else {
        empty = false;
      }
      res.render("user/searchResults", { data, key, empty });
    });
  },
};
