import { start } from "repl";
import { loadLinesFromFile } from "../utils/utils";

interface SerialNumber {
  start: number;
  end: number;
  y: number;
  value: number;
}

interface Sign {
  x: number;
  y: number;
  value: string;
}

const map: string[][] = [];
let allSerialNumbers: SerialNumber[] = [];
let allSigns: Sign[] = [];
let allGears: Sign[] = [];
let sum: number = 0;

loadLinesFromFile("day03/data.txt")
  .then((lines) => {
    let mapY = 0;
    
    lines.forEach((line) => {
      map.push(line.split(""));
      allSerialNumbers = allSerialNumbers.concat(getNumbersFromLine(map[mapY], mapY));
      allSigns = allSigns.concat(getSignsFromLine(map[mapY], mapY));
      mapY++;
    });

    part1();
    part2();
  })
  .catch((error) => {
    console.error(error);
  });

const part1 = () => {
  for(let serialNumber of allSerialNumbers) {
    for(let sign of allSigns) {
      if (checkSerialNumber(sign, serialNumber)) {
        sum += serialNumber.value;
        break;
      }
    }
  }
  console.log(sum);
}

const part2 = () => {
  let sum: number = 0;
  allGears = allSigns.filter( sign => sign.value == "*");
  console.log(allGears);
  //search true geats
  for(let gear of allGears) {
    let serialNumbers: SerialNumber[] = [];
    for(let serialNumber of allSerialNumbers) {
      if(checkSerialNumber(gear, serialNumber)) {
        serialNumbers.push(serialNumber);
      }
    } 
    if (serialNumbers.length == 2) {
      sum += serialNumbers[0].value * serialNumbers[1].value;
    }
  }
  console.log(sum);
}

const getNumbersFromLine = (array: string[], y: number): SerialNumber[] => {
  let startX = -1;
  let endX = 0;
  let serialNumbers: SerialNumber[] = [];
  let value = "";
  for(let i = 0; i < array.length+1; i++)
  {
    if(/\d/.test(array[i]) && startX < 0){
      startX = i;
    }
    if(/\d/.test(array[i]) && startX >= 0){
      value += array[i];
    }
    if ((!/\d/.test(array[i])) && startX > -1) {
      endX = i-1;

      serialNumbers.push({
        start: startX,
        end: endX,
        y: y,
        value: parseInt(value)
      });

      startX = -1;
      endX = 0;
      value = "";
    }
  }
  return serialNumbers;
}
const getSignsFromLine = (array: string[], y: number): Sign[] => {
  let signs: Sign[] = [];

  for(let i = 0; i < array.length; i++) {
    if(!/\d|\./.test(array[i])) {
      signs.push({
        x: i,
        y: y,
        value: array[i]
      });
    }
  }
  return signs;
}

const checkSerialNumber = (sign: Sign, serialNumber: SerialNumber): boolean => {
  if ( serialNumber.start >= sign.x - 1
    && serialNumber.start <= sign.x + 1
    && serialNumber.y >= sign.y-1
    && serialNumber.y <= sign.y+1)
    return true;

  if ( serialNumber.end >= sign.x - 1
    && serialNumber.end <= sign.x + 1
    && serialNumber.y >= sign.y-1
    && serialNumber.y <= sign.y+1)
    return true;

  return false;
}
