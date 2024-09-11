import { Draw } from '../../common/Draw.mjs';
const SERVER_URL = 'http://localhost:3001';

async function handleInvalidResponse(response) {
  if (!response.ok) {
    const error_message = await response.text();
    throw Error(`${response.status} ${response.statusText}: ${error_message}.`);
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
    //console.error('Error logging in: ' + error);
    throw Error('Error logging in: ', {cause: error});
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
    //console.error('Error logging out: ' + error);
    throw Error('Error loggin out: ', {cause: error});
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
    throw Error('Error fetching data: ', {cause: error});
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
    //console.error('Error fetching the last draw of the game: ' + error);
    throw Error('Error fetching the last draw of the game: ', {cause: error});
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
    let bet = await response.json();
    console.log(`Bet created for the round #${bet.round}: ${bet.numbers}`);
    return bet;
  } catch (error) {
    //console.error('Error placing bet: ', error);
    throw Error('Error placing bet: ', {cause: error});
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
    //console.error('Error fetching user results: ' + error);
    throw Error('Error fetching user results: ', {cause: error});
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
    //console.error('Error downloading best scores: ' + error);
    throw Error('Error downloading best scores: ', {cause: error});
  }
};

const API = { logIn, getUserData, logOut, getBestScores, getLastDraw, createBet, getNewResults };
export default API;
