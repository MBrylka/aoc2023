import { loadLinesFromFile } from "../utils/utils";


const findRoute = (commands: ("L" | "R")[], map: {[key: string]: {"L": string, "R": string}}, startingKey: string): number => {
  let currentKey = startingKey;
  let steps = 0;
  let currentCommandIndex = 0;
  let commandsLength = commands.length;

  while(!currentKey.endsWith("Z")) {
    let newKey: string = map[currentKey][commands[currentCommandIndex]];
    currentKey = newKey;
    steps++;
    currentCommandIndex++;
    if(currentCommandIndex === commandsLength) currentCommandIndex = 0;
  }
  return steps
}

const part1 = (commands: ("L" | "R")[], map: {[key: string]: {"L": string, "R": string}}) => {
  console.log(findRoute(commands, map, "AAA"));
}

const findNWW = (...numbers: number[]): number => {
  // Funkcja do znalezienia NWD dwóch liczb
  function findNWD(a: number, b: number): number {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  // Funkcja do znalezienia NWW dwóch liczb
  function findNWWTwoNumbers(a: number, b: number): number {
    return (a * b) / findNWD(a, b);
  }

  // Funkcja do znalezienia NWW dla wielu liczb
  function findNWWMultipleNumbers(numbers: number[]): number {
    let nww = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      nww = findNWWTwoNumbers(nww, numbers[i]);
    }
    return nww;
  }

  // Sprawdzenie, czy podano co najmniej dwie liczby
  if (numbers.length < 2) {
    throw new Error("Podaj co najmniej dwie liczby.");
  }

  // Obliczenie NWW dla wielu liczb
  const result = findNWWMultipleNumbers(numbers);

  return result;
}

const part2 = (commands: ("L" | "R")[], map: {[key: string]: {"L": string, "R": string}}) => {
  let currentKeys = [...Object.keys(map).filter(key => key.endsWith("A"))];
  console.log(currentKeys);
  let routes = [];

  for (const key of currentKeys) {
    const newRoute = findRoute(commands, map, key)
    routes.push(newRoute);
  }
  console.log(routes);
  console.log(findNWW(...routes))
}

loadLinesFromFile("day08/data.txt")
  .then((lines) => {
    let map: {[key: string]: {"L": string, "R": string}} = {}
    const commands: any = lines[0].split("");
    lines = lines.slice(2);
    for(let line of lines) {
      line = line.replace("(", "").replace(")", "").replace(" ", "").replace(" ", "").replace(" ", "");
      let splitLine = line.split("=");
      let newKey: string = splitLine[0];
      map[newKey] = {"L": splitLine[1].split(",")[0], "R": splitLine[1].split(",")[1]}
    }
    //part1(commands, map);
    part2(commands, map);
  })
  .catch((error) => {
    console.error(error);
  });