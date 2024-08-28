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
  const response = await fetch(SERVER_URL + '/api/best_scores', {
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
  const response = await fetch(SERVER_URL + '/api/last_draw', {
    credentials: 'include'
  });
  const draw = await response.json();
  if (response.ok)
    return draw;
  else {
    throw draw;
  }
};

const API = { logIn, logOut, getUserInfo, getBestScores, getLastDraw};
export default API;