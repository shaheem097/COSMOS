const mongoose = require('mongoose')
const Schema = mongoose.Schema

const walletSchema = new Schema({
    userId:String,
    WalletAmount:String,
   
})





module.exports = mongoose.model('wallet',walletSchema)