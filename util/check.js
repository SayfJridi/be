
const check = (req,res,next) => {
    if (!req.isAuthenticated()) {
      req.flash('error',"Connectez Pour Continuer s'il vous plait") ;
  
      return res.redirect('/') ; 
    } 
    next() ;
  }

  module.exports = check  ; 
