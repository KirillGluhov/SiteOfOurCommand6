var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var points = [];

canvas.addEventListener('click', function(event) 
{
  var x = event.pageX - canvas.offsetLeft;
  var y = event.pageY - canvas.offsetTop;
  points.push({x: x, y: y});

  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();
});

class City {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceTo(city) {
    const dx = Math.abs(this.x - city.x);
    const dy = Math.abs(this.y - city.y);
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Route {
  constructor(cities) {
    this.cities = cities;
  }

  getDistance() {
    let distance = 0;
    for (let i = 0; i < this.cities.length - 1; i++) {
      distance += this.cities[i].distanceTo(this.cities[i + 1]);
    }
    distance += this.cities[this.cities.length - 1].distanceTo(this.cities[0]);
    return distance;
  }
}

function generateRandomRoute(cities) {
  const route = new Route(cities.slice());
  for (let i = route.cities.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [route.cities[i], route.cities[j]] = [route.cities[j], route.cities[i]];
  }
  return route;
}

function crossover(parent1, parent2) {
  const offspringCities = Array(parent1.cities.length);
  const start = Math.floor(Math.random() * parent1.cities.length);
  const end = Math.floor(Math.random() * (parent1.cities.length - start)) + start;
  for (let i = start; i <= end; i++) {
    offspringCities[i] = parent1.cities[i];
  }
  let k = 0;
  for (let i = 0; i < parent2.cities.length; i++) {
    if (!offspringCities.includes(parent2.cities[i])) {
      while (offspringCities[k]) {
        k++;
      }
      offspringCities[k] = parent2.cities[i];
    }
  }
  return new Route(offspringCities);
}

function mutate(route) {
  const mutationRate = 0.01;
  for (let i = 0; i < route.cities.length; i++) {
    if (Math.random() < mutationRate) {
      const j = Math.floor(Math.random() * route.cities.length);
      [route.cities[i], route.cities[j]] = [route.cities[j], route.cities[i]];
    }
  }
  return route;
}

function geneticAlgorithm(cities, populationSize, maxGenerations, mutationRate, elitism) {
  let currentGeneration = 0;
  let currentBestRoute;
  let currentBestDistance = Infinity;
  let population = Array(populationSize);
  for (let i = 0; i < populationSize; i++) {
    population[i] = generateRandomRoute(cities);
  }
  while (currentGeneration < maxGenerations) {
    population = population.sort((a, b) => a.getDistance() - b.getDistance());
    if (population[0].getDistance() < currentBestDistance) {
      currentBestRoute = population[0];
      currentBestDistance = currentBestRoute.getDistance();
    }
    const nextGeneration = [];
    for (let i = 0; i < elitism; i++) {
      nextGeneration.push(population[i]);
    }
    for (let i = elitism; i < populationSize; i++) {
      const parent1 = population[Math.floor(Math.random() * elitism)];
      const parent2 = population[Math.floor(Math.random() * (populationSize - elitism))];
      let offspring = crossover(parent1, parent2);
      offspring = mutate(offspring);
      nextGeneration.push(offspring);
    }
    population = nextGeneration;
    currentGeneration++;
  }
  return currentBestRoute;
}

function drawRoute(route) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(route.cities[0].x, route.cities[0].y);
  for (let i = 1; i < route.cities.length; i++) {
    ctx.lineTo(route.cities[i].x, route.cities[i].y);
  }
  ctx.closePath();
  ctx.stroke();
}

function start() {
  const cities = [
    { x: 50, y: 50 },
    { x: 100, y: 100 },
    { x: 150, y: 50 },
    { x: 200, y: 100 },
    { x: 250, y: 50 },
    { x: 300, y: 100 },
    { x: 350, y: 50 },
    { x: 400, y: 100 },
    { x: 450, y: 50 },
    { x: 500, y: 100 },
  ];
  const populationSize = 50;
  const maxGenerations = 1000;
  const mutationRate = 0.01;
  const elitism = 5;
  const route = geneticAlgorithm(cities, populationSize, maxGenerations, mutationRate, elitism);
  drawRoute(route);
}

function clear() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const startButton = document.getElementById("start-button");
startButton.addEventListener("click", start);

const clearButton = document.getElementById("clear-button");
clearButton.addEventListener("click", clear);
