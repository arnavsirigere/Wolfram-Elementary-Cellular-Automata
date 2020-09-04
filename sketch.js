let automata = [[]];
let res = 10;
let rows, cols;
let rule = 90;
let evolutions = {};
let validRule = true;

let ruleInput;
let colorPicker1, colorPicker2;

function setup() {
  createCanvas(600, 600);
  rows = height / res;
  cols = width / res;
  populateAutomata();
  let div = select('#root');
  ruleInput = createInput(rule.toString());
  ruleInput.input(newRule);
  let p1 = createP('Enter a number in base 10, where each bit in the binary representation of the number represents the evolution for a corresponding neighborhood');
  let resetButton = createButton('Reset!');
  colorPicker1 = createColorPicker('#62B6CB');
  colorPicker2 = createColorPicker('#232ED1');
  p1.parent(div);
  ruleInput.parent(div);
  resetButton.parent(div);
  resetButton.mouseClicked(reset);
  createP('Color for the "on" state').parent(div);
  colorPicker1.parent(div);
  createP('Color for the "off" state').parent(div);
  colorPicker2.parent(div);
}

function reset() {
  ruleInput.value('90');
  rule = 90;
  validRule = true;
  populateAutomata();
}

function populateAutomata() {
  automata = [[]];
  for (let i = 0; i < cols; i++) {
    let state = Math.floor(cols / 2) == i ? 1 : 0;
    automata[0][i] = state;
  }
  computeRules();
}

function newRule() {
  rule = +ruleInput.value();
  validRule = /\d+/.test(rule) && rule >= 0 && rule < 256;
  if (validRule) {
    computeRules();
  }
  console.log(evolutions);
}

function draw() {
  background(255);
  frameRate(40);
  if (validRule) {
    for (let y = 0; y < automata.length; y++) {
      let generation = automata[y];
      for (let x = 0; x < generation.length; x++) {
        fill(generation[x] == '1' ? colorPicker1.color() : colorPicker2.color());
        noStroke();
        rect(x * res, y * res, res, res);
      }
    }
    nextGeneration();
  } else {
    fill(0);
    textSize(20);
    text('Invalid rule! It has to be a number between 0 and 255 inclusively', 20, height / 2);
  }
}

function nextGeneration() {
  let prevGen = automata[automata.length - 1];
  let nextGen = [];
  for (let i = 0; i < cols; i++) {
    let neighborhood = [i > 0 ? prevGen[i - 1] : prevGen[cols - 1], prevGen[i], i < cols - 1 ? prevGen[i + 1] : prevGen[0]].join('');
    nextGen[i] = evolutions[neighborhood];
  }
  automata.push(nextGen);
  nextGen = prevGen;
  if (automata.length > rows) {
    automata.shift();
  }
}

function computeRules() {
  let allNeighborhoods = ['111', '110', '101', '100', '011', '010', '001', '000'];
  for (let i = 0; i < allNeighborhoods.length; i++) {
    evolutions[allNeighborhoods[i]] = rule.toString(2).padStart(8, '0').split('')[i];
  }
}
