const User = require("../model/userschema.js");
const Product = require("../model/product-schema");
const Category = require("../model/category-schema");
const Cart = require("../model/cart-schema");
const Address = require("../model/Address-schema.js");
const Order = require("../model/order-schema.js");
const Coupon = require("../model/coupon.js");
const banner = require("../model/banner-schema.js");
const Wallet = require("../model/wallet-schema.js");
const coupon = require("../controller/user/coupon.js");
const bcrypt = require("bcrypt");
const razorpay = require("razorpay");
const { response } = require("express");

var instance = new razorpay({
  key_id: "rzp_test_wxBeuGUWgAI19I",
  key_secret: "v1oxHOmPj8fChpMmKzfxAkum",
});

module.exports = {
  signup: (userdata) => {
    return new Promise((resolve, reject) => {
      User.findOne({ email: userdata.email }).then((echeck) => {
        if (echeck) {
          resolve({ exemail: true });
        } else {
          User.findOne({ phone: userdata.phone }).then((pcheck) => {
            if (pcheck) {
              resolve({ exphone: true });
            } else {
              bcrypt.hash(userdata.password, 10).then((pass) => {
                const user = new User({
                  uname: userdata.uname,
                  email: userdata.email,
                  phone: userdata.phone,
                  password: pass,
                });

                user.save().then((usercreated) => {
                  resolve({ existinguser: false, pass: true, usercreated });
                });
              });
            }
          });
        }
      });
    });
  },

  forlogin: (userdata) => {
    return new Promise((resolve, reject) => {
      User.findOne({ email: userdata.email }).then((echeck) => {
        if (echeck != null) {
          bcrypt.compare(userdata.password, echeck.password).then((pass) => {
            if (pass) {
              let userdata = echeck;

              if (echeck.block) {
                resolve({ login: false, block: true });
              } else {
                resolve({ login: true, userdata });
              }
            } else {
              resolve({ login: false });
            }
          });
        } else {
          User.findOne({ phone: userdata.email }).then((pcheck) => {
            if (pcheck != null) {
              bcrypt
                .compare(userdata.password, pcheck.password)
                .then((pass) => {
                  if (pass) {
                    let userdata = pcheck;
                    if (pcheck.block) {
                      resolve({ login: false, block: true });
                    } else {
                      resolve({ login: true, userdata });
                    }
                  } else {
                    resolve({ login: false });
                  }
                });
            } else {
              resolve({ login: false });
            }
          });
        }
      });
    });
  },
  checkphonenumber: (phonenumber) => {
    return new Promise((resolve, reject) => {
      User.findOne({ phone: phonenumber }).then((data) => {
        console.log(data);
        console.log("ddddddddddddddddddddddaaaaaaaaaaa");
        if (data) {
          resolve({ check: true });
        } else {
          resolve({ check: false });
        }
      });
    });
  },
  loginwithotp: (phone) => {
    console.log("itscomingggggggggggggggggggggg");
    console.log(phone);
    return new Promise((resolve, reject) => {
      User.findOne({ phone: phone }).then((userdata) => {
        if (userdata) {
          console.log("findd userrrrrrrrrrrrrrrrrrrr");
          console.log(userdata);
          resolve({ err: false, userdata });
        } else {
          resolve({ err: true });
        }
      });
    });
  },
  getallproducts: () => {
    return new Promise((resolve, reject) => {
      Product.find({}).then((data) => {
        resolve(data);
      });
    });
  },
  getoneproduct: (id) => {
    return new Promise((resolve, reject) => {
      Product.findById(id).then((data) => {
        resolve(data);
      });
    });
  },
  getproductbycategory: (cat) => {
    return new Promise((resolve, reject) => {
      Product.find({ category: cat }).then((data) => {
        resolve(data);
      });
    });
  },

  getcategory: () => {
    return new Promise((resolve, reject) => {
      Category.find({}).then((cat) => {
        resolve(cat);
      });
    });
  },

  addtocartfromhome: (pid, uid) => {
    return new Promise((resolve, reject) => {
      Cart.find({ owner: uid, pid: pid }).then((cdata) => {
        if (cdata.length != 0) {
          let exist = true;
          resolve(exist);
        } else {
          let exist = false;
          Product.findById(pid).then((data) => {
            const cartitem = new Cart({
              owner: uid,
              pid: data._id,
              qty: 1,
              productTitle: data.productTitle,
              description: data.description,
              image: data.image[0],
              price: data.price,
              stock: data.stock,
              category: data.category,
            });

            cartitem.save().then(() => {
              resolve(exist);
            });
          });
        }
      });
    });
  },

  //view cart
  viewcart: (uid) => {
    return new Promise((resolve, reject) => {
      Cart.find({ owner: uid }).then((data) => {
        if (data.length == 0) {
          resolve({ empty: true });
        } else {
          resolve({ empty: false, data });
        }
      });
    });
  },

  addtocart: (productid, userid, qty1, offer, offprice, pid) => {
    console.log(productid);

    return new Promise((resolve, reject) => {
      qty1 = Number(qty1);

      Cart.findOne({ owner: userid, pid: productid }).then((result) => {
        if (result) {
          let outforcart = false;
          let id = result._id;
          let more = false;
          let qty2 = Number(result.qty) + Number(qty1);
          if (qty2 > result.stock) {
            more = true;
            qty2 = result.stock;
          }

          Cart.findByIdAndUpdate(id, {
            $set: {
              qty: qty2,
            },
          }).then(() => {
            resolve(more);
          });
        } else {
          if (offer == 1) {
            Product.findById(pid).then((data) => {
              let more = false;
              if (qty1 > data.stock) {
                more = true;
                qty1 = data.stock;
              }

              const cartitem = new Cart({
                owner: userid,
                pid: data._id,
                qty: qty1,
                productTitle: data.productTitle,
                description: data.description,
                image: data.image[0],
                price: offprice,
                stock: data.stock,
                category: data.category,
              });

              cartitem.save().then(() => {
                resolve(more);
              });
            });
          } else {
            Product.findById(productid).then((data) => {
              console.log(data);

              let more = false;
              if (qty1 > data.stock) {
                more = true;
                qty1 = data.stock;
              }

              const cartitem = new Cart({
                owner: userid,
                pid: data._id,
                qty: qty1,
                productTitle: data.productTitle,
                description: data.description,
                image: data.image[0],
                price: data.price,
                stock: data.stock,
                category: data.category,
              });

              cartitem.save().then(() => {
                resolve(more);
              });
            });
          }
        }
      });
    });
  },

  cartupdate: (qty1, pid, uid) => {
    return new Promise((resolve, reject) => {
      Cart.findOne({ owner: uid, pid: pid }).then((cdata) => {
        let id = cdata._id;
        Cart.findByIdAndUpdate(id, {
          $set: {
            qty: qty1,
          },
        }).then(() => {
          resolve();
        });
      });
    });
  },

  deletecartitem: (id) => {
    return new Promise((resolve, reject) => {
      Cart.findByIdAndDelete(id).then(() => {
        resolve();
      });
    });
  },

  clearcart: (id) => {
    return new Promise((resolve, reject) => {
      Cart.deleteMany({ owner: id }).then(() => {
        resolve();
      });
    });
  },

  changePaymentStatus: (oid) => {
    return new Promise((resolve, reject) => {
      Order.findByIdAndUpdate(oid, {
        $set: {
          paymentStatus: "Successful",
        },
      }).then(() => {
        resolve();
      });
    });
  },

  addnewaddress: (data, uid) => {
    return new Promise((resolve, reject) => {
      const address = new Address({
        owner: uid,
        name: data.name,
        address: data.address,
        state: data.state,
        country: data.country,
        pincode: data.pincode,
        phone: data.phone,
        type: data.type,
      });
      address.save().then(() => {
        resolve();
      });
    });
  },

  deleteaddress: (id) => {
    return new Promise((resolve, reject) => {
      Address.findByIdAndRemove(id).then(() => {
        let del = true;

        resolve(del);
      });
    });
  },

  getorders: (uid) => {
    return new Promise((resolve, reject) => {
      Order.find({ owner: uid }).then((data) => {
        resolve(data);
      });
    });
  },

  getaddressbyid: (uid) => {
    return new Promise((resolve, reject) => {
      Address.find({ owner: uid }).then((data) => {
        resolve(data);
      });
    });
  },

  getoneaddress: (id) => {
    return new Promise((resolve, reject) => {
      Address.findById(id).then((data) => {
        resolve(data);
      });
    });
  },

  stockchecker: (items) => {
    let outofstock = [];
    let i = 0;
    return new Promise((resolve, reject) => {
      let counter = 0;

      items.forEach((element) => {
        Product.findById(element.pid)
          .then((data) => {
            if (data.stock == 0) {
              outofstock[i] = element._id;
              i++;
            }
            counter++;
          })
          .then(() => {
            if (counter == items.length) {
              resolve(outofstock);
            }
          });
      });
    });
  },
  cartstockupdate: (outofstock) => {
    return new Promise((resolve, reject) => {
      let counter = 0;

      outofstock.forEach((element) => {
        Cart.findByIdAndUpdate(element, {
          $set: {
            stock: "0",
          },
        }).then(() => {
          counter++;
          if (outofstock.length == counter) {
            resolve();
          }
        });
      });
    });
  },

  verifypayment: (details) => {
    console.log("rejecttttedd");
    return new Promise((resolve, reject) => {
      try {
        console.log("hlo");
        const crypto = require("crypto");
        let hmac = crypto.createHmac("sha256", "v1oxHOmPj8fChpMmKzfxAkum");
        hmac.update(
          details["payment[razorpay_order_id]"] +
            "|" +
            details["payment[razorpay_payment_id]"]
        );
        hmac = hmac.digest("hex");
        if (hmac == details["payment[razorpay_signature]"]) {
          resolve();
        } else {
          reject("not match");
        }
      } catch (err) {
        console.log(err);
      }
    });
  },
  getallcart: () => {
    return new Promise((resolve, reject) => {
      Cart.find({}).then((data) => {
        resolve(data);
      });
    });
  },
  updatestock: (cart) => {
    return new Promise((resolve, reject) => {
      cart.forEach((element) => {
        let id = element.pid;
        let qty = element.qty;

        Product.findById(id).then((data) => {
          let newstock = data.stock - qty;
          let stockk = newstock.toString();
          Product.findByIdAndUpdate(id, {
            $set: {
              stock: stockk,
            },
          }).then(() => {
            resolve();
          });
        });
      });
    });
  },

  placeorder: (uid, product, address, payment, amount, phone, code) => {
    function generateUniqueID(time, number1) {
      const uniqueID = `${time}${number1}`;
      return uniqueID;
    }
    let currentDate1 = new Date();
    let time = currentDate1.getTime();
    let ph = phone[7] + phone[8] + phone[9];
    let oid = generateUniqueID(time, ph);
    console.log(oid);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

    return new Promise((resolve, reject) => {
      let currentDate = new Date();

      const order = new Order({
        owner: uid,
        date: currentDate.toDateString(),
        products: product,
        orderid: oid,
        address: address,
        payment: payment,
        paymentStatus: "pending",
        amount: amount,
        orderStatus: "placed",
      });
      order.save().then((data) => {
        if (coupon) {
          let id = data._id;
          Order.findByIdAndUpdate(id, {
            $set: {
              coupon: code,
            },
          }).then(() => {
            resolve(order);
          });
        } else {
          let id = data._id;
          Order.findByIdAndUpdate(id, {
            $set: {
              coupon: "No coupon applied",
            },
          }).then(() => {
            resolve(order);
          });
        }
      });
    });
  },

  generateRazorpay: (amount, oid) => {
    return new Promise((resolve, reject) => {
      let total = parseInt(amount);

      var options = {
        amount: total * 100,
        currency: "INR",
        receipt: "" + oid,
      };
      instance.orders.create(options, function (err, order) {
        if (err) {
          console.log(err);
        } else {
          console.log("new order:", order);

          resolve(order);
        }
      });
    });
  },

  getorderbyid: (id) => {
    return new Promise((resolve, reject) => {
      Order.findById(id).then((data) => {
        resolve(data);
      });
    });
  },
  updateprofile: (id, update) => {
    return new Promise((resolve, reject) => {
      User.findByIdAndUpdate(id, {
        $set: {
          uname: update.uname,
          email: update.email,
          phone: update.phone,
        },
      }).then(() => {
        User.findById(id).then((data) => {
          resolve({ updated: true, data });
        });
      });
    });
  },
  cancelorder: (id) => {
    return new Promise((resolve, reject) => {
      Order.findByIdAndUpdate(id, {
        $set: {
          orderStatus: "Cancelled",
        },
      }).then((order) => {
        if (order.payment == "razorpay") {
          Order.findByIdAndUpdate(id, {
            $set: {
              paymentStatus: "refunded",
            },
          }).then(() => {
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  },

  returnorder: (oid) => {
    return new Promise((resolve, reject) => {
      Order.findByIdAndUpdate(oid, {
        $set: {
          orderStatus: "return requested",
        },
      }).then(() => {
        resolve();
      });
    });
  },
  addtowallet: (userid, walletamount) => {
    return new Promise((resolve, reject) => {
      Wallet.findOne({ userId: userid }).then((response) => {
        if (response) {
          let totalwalletamount =
            Number(response.WalletAmount) + Number(walletamount);
          Wallet.updateOne(
            { userId: userid },
            { $set: { WalletAmount: totalwalletamount } }
          ).then((response2) => {
            if (response2) {
              console.log("updation successssssssssssss");
              resolve(response2);
            } else {
              console.log("not updateddddddddddd");
            }
          });
        } else {
          console.log(walletamount, "kkkkkkkkkkkkkkkkkkkkkkkkkk");

          const wallet = new Wallet({
            userId: userid,
            WalletAmount: walletamount,
          });
          wallet.save().then((walletadded) => {
            if (walletadded) {
              console.log("wallet inserted");
              resolve(walletadded);
            }
          });
        }
      });
    });
  },
  updateWallet: (uid, check) => {
    return new Promise((resolve, reject) => {
      Wallet.updateOne({ userId: uid }, { $set: { WalletAmount: check } }).then(
        (response) => {
          if (response) {
            console.log("wallet updated succesfully");
            resolve(response);
          } else {
            console.log("wallet can't updated ");
          }
        }
      );
    });
  },

  findWallet: (uid) => {
    return new Promise((resolve, reject) => {
      Wallet.findOne({ userId: uid }).then((response) => {
        if (response) {
          console.log("wallet get successfull");
          resolve(response);
        } else {
          console.log("wallet not get");
        }
      });
    });
  },

  getallbanners: () => {
    return new Promise((resolve, reject) => {
      banner.find({}).then((data) => {
        resolve(data);
      });
    });
  },

  getcategory: () => {
    return new Promise((resolve, reject) => {
      Category.find({}).then((cat) => {
        resolve(cat);
      });
    });
  },

  search: (key) => {
    return new Promise((resolve, reject) => {
      Product.find({
        productTitle: { $regex: new RegExp("^" + key + ".*", "i") },
      }).then((data) => {
        console.log(data);
        resolve(data);
      });
    });
  },

  deleteoder: (id) => {
    return new Promise((resolve, reject) => {
      Order.findByIdAndDelete(id).then(() => {
        resolve();
      });
    });
  },
  documentCount: () => {
    return new Promise(async (resolve, reject) => {
      Product.find()
        .countDocuments()
        .then((documents) => {
          resolve(documents);
        });
    });
  },
  creatwallet: (userid) => {
    return new Promise((resolve, reject) => {
      console.log("walet called");
      const wallet = new Wallet({
        userId: userid,
        WalletAmount: 0,
      });
      console.log("ssssssssssssssssssssssssssssssss");
      wallet.save().then((walletadded) => {
        if (walletadded) {
          console.log("wallet created");
          let status = true;
          resolve(status);
        }
      });
    });
  },
};
