const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adminSchema = new Schema({
    Name:String,
    Password:String
   
})


module.exports = mongoose.model('admin',adminSchema)