
const mongoose = require('mongoose') ; 


function fusionn (level , section , number) {

    if (section == ' ') {
        return level + '-' + number
    }
    else {
        return level + '-' + section + '-' + number
    }
}

const classe_schema = new mongoose.Schema({


    section : {
        required  : true  , type : String
    },
    level : {
        required : true , type : Number
    },
    number : {
        required : true  , type : Number 
    } , 
    year : {
        type : Number , default : new Date().getFullYear()
    }, 
    slug : {type : String   ,unique : true   , required : true}
})

classe_schema.pre('validate', function(next) {
 
    this.slug =fusionn(this.level , this.section , this.number)


    next() ; 
})


module.exports = mongoose.model('classe', classe_schema) ; 
