const mongoose = require('mongoose')
const Schema = mongoose.Schema

const couponSchema = new Schema({
    
    code:String,
    discount:Number,
    limit:Number,
    min:Number,
    expire:Date,
    used:[]

})

module.exports = mongoose.model('coupon',couponSchema)
