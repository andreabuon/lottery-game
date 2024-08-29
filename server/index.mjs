/** Importing modules **/
import express from 'express';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
// Passport-related imports
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

import { getUser, getBestScores } from './dao_users.mjs';
import { addDraw, addBet, getLastDraw } from './dao_games.mjs';
import { createDraw, updateScores } from './lottery_game.mjs';

// init express
const app = new express();
app.use(express.json());

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));


/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUserByCredentials() (i.e., id, username, name).
 **/
passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await getUser(username, password);
  if (!user)
    return callback(null, false, 'Incorrect username or password.');

  return callback(null, user);
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) {
  callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) {
  return callback(null, user); // this will be available in req.user

  // In this method, if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));
});

/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
}

/** Creating the session */
app.use(session({
  secret: "This is a very secret information used to initialize the session!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

/*** APIs ***/

// POST /api/sessions
// This route is used for performing login.
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json({ error: info });
    }
    // success, perform the login and extablish a login session
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUserByCredentials() in LocalStratecy Verify Function
      return res.json(req.user);
    });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

/*******/

// POST /api/bet/new
// This route is used for adding a new bet.
app.post('/api/bets/', isLoggedIn, async (req, res) => {
  try {
    const bet = req.body;
    console.log("Created a new bet: ",req.user, bet);
    let risultato = await addBet(req.user.id, bet);
    res.status(200).json({ message:'Bet added successfully'});
  } catch (err){
    res.status(500).json({ message: err });
    //res.status(500).end();
  }
});


// GET /api/best_scores/
// Returns a JSON array containing the users with the top 3 scores in the database.
app.get('/api/scores/best', isLoggedIn, async (req, res) => {
  try {
    const scores = await getBestScores();
    res.json(scores);
  } catch {
    res.status(500).end();
  }
});

// GET /api/last_draw/
// Returns a JSON array containing the latest draw in the database.
app.get('/api/draws/last', isLoggedIn, async (req, res) => {
  try {
    const draw = await getLastDraw();
    res.json(draw);
  } catch {
    res.status(500).end();
  }
});

/*******/
const TIMEOUT = 20 * 1000; //FIXME
async function runLotteryGame() {
  await createDraw();
  await updateScores();
  setTimeout(runLotteryGame, TIMEOUT);
}

// Activating the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
  console.log('Starting the game!');
  runLotteryGame();
});



