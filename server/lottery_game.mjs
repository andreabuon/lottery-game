import { addDraw, addBet, getBets, getLastDraw, deleteBets } from './dao_games.mjs';
import { updateUserScore, getUserById } from './dao_users.mjs';
import { Draw } from '../common/Draw.mjs';
import { Bet } from '../common/Bet.mjs';

const ROUNDS_TIMEOUT = 20 * 1000; //FIXME this should be 120 * 1000
const DRAW_SIZE = 5;

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

async function newRound() {
  try {
    const draw = Draw.create(DRAW_SIZE); // Create a new draw
    const draw_id = await addDraw(draw); // Save draw to the database
    setTimeout(updateScores(), ROUNDS_TIMEOUT); //FIXME Update scores based on the latest draw_id
  } catch (error) {
    console.error('Error running round:', error);
  }
}

export async function runGame() {
  newRound();
  setTimeout(runGame, ROUNDS_TIMEOUT); // Schedule the next round
}
