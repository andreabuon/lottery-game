import { addRound, addDraw, addBet, getRoundBets, getRound, getDrawByRound } from './dao_games.mjs';
import { updateUserScore, getUserById } from './dao_users.mjs';
import { Draw, pickDraw } from '../common/Draw.mjs';
import { Bet } from '../common/Bet.mjs';

const ROUNDS_TIMEOUT = 120 * 1000;

export async function createBet(user, user_bet) {
  const bet = new Bet(user.user_id, [...user_bet]);
  const cost = bet.getCost();

  try {
    if (user.score < cost) { //FIXME user score should be checked in the DB?
      throw new Error(`The player ${user.user_id} does not have enough points`);
    }
    //Get the next round number
    let round = await getRound();
    // Add the bet to the database
    await addBet(round, bet);
    // Subtract bet cost from user score
    await updateUserScore(user.user_id, user.score - cost);
    return round;
  } catch (error) {
    //console.error('Error while creating bet for the player #:', user.user_id, error);
    throw error;
  }
}

export async function updateScores(round) {
  console.log(`[Round ${round}] Round completed. #########`);

  try {
    const draw = await getDrawByRound(round);
    console.log(`[Round ${round}] Draw: ${draw.toString()}`);

    const bets = await getRoundBets(round);
    console.log(`[Round ${round}] Bets: `);
    if(bets.length == 0){ //FIXME
      console.log(`[Round ${round}] No bets found.`);
    }

    for (let bet of bets) {
      const reward = bet.computeReward(draw);
      console.log(`[Round ${round}] ${bet.toString()} and won ${reward} points.`);
      if (reward === 0) continue;

      try {
        const user = await getUserById(bet.user_id);
        if (!user) {
          console.error(`[Round ${round}] The user ${bet.user_id} has been deleted - skipping its score update!`);
          continue;
        }
        await updateUserScore(bet.user_id, user.score + reward);
      } catch (error) {
        console.error(`[Round ${round}] Error updating user ${bet.user_id} score:`, error);
      }
    }
  } catch (error) {
    console.error(`[Round ${round}] Error updating scores:`, error);
  }
  console.log(`[Round ${round}] Scores updated. #########\n`);
}

async function newRound() {
  try {
    console.log("Starting new round");
    const round = await addRound();
    const draw = pickDraw(); // Create a new draw
    await addDraw(round, draw); // Save draw to the database
    setTimeout(() => updateScores(round), ROUNDS_TIMEOUT);
  } catch (error) {
    console.error('Error running round:', error);
  }
}

export async function runGame() {
  setTimeout(runGame, ROUNDS_TIMEOUT); // Schedule the next round
  await newRound();
}
