import { Draw } from '../../common/Draw.mjs';
import { Bet } from '../../common/Bet.mjs';
const SERVER_URL = 'http://localhost:3001';

async function handleInvalidResponse(response) {
  if (!response.ok) {
    const error_message = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${error_message}`);
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
    console.error('Error logging in: ' + error);
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
    return;
  } catch (error) {
    console.error('Error logging out: ' + error);
    throw error;
  }
};

const getUserData = async () => {
  try {
    const response = await fetch(SERVER_URL + '/api/sessions/current', { credentials: 'include' });
    await handleInvalidResponse(response);
    const user = await response.json();
    return user;
  } catch (error) {
    //console.error('Error fetching user data: ' + error);
    throw error;
  }
};

const getLastDraw = async () => {
  try {
    const response = await fetch(SERVER_URL + '/api/draws/last', {
      credentials: 'include'
    });
    await handleInvalidResponse(response);
    const draw = await response.json();

    //NOTE draw can be null!
    if (!draw) {
      return draw;
    }

    return new Draw(draw.numbers, draw.round);
  } catch (error) {
    console.error('Error fetching draw: ' + error);
    throw error;
  }
}

const createBet = async (numbers) => {
  try {
    const response = await fetch(SERVER_URL + '/api/bets/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({numbers: numbers})
    });
    await handleInvalidResponse(response);
    let betJSON = await response.json();
    let bet = new Bet(betJSON.round, betJSON.user_id, betJSON.numbers);
    console.log(`Bet created for the round #${bet.round}: ${bet.numbers}`);
    return bet;
  } catch (error) {
    console.error('Error placing bet: ' + error);
    throw error;
  }
};

const getNewResults = async function () {
  try {
    const response = await fetch(SERVER_URL + '/api/user/results/unseen', {
      credentials: 'include'
    });

    await handleInvalidResponse(response);
    const results = await response.json();
    if(!results){
      return [];
    }
    return results;
  } catch (error) {
    console.error('Error fetching user results: ' + error);
    throw error;
  }
}

const getBestScores = async () => {
  try {
    const response = await fetch(SERVER_URL + '/api/scores/best', {
      credentials: 'include'
    });
    await handleInvalidResponse(response);
    const scores = await response.json();
    return scores;
  } catch (error) {
    console.error('Error fetching best scores: ' + error);
    throw error;
  }
};

const API = { logIn, getUserData, logOut, getBestScores, getLastDraw, createBet, getNewResults };
export default API;
