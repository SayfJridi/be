
require('dotenv').config() ; 


// Importing the Functionnalities
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var session = require('express-session') ; 
var methodeOverride = require('method-override')
var passport = require('passport');
var  LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose') ;
var flash = require('express-flash') ; 
var bcrypt = require('bcrypt') ;
var compression = require('compression') ; 
var MongoDBStore = require('connect-mongodb-session')(session)
const admis = require('./model/admis') ; 
const multer = require('multer') ; 




// requirng Models 
 
const user = require('./model/user') ; 

// routers Requiring

app.listen(process.env.PORT || 80 ) ; 

const uri = 'mongodb+srv://sayf:sayf12@cluster0.lnrhp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' ;


var store = new MongoDBStore({
  uri: uri,
  collection: 'mySessions'
});

// Database Connection 
mongoose.connect(uri, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
}).then((res) => {console.log('Connecté a la Base De Donnée')}) ; 

// Using The functionnalities
app.use(session({
  saveUninitialized : false   , resave : false  , secret : 'beithekmafinalsessionkey' ,
  maxAge: 1000 * 60 * 60 * 24 * 1 // 1 week
  ,  store: store,

}))

app.use(flash()) ;
app.use(compression()) ;   


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//passport initialization

app.use(passport.initialize()) ;
app.use(passport.session()) ;

passport.use(new LocalStrategy({passReqToCallback : true},
  async function (req ,username, password, done) {
    await user.findOne( {username : username}, async function(err, user) {
      if (err) { 
        return done(err) }
      if (!user) {
        req.flash('erreur','Incorrect username.')
        return done(null, false, req.flash('error','Utilisateur Non Trouvé'));
      }
    if (!(await bcrypt.compare(password,user.password))) {
      req.flash('username',user.username) ; 
      req.flash('error', 'Mot De Passe Erroné') ; 
        return done(null, false);
      }
      
      return done(null, user);
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id,user.username);
});
passport.deserializeUser((id,done) => {
  done(null,{id}) ;
})

const check = (req,res) => {
  if (!req.isAuthenticated()) {
    req.flash('error','You Need to log in to access that part') ;

    return res.redirect('/') ; 
  }
  next() ; 
}

// Home Page Setup
app.get('/' , (req,res)=> {
 
  console.log('\x1b[36m%s\x1b[0m', req.isAuthenticated());

  const value = (!req.isAuthenticated()) ? 'disabled' : ''  ; 
  const erreur = req.flash().error || [' '] ; 
  res.render('home',{value : value , erreur : erreur }) ; 
 
}) ; 




app.get('/login',async(req,res)=> {

  if ((req.isAuthenticated())) {
    return res.end('Vous etes deja connecter')
  }  
  const liste_erreur = req.flash() ; 
  const error = liste_erreur.error || [''] ; 
  const username = liste_erreur.usermane || [''] ; 
  res.render('login', {error : error[0]  , username : username[0]}) ; 
})

//router  initialization

// Sign in routes
app.post('/login', passport.authenticate('local', {
  failureFlash : true , 
  failureRedirect: '/'
}), (req,res) => { 
  res.redirect('/') ;
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/add_admis',(req,res)=>{
  res.render('ajout')  ; 
})
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + '/public/image_admis');
  },
  filename: function(req, file, cb) {
    cb(null, req.body.name + '.png');
  }
});
app.post('/add_admis', multer({storage : storage}).single('image'),async(req,res) =>  {
 console.log(req.file.path) ; 
  const admii = new admis({
    name : req.body.name , 
    image : req.file.filename , 
    bac : req.body.bac , 
    moyenne : req.body.moyenne,
  })

  await admii.save() ; 
  res.redirect('/admis') ; 
})

app.get('/admis' ,async(req,res)=>{
  const liste_admis = await admis.find() ; 
  res.render('admis',{admis : liste_admis}) ; 
}
)

app.use('/cour',require('./routes/cour')) ;
app.use('/bdd',require('./routes/db_remp')) ;  


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  
  res.status(404).send(req.flash()) ; 
});



/*

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('404');
});
*/
module.exports = app;
