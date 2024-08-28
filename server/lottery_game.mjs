import { addDraw } from './dao_games.mjs';

const DRAW_SIZE = 5;

function pickNumbers() {
    let draw = new Set();
    while(draw.size < DRAW_SIZE) {
      // Generate a random integer between 1 and 90
      const number = Math.floor(Math.random() * 90) + 1;
      draw.add(number);
    }
    return draw;
}

export async function createDraw() {
    const draw = pickNumbers();
    const draw_ID = await addDraw(draw);
    console.log("Added new draw [" + [...draw] + "] in the DB with ID: ", draw_ID);
    return draw_ID;
}
