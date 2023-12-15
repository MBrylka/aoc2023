import { loadLinesFromFile } from "../utils/utils";


const map: string[][] = [];
const enlargedMap: string[][] = [];
const takenMap: number[][] = [];
const pipesMap: string[][] = [];
let startingSign: string = "";

enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT
}


class Walker {
  currentX: number;
  currentY: number;
  currentValue: number;
  nextDirection: Direction;

  constructor(x: number, y: number, dir: Direction) {
    this.currentX = x;
    this.currentY = y;
    this.currentValue = 0;
    this.nextDirection = dir;
  }

  step(): boolean {
    pipesMap[this.currentY][this.currentX] = map[this.currentY][this.currentX];
    if(takenMap[this.currentY][this.currentX] !== 0)
    {
      takenMap[this.currentY][this.currentX];
      return false;
    }
    takenMap[this.currentY][this.currentX] = this.currentValue;
    this.currentValue++;
    switch(this.nextDirection) {
      case Direction.UP:
        this.currentY--;
        break;
      case Direction.RIGHT:
        this.currentX++;
        break;
      case Direction.DOWN:
        this.currentY++;
        break;
      case Direction.LEFT:
        this.currentX--;
        break;
    }

    this.determineNextDirection();

    return true;
  }

  determineNextDirection() {
    let sign = map[this.currentY][this.currentX];
    switch(sign) {
      case "L":
      {
        this.nextDirection = this.nextDirection == Direction.LEFT ? Direction.UP : Direction.RIGHT;
      } break;
      case "J":
      {
        this.nextDirection = this.nextDirection == Direction.RIGHT ? Direction.UP : Direction.LEFT;
      } break;
      case "7":
      {
        this.nextDirection = this.nextDirection == Direction.RIGHT ? Direction.DOWN : Direction.LEFT;
      } break;
      case "F":
      {
        this.nextDirection = this.nextDirection == Direction.LEFT ? Direction.DOWN : Direction.RIGHT;
      } break;
    }
  }
}

const determineStartingPosition = (map: string[][]): number[] => {
  let x = 0;
  let y = 0;

  for(let i = 0; i < map.length; i++) {
    for(let j = 0; j < map[i].length; j++) {
      if(map[i][j] == "S") {
        x = j;
        y = i;
        break;
      }
    }
  }
  
  return [x, y]
}

const determineStartingPipe = (map: string[][], x: number, y: number): string => {
  let up, down, left, right;
  let upConnectors = ["|", "J", "F"];
  let downConnectors = ["|", "J", "L"];
  let leftConnectors = ["-", "F", "L"];
  let rightConnectors = ["-", "J", "7"];
  if(upConnectors.find(value => value == map[y-1][x]) !== undefined) {
    up = true;
  }
  
  if(downConnectors.find(value => value == map[y+1][x]) !== undefined) {
    down = true;
  }
  
  if(leftConnectors.find(value => value == map[y][x-1]) !== undefined) {
    left = true;
  }
  
  if(rightConnectors.find(value => value == map[y][x+1]) !== undefined) {
    right = true;
  }

  //top down
  if(up && down) return "|";
  //left right
  if (left && right) return "-";
  //left top
  if( left && up) return "J";
  //left down
  if(left && down) return "7";
  //right top
  if(right && up) return "L";
  //right down
  if(right && down) return "F";

  return ".";
}

const part1 = (map: string[][]) => {
  const [x, y] = determineStartingPosition(map);
  startingSign = determineStartingPipe(map, x, y);
  console.log(startingSign);
  let walkers: Walker[] = [];
  switch(startingSign) {
    case "|":
    {
      walkers.push(new Walker(x, y, Direction.UP));
      walkers.push(new Walker(x, y, Direction.DOWN));
    } break;
    case "-":
    {
      walkers.push(new Walker(x, y, Direction.LEFT));
      walkers.push(new Walker(x, y, Direction.RIGHT));
    } break;
    case "L":
    {
      walkers.push(new Walker(x, y, Direction.UP));
      walkers.push(new Walker(x, y, Direction.RIGHT));
    } break;
    case "J":
    {
      walkers.push(new Walker(x, y, Direction.UP));
      walkers.push(new Walker(x, y, Direction.LEFT));
    } break;
    case "7":
    {
      walkers.push(new Walker(x, y, Direction.DOWN));
      walkers.push(new Walker(x, y, Direction.LEFT));
    } break;
    case "F":
    {
      walkers.push(new Walker(x, y, Direction.DOWN));
      walkers.push(new Walker(x, y, Direction.RIGHT));
    } break;
  }

  //walkers are created, now loop steps until no steps are available:

  let walkersConditions = [true, true];
  while(walkersConditions[0] == true || walkersConditions[1] == true) {
    walkersConditions[0] = walkers[0].step();
    walkersConditions[1] = walkers[1].step();
  }
  pipesMap[y][x] = startingSign;
  console.log(Math.max(walkers[0].currentValue-1, walkers[1].currentValue-1));
  
}


interface visitedFloor {
  x: number,
  y: number,
  onEdge: boolean
}

/*  const getVisitedFloors = (mapData: string[][], row: number, col: number, visitedFloors: visitedFloor[]): visitedFloor[] => {
  const currentTile = mapData[col][row]
  if(currentTile === ".") {
    if(visitedFloors.filter(value => value.x == row && value.y == col).length == 1) {
      return [];
    }
    let newVisited: visitedFloor;
    if(row === 0 || row === mapData[0].length-1 || col === 0 || col == mapData.length-1) {
      
      return[{x: row, y: col, onEdge: true}];
    } else {
      newVisited = {x: row, y: col, onEdge: false}
    }
    visitedFloors.push(newVisited);
    return [
      newVisited, 
      ...(row > 0 ? getVisitedFloors(mapData, row-1, col, visitedFloors): []),
      ...(row < mapData[0].length-1 ? getVisitedFloors(mapData, row+1, col, visitedFloors): []),
      ...(col > 0 ? getVisitedFloors(mapData, row, col-1, visitedFloors) : []),
      ...(col < mapData.length-1 ? getVisitedFloors(mapData, row, col+1, visitedFloors): [])
    ]
  }
  return [];
}  */
const getVisitedFloors = (mapData: string[][], startRow: number, startCol: number, visitedFloors: visitedFloor[]): visitedFloor[] => {
  const stack: { row: number; col: number }[] = [];

  stack.push({ row: startRow, col: startCol });

  while (stack.length > 0) {
    const { row, col } = stack.pop()!; // Non-null assertion for simplicity, make sure stack is not empty

    if (row < 0 || row >= mapData[0].length || col < 0 || col >= mapData.length) {
      visitedFloors.push({ x: row, y: col, onEdge: true });
      break;
    } else if (mapData[col][row] === "." && visitedFloors.every((v) => v.x !== row || v.y !== col)) {
      visitedFloors.push({ x: row, y: col, onEdge: false });
      stack.push({ row: row - 1, col });
      stack.push({ row: row + 1, col });
      stack.push({ row, col: col - 1 });
      stack.push({ row, col: col + 1 });
    }
  }

  return visitedFloors;
};

function isContained(mapData: string[][], col: number, row: number): boolean {
  let visitedFloors: visitedFloor[] = []
  let newFloors = getVisitedFloors(mapData, row, col, visitedFloors);
  console.log(newFloors.length, newFloors);
  return(newFloors.filter(value => value.onEdge).length == 0);
}
const part2 = (mapData: string[][]) => {

  let sum: number = 0;
  for(let i = 0; i < mapData.length; i++) {
    for(let j = 0; j < mapData[i].length; j++) {
      if(mapData[i][j] == ".") {
        console.log("checking...", j, i);
        if(isContained(enlargedMap, i*3+1, j*3+1)) {
          console.log(true);
          sum += 1;
        } else {
          console.log(false);
        }
      }
    }
  }

  console.log(sum);
}

const createEnlaredMap = (map: string[][]) => {
  let mapSize = map[0].length;
  for(let i = 0; i < map.length * 3; i++) {
    let newArray: string[] = [];
    for(let j = 0; j < mapSize * 3; j++) {
      newArray.push(".");
    }
    enlargedMap.push(newArray);
  }

  for(let i = 0; i < map.length; i++) {
    for(let j = 0; j < map[i].length; j++) {
      let sign = map[i][j] == "S" ? startingSign : map[i][j];
      switch(sign) {
        case "|": {
          enlargedMap[i*3][j*3+1] = "|";
          enlargedMap[i*3+1][j*3+1] = "|";
          enlargedMap[i*3+2][j*3+1] = "|";
        } break;
        case "-": {
          enlargedMap[i*3+1][j*3] = "-";
          enlargedMap[i*3+1][j*3+1] = "-";
          enlargedMap[i*3+1][j*3+2] = "-";
        } break;
        case "L": {
          enlargedMap[i*3][j*3+1] = "|";
          enlargedMap[i*3+1][j*3+1] = "L";
          enlargedMap[i*3+1][j*3+2] = "-";
        } break;
        case "J": {
          enlargedMap[i*3][j*3+1] = "|";
          enlargedMap[i*3+1][j*3+1] = "J";
          enlargedMap[i*3+1][j*3] = "-";
        } break;
        case "7": {
          enlargedMap[i*3+2][j*3+1] = "|";
          enlargedMap[i*3+1][j*3+1] = "7";
          enlargedMap[i*3+1][j*3] = "-";
        } break;
        case "F": {
          enlargedMap[i*3+2][j*3+1] = "|";
          enlargedMap[i*3+1][j*3+1] = "F";
          enlargedMap[i*3+1][j*3+2] = "-";
        } break;
      }
    }
  }
  for(let i = 0; i < enlargedMap.length; i++) {
    console.log(JSON.stringify(enlargedMap[i]));
  } 
}

loadLinesFromFile("day10/data.txt")
  .then((lines) => {
    for(let line of lines) {
      map.push(line.split(""));
    }
    for(let i = 0; i < map.length; i++) {
      let newArray = [];
      let newArray2 = [];
      for(let j = 0; j < map[i].length; j++) {
        newArray.push(0);
        newArray2.push(".");
      }
      takenMap.push(newArray);
      pipesMap.push(newArray2);
    }

    part1(map);
     for(let i = 0; i < pipesMap.length; i++) {
      console.log(JSON.stringify(pipesMap[i]));
    } 
    createEnlaredMap(pipesMap);
    part2(pipesMap);
    
  })
  .catch((error) => {
    console.error(error);
  });