const { response } = require("express");
const adminHelper = require("../../helpers/adminHelper");

module.exports = {
  category: (req, res) => {
    adminHelper.getcategory().then((data) => {
      let newcat = req.session.newcat;
      let err = req.session.caterr;
      let del = req.session.del;
      let del0 = req.session.del0;
      req.session.newcat = false;
      req.session.caterr = false;
      req.session.del = false;
      let category = data;

      if (newcat) {
        res.render("admin/category", { newcat, category });
      } else if (err) {
        res.render("admin/category", { err, category });
      } else if (del) {
        res.render("admin/category", { del, category });
      } else if (del0) {
        res.render("admin/category", { del0, category });
      } else {
        res.render("admin/category", { category });
      }
    });
  },
  addcategory: (req, res) => {
    let word = req.body.name;
    word = word.charAt(0).toUpperCase() + word.slice(1);

    req.body.name = word;
    console.log(req.body);

    adminHelper.addcategory(req.body).then((data) => {
      if (data.status) {
        req.session.newcat = true;
        res.redirect("/admin/category");
      } else {
        req.session.caterr = true;
        res.redirect("/admin/category");
      }
    });
  },
  editcategory: (req, res) => {
    adminHelper.getcategorybyid(req.params.id).then((response) => {
      let data = response;

      res.render("admin/editcategory", { data });
    });
  },
  updateCategory: (req, res) => {
    adminHelper.updatecategory(req.params.id, req.body).then(() => {
      console.log("paramsid", req.params.i);
      res.redirect("/admin/category");
    });
  },

  deletecategory: (req, res) => {
    let deletekey = req.params.id;
    adminHelper.deletecategory(req.params.id, deletekey).then((response) => {
      if (!response.del) {
        req.session.del0 = true;
      }

      req.session.del = response.del;
      res.redirect("/admin/category");
    });
  },
};
