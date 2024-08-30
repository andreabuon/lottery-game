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

  //add the bet to the DB
  await addBet(user.user_id, bet);
  //the uses pays for the bet
  await updateUserScore(user.user_id, user.score - cost);
  console.log(user.user_id + " has just made a new bet: " + bet);
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
  console.log("#### Round done. Updating scores #####");

  let draw = await getLastDraw();
  console.log("Last draw: ", draw);

  let bets = await getBets();
  console.log("Current bets:");
  console.log(bets);

  for (let bet of bets) {
    //console.log(bet);
    let reward = computeReward(draw, bet)
    console.log("Player " + bet.user_id + " won " + reward + " points.");
    if (reward == 0) continue;
    let user = await getUserById(bet.user_id);
    await updateUserScore(bet.user_id, user.score + reward);
  }

  //await deleteBets();
  console.log("#######");
  console.log("\n");
}

const TIMEOUT = 20 * 1000; //FIXME
export async function runGame() {
  await createDraw();
  await updateScores();
  setTimeout(runGame, TIMEOUT);
}
