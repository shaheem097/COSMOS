const { response } = require("express");
const userHelper = require("../../helpers/userHelper");

module.exports = {
  PostVerifyPayment: (req, res) => {
    console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
    userHelper
      .verifypayment(req.body)
      .then(() => {
        console.log("ssssssssssssssssssssssssssssssssss");
        console.log(req.body);

        res.json({ status: true });
      })
      .catch((err) => {
        res.json({ status: false, err });
      });
  },
};
