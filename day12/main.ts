import { loadLinesFromFile } from "../utils/utils";



class ConditionRecord {
  conditions: string;
  records: number[];

  constructor(line: string) {
    let lineSplit = line.split(" ");
    this.conditions = lineSplit[0];
    this.records = lineSplit[1].split(",").map(value => parseInt(value));
  }

  getPossibleArregements(): number {
    let allCombinations: string[] = this.getCombinations(this.conditions);
    //majac liste kombinacjy sprawdz czy dana kombinacja spelnia warunek records
    let validCombinations: number = 0;
    for(let combination of allCombinations) {
      if(this.checkCombination(combination)) {
        validCombinations++;
      }
    }
    return validCombinations;
  }

  unfold() {
    let cond = this.conditions;
    let recs = [...this.records];
    for(let i = 0; i < 4; i++)
    {
      this.conditions += "?" + cond;
      this.records = this.records.concat(recs);
    }

  }

  private getCombinations(conditions: string): string[] {
    if(conditions.includes("?")) {
      let variant1 = conditions.replace("?", ".");
      let variant2 = conditions.replace("?", "#");
      return [...this.getCombinations(variant1), ...this.getCombinations(variant2)]
    }
    return [conditions]
  }  

  private checkCombination(combination: string): boolean {
    let splited = combination.split(".").filter(value => value.length > 0).map(value => value.length);
    return JSON.stringify(splited) === JSON.stringify(this.records);
  }
}

const part1 = (conditionRecords: ConditionRecord[]) => {
  let arrangements = 0;
  for(let conditionRecord of conditionRecords) {
    arrangements += conditionRecord.getPossibleArregements();
  }
  console.log(arrangements);
}

const part2 = (conditionRecords: ConditionRecord[]) => {
  //input is too large and brute forcing is not possible
  let arrangements = 0;
  for(let conditionRecord of conditionRecords) {
    conditionRecord.unfold();
    arrangements += conditionRecord.getPossibleArregements();
  }
  console.log(arrangements);
  
}

loadLinesFromFile("day12/data.txt")
  .then((lines) => {
    const conditionRecords: ConditionRecord[] = [];
    for(let line of lines) {
      conditionRecords.push(new ConditionRecord(line));
    }
    part1(conditionRecords);
    part2(conditionRecords);
  })
  .catch((error) => {
    console.error(error);
  });