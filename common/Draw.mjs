const DRAW_SIZE = 5;

export function Draw(numbers) {
  this.numbers = new Set(numbers); // Using Set for saving unique numbers
};

Draw.prototype.toString = function () {
  return `[${[...this.numbers].join(", ")}]`;
};

export function createDraw() {
  const numbers = new Set();
  while (numbers.size < DRAW_SIZE) {
    // Random integer between 1 and 90
    const number = Math.floor(Math.random() * 90) + 1; //
    numbers.add(number);
  }
  return new Draw(numbers);
};