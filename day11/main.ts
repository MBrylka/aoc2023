import { loadLinesFromFile } from "../utils/utils";

let mapGrid: string[][] = [];
let emptyRows: number[] = [];
let emptyCols: number[] = [];


const findEmptyRowsAndCols = () => {
  
  //find empty rows
  for (let i = 0; i < mapGrid.length; i++) {
    if (mapGrid[i].filter((value) => value === "#").length === 0) {
      emptyRows.push(i);
    }
  }

  //find empty columns
  for(let col = 0; col < mapGrid[0].length; col++) {
    let hasStars = false;
    
    for(let row = 0; row < mapGrid.length; row++) {
      if(mapGrid[row][col] === "#") {
        hasStars = true;
        break;
      }
    }

    if(!hasStars) {
      emptyCols.push(col);
    }
  }
};

interface Star {
  id: number,
  row: number,
  col: number
}

const getStarsList = (): Star[] => {
  let stars: Star[] = [];
  let id: number = 0;
  for(let row = 0; row < mapGrid.length; row++) {
    for(let col = 0; col < mapGrid[0].length; col++) {
      if(mapGrid[row][col] === "#"){
        stars.push({id: id++, row: row, col: col})
      }
    }
  }
  return stars;
}

const calculateDistance = (star1: Star, star2: Star): number => {
  const deltaX = Math.abs(star2.col - star1.col);
  const deltaY = Math.abs(star2.row - star1.row);
  return deltaX + deltaY;;
}

const getNewStarsList = (starsList: Star[], expandFactor: number): Star[] => {
  let newStarsList: Star[] = [];
  for(let star of starsList) {
    let emptyColsBefore = emptyCols.filter(value => value < star.col).length;
    let emptyRowsBefore = emptyRows.filter(value => value < star.row).length;
    newStarsList.push({id: star.id, row: star.row + (emptyRowsBefore * expandFactor), col: star.col + (emptyColsBefore * expandFactor)});
  }
  return newStarsList;
}

const part1 = () => {
  let starsList: Star[] = getStarsList();
  let newStarsList = getNewStarsList(starsList, 1);

  let distancesSum: number = 0;
  for(let i = 0; i < newStarsList.length; i++) {
    for(let j = i+1; j < newStarsList.length; j++) {
      distancesSum += calculateDistance(newStarsList[i], newStarsList[j]);
    }
  }
  console.log(distancesSum);
};

const part2 = () => {
  let starsList: Star[] = getStarsList();
  let newStarsList = getNewStarsList(starsList, 1000000-1);

  let distancesSum: number = 0;
  for(let i = 0; i < newStarsList.length; i++) {
    for(let j = i+1; j < newStarsList.length; j++) {
      distancesSum += calculateDistance(newStarsList[i], newStarsList[j]);
    }
  }
  console.log(distancesSum);
};

loadLinesFromFile("day11/data.txt")
  .then((lines) => {
    for (let line of lines) {
      mapGrid.push(line.split(""));
    }
    findEmptyRowsAndCols();
    part1();
    part2();
  })
  .catch((error) => {
    console.error(error);
  });
