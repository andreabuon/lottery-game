import { addDraw, addBet, getBets, getLastDraw, deleteBets } from './dao_games.mjs';
import { updateUserScore, getUserById } from './dao_users.mjs';

const COST_PER_NUMBER = 5; //pts
const DRAW_SIZE = 5;

export function Draw(numbers) {
  this.numbers = new Set(numbers); //FIXME Maybe better a Set ?

  Draw.create = function (size) {
    //Pick random numbers
    let numbers = new Set();
    while (numbers.size < size) {
      // Generate a random integer between 1 and 90
      const number = Math.floor(Math.random() * 90) + 1;
      numbers.add(number);
    }
    return new Draw(numbers);
  };

  this.toString = () => {
    return ('' + [...this.numbers]);
  };
}

export function Bet(user_id, numbers) {
  this.user_id = user_id;
  this.numbers = new Set(numbers); //FIXME this should be a set

  this.getSize = () => {
    return numbers.size;
  }

  this.toString = () => {
    return ("Player #" + user_id + ' : ' + [...bet.numbers]);
  }

  this.computeReward = (draw) => {
    let score = 0;
    for (let number of this.numbers) {
      if (draw.numbers.has(number)) {
        score += 10;
      }
    }
    return score;
  }

  this.getCost = () => {
    return this.getSize() * COST_PER_NUMBER;
  }
}

export async function createBet(user, user_bet) {
  let bet = new Bet(user, user_bet);
  let cost = bet.getCost();
  if (user.score < cost) {
    throw new Error('You do not have enough points');
  }

  try {
    //add the bet to the DB
    await addBet(bet);
    //the user pays for the bet
    await updateUserScore(user.user_id, user.score - cost);
    console.log(bet);
  } catch (error) {
    throw error;
  }
}

export async function updateScores() {
  console.log("#### Round done #####");

  let draw = await getLastDraw();
  console.log("Last draw: ", draw);

  let bets = await getBets();
  console.log("Current bets:");

  for (let bet of bets) {
    console.log(bet);
    let reward = bet.computeReward(draw);
    console.log("Player " + bet.user_id + " won " + reward + " points.");
    if (reward == 0) continue;
    let user = await getUserById(bet.user_id); //FIXME mettere try/catch
    if (!user) {
      console.error('The user ' + bet.user_id + ' has been deleted - skipping its score update!');
      continue;
    }
    await updateUserScore(bet.user_id, user.score + reward);
  }

  //await deleteBets();
  console.log("\n");
  console.log("#######");
}

const ROUNDS_TIMEOUT = 20 * 1000; //FIXME
export async function runGame() {
  const draw = Draw.prototype.create(DRAW_SIZE);
  let draw_id = await addDraw(draw);
  await updateScores(); //FIXME use draw_id to only update last draw bets
  setTimeout(runGame, ROUNDS_TIMEOUT);
}
