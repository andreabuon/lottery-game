export const BET_MIN_NUM = 1;
export const BET_MAX_NUM = 90;
export const BET_MAX_SIZE = 3;
export const COST_PER_BET_NUMBER = 5; // pts
const PTS_PER_MATCHED_NUM = 10;


export function Bet(round, user_id, nums) {
  this.round = round;
  this.user_id = user_id;
  this.numbers = [];

  for (const num of new Set(nums)) {
    if (num >= BET_MIN_NUM && num <= BET_MAX_NUM ) {
      this.numbers.push(num)
    }
  }
  if (this.getSize() == 0) {
    throw Error('A bet must be placed on at least one number.');
  }
  if (this.getSize() > BET_MAX_SIZE) {
    throw Error('A bet cannot be placed on more than ' + BET_MAX_SIZE + ' numbers.');
  }
  this.numbers.sort((a, b) => (a - b));
}

Bet.prototype.getSize = function () {
  return this.numbers.length;
};

Bet.prototype.computeReward = function (draw) {
  let score = 0;
  for (let number of this.numbers) {
    if (draw.numbers.includes(number)) {
      score += PTS_PER_MATCHED_NUM;
    }
  }
  return score;
};

Bet.prototype.getCost = function () {
  return this.getSize() * COST_PER_BET_NUMBER;
};

Bet.prototype.toString = function () {
  return `Player #${this.user_id} bet on : [${[...this.numbers].join(", ")}]`;
};