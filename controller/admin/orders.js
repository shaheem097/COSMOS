const { response } = require("express");
const adminHelper = require("../../helpers/adminHelper");
module.exports = {
  orders: (req, res) => {
    adminHelper.allorders().then((orders) => {
      let orderupdate = req.session.orderupdate;
      req.session.orderupdate = false;

      orders = orders.reverse();
      res.render("admin/orders", { orders, orderupdate });
    });
  },

  editorder: (req, res) => {
    adminHelper.getorderbyid(req.params.id).then((order) => {
      res.render("admin/editorder", { order });
    });
  },
  updateorder: (req, res) => {
    adminHelper.updateorder(req.params.id, req.body).then(() => {
      req.session.orderupdate = true;
      res.redirect("/admin/orders");
    });
  },
};
