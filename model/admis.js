const mongoose = require('mongoose') 



const admis_schema = mongoose.Schema({

    name : {
        type : String ,
        required : true
    } , 
    bac : {
        type : String  , 
        required : true
    },
    moyenne : {
        type : Number , 
        required : true 
    }, 
    image  : {
        type  : String , 
        default : 'avatar.png'
    }
})



module.exports = mongoose.model('Admi',admis_schema) ; 