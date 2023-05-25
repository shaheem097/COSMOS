const { response } = require("express");
const adminHelper = require("../../helpers/adminHelper");
module.exports = {
  userinfo: (req, res) => {
    adminHelper.userinfo().then((data) => {
      res.render("admin/userinfo", { data });
    });
  },

  blockuser: (req, res) => {
    let block = true;

    adminHelper.blockuser(req.params.id).then(() => {
      req.session.user = false;
      req.session.userdata = null;
      req.session.blockpage = true;
      res.redirect("/admin/userinfo");
    });
  },

  unblockuser: (req, res) => {
    adminHelper.unblockuser(req.params.id).then(() => {
      res.redirect("/admin/userinfo");
    });
  },
};
