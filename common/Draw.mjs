const DRAW_SIZE = 5;

export function Draw(numbers, round_num = -1) {
  let unique_numbers = new Set(numbers)
  //TODO checks?
  
  this.numbers = [...unique_numbers];
  this.round = round_num;
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