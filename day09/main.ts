import { loadLinesFromFile } from "../utils/utils";


class SensorReadings {
  readings: number[];
  differences: number[][];
  constructor(line: string) {
    this.readings = [];
    this.differences = [];

    for(let number of line.split(" "))
    {
      this.readings.push(parseInt(number));
    }
    this.generateHistory();
  }

  getDifferences(array: number[]): number[] {
    let difference: number[] = [];
    for(let i = 0; i < array.length -1; i++) {
      difference.push(array[i+1] - array[i])
    }
    return difference;
  }

  generateHistory() {
    let stopGenerating = false;
    this.differences.push(this.getDifferences(this.readings));
    while(!stopGenerating) {
      this.differences.push(this.getDifferences(this.differences[this.differences.length-1]));
      if(this.differences[this.differences.length-1].filter(value => value !== 0).length === 0) {
        stopGenerating = true;
      }
    }
  }

  getPredictedNextValue(): number {
    let predictionTable = [this.readings, ...this.differences];

    let predictionArray = [0];
    for(let i = predictionTable.length-2; i >= 0; i--) {
      predictionArray.push(predictionTable[i][predictionTable[i].length-1]+ predictionArray[predictionArray.length-1]);
    }
    return predictionArray[predictionArray.length-1];
  }

  getPredictedPreviousValue(): number {
    let predictionTable = [this.readings, ...this.differences];
    let predictionArray = [0];
    for(let i = predictionTable.length-2; i >= 0; i--) {
      let newPredictedValue = predictionTable[i][0] - predictionArray[predictionArray.length-1];
      predictionArray.push(newPredictedValue)
    }
    console.log(predictionArray)
    return predictionArray[predictionArray.length-1];
  }

}

const part1 = (sensors: SensorReadings[]) => {
  let sum: number = 0;
  for(let sensor of sensors) {
    sum += sensor.getPredictedNextValue();
  }
  console.log(sum);
}


const part2 = (sensors: SensorReadings[]) => {
  let sum: number = 0;
  for(let sensor of sensors) {
    sum += sensor.getPredictedPreviousValue();
  }
  console.log(sum);
}

loadLinesFromFile("day09/data.txt")
  .then((lines) => {
    let sensors: SensorReadings[] = [];

    for(let line of lines) {
      sensors.push(new SensorReadings(line));
    }
    //part1(sensors);
    part2(sensors);
  })
  .catch((error) => {
    console.error(error); 
  });