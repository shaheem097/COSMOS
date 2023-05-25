const { response } = require("express");
const userHelper = require("../../helpers/userHelper");
module.exports = {
  shop: (req, res) => {
    let userdata = req.session.userdata;
    let added = req.session.itemadded;
    req.session.itemadded = false;
    let exist = req.session.exist;
    req.session.exist = false;

    const currentUrl = req.originalUrl;

    userHelper.getallproducts().then((response) => {
      let allproducts = response;
      req.session.allproducts = allproducts;

      userHelper.getcategory().then((cat) => {
        res.render("user/shop", {
          response,
          cat,
          userdata,
          added,
          exist,
          allproducts,
        });
      });
    });
  },

  bycategory: (req, res) => {
    let userdata = req.session.userdata;
    let cname = req.params.id;
    let added = req.session.itemadded;
    req.session.itemadded = false;
    let exist = req.session.exist;

    req.session.exist = false;

    userHelper.getproductbycategory(req.params.id).then((data) => {
      userHelper.getcategory().then((cdata) => {
        res.render("user/shop", { data, cdata, userdata, cname, added, exist });
      });
    });
  },
  productdetails: (req, res) => {
    let userdata;
    let uid;
    if (req.session.user) {
      userdata = req.session.userdata;
      uid = req.session.userdata._id;
    } else {
      uid = "null";
    }

    let itemadded = req.session.itemadded;
    let more = req.session.more;

    req.session.more = false;

    req.session.itemadded = false;

    userHelper.getcategory().then((cat) => {
      userHelper.getoneproduct(req.params.id).then((data) => {
        req.session.out = false;
        let out = req.session.out;
        if (data.stock == 0) {
          more = req.session.more = false;
          req.session.out = true;
          out = req.session.out;
        }

        let pid1 = data._id;

        console.log(data._id);

        res.render("user/product-details", {
          data,
          cat,
          userdata,
          itemadded,
          more,
          out,
        });
      });
    });
  },
};
