const coupon = require("../../helpers/user/coupon");
module.exports = {
  applycoupon: (req, res) => {
    let uid = req.session.userdata._id;
    let total = Number(req.body.total);

    let code = req.body.code;
    req.session.code = code;
    console.log(code);

    coupon.checkcoupon(code, uid).then((response) => {
      console.log(response);
      if (response.found) {
        if (!response.used) {
          let limit = response.data.limit;
          let min = response.data.min;
          let discount = response.data.discount;
          let expire = response.data.expire;

          if (total < min) {
            req.session.minerr = true;
            req.session.minvalue = min;
          } else {
            req.session.minerr = false;
          }

          let today = new Date();
          let expire1 = new Date(expire);

          if (today > expire1) {
            req.session.cexpired = true;
            res.redirect("/checkout");
          } else if (req.session.minerr) {
            res.redirect("/checkout");
          } else {
            let off = (discount * total) / 100;

            if (off > limit) {
              off = limit;
            }
            let total1 = total - off;

            req.session.newtotal = total1;
            req.session.couponapplied = true;
            req.session.couponvalue = off;
            req.session.code1 = code;

            res.redirect("/checkout");
          }
        } else if (!response.found) {
          req.session.found = response.found;
          res.redirect("/checkout");
        } else {
          req.session.used = true;
          res.redirect("/checkout");
        }
      } else {
        req.session.found = false;
        res.redirect("/checkout");
      }
    });
  },

  removecoupon: (req, res) => {
    req.session.couponapplied = false;
    res.redirect("/checkout");
  },
};
