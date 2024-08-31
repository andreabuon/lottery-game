const SERVER_URL = 'http://localhost:3001';

async function handleInvalidResponse(response) {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`${response.status} - ${response.statusText}: ${errorMessage}`);
  }
}

const logIn = async (credentials) => {
  try {
    const response = await fetch(SERVER_URL + '/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    await handleInvalidResponse(response);
    const user = await response.json();
    return user;
  } catch (error) {
    throw new Error(error)
  }
};

const getUserInfo = async () => {
  try {
    const response = await fetch(SERVER_URL + '/api/sessions/current', { credentials: 'include' });
    await handleInvalidResponse(response);
    const user = await response.json();
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const logOut = async () => {
  try {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
    await handleInvalidResponse(response);
    return null;
  } catch (error) {
    throw new Error(error);
  }
};

const getBestScores = async () => {
  try {
    const response = await fetch(SERVER_URL + '/api/scores/best', {
      credentials: 'include'
    });
    await handleInvalidResponse(response);
    const scores = await response.json();
    return scores;
  } catch (error) {
    throw new Error(error);
  }
};

const getLastDraw = async () => {
  try {
    const response = await fetch(SERVER_URL + '/api/draws/last', {
      credentials: 'include'
    });
    await handleInvalidResponse(response);
    const draw = await response.json();
    return draw;
  } catch (error) {
    throw new Error(error);
  }
}

const createBet = async (bet) => {
  try {
    const response = await fetch(SERVER_URL + '/api/bets/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(bet)
    });
    await handleInvalidResponse(response);
    return null;
  } catch (error) {
    throw new Error(error);
  }
};

const API = { logIn, getUserInfo, logOut, getBestScores, getLastDraw, createBet };
export default API;