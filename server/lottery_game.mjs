import { insertDraw } from './dao_games.mjs';

function pickFiveNumbers() {
    let draw = new Set();
    while(draw.size < 5) {
      // Generate a random integer between 1 and 90
      const number = Math.floor(Math.random() * 90) + 1;
      draw.add(number);
    }
    return draw;
}

export async function createDraw() {
    const draw = pickFiveNumbers();
    const draw_ID = await insertDraw(draw);
    console.log("Added new draw [" + [...draw] + "] in the DB with ID: ", draw_ID);
    return draw_ID;
}
