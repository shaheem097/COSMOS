const { response } = require("express");
const userHelper = require("../../helpers/userHelper");
const swal = require("sweetalert");
module.exports = {
  checkout: (req, res) => {
    let found = req.session.found;
    req.session.found = true;

    let used = req.session.used;
    req.session.used = false;

    let userdata = req.session.userdata;
    let uid = req.session.userdata._id;
    let newtotal = req.session.newtotal;

    let couponapplied = req.session.couponapplied;

    let couponvalue = req.session.couponvalue;

    let expired = req.session.cexpired;
    req.session.cexpired = false;

    let minerr = req.session.minerr;
    req.session.minerr = false;

    let minvalue = req.session.minvalue;

    let code = req.session.code1;

    userHelper.viewcart(uid).then((response) => {
      let items = response.data;

      if (response.empty) {
        res.redirect("/");
      } else {
        userHelper.stockchecker(items).then((outofstock) => {
          if (outofstock.length > 0) {
            userHelper.cartstockupdate(outofstock).then(() => {
              userHelper.getaddressbyid(uid).then((address) => {
                let data = response.data;

                res.render("user/checkout1", {
                  data,
                  address,
                  userdata,
                  newtotal,
                  expired,
                  couponapplied,
                  minerr,
                  minvalue,
                  couponvalue,
                  used,
                  found,
                  code,
                  reload: true,
                });
              });
            });
          } else {
            userHelper.getaddressbyid(uid).then((address) => {
              let data = response.data;

              userHelper.findWallet(uid).then((wal) => {
                let wa = Number(wal.WalletAmount);
                res.render("user/checkout", {
                  wa,
                  data,
                  address,
                  userdata,
                  newtotal,
                  expired,
                  couponapplied,
                  minerr,
                  minvalue,
                  couponvalue,
                  used,
                  found,
                  code,
                  reload: false,
                });
              });
            });
          }
        });
      }
    });
  },
  orderplaced: (req, res) => {
    let userdata = req.session.userdata;

    res.render("user/orderplaced", { userdata });
  },

  clear: (req, res) => {
    let uid = req.session.userdata._id;

    let code = req.session.code;

    req.session.gotoOrder = true;

    userHelper.getallcart().then((cdata) => {
      userHelper.updatestock(cdata).then(() => {
        userHelper.clearcart(uid).then(() => {
          if (req.session.razorpay) {
            let oid = req.session.razororderId;
            userHelper.changePaymentStatus(oid).then(() => {
              res.redirect("/profile");
            });
          } else {
            res.redirect("/profile");
          }
          // res.redirect("/");
        });
      });
    });
  },


  placeorder: (req, res) => {
    let count = 0;
    let uid = req.session.userdata._id;
    let address = req.body.address;
    let amount = req.body.amount;
    let payment = req.body.payment_mode;
    let phone = req.session.userdata.phone;
    let coupon = false;
    let code = req.session.code1;
    if (req.session.couponapplied) {
      amount = req.body.newtotal;
      coupon = true;
    }

    req.session.couponapplied = false;
    req.session.couponvalue = 0;

    req.session.newtotal = 0;

    if (payment == "wallet") {
      console.log("WALLET@@@@@");
      userHelper.findWallet(uid).then((walltet) => {
        let walletamount = Number(walltet.WalletAmount);
        let amount1 = Number(amount);
        if (walletamount < amount1) {
          req.session.badwallet = true;

          console.log("CHECKINGGG1111111111111111");
          res.redirect("/checkout");
        } else {
          req.session.badwallet = false;
        }

        console.log(req.session.badwallet);
        console.log("?????/////////");
      });
    }

    userHelper.viewcart(uid).then((response) => {
      let cart = response.data;
      userHelper.getoneaddress(address).then((address1) => {
        let address2 =
          address1.name +
          "," +
          address1.address +
          "," +
          address1.state +
          "," +
          address1.country +
          "," +
          address1.pincode;

        userHelper
          .placeorder(uid, cart, address2, payment, amount, phone, coupon, code)
          .then((order) => {
            if (payment == "wallet") {
              userHelper.findWallet(uid).then((wallet) => {
                walletamount = Number(wallet.WalletAmount);
                check = walletamount - Number(amount);
                console.log(check);
                if (check >= 0) {
                  count = 1;
                  userHelper.updateWallet(uid, check).then((response) => {
                    req.session.razorpay = false;
                  });
                  if (count === 1) {
                    res.redirect("/clear");
                  }
                } else {
                  req.session.razorpay = false;
                  req.session.wallerr = true;
                  console.log("insufficient balence");

                  userHelper.deleteoder(order._id).then(() => {
                    console.log("DELETED");
                  });
                }
              });
            } else if (payment == "razorpay") {
              userHelper
                .generateRazorpay(order.amount, order._id)
                .then((data) => {
                  console.log("vernnundo");
                  req.session.razorpay = true;
                  req.session.razororderId = order._id;

                  console.log("data", data);
                  res.json(data);
                });
            }
            else
            {
              res.redirect('/clear1')
            }
          });
      });
    });
  },


  orderdetails: (req, res) => {
    let userdata = req.session.userdata;

    userHelper.getorderbyid(req.params.id).then((odata) => {
      res.render("user/orderdetails", { userdata, odata });
    });
  },

  cancelorder: (req, res) => {
    const previousUrl = req.header("Referer");
    let userid = req.session.userdata._id;
    console.log(userid);

    userHelper.cancelorder(req.params.id).then((response) => {
      userHelper.getorderbyid(req.params.id).then((order) => {
        let total = Number(order.amount);
        console.log(total);

        if (order.paymentStatus === "refunded") {
          userHelper.addtowallet(userid, total).then((response2) => {
            res.redirect(previousUrl);
          });
        }
      });
    });
  },
  returnorder: (req, res) => {
    const previousUrl = req.header("Referer");
    let userid = req.session.userdata._id;

    userHelper.returnorder(req.params.id).then(() => {
      userHelper.getorderbyid(req.params.id).then((order) => {
        let total = Number(order.amount);
        console.log(total);

        userHelper.addtowallet(userid, total).then((response2) => {
          res.redirect(previousUrl);
        });
      });
    });
  },

  orders: (req, res) => {
    let userdata = req.session.userdata;
    userHelper.getorderbyid(userdata._id).then((odata) => {
      res.render("user/orders", { userdata, odata });
    });
  },
};
