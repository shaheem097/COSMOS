const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bannerSchema = new Schema({
  
    title:String,
    line1:String,
    line2:String,
    line3:String,
    button:String,
    link:String,
    image:Array
   
})





module.exports = mongoose.model('banner',bannerSchema)
