import { loadLinesFromFile } from "../utils/utils";

const wordToDigitMap: Record<string, string> = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

loadLinesFromFile("day01/data.txt")
  .then((lines) => {
    let sum = 0;
    lines.forEach((line) => {
      sum += getCalibrationValue(line);
    });
    console.log(sum);
  })
  .catch((error) => {
    console.error(error);
  });

const findFirstDigit = (line: string): string => {
  let newString = "";
  for (const char of line) {
    newString += char;
    for (const key of Object.keys(wordToDigitMap)) {
      const digit = wordToDigitMap[key];
      if (newString.includes(digit) || newString.includes(key)) {
        return digit;
      }
    }
  }
  return "";
};

const findLastDigit = (line: string): string => {
  let newString = "";
  for (let i = line.length - 1; i >= 0; i--) {
    newString = line[i] + newString;
    for (const key of Object.keys(wordToDigitMap)) {
      const digit = wordToDigitMap[key];
      if (newString.includes(digit) || newString.includes(key)) {
        return digit;
      }
    }
  }
  return "";
};

const getCalibrationValue = (inputString: string): number => {
    const firstDigit = findFirstDigit(inputString);
    const lastDigit = findLastDigit(inputString);
    return parseInt(firstDigit+lastDigit);
};
