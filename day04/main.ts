import { loadLinesFromFile } from "../utils/utils";

loadLinesFromFile("day04/data.txt")
  .then((lines) => {
    let games: Game[] = [];
    lines.forEach((line) => {
      games.push(new Game(line));
    });
    part1(games);
    part2(games);
  })
  .catch((error) => {
    console.error(error);
  });

const part1 = (games: Game[]) => {
  let sum: number = 0;
  for(const game of games) {
    sum += game.winningNumbersCount > 1 ? Math.pow(2, game.winningNumbersCount-1): game.winningNumbersCount;
  }

  console.log(sum);
}


const part2 = (games: Game[]) => {
  let sum: number = 0;
  for(let game of games) {
    game.createSubgames(games);
    sum += game.countGames();
  }
  console.log(sum)
}

class Game {
  gameId: number;
  winningNumbers: number[];
  gameNumbers: number[];
  subgames: Game[];
  winningNumbersCount: number;

  constructor(inputString: string) {
    this.subgames = [];
    this.winningNumbers = [];
    this.gameNumbers = [];
    this.winningNumbersCount = 0;


    let split1 = inputString.split("|");
    let split2 = split1[0].split(":");

    let winningNumbersString = split2[1];
    let gameNumbersString = split1[1];

    for(let gameNumberString of winningNumbersString.split(" ")) {
      this.winningNumbers.push(parseInt(gameNumberString));
    }
    for(let gameNumberString of gameNumbersString.split(" ")) {
      this.gameNumbers.push(parseInt(gameNumberString));
    }
    this.winningNumbers = this.winningNumbers.filter(value => !Number.isNaN(value));
    this.gameNumbers = this.gameNumbers.filter(value => !Number.isNaN(value));
    this.gameId = parseInt(split2[0].replace("Card ", ""));
    this.countWinningNumbers()
  }

  countWinningNumbers() {
    let numbers: number = 0;
    for(const winningNumber of this.winningNumbers) {
      if(this.gameNumbers.includes(winningNumber)) {
        numbers++;
      }
    }
    this.winningNumbersCount = numbers; 
  }
  
  createSubgames(games: Game[]) {
    if(this.winningNumbersCount > 0) {
      this.subgames = games.slice(this.gameId, this.gameId + this.winningNumbersCount );
      for(let game of this.subgames) {
        game.createSubgames(games);
      }
    }
  }

  countGames(): number {
    let sum: number = 0;
    sum += 1;
    for(let game of this.subgames) {
      sum += game.countGames();
    }
    return sum;
  }
  
  inspect(): string {
    return `GameId: ${this.gameId}, WinningNumbers: [${this.winningNumbers}], GameNumbers: [${this.gameNumbers}], WinningNumbersCount: ${this.winningNumbersCount}, Subgames: [${this.subgames}]`;
  }
}