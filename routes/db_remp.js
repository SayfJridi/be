


const express = require('express') ; 
const app = require('../app');
const bcrypt = require('bcrypt') ; 
const router =  express.Router() ;
const user = require('../model/user') ; 
const plain = require('../model/to_recover') ; 
const classe= require('../model/classe') ; 
const multer = require('multer') ; 

router.post('/add_prof'  , async(req,res) => {
    
const phone = req.body.phone ; 
const classes = req.body.classes ;  
    const type = "professeur"  ; 
    const name = req.body.name  ; 
    const lastname = req.body.lastname ; 
    const username = await generate_username(name,lastname) ; 
    
    const password = await bcrypt.hash(req.body.cin ,10)
    const userr = new user({ cin : req.body.password ,  phone : phone , name : name ,password : password ,  username : username , lastname : lastname , type : type ,classes : classes })
 
    userr.save().then((msg) => { 
        res.send('identifiant : ' + username + " mot de passe  : " + req.body.cin) ; 
        res.end()})
        
      
}) ; 

router.post('/add_classe'  , async(req,res) => {
    const new_classe  = new classe({
        level : req.body.level , 
        section : req.body.section , 
        year : req.body.year  , 
         number : req.body.number 
    })
    await new_classe.save() ; 
    res.end('added')
    })

router.get('/' ,async (req,res)=> {
    const liste_classe = await classe.find()  ;
    res.render('base', {classes : liste_classe }) ; 
})  ;
router.post('/add_etudiant'  , async(req,res) => {

    const phone = req.body.phone ; 
    const daten = new Date(req.body.daten)  ;
  
    const classes = [] ; 
    classes.push(req.body.classe) ; 
        const type = "student"  ; 
        const name = req.body.name  ; 
        const lastname = req.body.lastname ; 
        const passwordt = daten.getDay().toString() + daten.getMonth().toString() + daten.getFullYear().toString() ; 
   
        const username = await generate_username(name,lastname) ;  
        const password = await bcrypt.hash(passwordt,10) ;  
        
        
        const userr = new user({phone : phone  , date_naissance : daten ,  name : name ,password : password ,  username : username , lastname : lastname , type : type ,classes : classes })
        new plain({username : username ,password :  passwordt}).save() ; 
        userr.save().then((msg) => { 
            
         res.end('identifiant : ' + username + " mot de passe  : " + passwordt) ; 
      
     }).catch((e) => {
         console.log(e) ;
         res.end("erreur") ;
     }) ; 
    
       })

    



router.get('/affichage/:slug_classe/etudiant' , async(req,res)=> {
    const curr_classe = await classe.findOne({slug : req.params.slug_classe})
    var liste_etudiant = await user.find({type : 'student' }) ; 
    console.log(liste_etudiant) ;
    liste_etudiant = liste_etudiant.filter((el) => {
        return el.classes[0] == curr_classe._id
    })
 

    res.render('affich_eleve' , {users : liste_etudiant  , slug : req.params.slug_classe})
})



router.get('/affichage/classe', async(req,res)=> {
    const liste_classe = await classe.find() ; 
    
    res.render('affich_classe' , {
        classes : liste_classe
    })
})



router.get('/affichage/professeur', async(req,res)=> {
    const liste_prof = await user.find({type : 'professeur'})   ; 

    res.render('affich_prof' , {
        users : liste_prof
    })
})

router.get('/test', (req,res)=>{
    res.render('new_news') ; 
  })


  router.post('/add_news' , multer({storage : multer.diskStorage({
    destination: function (req, file, cb) {
      
      cb(null, "public/news")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
}) 
}).single('cour') ,  (req, res)=>{

    const article  = req.body.article  ; 

    res.render('new_news', {image : req.file.filename}) ; 
    console.log(req.file)  }
    
    )

   async function generate_username (name , lastname)  {

        const users = await user.find() ; 
    
        let result = users.map(({ username }) => username) ; 
        var curr_username = name + '_' + lastname ; 
       while (result.includes(curr_username)) {
        curr_username = curr_username + '0' ; 
       } ; 
        return curr_username ; 
    }


module.exports = router ; 