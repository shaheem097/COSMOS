const Admin = require("../model/admin-schema");
const Category = require("../model/category-schema");
const User = require("../model/userschema");
const Product = require("../model/product-schema");
const Order = require("../model/order-schema");
const Coupon = require("../model/coupon");
const Banner = require("../model/banner-schema");
module.exports = {
  adminlogin: (data) => {
    return new Promise((resolve, reject) => {
      Admin.findOne({ Name: data.email }).then((valid) => {
        if (valid) {
          if (valid.Password == data.password) {
            resolve({ adminlogin: true });
          } else {
            resolve({ adminlogin: false });
          }
        } else {
          resolve({ adminlogin: false });
        }
      });
    });
  },
  postsignup:(admindata)=>{
    return new Promise((resolve, reject) => {
      Admin.findOne({Name:admindata.email}).then((namecheck)=>{
        if(namecheck){
          resolve({exemail:true});
        }else{
          const admin=new Admin({
            Name:admindata.email,
            Password:admindata.password
          })
          admin.save().then((admincreated)=>{
            resolve({admincreated})
          });
        }
      })
    })
  },
  addcategory: (data) => {
    return new Promise((resolve, reject) => {
      Category.find({ name: data.name }).then((valid) => {
        console.log(valid);
        if (valid.length == 0) {
          const cat = Category({
            name: data.name,
            description: data.description,
          });
          cat.save().then(() => {
            resolve({ status: true });
          });
        } else {
          resolve({ status: false });
        }
      });
    });
  },
  getcategory: () => {
    return new Promise((resolve, reject) => {
      Category.find({}).then((data) => {
        resolve(data);
      });
    });
  },
  getcategorybyid: (id) => {
    return new Promise((resolve, reject) => {
      Category.findById(id).then((data) => {
        resolve(data);
      });
    });
  },
  updatecategory: (id, update) => {
    return new Promise((resolve, reject) => {
      Category.findByIdAndUpdate(id, {
        $set: {
          name: update.name,
          description: update.description,
        },
      }).then(() => {
        resolve();
      });
    });
  },

  deletecategory: (id) => {
    return new Promise((resolve, reject) => {
      Category.findById(id).then((data) => {
        let name = data.name;
        console.log(data);

        // Check if category has any products
        Product.findOne({ category: name }).then((product) => {
          if (product) {
            console.log(product);

            // Category has products, reject with an error
            resolve({ del: false });
          } else {
            // Category has no products, delete it
            Category.findByIdAndDelete(id).then(() => {
              resolve({ del: true });
            });
          }
        });
      });
    });
  },

  addproduct: (product, filename) => {
    return new Promise((resolve, reject) => {
      const item = new Product({
        productTitle: product.title,
        description: product.description,
        price: product.price,
        image: filename,
        stock: product.stock,
        category: product.category,
      });

      item.save().then((data) => {
        resolve({ added: true });
      });
    });
  },
  viewproducts: () => {
    return new Promise((resolve, reject) => {
      Product.find({})
        .lean()
        .then((data) => {
          resolve(data);
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
  getoneproduct: (id) => {
    return new Promise((resolve, reject) => {
      Product.findById(id).then((data) => {
        Category.find({}).then((cat) => {
          resolve({ data, cat });
        });
      });
    });
  },
  paymentcount: () => {
    return new Promise((resolve, reject) => {
      Order.find({}).then((orders) => {
        let len = orders.length;
        let cod = 0;
        let online = 0;

        for (let i = 0; i < orders.length; i++) {
          if (orders[i].payment == "COD") {
            cod++;
          }
        }

        online = len - cod;

        resolve({ online, cod, len });
      });
    });
  },
  getOrderByDate: async () => {
    try {
      const startDate = new Date("2022-01-01");
      let orderDate = await Order.find({ date: { $gte: startDate } });

      return orderDate;
    } catch (err) {
      console.log(err);
    }
  },

  updateproduct: (id, update, filename) => {
    return new Promise((resolve, reject) => {
      Product.findByIdAndUpdate(id, {
        $set: {
          productTitle: update.title,
          description: update.description,
          price: update.price,
          image: filename,
          stock: update.stock,
          category: update.category,
        },
      }).then(() => {
        resolve({ updated: true });
      });
    });
  },
  updateproduct1: (id, update) => {
    return new Promise((resolve, reject) => {
      let stock1 = update.stock;
      Product.findByIdAndUpdate(id, {
        $set: {
          productTitle: update.title,
          description: update.description,
          price: update.price,
          stock: update.stock,
          category: update.category,
        },
      }).then((data) => {
        resolve({ updated: true });
      });
    });
  },

  deleteproduct: (id) => {
    return new Promise((resolve, reject) => {
      Product.findByIdAndRemove(id).then(() => {
        resolve({ del: true });
      });
    });
  },

  userinfo: () => {
    return new Promise((resolve, reject) => {
      User.find({}).then((data) => {
        resolve(data);
      });
    });
  },
  blockuser: (id) => {
    return new Promise((resolve, reject) => {
      User.findByIdAndUpdate(id, {
        $set: {
          block: true,
        },
      }).then(() => {
        resolve();
      });
    });
  },

  unblockuser: (id) => {
    return new Promise((resolve, reject) => {
      User.findByIdAndUpdate(id, {
        $set: {
          block: false,
        },
      }).then(() => {
        resolve();
      });
    });
  },

  allorders: () => {
    return new Promise((resolve, reject) => {
      Order.find({}).then((data) => {
        resolve(data);
      });
    });
  },

  getorderbyid: (id) => {
    return new Promise((resolve, reject) => {
      Order.findById(id).then((order) => {
        resolve(order);
      });
    });
  },

  updateorder: (id, update) => {
    return new Promise((resolve, reject) => {
      if (update.orderStatus == "Cancelled") {
        Order.findByIdAndUpdate(id, {
          $set: {
            orderStatus: update.orderStaus,
            paymentStatus: update.orderStatus,
          },
        }).then((order) => {
          resolve();
        });
      } else {
        Order.findByIdAndUpdate(id, {
          $set: {
            orderStatus: update.orderStatus,
            paymentStatus: update.paymentStatus,
          },
        }).then((order) => {
          resolve();
        });
      }
    });
  },
  getcoupons: () => {
    return new Promise((resolve, reject) => {
      Coupon.find({}).then((data) => {
        resolve(data);
      });
    });
  },

  addcoupon: (data) => {
    return new Promise((resolve, reject) => {
      let err = false;

      Coupon.find({ code: data.code }).then((data1) => {
        if (data1.length == 0) {
          const code = new Coupon({
            code: data.code,
            discount: data.discount,
            limit: data.limit,
            min: data.min,
            expire: data.expire,
          });
          code.save().then((data) => {
            resolve(err);
          });
        } else {
          err = true;
          resolve(err);
        }
      });
    });
  },
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

  deletecoupon: (id) => {
    return new Promise((resolve, reject) => {
      Coupon.findByIdAndDelete(id).then(() => {
        resolve();
      });
    });
  },

  viewbanner: () => {
    return new Promise((resolve, reject) => {
      Banner.find({}).then((data) => {
        resolve(data);
      });
    });
  },

  addbanner: (filename, data) => {
    return new Promise((resolve, reject) => {
      const banner = new Banner({
        title: data.title,
        line1: data.line1,
        line2: data.line2,
        line3: data.line3,
        button: data.button,
        link: data.link,
        image: filename,
      });

      banner.save().then((data) => {
        resolve({ added: true, data });
      });
    });
  },
  deletebanner: (id) => {
    return new Promise((resolve, reject) => {
      Banner.findByIdAndRemove(id).then(() => {
        resolve({ delete: true });
      });
    });
  },
  customreport: (start, end) => {
    return new Promise((resolve, reject) => {
      start = new Date(start);
      end = new Date(end);

      console.log(start);
      console.log(end);

      let data = [];

      Order.find({})
        .then((orders) => {
          for (let i = 0; i < orders.length; i++) {
            let y = orders[i].date;
            y.setHours(0, 0, 0, 0);
            let x = new Date(y);
            if (x >= start && x <= end) {
              data.push(orders[i]);
            }

            let word = y + "";
            word = word.substring(0, 16);
            console.log(word);
            let word1 = start + "";
            word1 = word1.substring(0, 16);

            if (word == word1) {
              data.push(orders[i]);
            }
          }
        })
        .then(() => {
          resolve(data);
        });
    });
  },

  monthlyreport: (start, end) => {
    return new Promise((resolve, reject) => {
      console.log(start);
      console.log(end);

      let flag = false;

      let data = [];

      Order.find({})
        .then((orders) => {
          orders.forEach((element) => {
            let x = element.date;

            if (x >= start && x <= end) {
              data.push(element);
            }
          });
        })
        .then(() => {
          resolve(data);
        });
    });
  },

  annualreport: (start, end) => {
    return new Promise((resolve, reject) => {
      let data = [];

      start = Number(start);
      end = Number(end);

      console.log(start);
      console.log(end);

      Order.find({})
        .then((orders) => {
          orders.forEach((element) => {
            let x = element.date + "";
            x = x.substring(11, 15);

            x = Number(x);
            console.log(x);

            if (x >= start && x <= end) {
              data.push(element);
            }
          });
        })
        .then(() => {
          resolve(data);
        });
    });
  },
};
