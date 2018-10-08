var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/orders', function(req, res, next) {
  res.json(JSON.stringify([
      {
        orderId:'1543'
      },
      {
        orderId:'1121'
      },
      {
          orderId:'1543'
      },
      {
          orderId:'1121'
      },
      {
          orderId:'1543'
      },
      {
          orderId:'1121'
      },
      {
          orderId:'1543'
      },
      {
          orderId:'1121'
      }
  ]))
});

module.exports = router;
