const mongoose = require('mongoose')
const Schema = mongoose.Schema

const addressSchema = new Schema({
    
    owner:String,
    name:String,
    address:String,
    state:String,
    country:String,
    pincode:String,
    phone:String,
    type:String

})





module.exports = mongoose.model('address',addressSchema)