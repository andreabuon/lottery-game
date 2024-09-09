import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
// Passport - Authentication
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
// Lottery Game
import { Draw } from '../common/Draw.mjs';
import { Bet } from '../common/Bet.mjs';
import { getUserByCredentials, getUserById, getBestScores } from './dao_users.mjs';
import { getLastDraw, getNewResults, markResultsAsSeen } from './dao_games.mjs';
import { createBet, runGame } from './lottery_game.mjs';

const app = new express();
app.use(express.json());
//app.use(morgan('dev'));

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

/*** Passport ***/

// Set up authentication strategy to search in the DB a user with a matching password. The user object will contain information extracted from the DB.
passport.use(new LocalStrategy(
  async function verify(username, password, callback) {
    const user = await getUserByCredentials(username, password);
    if (!user) {
      return callback(null, false, 'Incorrect username or password.');
    }
    return callback(null, user);
  }));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) {
  callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) {
  return callback(null, user); // this will be available in req.user
});

// Defining authentication verification middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).end();
}

// Creating the session
app.use(session({
  secret: "This is a very secret information used to initialize the session!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

/****** Routes ******/

/* Authentication */

// POST /api/sessions
// This route is used to perform login.
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      // display wrong username/password messages
      return res.status(401).send(info || 'Auth failed'); //FIXME
    }

    // success, perform the login and extablish a login session
    req.login(user, (err) => {
      if (err)
        return next(err);

      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /api/sessions/current
// This route is used to log out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// GET /api/sessions/current
// This route is used to check whether the user is logged in or not and to retrieve the updated user data after placing a bet or retrieving the results of the game.
app.get('/api/sessions/current', isLoggedIn, async (req, res) => {
  try {
    let user = await getUserById(req.user.user_id);
    if (!user) {
      res.status(404).end();
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

/*******/

/* Lottery Game*/

// GET /api/draws/last
// This route is used to obtain the latest draw in the database.
app.get('/api/draws/last', isLoggedIn, async (req, res) => {
  try {
    const draw = await getLastDraw();
    res.json(draw);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

// POST /api/bets/
// This route is used by a client to create a new bet.
app.post('/api/bets/', isLoggedIn, async (req, res) => {
  try {
    let user = req.user;
    //TODO validate bet fields!
    let numbers = req.body;

    let bet = await createBet(user, numbers);
    res.status(200).json(bet);
  } catch (error) {
    if (error.errno && error.errno === 19) {
      res.status(409).end();
      return;
    }
    console.error(error);
    res.status(500).end();
  }
});

// GET /api/user/results/unseen
// This route is used by the client to retrieve the bet results that the user has not viewed yet.
app.get('/api/user/results/unseen', isLoggedIn, async (req, res) => {
  try {
    const results = await getNewResults(req.user.user_id);
    markResultsAsSeen(req.user.user_id);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

// GET /api/scores/best
// This route is used by the client to retrieve the usernames and scores of the best 3 players in the database.
app.get('/api/scores/best', isLoggedIn, async (req, res) => {
  try {
    const scores = await getBestScores();
    res.json(scores);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

/*******/

// Activating the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
  console.log('Starting the game!');
  runGame();
});



