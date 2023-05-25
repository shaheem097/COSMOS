const { response } = require("express");
const adminHelper = require("../../helpers/adminHelper");

module.exports = {
  viewbanner: (req, res) => {
    adminHelper.viewbanner().then((banner) => {
      let data = banner;
      let del = req.session.deleted;
      req.session.deleted = false;

      res.render("admin/banner", { del, data });
    });
  },

  newbanner: (req, res) => {
    let banneradded = req.session.banneradded;
    req.session.banneradded = false;

    res.render("admin/addbanner", { banneradded });
  },

  postbanner: (req, res) => {
    let images = req.files.map((a) => a.filename);
    adminHelper.addbanner(images, req.body).then((response) => {
      req.session.banneradded = response.banneradded;
      req.session.banner = response.data;
      res.redirect("/admin/newbanner");
    });
  },
  deletebanner: (req, res) => {
    adminHelper.deletebanner(req.params.id).then((response) => {
      req.session.deleted = response.delete;

      res.redirect("/admin/banner");
    });
  },
};
