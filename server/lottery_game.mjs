import { insertDraw } from './dao_games.mjs';

function pickFiveNumbers() {
    const draw = [];
    for (let i = 0; i < 5; i++) {
      // Generate a random integer between 1 and 90
      const number = Math.floor(Math.random() * 90) + 1;
      draw.push(number);
    }
    return draw;
}

export async function createDraw() {
    const draw = pickFiveNumbers();
    console.log("Created draw: ", draw);
    const draw_ID = await insertDraw(draw);
    console.log("Draw ID: ", draw_ID);
    return draw_ID;
}
