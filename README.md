[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/HF0PzDJs)
# Exam 3: "Lottery Game"
## Student: s333224 BUONAURIO ANDREA 

## React Client Application Routes
<!--
- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification 
-->
- Route `/`: Homepage of the website. Logged out users can read the game's rules. Logged in users can play the game (see the last draw of the game and make a new bet)
- Route `/login`: page used to perform login.
- Route `/rules`: contains the rules of the game for logged in users
- Route `/scoreboard`: Contains a table with the scores of the best 3 players of the game.
- Route `/*`: page for all invalid URLs

## API Server
<!--
- POST `/api/something`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...
-->
  
- POST /api/sessions
  - This route is used to perform login.
  - request parameters: none
  - request body content: credentials of the user
  - response body content: object with the data of the current user or an error message

- DELETE /api/session/current
  - This route is used to log out the current user.
  - request parameters: none
  - request body content: none
  - response body content: none

- GET /api/sessions/current
  - This route is used to check whether the user is logged in or not and to return the updated user data (usefult after placing a new bet or after the results of the game)
  - request parameters: none
  - request body content: none
  - response body content: object with the data of the current user or an error message

- GET /api/draws/last
  - This route is used to obtain the latest draw in the database.
  - request parameters: none
  - request body content: none
  - response body content: object with the data of the last draw of the game or an error message

- POST /api/bets/
  - This route is used to create a new bet.
  - request parameters: none
  - request body content: numbers of the new user bet
  - response body content: object with the data of the new bet or an error message

- GET /api/user/results/unseen
  - This route is used to download the bet results that the user has not viewed yet.
  - request parameters: none
  - request body content: none
  - response body content: array of objects with the results of the last bets of the user or an error message
  
- GET /api/scores/best
  - This route is used to download the username and scores of the best 3 players in the database.
  - request parameters: none
  - request body content: none
  - response body content: array of objects containing the username and the score of the top 3 players or an error message


## Database Tables

- Table `users` - contains informations about the users (id, username, hash, salt, score)
- Table `rounds` - contains informations about the game rounds (id)
- Table `draws` - contains informations about the draws of the game (id and numbers drawn)
- Table `bets` - contains informations about the players bet (id of the bet, id of the user, numbers in the bet)
- Table `results` - contains informations about the results of the players' bets (id of the round, id of the user, score of the bet, viewed status of the result) 


## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...
//TODO
(only _main_ components, minor ones may be skipped)

## Screenshot
//TODO
![Screenshot](./img/screenshot1.jpg)
![Screenshot](./img/screenshot2.jpg)

## Users Credentials

| username                | plain-text password |
| ----------------------- | ------------------- |
| user                    | password            |
| admin                   | password            |
| andrea                  | password            |
| carmine                 | password            |
| simone                  | password            |

