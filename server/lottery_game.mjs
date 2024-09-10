import { addRound, addDraw, addBet, getRoundBets, getRound, getDrawByRound, addResult } from './dao_games.mjs';
import { updateUserScore, getUserById } from './dao_users.mjs';
import { Draw, pickDraw } from '../common/Draw.mjs';
import { Bet } from '../common/Bet.mjs';

const ROUNDS_TIMEOUT = 120 * 1000;

export async function createBet(req_user, numbers) {
  try {
    const user = await getUserById(req_user.user_id);
    if (!user) {
      throw new Error(`Player #${user.user_id} has not been found in the DB - skipping its bet!`);
    }

    const round = await getRound();
    const bet = new Bet(round, user.user_id, numbers);

    const cost = bet.getCost();
    if (user.score < cost) {
      throw new Error(`Player #${user.user_id} does not have enough points to place this bet.`);
    }

    await addBet(bet);

    // Subtract bet cost from user score
    await updateUserScore(user.user_id, user.score - cost);
    console.log(`[Round ${bet.round}] Player #` + bet.user_id + " placed a new bet [" + bet.numbers + "].");
    return bet;
  } catch (error) {
    //console.error(`Error creating bet for the player #${req_user.user_id}: ${error}`);
    throw error;
  }
}

async function addReward(user_id, reward, round) {
  try {
    const user = await getUserById(user_id);
    if (!user) {
      console.error(`[Round ${round}] Player #${user_id} has not been found - skipping its score update!`);
      return;
    }
    await updateUserScore(user.user_id, user.score + reward);
    //console.log(`Updated Player ${user.username} score: previus score = ${user.score} reward: ${reward} - new score: ${user.score+reward}`);
  } catch (error) {
    console.error(`[Round ${round}] Error adding new reward to Player #${user_id}: `, error);
  }
}

async function processBet(bet, draw, round) {
  const reward = bet.computeReward(draw);
  console.log(`[Round ${round}] ${bet.toString()} and won ${reward} points.`);

  try {
    await addResult(round, bet.user_id, reward);

    if (reward > 0) {
      await addReward(bet.user_id, reward, round);
    }
  } catch (error) {
    console.error(`[Round ${round}] Error processing bet for Player #${bet.user_id} bet: `, error);
  }
}

async function manageBets(round) {
  try {
    const draw = await getDrawByRound(round);
    const bets = await getRoundBets(round);

    if (!bets || bets.length == 0) {
      console.log(`[Round ${round}] No bets found.`);
      return;
    }

    console.log(`[Round ${round}] Processing bets: `);
    for (const bet of bets) {
      await processBet(bet, draw, round);
    }
  } catch (error) {
    console.error(`[Round ${round}] Error managing bets:`, error);
  }
}

async function endRound(round) {
  try {
    console.log(`[Round ${round}] Ending round...`);
    const draw = pickDraw(); // Create a new draw
    await addDraw(round, draw); // Save draw to the database
    console.log(`[Round ${round}] ` + "Draw added to the DB: " + draw.toString());

    await manageBets(round);
    console.log(`[Round ${round}] Round completed and scores updated. \n`);
  } catch (error) {
    console.error(`Error ending round ${round}: ${error}`);
  }
}

async function newRound() {
  try {
    console.log("Starting a new round...");
    const round = await addRound();
    console.log(`[Round ${round}] New round started. 🆕`);
    setTimeout(() => endRound(round), ROUNDS_TIMEOUT);
  } catch (error) {
    console.error(`Error running new round: ${error}`);
  }
}

export async function runGame() {
  setTimeout(runGame, ROUNDS_TIMEOUT); // Schedule the next round
  await newRound();
}
