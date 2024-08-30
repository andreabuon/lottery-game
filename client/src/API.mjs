const SERVER_URL = 'http://localhost:3001';

async function handleError(response) {
  const errorMessage = await response.text();
  throw new Error(`${response.status} - ${response.statusText}: ${errorMessage}`);
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
  if (!response.ok) {
    handleError(response);
  }
  const user = await response.json();
  return user;
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  if (!response.ok) {
    handleError(response);
  }
  const user = await response.json();
  return user;
};

const logOut = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!response.ok) {
    handleError(response);
  }
  return null;
};

const getBestScores = async () => {
  const response = await fetch(SERVER_URL + '/api/scores/best', {
    credentials: 'include'
  });
  if (!response.ok) {
    handleError(response);
  }
  const scores = await response.json();
  return scores;
};

const getLastDraw = async () => {
  const response = await fetch(SERVER_URL + '/api/draws/last', {
    credentials: 'include'
  });

  if (!response.ok) {
    handleError(response);
  }
  const draw = await response.json();
  return draw;
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
  if (!response.ok) {
    handleError(response);
  }
  return await response.json();
};

const API = { logIn, getUserInfo, logOut, getBestScores, getLastDraw, createBet };
export default API;