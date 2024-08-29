import { addDraw, getBets, getLastDraw, deleteBets } from './dao_games.mjs';
const DRAW_SIZE = 5;

function pickNumbers() {
    let draw = new Set();
    while(draw.size < DRAW_SIZE) {
      // Generate a random integer between 1 and 90
      const number = Math.floor(Math.random() * 90) + 1;
      draw.add(number);
    }
    return Array.from(draw);
}

export async function createDraw() {
    const draw = pickNumbers();
    const draw_ID = await addDraw(draw);
    //console.log("Added new draw [" + [...draw] + "] in the DB with ID: ", draw_ID);
    return draw_ID;
}

function computeScore(draw, bet){
  let score = 0;

  for(let number of bet.bet_numbers){
    if(draw.includes(number)){
      score+=10;
    }
  }
  return score;
}

export async function updateScores(){
  console.log("#### UPDATING SCORES #####");

  let draw = await getLastDraw();
  console.log("Last draw: ", draw);

  let bets = await getBets();
  console.log("Current bets:");
  console.log(bets);

  for(let bet of bets){
    //console.log(bet);
    let score = computeScore(draw, bet)
    console.log("Player " + bet.user_id + " scored " + score + " points.");
  }
  
  //await deleteBets();
  console.log("#######");
}
