const { response } = require("express");
const userHelper = require("../../helpers/userHelper");

module.exports = {
  addAddress: (req, res) => {
    const previousUrl = req.header("Referer");
    let uid = req.session.userdata._id;

    userHelper.addnewaddress(req.body, uid).then(() => {
      req.session.newaddress = true;

      res.redirect(previousUrl);
    });
  },

  deleteaddress: (req, res) => {
    const previousUrl = req.header("Referer");
    userHelper.deleteaddress(req.params.id).then(() => {
      req.session.addel = true;
      res.redirect(previousUrl);
    });
  },
};
