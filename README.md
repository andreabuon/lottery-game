# Exam 3: "Lottery Game"
## Student: s333224 BUONAURIO ANDREA 

## React Client Application Routes
- Route `/`: This page is the homepage of the website. Logged out users can read the rules of the game. Logged in users can play the game (see the last draw of the game and place a new bet).
- Route `/login`: page used to perform login.
- Route `/rules`: page used by logged in users to read the rules of the game.
- Route `/scoreboard`: this page contains a table with the scores of the current best 3 players of the game.
- Route `/*`: page for all invalid URLs.

## API Server

### __Login__
- URL: `/api/sessions`
- HTTP Method: POST.
- Description: Logs in a user using provided credentials (username and password).
- Authentication: Not required.
- Request parameters: _None_.
- Request body content: Object with the credentials of the user (username and password).
```
{
  "username": "user",
  "password": "password"
} 
```
- Response body content: JSON object with the data of the current user _or_ an error message.
```
{
  "user_id": 1,
  "username": "user",
  "score": 100,
} 
```

### __Logout__
- URL: `/api/sessions/current`
- HTTP Method: DELETE 
- Description: Logs out the current user.
- Authentication: Not required.
- Request parameters: _None_.
- Request body content: _None_.
- Response body content: _None_.

### __Check login status and retrieve user data__
- URL: `/api/sessions/current`
- HTTP Method: GET 
- Description: Checks if the user is logged in and retrieves its data.
- Authentication: Not required.
- Request parameters: _None_.
- Request body content: _None_.
- Response body content: JSON object with the data of the current user _or_ an error message.
```
{
  "user_id": 1,
  "username": "user",
  "score": 100,
} 
```

### __Get the last draw of the game__
- URL: `/api/draws/last`
- HTTP Method: GET.
- Description: Retrieves the latest draw of the game in the database.
- Authentication: Required.
- Request parameters: _None_.
- Request body content: _None_.
- Response body content: JSON object with the data of the last draw of the game _or_ an error message.
```
{
  "numbers": [1,2,3,4,5],
  "round": 2,
} 
```

### __Place a new bet for the next round.__
- URL: `/api/bets`
- HTTP Method: POST.
- Description: This route is used by logged in users to place a new bet for the next round of the game.
- Authentication: Required.
- Request parameters: _None_.
- Request body content: Object with the numbers on which the player wants to place a bet.
```
{
  "numbers": [5, 10, 15]
}
```
- Response body content: Object with the data of the new bet created _or_ an error message.
```
{
  "round": 8,
  "user_id": 1,
  "numbers": [ 5, 10, 15]
}
```

### __Get the the results of the user bets.__
- URL: `/api/user/results/unseen`
- HTTP Method: GET 
- Description: This route is used by logged in users to download the bet results that the user has not viewed yet.
- Authentication: Required.
- Request parameters: _None_.
- Request body content: _None_.
- Response body content: JSON Object with the results of the last bets of the user _or_ an error message.
```
[
  {
    "round_num": 8,
    "user_id": 1,
    "score": 0,
    "viewed": 0
  }
]
```

### __Get the scores of the best players of the game.__
- URL: `/api/scores/best`
- HTTP Method: GET 
- Description: This route is used to download the username and scores of the best 3 players in the database.
- Authentication: Required.
- Request parameters: _None_.
- Request body content: _None_.
- Response body content: JSON array with the username and scores of the top 3 players _or_ an error message.
```
[
  {
    "username": "admin",
    "score": 100
  },
  {
    "username": "user",
    "score": 85
  },
  {
    "username": "andrea",
    "score": 85
  }
]
```


## Database Tables

- Table `users` - contains informations about the players (user id, username, hash, salt, score)
- Table `rounds` - contains informations about the game rounds (round count)
- Table `draws` - contains informations about the draws of the game (round number and numbers drawn)
- Table `bets` - contains informations about the players bet (round number, id of the user, numbers in the bet)
- Table `results` - contains informations about the results of the players' bets : round number, id of the user, score of the bet, status of the result of the bet (viewed or not) 


## Main React Components
<!--
- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main 
- functionality
-->


//TODO

## Screenshot
//TODO
![Screenshot](./img/screenshot1.jpg)
![Screenshot](./img/screenshot2.jpg)

## Users Credentials

| username | plain-text password |
| -------- | ------------------- |
| user     | password            |
| admin    | password            |
| andrea   | password            |
| carmine  | password            |
| simone   | password            |

