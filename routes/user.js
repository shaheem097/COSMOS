var express = require('express');
var router = express.Router();
const userprofile = require('../controller/user/userprofile')
const userlogin = require('../controller/user/userlogin')
const usersignup = require('../controller/user/signup')
const userotp = require('../controller/user/otp')
const usershop= require('../controller/user/shop')
const usercart= require('../controller/user/cart')
const userorders= require('../controller/user/orders')
const userpayment = require('../controller/user/payment')
const useraddress= require('../controller/user/address')
const userAuth = require('../authentication/userAuth');
const coupon = require('../controller/user/coupon')


/* GET home page. */
router.get('/',userprofile.homepage);

//user login
router.route('/login')
.get(userlogin.userlogin)
.post(userlogin.postuserlogin)

//user logout
router.get('/logout',userlogin.userlogout)

//Get users Contact
router.get('/contact',userprofile.contact)

//Get user signup
router.get('/signup',usersignup.usersignup);

//Post user signup
router.post('/signup_submit',usersignup.postusersignup);

//Get users otp login details
router.get('/otplogin-page',userotp.otplogin)

//login with otp
router.post('/loginwithotp',userotp.loginwithotp)

//OTP Check number 
router.post('/checkPhoneNumber',userotp.checknumber)

/* GET users contact. */
router.get('/blocked',userprofile.block);

//Get All products
router.get('/shop',usershop.shop)

/* GET product by category. */
router.get('/shop/:id',usershop.bycategory)

//Get product datils
router.get('/product/:id',usershop.productdetails)

//Get Cart Page
router.get('/cart',userAuth.userAuth,usercart.viewcart)

//Add to cart from Prdct Details
router.post('/addtocart/:id',userAuth.userAuth,usercart.addtocart);

//Add to cart from shop
router.get('/addtocartfromshop/:id',userAuth.userAuth,usercart.addtocartfromshop);

//Cart update
router.post('/cartupdate',userAuth.userAuth,usercart.cartupdate)

// Delete cart item
router.get('/deletecartitem/:id',userAuth.userAuth,usercart.deletecartitem)

//Clear cart item
router.get('/clearcart/:id',userAuth.userAuth,usercart.clearcart)

//Get checkout
router.get('/checkout',userAuth.userAuth,userorders.checkout)

//Add address
router.post('/addaddress',userAuth.userAuth,useraddress.addAddress)

//Delete address
router.get('/deladdress/:id',userAuth.userAuth,useraddress.deleteaddress)

//placeorder
router.post('/placeorder',userAuth.userAuth,userorders.placeorder)

/* GET clear . */
router.get('/clear',userAuth.userAuth,userorders.clear);

//Get Order Placed
router.get('/orderplaced',userAuth.userAuth,userorders.orderplaced)

//Get order details
router.get('/orderdetails/:id',userAuth.userAuth,userorders.orderdetails)


//Get verify Razorpay
router.post('/verifypayment',userAuth.userAuth,userpayment.PostVerifyPayment)

//Get User Profile
router.get('/profile',userAuth.userAuth,userprofile.userprofile)

//update profile
router.post('/updateprofile/:id',userAuth.userAuth,userprofile.updateprofile)

//cancel order
router.get('/cancelorder/:id',userAuth.userAuth,userorders.cancelorder)

//return order
router.get('/returnorder/:id',userAuth.userAuth,userorders.returnorder)

//get user Oredrs
router.get('/orders',userAuth.userAuth,userorders.orders)

//Post coupon
router.post('/applycoupon',coupon.applycoupon)

//Remove coupon
router.get('/removecoupon',userAuth.userAuth,coupon.removecoupon)

/* POST SEARCH. */
router.post('/search',userprofile.search)

module.exports = router;
