const express = require('express')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var session = require('express-session');
const cors = require('cors')
const KnexSessionStore = require('connect-session-knex')(session);
var requestify = require('requestify');

//refactor later authentication check repetition

const STATUSES = {
  'SUCCESS':'success',
  'FAILED':'failed'
}

const app = express()
const port = 3001

const bcrypt = require('bcrypt');
const saltRounds = 10;


app.use(cookieParser())
app.use(cors({credentials: true, origin: true}))
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
    maxAge: 60000 * 30
  },
  clearInterval:60000
}));

app.get('/myRestaurants', (req, res) => {
  let authentication= JSON.parse(req.cookies.authentication)

  knex('RESTAURANT')
    .where('RESTAURANT_OWNER','=', authentication.userId)
    .select()
    .then((data) => {
      res.json(
        {
          status:STATUSES.SUCCESS,
          restaurantsData:data
        }
      )
    })
})

app.get('/getFoodByCategory', (req, res) => {



  knex('PRODUCT')
    .where({
      RESTAURANT_ID:req.query.restaurantId,
      PRODUCT_MENU_TYPE:req.query.foodCategory
    })
    .select()
    .then((data) => {
      res.json({menuItems:data})
    })
})


app.get('/getRestaurant', (req, res) => {

  knex('RESTAURANT')
    .where('RESTAURANT_ID','=', req.query.id)
    .select()
    .then((data) => {
      res.json(data)
    })
})

app.get('/getRestaurants', (req, res) => {

  let lat = req.query.lat
  let lng = req.query.lng

  knex('RESTAURANT').select().then((data) => {
    const requests = data.map((restaurant) => {

      return new Promise((resolve) => {

        let url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${lng}&destinations=${restaurant.RESTAURANT_LATITUDE},${restaurant.RESTAURANT_LONGITUDE}&key=AIzaSyB228AWCnKapnDizeZJDUS1RFoaKjdKhsI`
        requestify.get(url)
          .then(function(response) {
            let distanceMatrix = response.getBody().rows[0].elements[0]
            let distance = distanceMatrix.distance.text
            let distanceVal = distanceMatrix.distance.value
            let time = distanceMatrix.duration.text

            let restaurantObject = {
             restaurantId:restaurant.RESTAURANT_ID,
              restaurantName:restaurant.RESTAURANT_NAME,
              restaurantLat:restaurant.RESTAURANT_LATITUDE,
              restaurantLong:restaurant.RESTAURANT_LONGITUDE,
            }



            resolve({time:time, distance:distance,distanceVal:distanceVal, 'restaurant':restaurantObject})
            //resolve({ time: '1 min', distance: '0.8 km', distanceVal: 816, restaurant: { restaurantId:5, restaurantName: 'Jutrzenka', restaurantLat: 53.9278264, restaurantLong: 16.2573878 } })

          })
      })
    })


    Promise.all(requests).then((data) => {
      res.json(JSON.stringify({results:data}))
    })
  })



})

app.post('/addToMenu', (req, res) => {
  knex('sessions')
    .where('sid', '=', JSON.parse(req.cookies.authentication).sessionId)
    .select()
    .then((user) => {
      if (user.length) {
        for (let i of req.body.menuItems) {
            i.RESTAURANT_ID = req.body.restaurantId
            knex('PRODUCT').insert(i).then((r) => {
              console.log(r)
            })
        }
        res.json({'status':STATUSES.SUCCESS})
      } else {
        return res.json({'status':'notAuthenticated'})
      }
    })
})



app.post('/addRestaurant', (req, res) => {

  knex('sessions')
    .where('sid', '=', JSON.parse(req.cookies.authentication).sessionId)
    .select()
    .then((user) => {
      if (user.length) {

        let address = `${req.body.city} ${req.body.street} ${req.body.postalCode}`

        requestify.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyB228AWCnKapnDizeZJDUS1RFoaKjdKhsI`)
          .then(function(response) {
              let location = response.getBody().results[0].geometry.location

              console.log(location.lat)

              const record = {
                'RESTAURANT_NAME':req.body.restaurantName,
                'RESTAURANT_OWNER':JSON.parse(user[0].sess).userData,
                'RESTAURANT_POSTCODE':req.body.postalCode,
                'RESTAURANT_STREET':req.body.street,
                'RESTAURANT_CITY':req.body.city,
                'RESTAURANT_TABLE_COUNT':req.body.restaurantTableCount,
                'RESTAURANT_PRE_BOOK':req.body.allowPreBook,
                'RESTAURANT_LATITUDE':location.lat,
                'RESTAURANT_LONGITUDE':location.lng,
              }

              knex('RESTAURANT')
                .insert(record)
                .then(() => {
                  return res.json({'status':STATUSES.SUCCESS})
                })

            }
          );
      } else {
        return res.json({'status':'notAuthenticated'})
      }
    })
})



app.post('/deleteRestaurant', (req, res) => {
  console.log(req.body)
  knex('sessions')
    .where('sid', '=', JSON.parse(req.cookies.authentication).sessionId)
    .select()
    .then((user) => {
      if (user.length) {
        knex('RESTAURANT')
          .where('RESTAURANT_ID', '=', req.body.restaurantId)
          .del()
          .then((data) => {
            if (data) {
              return res.json({'status':STATUSES.SUCCESS})
            } else {
              return res.json({'status':STATUSES.FAILED})
            }
          })
      } else {
        return res.json({'status':'notAuthenticated'})
      }
    })
})


app.get('/checkAuthentication', (req, res) => {

  if (!req.cookies.authentication) {
    return res.json({'status':'notAuthenticated'})
  }

  let authentication = JSON.parse(req.cookies.authentication)

  if (authentication) {
    let sessionId = authentication.sessionId

    if (sessionId) {
      knex('sessions').where('sid', '=', sessionId).select().then((data) => {
        if (data.length == 1) {
          return res.json({'status': 'authenticated'})
        } else {
          return res.json({'status': 'notAuthenticated'})
        }
      })
    } else {
      return res.json({'status':'notAuthenticated'})
    }
  }



})

app.get('/signOut', (req, res) => {

  let authentication= JSON.parse(req.cookies.authentication)
  let sessionId = authentication.sessionId

  knex('sessions')
    .where('sid','=', sessionId)
    .del()
    .then((data) => {
      console.log(data)
      res.json({'status':STATUSES.SUCCESS})
    })
})



app.post('/register', (req, res) => {

  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {

    const record = {
      'PERSON_EMAIL':req.body.emailAddress,
      'PERSON_PASSWORD':hash,
      'PERSON_FIRSTNAME':req.body.firstName,
      'PERSON_LASTNAME':req.body.lastName,
      'PERSON_PHONE':req.body.phone,
    }

    knex('PERSON')
      .insert(record)
      .then((data) => {
        console.log('register success', data)
        res.json({status:STATUSES.SUCCESS});
      }).catch((err) => {
        console.log('registration went wrong', err)
      res.json({status:STATUSES.FAILED});
    })
  });


})

app.post('/login', (req, res) => {
  knex('PERSON')
    .where('PERSON_EMAIL', '=', req.body.emailAddress)
    .select().then((userData) => {
      if (userData.length) {
        bcrypt.compare(req.body.password, userData[0].PERSON_PASSWORD, (err, hashres) => {
          if (hashres) {
            req.session.userData = userData[0].PERSON_ID
            res.json({status:STATUSES.SUCCESS, sessionId:req.session.id,
              authenticatedUser:{
                id:userData[0].PERSON_ID,
                firstName:userData[0].PERSON_FIRSTNAME,
                lastName:userData[0].PERSON_LASTNAME
              }
            });
          } else {
            res.json({status:STATUSES.FAILED});
          }
        })
      } else {
        res.json({status:STATUSES.FAILED});
      }
  })

})



app.listen(port, () => console.log(`server listening on port ${port}!`))