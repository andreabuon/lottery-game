import { Draw } from './Draw.mjs';

const COST_PER_NUMBER = 5; // pts
const PTS_PER_MATCHED_NUM = 10;

export function Bet(user_id, numbers) {
  this.user_id = user_id;
  this.numbers = new Set(numbers);
}

Bet.prototype.getSize = () => {
  return this.numbers.size;
};

Bet.prototype.computeReward = (draw) => {
  let score = 0;
  for (let number of this.numbers) {
    if (draw.numbers.has(number)) {
      score += PTS_PER_MATCHED_NUM;
    }
  }
  return score;
};

Bet.prototype.getCost = () => {
  return this.getSize() * COST_PER_NUMBER;
};

Bet.prototype.toString = () => {
  return `BET: Player #${this.user_id} : [${[...this.numbers].join(", ")}]`;
};