import COLORS from './colors.js';

class Console {
  constructor() {
    this.colors = COLORS;
  }

  green(text) {
    console.log(this.colors.GREEN, text, this.colors.RESET);
  }

  blue(text) {
    console.log(this.colors.BLUE, text, this.colors.RESET);
  }

  orange(text) {
    console.log(this.colors.ORANGE, text, this.colors.RESET);
  }

  yellow(text) {
    console.log(this.colors.YELLOW, text, this.colors.RESET);
  }

  red(text) {
    console.log(this.colors.RED, text, this.colors.RESET);
  }

  white(text) {
    console.log(this.colors.WHITE, text, this.colors.RESET);
  }
}

const colorize = new Console();

export default colorize;
