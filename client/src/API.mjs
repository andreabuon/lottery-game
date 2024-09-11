import { Draw } from '../../common/Draw.mjs';
const SERVER_URL = 'http://localhost:3001';

async function handleInvalidResponse(response) {
  if (!response.ok) {
    const error_message = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${error_message}.`);
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
    console.error('Error fetching user data: ' + error);
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
    console.error('Error fetching the last draw of the game: ' + error);
    throw error;
  }
}

const createBet = async (user_bet) => {
  try {
    const response = await fetch(SERVER_URL + '/api/bets/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({numbers: user_bet.numbers}) //Send just the numbers of the bet! The server will compute the other fields of the bet (user and round).
    });
    await handleInvalidResponse(response);
    let server_bet = response.json();
    return server_bet;
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
    console.error('Error downloading best scores: ' + error);
    throw error;
  }
};

const API = { logIn, getUserData, logOut, getBestScores, getLastDraw, createBet, getNewResults };
export default API;
