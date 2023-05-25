const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId=require('mongodb').ObjectId


const cartSchema = new Schema({
    // userid:mongoose.SchemaTypes.ObjectId,
    // products:[]
  
    owner:String,
    pid:String,
    qty:Number,
    productTitle:String,
    description:String,
    price:String,
    stock:String,
    image:String, 
    category:String
   
})


module.exports = mongoose.model('cart',cartSchema)