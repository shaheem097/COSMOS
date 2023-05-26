var express = require('express');
var router = express.Router();
const auth=require('../authentication/adminAuth')
const category=require('../controller/admin/category')
const adminlogin=require('../controller/admin/loginadmin')
const orders=require('../controller/admin/orders')
const products=require('../controller/admin/products')
const userinfo=require('../controller/admin/userinfo')
const couponManagment=require('../controller/admin/couponmanagment')
const bannerManagment=require('../controller/admin/banner')
const salesreport=require('../controller/admin/salesreport')
const multer=require('../helpers/multer')



/* GET admin signup */
router.get('/signup',adminlogin.adminsignup)

// /Post admin signup
router.post('/signup-submit',adminlogin.postadminsignup)

/* GET users listing. */
router.get('/',adminlogin.admindashboard)

//Admin get login
router.get('/login',adminlogin.adminlogin)

//Admin post login
router.post('/login-submit',adminlogin.postadminlogin)

//Admin logout
router.get('/logout',adminlogin.adminlogout)

//Get add category Page
router.get('/category',category.category)

//post  category  Details
router.post('/addcategory',category.addcategory)

//Edit category page
router.get('/editcategory/:id',category.editcategory)

//Post edited category details
router.post('/updatecategory/:id',category.updateCategory)

//delete category
router.get('/deletecategory/:id',category.deletecategory)

//Get view product
router.get('/products',products.viewproducts)

//Add products
router.get('/addproduct',products.addproduct)

//Post add product details
router.post('/add_product',multer.uploads.array('image',4),products.postaddproduct)

//Get Edit product Details
router.get('/editproducts/:id',products.editproducts)

//Post updated product details
router.post('/updateproduct/:id',multer.uploads.array('image',4),products.updateproduct)

//Delte product
router.get('/deleteproduct/:id',products.deleteproduct)

// User info
router.get('/userinfo',userinfo.userinfo)

// Block user
router.get('/blockuser/:id',userinfo.blockuser)

//Unblock user
router.get('/unblockuser/:id',userinfo.unblockuser)

//Get admin orders
router.get('/orders',orders.orders)

//Get edit order
router.get('/editorder/:id',orders.editorder)

//Post update order
router.post('/updateorder/:id',orders.updateorder)

//Get coupon Page
router.get('/coupon',couponManagment.coupon)

//Add coupon details
router.post('/addcoupon',couponManagment.addcoupon)

//Delte coupon
router.get('/deletecoupon/:id',couponManagment.deltecoupon)

//get  banner page
router.get('/banner',bannerManagment.viewbanner)

//Get new banner
router.get('/newbanner',bannerManagment.newbanner)

//post Admin Banner Details
router.post('/banner_submit',multer.uploads.array('image'),bannerManagment.postbanner);

//Delete banner
router.get('/deletebanner/:id',bannerManagment.deletebanner)

//Get  Salesrepport page
router.get('/report',salesreport.report)

/* GET ADMIN CUSTOM REPORT. */
router.post('/customreport',salesreport.customreport);

/* GET ADMIN MONTHLY REPORT. */
router.post('/monthlyreport',salesreport.monthlyreport);

/* GET ADMIN ANNUAL REPORT. */
router.post('/annualreport',salesreport.annualreport);

module.exports = router;
