const SERVER_URL = 'http://localhost:3001';

function handleError(response){
  throw new Error(response.status+ ": " + response.statusText);  
}

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    handleError(response);
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    handleError(response);
  }
};

const logOut = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
  else {
    handleError(response);
  }
};

const getBestScores = async () => {
  const response = await fetch(SERVER_URL + '/api/scores/best', {
    credentials: 'include'
  });
  const scores = await response.json();
  if (response.ok)
    return scores;
  else {
    handleError(response);
  }
};

const getLastDraw = async () => {
  const response = await fetch(SERVER_URL + '/api/draws/last', {
    credentials: 'include'
  });
  const draw = await response.json();
  if (response.ok)
    return draw;
  else {
    handleError(response);
  }
};

const createBet = async (bet) => {
  const response = await fetch(SERVER_URL + '/api/bets/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(bet)
  });
  if (response.ok) {
    return await response.json();
  }
  else {
    handleError(response);
  }
};

const API = { logIn, getUserInfo, logOut, getBestScores, getLastDraw, createBet};
export default API;