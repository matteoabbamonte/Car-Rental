const express = require('express');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const moment = require('moment');
const { check, validationResult } = require('express-validator');
const dao = require('./dao.js');
const jwtSecret = "6A91A1C91CD7DD7C7E2816C49C150ED9A1C775FEC7D88352A998E0F0FA86B1AA";

const app = express();
const PORT = 3001;
// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());

const expireTime = 60 * 60 * 24 * 7; //seconds


// Authentication endpoint
app.post('/api/login', (req, res) => {
  const username = req.body.email;
  const password = req.body.password;

  dao.checkPassword(username, password).then((user) => {
    //AUTHENTICATION SUCCESS
    const token = jsonwebtoken.sign({ userID: user.userId }, jwtSecret, { expiresIn: expireTime });
    res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
    res.json({ id: user.userId, name: user.userName });
  }).catch(

    // Delay response when wrong user/pass is sent to avoid fast guessing attempts
    (err) => {
      new Promise((resolve) => { setTimeout(resolve, 1000) }).then(() => res.status(401).end())
    }
  );
});

app.use(cookieParser());

app.post('/api/logout', (req, res) => {
  res.clearCookie('token').end();
});

// GET /cars/ (all task_ids)/<task_id>
// Response body: object describing a public Task specified by its id
// Error: if the Task does not exist, returns {}
app.get('/api/cars', (req, res) => {
  const categories = req.query.categories.split("_");
  const brands = req.query.brands.split("_");
  dao.getCarsByCategoryAndBrand(categories, brands)
    .then((task) => { res.json(task); })
    .catch((err) => {
      res.status(500).json({
        errors: [{ 'msg: ': err }],
      });
    });
});

// For the rest of the code, all APIs require authentication
app.use(
  jwt({
    secret: jwtSecret,
    getToken: req => req.cookies.token
  })
);

//Logged APIs

// GET /cars?<filterName>=<filterValue>
// Parameters: filterName, filterValue
// Response body: list of cars
// Error: the error message is returned
app.get('/api/configure', (req, res) => {
  if (req.user && req.query.period != "none" && req.query.category != "none") {
    const period = req.query.period.split("_");
    var dateControl = moment(period[0]).isBefore(moment(period[1]));
    if (!dateControl) {
      return res.status(422).json({ errors: [{ 'msg: ': 'Wrong dates' }] });
    }
    dao.getCarsByCategoryAndPeriod(req.query.category, period)
      .then((task) => { res.json(task); })
      .catch((err) => {
        res.status(500).json({
          errors: [{ 'msg: ': err }],
        });
      });
  } else if (req.user && req.query.period != "none") {
    const period = req.query.period.split("_");
    var dateControl = moment(period[0]).isBefore(moment(period[1]));
    if (!dateControl) {
      return res.status(422).json({ errors: [{ 'msg: ': 'Wrong dates' }] });
    }
    dao.getCarsByPeriod(period)
      .then((task) => { res.json(task); })
      .catch((err) => {
        res.status(500).json({
          errors: [{ 'msg: ': err }],
        });
      });
  } else if (req.user) {
    dao.getCarsByCategoryAndBrand(req.query.category, "none")
      .then((task) => { res.json(task); })
      .catch((err) => {
        res.status(500).json({
          errors: [{ 'msg: ': err }],
        });
      });
  }
});


// GET /rentals/ <task_id>
// Response body: list of records from rental table concerning the specified user
// Error: returns error message
app.get('/api/rentals', [
  check('extended').isBoolean()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  var extended = req.query.extended;
  var userId = req.user && req.user.userID;
  dao.getRentals(extended, userId)
    .then((rentals) => { res.json(rentals); })
    .catch((err) => {
      res.status(500).json({
        errors: [{ 'msg: ': err }],
      });
    });
});

// POST /payment
// Request body: object describing an task 
// Response body: empty (ALTERNATIVE: new 'id' for the inserted course)
//    (ALTERNATIVE: return a full copy of the Exam)
app.post('/api/payment', [
  check('cardHolder').custom((string) => {
    if (string.split(" ").length < 2) {
      throw new Error('Not a Correct name');
    } else {
      return true;
    }
  }),
  check('cardNumber').isNumeric().isLength({ min: 16, max: 16 }),
  check('expiration').isAfter(moment().format('YYYY-MM-DD')),
  check('cvv').isLength({ min: 3, max: 3 }),
  check('startDate').isAfter(moment().format('YYYY-MM-DD')),
  check('endDate').isAfter(moment().format('YYYY-MM-DD')),
  check('carId').isInt(),
  check('price').isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const rentalObj = req.user && {
    userId: req.user.userID,
    carId: req.body.carId,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    price: req.body.price
  };
  dao.registerRental(rentalObj)
    .then((response) => res.end())
    .catch((err) => res.status(503).json({
      errors: [{ 'param': 'Server', 'msg': 'Database error' }],
    }));
});

// DELETE /delete
// Response body: list of rentals, without the one that must be deleted
// Error: returns err
app.delete('/api/delete', (req, res) => {
  const userID = req.user && req.user.userID;
  const rentalObj = req.user && {...req.body};
  dao.deleteRental(rentalObj, userID)
    .then(() => res.end())
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        errors: [{ 'msg: ': err }],
      });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));