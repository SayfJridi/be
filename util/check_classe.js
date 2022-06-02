

const user  = require('./../model/user') ; 

const classe= require('../model/classe') ;

const check_classe = async (req,res,next) => {



    const classee = await classe.findOne({slug : req.params.slug_classe}) ; 
    
    const userr = await user.findById(req.user.id)  ;

    const liste_classe = userr.classes ; 


    const exist = (liste_classe.indexOf(classee.id)) ; 

    if (exist == -1 && userr.type != "professeur") {

       return res.end('u dont belong here') ; 
    }

    next() ; 
}

module.exports = check_classe ; 