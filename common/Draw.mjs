export function Draw(numbers) {
    this.numbers = new Set(numbers); // Using Set for saving unique numbers
  
    // Static method to create a new Draw
    Draw.create = function (size) {
      const numbers = new Set();
      while (numbers.size < size) {
        // Random integer between 1 and 90
        const number = Math.floor(Math.random() * 90) + 1; //
        numbers.add(number);
      }
      return new Draw(numbers);
    };
  
    this.toString = () => {
      return ('' + [...this.numbers]);
      //return `[${[...this.numbers].join(", ")}]`;
    };
  }