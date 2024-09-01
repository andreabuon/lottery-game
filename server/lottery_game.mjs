import { addDraw, addBet, getBets, getLastDraw, deleteBets, getDrawByID } from './dao_games.mjs';
import { updateUserScore, getUserById } from './dao_users.mjs';
import { Draw, createDraw } from '../common/Draw.mjs';
import { Bet } from '../common/Bet.mjs';

const ROUNDS_TIMEOUT = 10 * 1000; //FIXME this should be 120 * 1000

export async function createBet(user, user_bet) {
  const bet = new Bet(user.user_id, [...user_bet]);
  const cost = bet.getCost();

  if (user.score < cost) {
    throw new Error('Error: the user does not have enough points');
  }

  try {
    // Add the bet to the database
    await addBet(bet);
    // Subtract bet cost from user score
    await updateUserScore(user.user_id, user.score - cost);
    console.log(bet); //FIXME
  } catch (error) {
    console.error('Error creating bet:', error);
    throw error;
  }
}

export async function updateScores(draw_id) {
  console.log(`#### Round done #####`);

  try {
    const draw = await getDrawByID(draw_id);
    console.log(`Draw ${draw_id}: ${[...draw.numbers]}`); //FIXME

    const bets = await getBets();
    console.log("Bets:");
    if(!bets) return;

    for (let bet of bets) {
      console.log(bet); //FIXME
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
  } catch (error) {
    console.error('Error updating scores:', error);
  }

  console.log("\n#######");
}

async function newRound(round_num) {
  try {
    console.log('Starting round #', round_num);
    const draw = createDraw(); // Create a new draw
    const draw_id = await addDraw(draw); // Save draw to the database
    console.log(`Round ${round_num} - Draw ${draw_id}: ${[...draw.numbers]}`);
    setTimeout(() => updateScores(draw_id), ROUNDS_TIMEOUT); //FIXME Update scores based on the latest draw_id //FIXME this should be equal to round_num
    //await deleteBets();
  } catch (error) {
    console.error('Error running round:', error);
  }
}

export async function runGame(round_count) {
  await newRound(round_count);
  round_count += 1;
  setTimeout(runGame, ROUNDS_TIMEOUT, round_count); // Schedule the next round
}

async function restoreRoundNumber(){
  let rounds_done;
  try{
    rounds_done = await getLastDraw().draw_id;
  }
  catch(error){
    console.error('No round number found in the DB: ' ,error);
    rounds_done = 0;
    console.error('Setting last round number to ', last_round+1);
  }
  return rounds_done;
}

export async function setupGame(){
  let rounds_done = await restoreRoundNumber();
  runGame(round_number + 1);
}