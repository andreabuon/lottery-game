import { addRound, addDraw, addBet, getRoundBets, getRound, getDrawByRound } from './dao_games.mjs';
import { updateUserScore, getUserById } from './dao_users.mjs';
import { Draw, pickDraw } from '../common/Draw.mjs';
import { Bet } from '../common/Bet.mjs';

const ROUNDS_TIMEOUT = 10 * 1000; //FIXME this should be 120 * 1000

export async function createBet(user, user_bet) {
  const bet = new Bet(user.user_id, [...user_bet]);
  const cost = bet.getCost();

  if (user.score < cost) {
    throw new Error('Error: the user does not have enough points');
  }

  try {
    //Get the next round number
    let round = await getRound();
    // Add the bet to the database
    await addBet(round, bet);
    // Subtract bet cost from user score
    await updateUserScore(user.user_id, user.score - cost);
    console.log(bet); //FIXME
  } catch (error) {
    console.error('Error creating bet:', error);
    throw error;
  }
}

export async function updateScores(round) {
  console.log(`#### Round ${round} done #####`);

  try {
    const draw = await getDrawByRound(round);
    console.log(`Round ${round} draw: `, draw); //FIXME

    const bets = await getRoundBets(round);
    console.log("Current bets:");

    for (let bet of bets) {
      console.log(bet); //FIXME
      const reward = bet.computeReward(draw);
      console.log(`Player ${bet.user_id} bet on ${[...bet.numbers]} and won ${reward} points.`);
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
  } catch (error) {
    console.error('Error updating scores:', error);
  }
  console.log("\n#######");
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
