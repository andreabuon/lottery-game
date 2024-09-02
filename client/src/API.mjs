import { Draw } from '../../common/Draw.mjs';
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
    throw error; // Simply re-throw the error to preserve the original stack trace
  }
};

const getUserInfo = async () => {
  try {
    const response = await fetch(SERVER_URL + '/api/sessions/current', { credentials: 'include' });
    await handleInvalidResponse(response);
    const user = await response.json();
    return user;
  } catch (error) {
    throw error;
  }
};

const getUserData = async () => {
  try {
    const response = await fetch(SERVER_URL + '/api/user/', { credentials: 'include' });
    await handleInvalidResponse(response);
    const user = await response.json();
    return user;
  } catch (error) {
    throw error;
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
    throw error;
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
    throw error;
  }
};

const getLastDraw = async () => {
  try {
    const response = await fetch(SERVER_URL + '/api/draws/last', {
      credentials: 'include'
    });
    await handleInvalidResponse(response);
    const draw_numbers = await response.json();
    return new Draw(draw_numbers);
    } catch (error) {
    throw error;
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
      body: JSON.stringify(Array.from(bet.numbers))
    });
    await handleInvalidResponse(response);
    return null;
  } catch (error) {
    throw error;
  }
};

const API = { logIn, getUserInfo, getUserData, logOut, getBestScores, getLastDraw, createBet };
export default API;
