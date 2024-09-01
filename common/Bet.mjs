import { Draw } from './Draw.mjs';

const BET_MAX_SIZE = 3;
const COST_PER_NUMBER = 5; // pts
const PTS_PER_MATCHED_NUM = 10;
const MAX_NUM = 90;
const MIN_NUM = 1;


export function Bet(user_id, nums) {
  this.user_id = user_id;
  this.numbers = new Set();
  for (const num of nums) {
    if (num <= MAX_NUM && num >= MIN_NUM) {
      this.numbers.add(num)
    }
  }
  if (this.getSize == 0) {
    throw Error('Bet size cannot be 0');
  }
  if (this.getSize > BET_MAX_SIZE) {
    throw Error('Bet size cannot be greater than ', BET_MAX_SIZE);
  }
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