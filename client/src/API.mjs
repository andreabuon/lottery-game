const SERVER_URL = 'http://localhost:3001';

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
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;  // an object with the error coming from the server
  }
};

const logOut = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
};

export const getBestScores = async () => {
  const response = await fetch(SERVER_URL + '/api/scores/best', {
    credentials: 'include'
  });
  const scores = await response.json();
  if (response.ok)
    return scores;
  else {
    throw scores;
  }
};

export const getLastDraw = async () => {
  const response = await fetch(SERVER_URL + '/api/draws/last', {
    credentials: 'include'
  });
  const draw = await response.json();
  if (response.ok)
    return draw;
  else {
    throw draw;
  }
};

export const createBet = async (bet) => {
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
    const errDetails = await response.text();
    throw errDetails;
  }
};

const API = { logIn, logOut, getUserInfo, getBestScores, getLastDraw, createBet};
export default API;