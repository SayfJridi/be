const cookieParser = require('cookie-parser');
const express = require('express');

const router = express.Router();
const check = require('../util/check');
const mongoose = require('mongoose');
const user = require('./../model/user');
const classe = require('../model/classe');
const multer = require('multer');
const cour = require('../model/cours');
const fs = require('fs');
const path = require('path') ; 
const check_classe = require('../util/check_classe') ; 


const initiate_cour = require('multer').diskStorage({
  destination: async function (req, file, cb) {
    var courr = new cour()
    var dir = __dirname + './../public/cour/' + courr._id;
    fs.mkdirSync(dir);
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});




router.post('/abc/add_cour', multer({storage: initiate_cour}).any('cour'),async (req, res) => {
 console.log(req.body) ; 
  if (!req.files) {
    return res.end('file not uploaded');
  }


  
  const x = req.files[0].path.split('\\');
  const id = x[x.length - 2];
  const files = [];

  req.files.forEach(file => {
    files.push(file.filename);
  })
  const publisher = await user.findById(req.user.id);
  const courr = new cour({
    _id: id,
    publisher_id: publisher._id,
    publisher_name: publisher.name + " " + publisher.lastname,
    classe: req.body.classe,
    matiere: req.body.matiere,
    chapitre: req.body.chapitre,
    files: files,
    color:req.body.clr
  })
 courr.save().then(() => {
   res.end('Added')
 }).catch(() => {

  console.log(__dirname) ;
   fs.rmdirSync(__dirname + '../public/cour/' + 'xDD' , {recursive : true } , (err) => {
    console.log(err) ; 

   }) 

   res.end('err') ; 
 }) ;
 
 
})



router.get('/',check , async(req,res)=> {

  
  const liste_cour = await cour.find()
  const liste_classes = await classe.find()
  res.render('cours', {cours : liste_cour , classes : liste_classes }) ; 
})






module.exports = router;