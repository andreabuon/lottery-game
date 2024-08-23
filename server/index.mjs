/** Importing modules **/
import express from 'express';
import cors from 'cors';
import {check, validationResult} from 'express-validator';

import UserDao from './dao_users.mjs';

const userDao = new UserDao();

// init express
const app = new express();
app.use(express.json());

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));


/*** Passport ***/

/** Authentication-related imports **/
import passport from 'passport';                              // authentication middleware
import LocalStrategy from 'passport-local';                   // authentication strategy (username and password)

/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUserByCredentials() (i.e., id, username, name).
 **/
passport.use(new LocalStrategy(async function verify(username, password, callback) {
    const user = await userDao.getUserByCredentials(username, password)
    if(!user)
      return callback(null, false, 'Incorrect username or password');

    return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUserByCredentials(), i.e, id, username, name)
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


/** Creating the session */
import session from 'express-session';

app.use(session({
  secret: "This is a very secret information used to initialize the session!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({error: 'Not authorized'});
}


/*** APIs ***/

app.get('/', (req, res) => {
  res.send('Hello World!')
})


// Activating the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});