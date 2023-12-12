import { loadLinesFromFile } from "../utils/utils";

const part1 = () => {
}


const part2 = () => {
}

loadLinesFromFile("day07/data.txt")
  .then((lines) => {
    for(let line of lines) {
    }
    part1();
    part2();
  })
  .catch((error) => {
    console.error(error);
  });