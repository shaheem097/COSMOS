const { response } = require("express");
const adminHelper = require("../../helpers/adminHelper");

module.exports = {
  addproduct: (req, res) => {
    adminHelper.getcategory().then((data) => {
      if (req.session.added) {
        let added = req.session.added;
        req.session.added = false;
        res.render("admin/addproduct", { added, data });
      } else {
        res.render("admin/addproduct", { data });
      }
    });
  },

  postaddproduct: (req, res) => {
    let images = req.files.map((a) => a.filename);

    // res.redirect('/admin/addproduct')
    adminHelper.addproduct(req.body, images).then((add) => {
      req.session.added = true;
      res.redirect("/admin/products");
    });
  },

  viewproducts: (req, res) => {
    adminHelper.viewproducts().then((data) => {
      let del = req.session.del;
      req.session.del = false;
      let update = req.session.update;
      let added = req.session.added;
      req.session.added = false;
      req.session.update = false;

      res.render("admin/products", { data, update, added, del });
    });
  },

  editproducts: (req, res) => {
    adminHelper.getoneproduct(req.params.id).then((response) => {
      req.session.image1 = response.data.image[0];
      req.session.image2 = response.data.image[1];
      req.session.image3 = response.data.image[2];
      req.session.image4 = response.data.image[3];
      let data = response.data;
      let cat = response.cat;

      res.render("admin/editproducts", { data, cat });
    });
  },
  updateproduct: (req, res) => {
    let data = req.files;

    if (data.length == 0) {
      adminHelper.updateproduct1(req.params.id, req.body).then((response) => {
        req.session.update = response.updated;
        res.redirect("/admin/products");
      });
    } else {
      let images = req.files.map((a) => a.filename);
      let changes = [
        req.session.image1,
        req.session.image2,
        req.session.image3,
        req.session.image4,
      ];
      let len = images.length;

      if (req.body.img1 == 0) {
        images[len] = req.session.image1;
        len++;
      }

      if (req.body.img2 == 0) {
        images[len] = req.session.image2;
        len++;
      }

      if (req.body.img3 == 0) {
        images[len] = req.session.image3;
        len++;
      }

      if (req.body.img4 == 0) {
        images[len] = req.session.image4;
        len++;
      }

      adminHelper
        .updateproduct(req.params.id, req.body, images)
        .then((response) => {
          req.session.update = response.updated;
          res.redirect("/admin/products");
        });
    }
  },
  deleteproduct: (req, res) => {
    adminHelper.deleteproduct(req.params.id).then((response) => {
      req.session.del = response.del;
      res.redirect("/admin/products");
    });
  },
};
