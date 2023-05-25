const Coupon = require("../../model/coupon");
module.exports = {
  checkcoupon: (id, uid) => {
    return new Promise((resolve, reject) => {
      Coupon.findOne({ code: id }).then((data) => {
        if (data) {
          let used = false;
          data.used.forEach((element) => {
            if (element == uid) {
              used = true;
            }
          });
          if (used) {
            resolve({ used: true, found: true });
          } else {
            resolve({ used: false, data, found: true });
          }
        } else {
          resolve({ found: false });
        }
      });
    });
  },
};
