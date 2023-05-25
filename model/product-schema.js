const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    productTitle:String,
    description:String,
    price:String,
    stock:String,
    image:[], 
    category:String
   
})





module.exports = mongoose.model('products',productSchema)
