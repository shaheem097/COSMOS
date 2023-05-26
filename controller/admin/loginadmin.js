const { response } = require("express");
const adminHelper = require("../../helpers/adminHelper");
module.exports = {
  admindashboard: (req, res) => {
    if (req.session.admin) {
      let cod = 0;
      let online = 0;
      let len = 0;
      let days = [];
      let ordersPerDay = {};

      let count = 0;
      adminHelper.paymentcount().then((response) => {
        cod = response.cod;
        online = response.online;
        len = response.len;

        cod = (cod / len) * 100;
        online = (online / len) * 100;

        cod = Math.round(cod * 100) / 100;
        online = Math.round(online * 100) / 100;
      });
      adminHelper.getOrderByDate().then((response) => {
        if (response.length > 0) {
          let result = response;
          for (let i = 0; i < result.length; i++) {
            let ans = {};
            ans["createdAt"] = result[i].date;
            days.push(ans);
            ans = {};
          }
        }
        days.forEach((order) => {
          const day = order.createdAt.toLocaleDateString("en-US", {
            weekday: "long",
          });
          ordersPerDay[day] = (ordersPerDay[day] || 0) + 1;
        });
      });

      adminHelper.allorders().then((orders) => {
        adminHelper.viewproducts().then((products) => {
          let productcount = products.length;
          orders.forEach((element) => {
            count = count + 1;
          });
          let revenue = 0;

          orders.forEach((element) => {
            if (element.paymentStatus == "Successful") {
              revenue = revenue + Number(element.amount);

              revenue = Math.round(revenue * 100) / 100;
            }
          });
          revenue = revenue.toLocaleString("en-IN");

          res.render("admin/dashboard", {
            revenue,
            count,
            productcount,
            cod,
            online,
            ordersPerDay,
          });
        });
      });
    } else {
      res.redirect("/admin/login");
    }
  },

  adminsignup:(req,res)=>
  {
    if(req.session.admin){
      res.redirect('/signup')
    }else{
      res.render('admin/signup')
    }
    
  },

  adminlogin: (req, res) => {
    if (req.session.admin) {
      res.redirect("/admin");
    } else {
      let loginerr = req.session.loginerr;
      req.session.loginerr = false;

      if (loginerr) {
        res.render("admin/login", { loginerr });
      } else {
        res.render("admin/login");
      }
    }
  },
  postadminlogin: (req, res) => {
    adminHelper.adminlogin(req.body).then((response) => {
      if (response.adminlogin) {
        req.session.admin = true;
        res.redirect("/admin");
      } else {
        req.session.admin = false;
        req.session.loginerr = true;
        res.redirect("/admin/login");
      }
    });
  },
  postadminsignup:(req,res)=>{
    console.log("cminnggggggggg");
    adminHelper.postsignup(req.body).then((response)=>{
      console.log(response);
      if(response.exemail){
        res.redirect('/signup')
      }else{
        res.redirect('/admin/login')
      }
    })
  },

  adminlogout: (req, res) => {
    req.session.admin = false;
    req.session.otpsend = false;
    res.redirect("/admin");
  },
};
