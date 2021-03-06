var express = require('express');
var router = express.Router();
const users = require("../usersData");
var methods = require("../methods");
const save = require("../RegistroControl")

const registerPage = "../views/users/register";
const loginPage = "../views/users/login";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/home', function(req, res) {
  res.render('home');
});
router.get('/login', (req, res) => {
  res.render(loginPage);
});
router.get('/register', (req, res) => {
  res.render(registerPage);
});

router.post('/register', (req, res) => {
  const { fullName_, email_, password_, confirmPassword_ } = req.body;

  //validar
  if ( password_ === confirmPassword_) {
    //validar si el correo existe
    if (users.data.find(u => u.email === email_)) {
      res.render(registerPage, {
        message: "El usuario ya esta registrado",
        messageClass: "alert-danger"
      });
    }
    const phash = methods.getHashedPassword(password_);

    //almacenar los datos
    users.data.push({
      fullName:fullName_,
      email:email_,
      password: phash
    
    });
    save.save(
      "{fullName:'"+fullName_+"',email:'"+email_+"',password:'"+phash+"'}, "
    )
    res.render(loginPage, {
      message: "Registro Completo. Inicie sesion",
      messageClass: "alert-success"
    });

  } else {
    res.render(registerPage, {
      message: "Las contraseñas no coinciden",
      messageClass: "alert-danger"
    });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = methods.getHashedPassword(password);
  
  //validar que los datos coincidan
  const dataUser = users.data.find(u => {
    return u.email === email && hashedPassword === u.password;
  });

  if(dataUser) {
    const authToken = methods.generateToken();
    //almacenar token de autenticacion
    methods.authTokens[authToken] = dataUser;
    res.cookie('AuthToken', authToken);
    res.redirect('/home');
  } else {
    res.render(loginPage, {
      message: "El usuario o clave no coinciden",
      messageClass: "alert-danger"
    });
  }
});

module.exports = router;
