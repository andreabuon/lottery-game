import { addRound, addDraw, addBet, getRoundBets, getRound, getDrawByRound, addResult } from './dao_games.mjs';
import { updateUserScore, getUserById } from './dao_users.mjs';
import { Draw, pickDraw } from '../common/Draw.mjs';
import { Bet } from '../common/Bet.mjs';

const ROUNDS_TIMEOUT = 10 * 1000; //FIXME

export async function createBet(user, numbers) {
  try {
    let round = await getRound();
    console.log('createBet - getRound: ', round);
    const bet = new Bet(round, user.user_id, numbers);

    const cost = bet.getCost();
    if (user.score < cost) { //FIXME user score should be checked in the DB?
      throw new Error(`The player ${user.user_id} does not have enough points`);
    }

    await addBet(bet);

    // Subtract bet cost from user score
    await updateUserScore(user.user_id, user.score - cost);
    return bet;
  } catch (error) {
    console.error(`Error while creating bet for the player #${user.user_id}: ${error}`);
    throw error;
  }
}

export async function updateScores(round) {
  try {
    const draw = await getDrawByRound(round);

    const bets = await getRoundBets(round);
    console.log(`[Round ${round}] Bets: `);
    if (bets.length == 0) { //FIXME
      console.log(`[Round ${round}]: No bets found.`);
    }

    for (let bet of bets) {
      const reward = bet.computeReward(draw);
      console.log(`[Round ${round}] ${bet.toString()} and won ${reward} points.`);
      await addResult(round, bet.user_id, reward)
      if (reward === 0) continue;

      try {
        const user = await getUserById(bet.user_id);
        if (!user) {
          //console.error(`[Round ${round}] The user ${bet.user_id} has not been found - skipping its score update!`);
          continue;
        }
        await updateUserScore(bet.user_id, user.score + reward);
      } catch (error) {
        console.error(`[Round ${round}] Error computing user ${bet.user_id} score:`, error);
      }
    }
  } catch (error) {
    console.error(`[Round ?] Error updating scores:`, error);
  }
  console.log(`[Round ${round}] Scores updated. #########\n`);
}

async function newRound() {
  try {
    console.log("Starting new round");
    const round = await addRound();
    console.log("STARTED ROUND ", round);
    setTimeout(() => endRound(round), ROUNDS_TIMEOUT);
  } catch (error) {
    console.error(`Error running round: ${error}`);
  }
}

async function endRound(round) {
  console.log(`[Round ${round}] Round completed. #########`);
  const draw = pickDraw(); // Create a new draw
  await addDraw(round, draw); // Save draw to the database
  await updateScores(round);
}

export async function runGame() {
  setTimeout(runGame, ROUNDS_TIMEOUT); // Schedule the next round
  await newRound();
}
