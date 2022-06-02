
const mongoose = require('mongoose')
const plain_schema = new mongoose.Schema({
   username  : {
       type : String 
   }, 
   password : String
})

module.exports = mongoose.model("plain", plain_schema) 
