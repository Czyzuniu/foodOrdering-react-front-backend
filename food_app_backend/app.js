const express = require('express')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
const multer  = require('multer')
var session = require('express-session');
const cors = require('cors')
const crypto = require('crypto');
const fs = require('fs');
const path = require('path')
const KnexSessionStore = require('connect-session-knex')(session);
const mime = require('mime');
require('dotenv').config({ path: './vars.env' })
var requestify = require('requestify');
//refactor later authentication check repetition

const STATUSES = {
  'SUCCESS':'success',
  'FAILED':'failed'
}

// const storage = multer.diskStorage({
//   destination: './uploads/',
//   filename: function (req, file, cb) {
//     crypto.pseudoRandomBytes(16, function (err, raw) {
//       if (err) return cb(err)
//
//       //CHECK PATHS LATER
//       cb(null, raw.toString('hex') + path.extname(file.originalname))
//     })
//   }
// })
//
// const uploader = multer({ storage: storage })


const uploader = multer({
  dest: "uploads/",
  limits: {
    fields: 10,
    fileSize: 1024*1024*20,
    files: 1,
  }
});

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
app.use(express.static(path.join(__dirname, 'public')));

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


  socket.on('confirmOrder', (data) => {
    io.to(`${data.toSocketId}`).emit('orderConfirmed');
    setOrderStatus(data)
    io.sockets.emit('orderUpdated')
  })

  socket.on('declineOrder', (data) => {
    io.to(`${data.toSocketId}`).emit('orderDeclined', {reason:data.reason});
    io.sockets.emit('orderUpdated')
    setOrderStatus(data)
  })

  socket.on('completeOrder', (data) => {
    io.sockets.emit('orderUpdated')
    setOrderStatus(data)
  })
});

app.get('/myRestaurants',isAuthenticated,(req, res) => {
  let authentication= JSON.parse(req.cookies.authentication)
  let restaurants = []

  knex('RESTAURANT')
    .where('RESTAURANT_OWNER','=', authentication.userId)
    .select()
    .then((data) => {
      let promises = data.map((restaurant) => {
        return new Promise((resolve) => {
          knex('RESTAURANT_CATEGORY')
            .where({RESTAURANT_ID:restaurant.RESTAURANT_ID})
            .select()
            .then((cats) => {
              restaurant.categories = cats
              restaurants.push(restaurant)
              resolve()
            })
        })
      })


      Promise.all(promises).then(() => {
        res.json({restaurants:restaurants})
      })

    })
})

app.get('/getFoodByCategory', (req, res) => {
  let isWebAppMenu = req.query.isWebApp
  let query = knex('PRODUCT')
    .innerJoin('MENUTYPE', 'PRODUCT.PRODUCT_MENU_TYPE', '=', 'MENUTYPE.MENU_TYPE_ID')
    .where({
      RESTAURANT_ID: req.query.restaurantId,
      PRODUCT_MENU_TYPE: req.query.foodCategory
    })


  if (!isWebAppMenu) {
    query.andWhereRaw('PRODUCT_NAME != "" AND PRODUCT_DESCRIPTION != "" AND PRODUCT_PRICE != "NULL"')
  }

  query.select()
    .then((data) => {
      let promises = data.map((product) => {
        return new Promise((resolve) => {
          knex('FOOD_ALLERGY_PRODUCT')
            .innerJoin('FOOD_ALLERGY', 'FOOD_ALLERGY_PRODUCT.FOOD_ALLERGY_ID', '=', 'FOOD_ALLERGY.FOOD_ALLERGY_ID')
            .where({
              PRODUCT_ID: product.PRODUCT_ID,
            })
            .select().then((allergies) => {
              product.allergies = allergies
              resolve()
          })
        })
      })

      Promise.all(promises).then(() => {
        res.json({menuItems:data})
      })

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
        let promises = data.map((product) => {
          return new Promise((resolve) => {
            knex('FOOD_ALLERGY_PRODUCT')
              .innerJoin('FOOD_ALLERGY', 'FOOD_ALLERGY_PRODUCT.FOOD_ALLERGY_ID', '=', 'FOOD_ALLERGY.FOOD_ALLERGY_ID')
              .where({
                PRODUCT_ID: product.PRODUCT_ID,
              })
              .select().then((allergies) => {
              product.allergies = allergies
              resolve()
            })
          })
        })

        Promise.all(promises).then(() => {
          res.json({menuItems:data})
        })

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
    .innerJoin('STATUS', 'ORDER_HEADER.ORDER_STATUS', 'STATUS.STATUS_ID')
    .where({
      RESTAURANT_ID:req.query.id,
    })
    .whereNot({ORDER_STATUS:'COMPLETED'})
    .andWhereNot({ORDER_STATUS:'DECLINED'})
    .select()
    .then((data) => {
      let promises = data.map((order) => {
        let orderRecord = {
          orderId:order.ORDER_ID,
          orderTable:order.ORDER_TABLE,
          from:order.ORDER_FROM_SOCKET_ID,
          orderStatus: {
              id:order.ORDER_STATUS,
              desc:order.STATUS_DESCRIPTION
          },
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
  let from = req.body.from
  let table = req.body.table

  let orderRecord = {RESTAURANT_ID:orderedItems[0].RESTAURANT_ID, ORDER_STATUS:'WTFORCONF', ORDER_FROM_SOCKET_ID:from, ORDER_TABLE:table}

  knex('ORDER_HEADER').insert(orderRecord).then((data) => {
    if (data) {
      const orderItems = orderedItems.map((item) => {
        return new Promise((resolve) => {
          knex('ORDER_ITEM').insert({ORDER_ID:data[0], QUANTITY:item.quantity, PRODUCT_ID:item.PRODUCT_ID, ORDER_CUSTOM:item.customized}).then((orderItemRes) => {
            resolve(orderItemRes)
            //change to emit to specific later
            io.sockets.emit('newOrder')
          })
        })
      })
    }
  })


  Promise.all(orderedItems).then((data) => {
    res.json({orderStatus:'WTFORCONF'})
  })
})

app.get('/getRestaurant', (req, res) => {

  console.log(req.query.id)

  knex('RESTAURANT')
    .where('RESTAURANT_ID','=', req.query.id)
    .select()
    .then((restaurantData) => {
      let resData = restaurantData[0]
      knex('RESTAURANT_IMAGE')
        .where('RESTAURANT_ID','=', req.query.id)
        .select()
        .then((images) => {
          knex('REVIEW')
            .avg({avgReview:'REVIEW_RATING' })
            .where({RESTAURANT_ID: req.query.id})
            .select()
            .then((avg) => {
              knex('RESTAURANT_CATEGORY')
                .innerJoin('FOOD_CATEGORY', 'RESTAURANT_CATEGORY.CATEGORY_ID', '=', 'FOOD_CATEGORY.CATEGORY_ID')
                .where({RESTAURANT_ID:req.query.id})
                .select().then((cats) => {
                  resData.avgReview = avg[0]
                  resData.categories = cats
                  res.json({resData, images})
              })
            })
        })
    })
})

app.get('/getMultipleRestaurants', (req, res) => {
  knex('RESTAURANT')
    .whereIn('RESTAURANT_ID',Array.from(req.query.ids))
    .select()
    .then((restaurants) => {
      res.json(restaurants)
    })
})



app.get('/getReviewsPerId', (req, res) => {
  knex('REVIEW')
    .innerJoin('RESTAURANT', 'REVIEW.RESTAURANT_ID', '=', 'RESTAURANT.RESTAURANT_ID')
    .where({'REVIEW_PERSON_ID':req.query.id})
    .select()
    .then((reviews) => {
      res.json(reviews)
    })
})


app.post('/submitReview', (req, res) => {

  let record = {
    RESTAURANT_ID: req.body.restaurantId,
    REVIEW_PERSON_ID: req.body.profileId,
    REVIEW_RATING:req.body.rating,
    REVIEW_COMMENTS:req.body.comments
  }

  knex('REVIEW')
    .where({
      RESTAURANT_ID: req.body.restaurantId,
      REVIEW_PERSON_ID: req.body.profileId,
    })
    .select()
    .then((review) => {
      console.log(review)
      if (review.length) {
        console.log('got something should update the previous record')
          knex('REVIEW')
            .where({
              RESTAURANT_ID: req.body.restaurantId,
              REVIEW_PERSON_ID: req.body.profileId,
            })
          .update(record).then(() => {
            res.json({status:STATUSES.SUCCESS})
          })
      } else {
        console.log('creating review')
        knex('REVIEW')
          .insert(record).then((rev) => {
            console.log(rev)
            res.json({status:STATUSES.SUCCESS})
          })
      }
    })

})


app.get('/getMyReview', (req, res) => {
  let myReview = []
  knex('REVIEW')
    .where({
      RESTAURANT_ID: req.query.restaurantId,
      REVIEW_PERSON_ID: req.query.profileId,
    })
    .select()
    .then((review) => {
      if (review) {
        myReview = review[0]
      }
      res.json({myReview:myReview})
    })
})

app.get('/getRestaurants', (req, res) => {

  let lat = req.query.lat
  let lng = req.query.lng

  knex('RESTAURANT')
    .select()
    .then((data) => {
    const requests = data.map((restaurant) => {

      return new Promise((resolve) => {

        // let url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${lng}&destinations=${restaurant.RESTAURANT_LATITUDE},${restaurant.RESTAURANT_LONGITUDE}&key=${process.env.GOOGLE_API}`
        // requestify.get(url)
        //   .then(function(response) {
        //     let distanceMatrix = response.getBody().rows[0].elements[0]
        //     let distance = distanceMatrix.distance.text
        //     let distanceVal = distanceMatrix.distance.value
        //     let time = distanceMatrix.duration.text
        //
        //     let restaurantObject = {
        //      restaurantId:restaurant.RESTAURANT_ID,
        //       restaurantName:restaurant.RESTAURANT_NAME,
        //       restaurantLat:restaurant.RESTAURANT_LATITUDE,
        //       restaurantLong:restaurant.RESTAURANT_LONGITUDE,
        //     }
        //
        //     resolve({time:time, distance:distance,distanceVal:distanceVal, 'restaurant':restaurantObject})
        //   })

        knex('RESTAURANT_CATEGORY')
          .where({RESTAURANT_ID:restaurant.RESTAURANT_ID})
          .select()
          .then((cats) => {
              restaurant.categories = cats
              resolve({ time: '1 min', distance: '0.8 km', distanceVal: 816, restaurant: restaurant })
          })
      })
    })

    Promise.all(requests).then((data) => {
      res.json(JSON.stringify({results:data}))
    })
  })
})

app.get('/getRestaurantsByCat', (req, res) => {
  let categories = req.query.categories.split(',')

  knex('RESTAURANT')
    .where({RESTAURANT_CATEGORIES:categories})
    .select().then((data) => {

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


app.get('/getAllReviews', isAuthenticated, (req, res) => {

  let restaurantId = req.query.restaurantId

  knex('REVIEW')
    .where({RESTAURANT_ID:restaurantId})
    .select().then((data) => {
    return res.json(data)
  })
})


app.get('/getCategories', (req, res) => {

  knex('FOOD_CATEGORY')
    .select().then((data) => {
    return res.json(data)
  })

})


app.get('/getFoodAllergies', (req, res) => {

  knex('FOOD_ALLERGY')
    .select().then((data) => {
    return res.json(data)
  })

})



app.post('/addPhoto', uploader.single('uploadedFile'), (req, res) => {

  console.log(req.file, req.body)

  const fileName = req.file.filename + '.' + req.file.mimetype.split('/')[1];
  var target_path = './public/images/' + fileName

  fs.rename(req.file.path, target_path, function (err) {
    const record = {
      'RESTAURANT_ID':req.body.restaurantId,
      'PATH':'/images/' + fileName,
    }

    knex('RESTAURANT_IMAGE')
      .insert(record)
      .then(() => {
        return res.json({'status':STATUSES.SUCCESS})
      })

  })

})


app.get('/restaurantImages', isAuthenticated, (req, res) => {

  console.log(req.file, req.body)

  knex('RESTAURANT_IMAGE')
    .select()
    .where({
      RESTAURANT_ID:req.query.restaurantId
    })
    .then((data) => {
      let images = []
      data.map((img) => {
        let prefix = 'localhost:3001'
        let final = prefix + img.PATH
        images.push({imgPath:final})
      })
      return res.json(images)
    })


})


app.post('/saveMenu', isAuthenticated, (req, res) => {

  let menuItems = req.body.menuItems

  console.log(menuItems)

  let promises = menuItems.map((i) => {
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
          i.PRODUCT_ALLERGIES.map((a) => {
            knex('FOOD_ALLERGY_PRODUCT')
              .insert({PRODUCT_ID:i.PRODUCT_ID, FOOD_ALLERGY_ID:a})
              .then(() => {
                console.log('allergy added')
              })
          })

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
  let categories = req.body.selectedCategories

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
          'RESTAURANT_LONGITUDE':location.lng
        }

        knex('RESTAURANT')
          .insert(record)
          .then((id) => {
            let promises = categories.map((m) => {
              return new Promise((resolve) => {
                knex('RESTAURANT_CATEGORY')
                  .insert({
                    CATEGORY_ID:m,
                    RESTAURANT_ID:id[0]
                  }).then(() => {
                    resolve()
                })
              })
            })
            Promise.all(promises).then((data) => {
              return res.json({'status':STATUSES.SUCCESS})
            })

          })
      }
    );
})


app.post('/editRestaurant', isAuthenticated, (req, res) => {

    let address = `${req.body.city} ${req.body.street} ${req.body.postalCode}`
    let categories = req.body.categories.join(',')

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
                    'RESTAURANT_CATEGORIES':categories,
                }


                //categories are not saving

                knex('RESTAURANT')
                    .update(record)
                    .then(() => {
                        return res.json({'status':STATUSES.SUCCESS})
                    })

            }
        );
})



app.post('/deleteRestaurant', (req, res) => {
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


app.post('/editProfile', (req, res) => {
  knex('PERSON')
    .where({'PERSON_ID':req.body.id})
    .update({PERSON_FIRSTNAME:req.body.firstName,PERSON_LASTNAME:req.body.lastName,PERSON_PHONE:req.body.phone,PERSON_EMAIL:req.body.emailAddress})
    .then((updated) => {
      knex('PERSON')
        .where({'PERSON_ID':req.body.id})
        .select().then((data) => {
          let user = {
              id:data[0].PERSON_ID,
              firstName:data[0].PERSON_FIRSTNAME,
              lastName:data[0].PERSON_LASTNAME,
              emailAddress:data[0].PERSON_EMAIL,
              phoneNumber:data[0].PERSON_PHONE,
          }
          res.json({status:STATUSES.SUCCESS,authenticatedUser:user})
      })
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
                lastName:userData[0].PERSON_LASTNAME,
                emailAddress:userData[0].PERSON_EMAIL,
                phoneNumber:userData[0].PERSON_PHONE,
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


function setOrderStatus(data) {

  console.log(data)

  let orderId = data.orderId
  let status = data.status

  knex('ORDER_HEADER')
    .where({'ORDER_ID':orderId})
    .update({'ORDER_STATUS':status})
    .then((data) => {
      return true
    })
}


http.listen(3001, function(){
  console.log('listening on *:3000');
});
