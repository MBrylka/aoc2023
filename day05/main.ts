import { loadLinesFromFile } from "../utils/utils";

class Ranges {
  destinationStart: number;
  sourceStart: number;
  size: number;

  constructor(dest: number, source:number, s: number) {
    this.destinationStart = dest;
    this.sourceStart = source;
    this.size = s;
  }

  getDestination(source: number): number {
    if(source >= this.sourceStart && source < this.sourceStart + this.size) {
      return this.destinationStart + Math.abs(this.sourceStart - source);
    }
    return -1
  }
}

class Map {
  ranges: Ranges[];

  constructor() {
    this.ranges = [];
  }

  addRange(dest: number, source: number, size: number) {
    this.ranges.push(new Ranges(dest, source, size));
  }

  getDestination(source: number): number {
    let dest = 0;
    for(const range of this.ranges) {
      dest =  range.getDestination(source);
      if(dest !== -1) return dest;
    }
    return source;
  }
}


const seedToSoilMap: Map = new Map();
const soilToFertilizerMap: Map = new Map();
const fertilizerToWaterMap: Map = new Map();
const waterToLightMap: Map = new Map();
const lightToTemperatureMap: Map = new Map();
const temperatureToHumidityMap: Map = new Map();
const humidityToLocationMap: Map = new Map();

const getSeedLocation = (seed: number): number => {
  let soil = seedToSoilMap.getDestination(seed);
  let fert = soilToFertilizerMap.getDestination(soil);
  let water = fertilizerToWaterMap.getDestination(fert);
  let light = waterToLightMap.getDestination(water);
  let temp = lightToTemperatureMap.getDestination(light);
  let humidity = temperatureToHumidityMap.getDestination(temp);
  let location = humidityToLocationMap.getDestination(humidity);
  return location;
}

const decodeMaps = (lines: string[]) => {
  lines = lines.slice(3);
  lines = lines.filter(value => value != "");

  //scrap maps
  let index = 0;
  let map = seedToSoilMap;
  while(index < lines.length) {
    if(lines[index] === "soil-to-fertilizer map:") map = soilToFertilizerMap;
    else if(lines[index] === "fertilizer-to-water map:") map = fertilizerToWaterMap;
    else if(lines[index] === "water-to-light map:") map = waterToLightMap;
    else if(lines[index] === "light-to-temperature map:") map = lightToTemperatureMap;
    else if(lines[index] === "temperature-to-humidity map:") map = temperatureToHumidityMap;
    else if(lines[index] === "humidity-to-location map:") map = humidityToLocationMap;
    else {
      const linesSplit = lines[index].split(" ");
      map.addRange(parseInt(linesSplit[0]), parseInt(linesSplit[1]), parseInt(linesSplit[2]));
    }
    index++;
  }
}


const part1 = (lines: string[]) => {
  //scrap seeds
  const seeds: number[] = [...lines[0].replace("seeds: ", "").split(" ").map(value => parseInt(value))];  
  let locationumbers: number[] = []
  for(const seed of seeds) {
    locationumbers.push(getSeedLocation(seed));
  }
  console.log(Math.min(...locationumbers));
}


const part2 = (lines: string[]) => {
  //scrap seeds
  const split = lines[0].replace("seeds: ", "").split(" ");
  console.log(split);
  let lowestLocation = Infinity;
  for(let i = 0; i < split.length; i+=2) {
    let start = parseInt(split[i]);
    let range = parseInt(split[i+1]);
    let currentStart = start;
    let currentRange = 100000;
    do {
      for(let j = currentStart; j < currentStart+currentRange; j++)
      { 
        lowestLocation = Math.min(lowestLocation, getSeedLocation(j));
      }
      currentStart+= currentRange;
      currentRange = Math.min(start + range - currentStart, currentRange);
      console.log(currentStart, currentStart + currentRange, start + range);
    } while(currentStart < start+range) ;
    console.log(lowestLocation);
  } 

}


loadLinesFromFile("day05/data.txt")
  .then((lines) => {
    decodeMaps(lines);
    //part1(lines);
    part2(lines);
  })
  .catch((error) => {
    console.error(error);
  });