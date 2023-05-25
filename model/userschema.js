const mongoose = require('mongoose')
const Schema = mongoose.Schema

const signupSchema = new Schema({
    uname:String,
    email:String,
    phone:String,
    password:String,
    block:Boolean
   
})

module.exports = mongoose.model('users',signupSchema)
