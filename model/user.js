
const mongoose = require('mongoose') ;



const user_schema = new mongoose.Schema({



    username : {
        type : String 
    } , 
name : {
    required : true   , 
    type : String 
}, 
lastname : {
    required : true , 
    type : String ,
},
password : {
    required : true  , 
    type : String 
}  , 
type : {
    type : String , 
    required : true  , 
},
date_naissance :{
    type : Date 
} , 
classes : {
    type : Array   , Default : [''] 

}  , 
phone : {
    type : String  
} , 
cin : {
    type : String 
}
})




module.exports  = mongoose.model('User' , user_schema) ; 