
const mongoose = require('mongoose') ; 




const cour_schema = new mongoose.Schema({
    publisher_id : {required : true  , type  : String} , 
    publisher_name : {required : true , type : String} , 
    classe : {required : true  , type : String} , 
    matiere :  {required : true  , type : String} , 
    chapitre : {required : true  , type : String} , 
    files :  {default : [] , type : Array} ,
    date : {type : String  , default : new Date().toLocaleDateString()},
    color : {
        type : String , default:"#a6d69a"
    }
})
module.exports = mongoose.model('cour', cour_schema) ;