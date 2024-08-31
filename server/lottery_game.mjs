import { addDraw, addBet, getBets, getLastDraw, deleteBets } from './dao_games.mjs';
import { updateUserScore, getUserById } from './dao_users.mjs';
const COST_PER_NUMBER = 5; //pts
const DRAW_SIZE = 5;

function pickNumbers() {
  let draw = new Set();
  while (draw.size < DRAW_SIZE) {
    // Generate a random integer between 1 and 90
    const number = Math.floor(Math.random() * 90) + 1;
    draw.add(number);
  }
  return Array.from(draw);
}

export async function createDraw() {
  const draw = pickNumbers();
  const draw_ID = await addDraw(draw);
  return draw_ID;
}

export async function createBet(user, bet) {
  let cost = bet.length * COST_PER_NUMBER;
  if (user.score < cost) {
    throw new Error('You do not have enough points');
  }

  try {
    //add the bet to the DB
    await addBet(user.user_id, bet);
    //the user pays for the bet
    await updateUserScore(user.user_id, user.score - cost);
    console.log(user.user_id + " has just made a new bet: " + bet);
  } catch (error) {
    throw error;
  }
}

function computeReward(draw, bet) {
  let score = 0;

  for (let number of bet.bet_numbers) {
    if (draw.includes(number)) {
      score += 10;
    }
  }
  return score;
}

export async function updateScores() {
  console.log("#### Round done #####");

  let draw = await getLastDraw();
  console.log("Last draw: ", draw);

  let bets = await getBets();
  console.log("Current bets:");

  for (let bet of bets) {
    console.log("Player " + bet.user_id + ' bet on the following numbers: ' + bet.bet_numbers);
    let reward = computeReward(draw, bet)
    console.log("Player " + bet.user_id + " won " + reward + " points.");
    if (reward == 0) continue;
    let user = await getUserById(bet.user_id); //FIXME mettere try/catch
    if(!user){
      console.error('The user ' + bet.user_id + ' has been deleted - skipping his bet!');
      continue;
    }
    await updateUserScore(bet.user_id, user.score + reward);
  }

  //await deleteBets();
  console.log("\n");
  console.log("#######");
}

const TIMEOUT = 20 * 1000; //FIXME
export async function runGame() {
  let draw_id = await createDraw();
  await updateScores(); //FIXME use draw_id to only update last draw bets
  setTimeout(runGame, TIMEOUT);
}
