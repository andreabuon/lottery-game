/** Importing modules **/
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
// Passport-related imports
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

import { getUser, getBestScores, getUserById } from './dao_users.mjs';
import { getLastDraw, getResult, getNewResults, markResultsAsSeen } from './dao_games.mjs';
import { createBet, runGame } from './lottery_game.mjs';
//imports for nodemon watch
import { Draw } from '../common/Draw.mjs';
import { Bet } from '../common/Bet.mjs';

// init express
const app = new express();
app.use(express.json());
app.use(morgan('dev'));

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
  return res.status(401).send('Not authorized');
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
      return res.status(401).send('' + info); //FIXME
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
    res.status(401).send('Not authenticated'); //FIXME
});

// DELETE /api/session/current
// This route is used for logging out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

/*******/

// GET /api/user/
// This route is used for refreshing the user data after placing a bet or retreiving the last draw of the game.
app.get('/api/user', isLoggedIn, async (req, res) => {
  try{
    let user = await getUserById(req.user.user_id);
    if(!user){
      throw(Error('User not found anymore!'));
    }
    res.status(200).json(user);
  } catch (error){
    console.error(error);
    res.status(500).send(error);
  }
});

// POST /api/bets/
// This route is used for creating a new bet.
app.post('/api/bets/', isLoggedIn, async (req, res) => {
  try {
    let user = req.user;
    //TODO validate bet fields!
    let numbers = req.body;
    let bet = await createBet(user, numbers);
    res.status(200).json(bet);
  } catch (error){
    if(error.errno && error.errno === 19){
      res.status(409).send('The player has already placed a bet for this round!');
      return;
    }

    console.error(error);
    res.status(500).send(error);
  }
});


// GET /api/scores/best
// Returns a JSON array containing the users with the top 3 scores in the database.
app.get('/api/scores/best', isLoggedIn, async (req, res) => {
  try {
    const scores = await getBestScores();
    res.json(scores);
  } catch (error){
    console.error(error);
    res.status(500).send(error);
  }
});

// GET /api/draws/last
// Returns a JSON array containing the latest draw in the database.
app.get('/api/draws/last', isLoggedIn, async (req, res) => {
  try {
    const draw = await getLastDraw();
    res.json(draw);
  } catch (error){
    console.error(error);
    res.status(500).send(error);
  }
});

// GET /api/draws/:round/score'
// Returns a JSON object containing the user score for the specified round.
app.get('/api/draws/:round/score', isLoggedIn, async (req, res) => {
  try {
    const result = await getResult(req.params.round, req.user.user_id);
    if(!result){
        return res.status(404).send('No result found for the specified user and round.');
      }
    res.json(result);
  } catch (error){
    console.error(error);
    res.status(500).send(error);
  }
});

//FIXME
// GET /api/draws/scores/unseen'
// Returns a JSON array containing the user scores for the round.
app.get('/api/draws/scores/unseen', isLoggedIn, async (req, res) => {
  try {
    const results = await getNewResults(req.user.user_id);
    markResultsAsSeen(req.user.user_id);
    res.json(results);
  } catch (error){
    console.error(error);
    res.status(500).send(error);
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



