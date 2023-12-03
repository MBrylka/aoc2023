import { loadLinesFromFile } from "../utils/utils";


interface Game {
  id: number;
  maxRedCount: number;
  maxBlueCount: number;
  maxGreenCount: number;
}

const redCubes = 12;
const greenCubes = 13;
const blueCubes = 14;

loadLinesFromFile("day02/data.txt")
  .then((lines) => {
    let games = [];
    let sum = 0;
    let powerSum = 0;
    lines.forEach((line) => {
      let game = createGameObject(line);
      if( checkGame(game)) {
        sum += game.id;
      }
      powerSum += calculatePower(game);
    });
    console.log(sum);
    console.log(powerSum);
  })
  .catch((error) => {
    console.error(error);
  });


const createGameObject = (inputString: string): Game => {
  let gameObject: Game = {id: 0, maxRedCount: 0, maxBlueCount: 0, maxGreenCount: 0};
  let [gameString, setsString] = inputString.split(": ");
  
  gameString = gameString.replace("Game ", "");
  gameObject.id = parseInt(gameString);

  let setList = setsString.split("; ");
  for(let set of setList) {
    let setElements = set.split(", ");
    for(let setElement of setElements) {
      let [count, color] = setElement.split(" ");
      let countInt = parseInt(count);
      if (color === "red" && gameObject.maxRedCount < countInt)
        gameObject.maxRedCount = countInt;
      if (color === "blue" && gameObject.maxBlueCount < countInt)
          gameObject.maxBlueCount = countInt;
      if (color === "green" && gameObject.maxGreenCount < countInt)
        gameObject.maxGreenCount = countInt;
    }
  }
  return gameObject;
}

const checkGame = (inputGame: Game): boolean => {
  return inputGame.maxBlueCount <= blueCubes && inputGame.maxGreenCount <= greenCubes && inputGame.maxRedCount <= redCubes;
}

const calculatePower = (inputGame: Game): number => {
  return inputGame.maxBlueCount * inputGame.maxGreenCount * inputGame.maxRedCount;
}