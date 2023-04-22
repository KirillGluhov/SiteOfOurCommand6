const NUM_ANTS = 10;  
const ALPHA = 1;  // Параметр для управления важностью следов феромонов
const BETA = 5;  // Параметр для контроля важности расстояний
const RHO = 0.1;  // Скорость испарения феромона
const Q = 100;  // Сумма депозита феромонов

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let vertices = []; 
let distMatrix = []; 
let pheromoneMatrix = []; 
let bestTour; 
let bestTourLength = Infinity;
let animationId;
let isRunning = false;

class Ant 
{
  constructor(startVertex) 
  {
    this.tour = [startVertex];
    this.visited = new Set([startVertex]);
    this.currentVertex = startVertex;
    this.tourLength = 0;
  }

  chooseNextVertex() 
  {
    let probs = [];
    let denominator = 0;

    for (let j = 0; j < vertices.length; j++) 
    {
      if (!this.visited.has(j)) 
      {
        let pheromone = pheromoneMatrix[this.currentVertex][j];
        let distance = distMatrix[this.currentVertex][j];
        let prob = Math.pow(pheromone, ALPHA) * Math.pow(1 / distance, BETA);

        probs.push(prob);
        denominator += prob;
      } 
      else 
      {
        probs.push(0);
      }
    }

    let r = Math.random() * denominator;
    let accumulator = 0;

    for (let j = 0; j < vertices.length; j++) 
    {
      if (!this.visited.has(j)) 
      {
        accumulator += probs[j];

        if (accumulator >= r) 
        {
          return j;
        }
      }
    }
  }

  move() 
  {
    let nextVertex = this.chooseNextVertex();
    this.tour.push(nextVertex);
    this.visited.add(nextVertex);
    let distance = distMatrix[this.currentVertex][nextVertex];
    this.tourLength += distance;
    this.currentVertex = nextVertex;
  }

  depositPheromone() 
  {
    let tourLength = this.tourLength;

    for (let i = 0; i < this.tour.length - 1; i++) 
    {
      let u = this.tour[i];
      let v = this.tour[i+1];

      pheromoneMatrix[u][v] += Q / tourLength;
     
    }

    let u = this.tour[this.tour.length - 1];
    let v = this.tour[0];

    pheromoneMatrix[u][v] += Q / tourLength;
  }
}

canvas.addEventListener('click', function(event) 
{
  let x = event.clientX - canvas.offsetLeft;
  let y = event.clientY - canvas.offsetTop;

  vertices.push({x, y});
  drawVertex(x, y);
});

function drawVertex(x, y) 
{
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
}

const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');

startButton.addEventListener('click', startAnimation);
stopButton.addEventListener('click', stopAnimation);

function startAnimation() 
{
  if (!isRunning) 
  {
    isRunning = true;

    initialize();
    animationLoop();
  }
}

function stopAnimation() 
{
  if (isRunning) 
  {
    isRunning = false;

    cancelAnimationFrame(animationId);
  }
}

function initialize() 
{
  for (let i = 0; i < vertices.length; i++) 
  {
    let row = [];

    for (let j = 0; j < vertices.length; j++) 
    {
      if (i === j) 
      {
        row.push(0);
      } 
      else 
      {
        let distance = Math.sqrt(Math.pow(vertices[i].x - vertices[j].x, 2) + Math.pow(vertices[i].y - vertices[j].y, 2));

        row.push(distance);
      }
    }

    distMatrix.push(row);
  }

  for (let i = 0; i < vertices.length; i++) 
  {
    let row = [];

    for (let j = 0; j < vertices.length; j++) 
    {
      row.push(1);
    }

    pheromoneMatrix.push(row);
  }

  bestTour = [];

  for (let i = 0; i < vertices.length; i++) 
  {
    bestTour.push(i);
  }
}

function animationLoop() 
{
  let ants = [];

  for (let i = 0; i < NUM_ANTS; i++) 
  {
    ants.push(new Ant(Math.floor(Math.random() * vertices.length)));
  }

  for (let i = 0; i < vertices.length - 1; i++) 
  {
    for (let ant of ants) 
    {
      ant.move();
    }
  }

  for (let ant of ants) 
  {
    ant.depositPheromone();
  }

  for (let ant of ants) 
  {
    if (ant.tourLength < bestTourLength) 
    {
      bestTourLength = ant.tourLength;
      bestTour = ant.tour;
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let i = 0; i < bestTour.length - 1; i++) 
  {
    let u = bestTour[i];
    let v = bestTour[i+1];
    ctx.moveTo(vertices[u].x, vertices[u].y);
    ctx.lineTo(vertices[v].x, vertices[v].y);
  }

  let u = bestTour[bestTour.length - 1];
  let v = bestTour[0];
  ctx.moveTo(vertices[u].x, vertices[u].y);
  ctx.lineTo(vertices[v].x, vertices[v].y);
  ctx.stroke();
  
  for (let i = 0; i < vertices.length; i++) 
  {
    for (let j = 0; j < vertices.length; j++) 
    {
      pheromoneMatrix[i][j] *= (1 - RHO);
      pheromoneMatrix[i][j] += RHO * INITIAL_PHEROMONE;
    }
  }

  for (let ant of ants) 
  {
    ant.updatePheromone();
  }
  
  if (isRunning) 
  {
    animationId = requestAnimationFrame(animationLoop);
  }
}