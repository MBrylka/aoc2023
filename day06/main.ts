import { loadLinesFromFile } from "../utils/utils";

class Race {
  time: number;
  distance: number;

  constructor(t: number, d: number) {
    this.time = t;
    this.distance = d;
  }

  getWaysOfWinning(): number {
    let waysOfWinning = 0;
    for(let i = 0; i < this.time; i++) {
      if (i * (this.time-i) > this.distance) waysOfWinning++;
    }
    return waysOfWinning
  }
}

const races: Race[] = [];


const part1 = (races: Race[]) => {
  let marginOfError = 1;
  for(let race of races) {
    marginOfError *= race.getWaysOfWinning();
  }
  console.log(marginOfError);
}


const part2 = (race: Race) => {
  console.log(race.getWaysOfWinning());
}



loadLinesFromFile("day06/data.txt")
  .then((lines) => {
    let times = lines[0].replace("Time:", "").split(" ").filter(value => value != "");
    let distances = lines[1].replace("Distance:", "").split(" ").filter(value => value != "");
    for(let i = 0; i < times.length; i++) {
      races.push(new Race(parseInt(times[i]), parseInt(distances[i])));
    }
    part1(races);

    let time = parseInt(lines[0].replace("Time: ", "").split(" ").filter(value => value != "").join(""));
    let distance = parseInt(lines[1].replace("Distance: ", "").split(" ").filter(value => value != "").join(""));

    part2(new Race(time, distance));
  })
  .catch((error) => {
    console.error(error);
  });