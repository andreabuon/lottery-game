import { addDraw, addBet, getBets, getLastDraw, deleteBets } from './dao_games.mjs';
import { updateUserScore, getUserById } from './dao_users.mjs';

const DRAW_SIZE = 5;
const COST_PER_NUMBER = 5; // pts
const PTS_PER_MATCHED_NUM = 10;


export function Draw(numbers) {
  this.numbers = new Set(numbers); // Using Set for saving unique numbers

  // Static method to create a new Draw
  Draw.create = function (size) {
    const numbers = new Set();
    while (numbers.size < size) {
      // Random integer between 1 and 90
      const number = Math.floor(Math.random() * 90) + 1; //
      numbers.add(number);
    }
    return new Draw(numbers);
  };

  this.toString = () => {
    return ('' + [...this.numbers]);
    //return `[${[...this.numbers].join(", ")}]`;
  };
}

export function Bet(user_id, numbers) {
  this.user_id = user_id;
  this.numbers = new Set(numbers);

  this.getSize = () => {
    return this.numbers.size;
  };

  this.toString = () => {
    return `Player #${this.user_id} : [${[...this.numbers]}]`;
  };

  this.computeReward = (draw) => {
    let score = 0;
    for (let number of this.numbers) {
      if (draw.numbers.has(number)) {
        score += PTS_PER_MATCHED_NUM;
      }
    }
    return score;
  };

  this.getCost = () => {
    return this.getSize() * COST_PER_NUMBER;
  };
}

export async function createBet(user, user_bet) {
  const bet = new Bet(user.user_id, user_bet);
  const cost = bet.getCost();

  if (user.score < cost) {
    throw new Error('Error: the user does not have enough points');
  }

  try {
    // Add the bet to the database
    await addBet(bet);
    // Subtract bet cost from user score
    await updateUserScore(user.user_id, user.score - cost);
    console.log(bet);
  } catch (error) {
    console.error('Error creating bet:', error);
    throw error;
  }
}

export async function updateScores() {
  console.log("#### Round done #####");

  try {
    const draw = await getLastDraw();
    console.log("Last draw: ", draw);

    const bets = await getBets();
    console.log("Current bets:");

    for (let bet of bets) {
      console.log(bet);
      const reward = bet.computeReward(draw);
      console.log(`Player ${bet.user_id} won ${reward} points.`);
      if (reward === 0) continue;

      try {
        const user = await getUserById(bet.user_id);
        if (!user) {
          console.error(`The user ${bet.user_id} has been deleted - skipping its score update!`);
          continue;
        }
        await updateUserScore(bet.user_id, user.score + reward);
      } catch (error) {
        console.error(`Error updating user ${bet.user_id} score:`, error);
      }
    }

    // Delete all bets after each round?
    // await deleteBets();
  } catch (error) {
    console.error('Error updating scores:', error);
  }

  console.log("\n#######");
}

const ROUNDS_TIMEOUT = 20 * 1000; //FIXME this should be 120 * 1000
export async function runGame() {
  newRound();
  setTimeout(runGame, ROUNDS_TIMEOUT); // Schedule the next round
}

async function newRound() {
  try {
    const draw = Draw.create(DRAW_SIZE); // Create a new draw
    const draw_id = await addDraw(draw); // Save draw to the database
    await setTimeout(updateScores(), ROUNDS_TIMEOUT); //FIXME Update scores based on the latest draw_id
  } catch (error) {
    console.error('Error running round:', error);
  }

}
