const express = require('express')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var session = require('express-session');
const cors = require('cors')
const KnexSessionStore = require('connect-session-knex')(session);
require('dotenv').config({ path: './vars.env' })
var requestify = require('requestify');

//refactor later authentication check repetition

const STATUSES = {
  'SUCCESS':'success',
  'FAILED':'failed'
}

const port = 3001

const bcrypt = require('bcrypt');
const saltRounds = 10;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

let socketClients = []

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


io.on('connection', function(socket){
  console.log('a user connected');
  socketClients.push(socket)
});

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
    .innerJoin('MENUTYPE', 'PRODUCT.PRODUCT_MENU_TYPE', '=', 'MENUTYPE.MENU_TYPE_ID')
    .where({
      RESTAURANT_ID:req.query.restaurantId,
      PRODUCT_MENU_TYPE:req.query.foodCategory
    })
    .select()
    .then((data) => {
      res.json({menuItems:data})
    })
})


app.get('/getAllMenuItems', isAuthenticated, (req, res) => {
    knex('PRODUCT')
        .innerJoin('MENUTYPE', 'PRODUCT.PRODUCT_MENU_TYPE', '=', 'MENUTYPE.MENU_TYPE_ID')
        .where({
            RESTAURANT_ID:req.query.restaurantId,
        })
        .select()
        .then((data) => {
            res.json({menuItems:data})
        })
})


app.post('/deleteMenuItems', isAuthenticated, (req, res) => {
    knex('PRODUCT')
        .whereIn('PRODUCT_ID', req.body)
        .delete()
        .then((data) => {
            res.json({status:STATUSES.SUCCESS})
        })
})


app.get('/orders', (req, res) => {

  let orders = {}

  knex('ORDER_HEADER')
    .where({
      RESTAURANT_ID:req.query.id,
    })
    .select()
    .then((data) => {
      let promises = data.map((order) => {

        let orderRecord = {
          orderId:order.ORDER_ID,
          orderStatus:order.ORDER_STATUS,
          orderItems:[],
          totalPrice:0
        }

        return new Promise((resolve) => {
          orders[order.ORDER_ID] = {
            order:orderRecord
          }
          knex('ORDER_ITEM').innerJoin('PRODUCT', 'ORDER_ITEM.PRODUCT_ID', 'PRODUCT.PRODUCT_ID')
            .where({
              ORDER_ID:order.ORDER_ID
            })
            .select()
            .then((orderItems) => {
              orderItems.map((item) => {
                orders[item.ORDER_ID].order.orderItems.push(item)
                orderRecord.totalPrice += item.PRODUCT_PRICE * item.QUANTITY
              })
              resolve()
            })
        })
      })

      Promise.all(promises).then((data) => {
        res.json(orders)
      })

    })

})

app.post('/createOrder', (req, res) => {
  let orderedItems = req.body.orderedItems

  knex('ORDER_HEADER').insert({RESTAURANT_ID:orderedItems[0].RESTAURANT_ID, ORDER_STATUS:'WTFORCONF'}).then((data) => {
    if (data) {
      const orderItems = orderedItems.map((item) => {
        return new Promise((resolve) => {
          knex('ORDER_ITEM').insert({ORDER_ID:data[0], QUANTITY:item.quantity, PRODUCT_ID:item.PRODUCT_ID}).then((orderItemRes) => {
            resolve(orderItemRes)
            //change to emit to specific later
            io.sockets.emit('newOrder')
          })
        })
      })
    }
  })


  Promise.all(orderedItems).then((data) => {
    res.json({status:STATUSES.SUCCESS})
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

        let url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${lng}&destinations=${restaurant.RESTAURANT_LATITUDE},${restaurant.RESTAURANT_LONGITUDE}&key=${process.env.GOOGLE_API}`
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
            //resolve({ time: '1 min', distance: '0.8 km', distanceVal: 816, restaurant: { restaurantId:1, restaurantName: 'Jutrzenka', restaurantLat: 53.9278264, restaurantLong: 16.2573878 } })

          })
      })
    })


    Promise.all(requests).then((data) => {
      res.json(JSON.stringify({results:data}))
    })
  })



})

app.post('/addProduct', isAuthenticated, (req, res) => {

    let menuItem = req.body.menuItem

    let record = {
      PRODUCT_NAME: menuItem.PRODUCT_NAME,
      PRODUCT_DESCRIPTION: menuItem.PRODUCT_DESCRIPTION,
      PRODUCT_PRICE: menuItem.PRODUCT_PRICE,
      PRODUCT_MENU_TYPE: menuItem.PRODUCT_MENU_TYPE,
      RESTAURANT_ID:req.body.restaurantId
    }

    knex('PRODUCT').insert(record).then((r) => {
      return res.json({'status':STATUSES.SUCCESS, PRODUCT_ID:r[0]})
    })

})


app.post('/saveMenu', isAuthenticated, (req, res) => {

  let menuItems = req.body.menuItems

  let promises = menuItems.map((i) => {
    console.log(i)
    return new Promise((resolve) => {
      knex('PRODUCT')
        .where({
          PRODUCT_ID:i.PRODUCT_ID
        })
        .update({
          PRODUCT_NAME: i.PRODUCT_NAME,
          PRODUCT_DESCRIPTION: i.PRODUCT_DESCRIPTION,
          PRODUCT_PRICE: i.PRODUCT_PRICE,
          PRODUCT_MENU_TYPE: i.PRODUCT_MENU_TYPE,
        })
        .then((r) => {
          resolve(r)
        })
    })
  })


  Promise.all(promises).then(() => {
    res.json({status:STATUSES.SUCCESS})
  })

})

app.post('/addRestaurant', isAuthenticated, (req, res) => {

  let address = `${req.body.city} ${req.body.street} ${req.body.postalCode}`

  requestify.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_API}`)
    .then(function(response) {
        let location = response.getBody().results[0].geometry.location
        const record = {
          'RESTAURANT_NAME':req.body.restaurantName,
          'RESTAURANT_OWNER':JSON.parse(req.user[0].sess).userData,
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
})


app.post('/editRestaurant', isAuthenticated, (req, res) => {

    let address = `${req.body.city} ${req.body.street} ${req.body.postalCode}`

    requestify.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_API}`)
        .then(function(response) {
                let location = response.getBody().results[0].geometry.location
                const record = {
                    'RESTAURANT_NAME':req.body.restaurantName,
                    'RESTAURANT_POSTCODE':req.body.postalCode,
                    'RESTAURANT_STREET':req.body.street,
                    'RESTAURANT_CITY':req.body.city,
                    'RESTAURANT_TABLE_COUNT':req.body.restaurantTableCount,
                    'RESTAURANT_PRE_BOOK':req.body.allowPreBook,
                    'RESTAURANT_LATITUDE':location.lat,
                    'RESTAURANT_LONGITUDE':location.lng,
                }

                knex('RESTAURANT')
                    .update(record)
                    .then(() => {
                        return res.json({'status':STATUSES.SUCCESS})
                    })

            }
        );
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



function isAuthenticated(req, res, next) {
  knex('sessions')
    .where('sid', '=', JSON.parse(req.cookies.authentication).sessionId)
    .select()
    .then((user) => {
      if (user.length) {
          req.user = user
          return next();
      } else {
        return res.json({'status':'notAuthenticated'})
      }
    })

}


http.listen(3001, function(){
  console.log('listening on *:3000');
});