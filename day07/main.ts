import { loadLinesFromFile } from "../utils/utils";

enum HandType {
  HighCard,    //0
  OnePair,     //1
  TwoPair,     //2
  ThreeOfAKind,//3
  FullHouse,   //4
  FourOfAKind, //5
  FiveOfAKind  //6
}

const cardValueOrder = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const cardValueOrder2 = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'];

class Hand {
  cards: string[];
  bid: number;
  handType: HandType;
  considerJoker: boolean;
  
  constructor(line: string, doConsiderJoker: boolean) {
    let split = line.split(" ");
    this.cards = split[0].split("");
    this.bid = parseInt(split[1]);
    this.considerJoker = doConsiderJoker;
    this.handType = this.getHandType();
  }

  getHandType(): HandType {
    if(!this.considerJoker) {
      return this.determineHandType(this.cards);
    } else { 
      let strongestHandType = HandType.HighCard;
      for (const replacementCard of ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A']) {
        const replacedHand = this.cards.map(card => (card === 'J' ? replacementCard : card));
        const currentHandType = this.determineHandType(replacedHand);

        if (currentHandType > strongestHandType) {
          strongestHandType = currentHandType;
        }
      }
      return strongestHandType;
    }
  }
  
  private determineHandType(cards: string[]): HandType {
    const cardCounts: { [card: string]: number } = {};
  
      for (const card of cards) {
        cardCounts[card] = (cardCounts[card] || 0) + 1;
      }
      const uniqueCardCount = Object.keys(cardCounts).length;

      if(uniqueCardCount == 5)
      {
        return HandType.HighCard
      } 
      if(uniqueCardCount == 4) return HandType.OnePair;
      if(uniqueCardCount == 1) return HandType.FiveOfAKind;
      if(uniqueCardCount == 2) {
        if(Object.values(cardCounts).includes(3) && Object.values(cardCounts).includes(2)) 
          return HandType.FullHouse;
        return HandType.FourOfAKind;
      }

      if(uniqueCardCount == 3){
        if(Object.values(cardCounts).includes(3)) {
          return HandType.ThreeOfAKind;
        }
        return HandType.TwoPair;
      }

      throw new Error("Invalid hand");
  }

}

const sortFunction = (a: Hand, b:Hand) => {
  if(a.handType !== b.handType) {
    return a.handType - b.handType;
  }

  for (let i = 0; i < a.cards.length; i++) {
    const strengthA = cardValueOrder.indexOf(a.cards[i] as any);
    const strengthB = cardValueOrder.indexOf(b.cards[i] as any);
    if (strengthA !== strengthB) {
      return strengthA - strengthB;
    }
  }

  // If all cards have the same strength, compare bids
  return a.bid - b.bid;
}

const sortFunction2 = (a: Hand, b:Hand) => {
  if(a.handType !== b.handType) {
    return a.handType - b.handType;
  }

  for (let i = 0; i < a.cards.length; i++) {
    const strengthA = cardValueOrder2.indexOf(a.cards[i] as any);
    const strengthB = cardValueOrder2.indexOf(b.cards[i] as any);
    if (strengthA !== strengthB) {
      return strengthA - strengthB;
    }
  }

  // If all cards have the same strength, compare bids
  return a.bid - b.bid;
}



const part1 = (hands: Hand[]) => {
  hands.sort(sortFunction);
  
  let sum = 0;
  for(let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    sum += (i+1) * hand.bid;
  }
  console.log(sum);
}


const part2 = (hands: Hand[]) => {
  hands.sort(sortFunction2);
  
  let sum = 0;
  for(let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    sum += (i+1) * hand.bid;
    console.log(hand.cards, hand.handType, hand.bid);
  }
  console.log(sum);
}

let hands: Hand[] = [];
let hands2: Hand[] = [];
loadLinesFromFile("day07/data.txt")
  .then((lines) => {
    for(let line of lines) {
      hands.push(new Hand(line, false));
      hands2.push(new Hand(line, true));
    }
    part1(hands);
    part2(hands2);
  })
  .catch((error) => {
    console.error(error);
  });