const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({

    owner:String,
    date:Date,
    orderid:String,
    products:{},
    address:String,
    payment:String,
    paymentStatus:String,
    amount:String,
    orderStatus:String,
    coupon:String

   
})

module.exports = mongoose.model('order',orderSchema)