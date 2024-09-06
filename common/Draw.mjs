const DRAW_SIZE = 5;

export function Draw(numbers, round_num = -1) {
  this.numbers = [...new Set(numbers)].sort((a, b) => a - b);
  this.round = round_num;
  //TODO checks?
};

Draw.prototype.toString = function () {
  return '[' + [this.numbers].join(", ") + ']';
};

export function pickDraw() {
  const numbers = new Set();
  while (numbers.size < DRAW_SIZE) {
    // Random integer between 1 and 90
    const number = Math.floor(Math.random() * 90) + 1; //
    numbers.add(number);
  }
  return new Draw(numbers);
};