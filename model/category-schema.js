const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
    name:String,
    description:String 
})





module.exports = mongoose.model('Category',categorySchema)
