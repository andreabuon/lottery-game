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
    const draw = await response.json();

    //NOTE draw can be null!
    if (!draw) {
      return draw;
    }

    return new Draw(draw.numbers, draw.round);;
  } catch (error) {
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
      body: JSON.stringify(user_bet.numbers) //Send just the bet numbers! The server will compute the other fields.
    });
    await handleInvalidResponse(response);
    let bet = response.json();
    return bet;
  } catch (error) {
    throw error;
  }
};

const getResult = async function (bet) {
  try {
    const response = await fetch(SERVER_URL + '/api/draws/' + bet.round + '/score', {
      credentials: 'include'
    });
    if (response.status == 404) {
      return 'Waiting for draw';
    }

    await handleInvalidResponse(response);
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}


const getNewResults = async function () {
  try {
    const response = await fetch(SERVER_URL + '/api/draws/scores/unseen', {
      credentials: 'include'
    });

    await handleInvalidResponse(response);
    const results = await response.json();
    if(!results){
      return [];
    }
    return results;
  } catch (error) {
    throw error;
  }
}

const API = { logIn, getUserInfo, getUserData, logOut, getBestScores, getLastDraw, createBet, getResult, getNewResults };
export default API;
