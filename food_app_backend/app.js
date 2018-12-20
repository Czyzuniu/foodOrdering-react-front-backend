const express = require('express')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const app = express()
const port = 3001

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'mydb'
  }
});


const store = new KnexSessionStore({
  knex: knex,
  tablename: 'sessions'
});


app.use(session({
  key: 'session_cookie_name',
  secret: 'session_cookie_secret',
  store: store,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000
  },
  clearInterval:15000
}));

//
// app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))



app.get('/restaurants', (req, res) => {
  res.json({'msg': 'restaurants'})
})

app.post('/checkAuthentication', (req, res) => {
    let sessionId = req.body.sessionId

    console.log(sessionId,'this')

    if (!sessionId) {
      return res.json({'status':'notAuthenticated'})
    } else {
      knex('sessions').where('sid', '=', sessionId).select().then((data) => {
        if (data.length == 1) {
          console.log('server returned authenitcation')
          return res.json({'status':'authenticated'})
        } else {
          return res.json({'status':'notAuthenticated'})
        }
      })
    }
})



app.post('/register', (req, res) => {
  console.log(req.body)
  // bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
  //   // Store hash in your password DB.
  // });

  //hash later, add first name to db too

  knex('PERSON')
    .insert({'PERSON_EMAIL':req.body.emailAddress, 'PERSON_PASSWORD':req.body.password})
    .then(() => {
      console.log('stored in db')
    })
})



app.post('/login', (req, res) => {
  console.log('login')
  knex('PERSON')
    .where('PERSON_EMAIL', '=', req.body.emailAddress)
    .andWhere('PERSON_PASSWORD','=',req.body.password)
    .select().then((userData) => {
    console.log(userData)
    if (userData.length == 1) {
      req.session.isAuthenticated = true
      res.json({status:"success", sessionId:req.session.id});
    } else {
      res.json({status:"failed"});
    }
  })
})



app.listen(port, () => console.log(`server listening on port ${port}!`))