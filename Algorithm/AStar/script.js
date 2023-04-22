"use strict"

let allButtons = {
    confirm: document.getElementById("confirmStartingOfProcess"),
    createLabyrinth: document.getElementById("createLabirinth"),
}

function makeLabyrinth(vertexesInLabyrinth, height, width) 
{
    let ctx = canvas.getContext("2d");
    let listOfVertexesWithNeighbours = [];

    let x = Math.floor(Math.random() * (height/2)) * 2;
    let y = Math.floor(Math.random() * (width/2)) * 2;

    cells[x][y] = "empty";
    drawCell(y, x, cells[x][y], sizeOfCell, ctx);
    vertexesInLabyrinth[x][y].type = "empty";

    if (y - 2 >= 0)
    {
        listOfVertexesWithNeighbours.push(vertexesInLabyrinth[x][y-2]);
    }

    if (y + 2 < width)
    {
        listOfVertexesWithNeighbours.push(vertexesInLabyrinth[x][y+2]);
    }

    if (x - 2 >= 0)
    {
        listOfVertexesWithNeighbours.push(vertexesInLabyrinth[x-2][y]);
    }

    if (x + 2 < height)
    {
        listOfVertexesWithNeighbours.push(vertexesInLabyrinth[x+2][y]);
    }

    while (listOfVertexesWithNeighbours.length > 0)
    {
        let index = Math.floor(Math.random()*listOfVertexesWithNeighbours.length);

        if (listOfVertexesWithNeighbours[index].type != "wall")
        {
            index = -1;

            for (let i = 0; i < listOfVertexesWithNeighbours.length; i++)
            {
                if (listOfVertexesWithNeighbours[i].type == "wall")
                {
                    index = i;
                    break;
                }
            }

        }

        if (index == -1)
        {
            return;
        }

        let vertex = listOfVertexesWithNeighbours[index];
        x = vertex.x;
        y = vertex.y;

        cells[x][y] = "empty";
        drawCell(y, x, cells[x][y], sizeOfCell, ctx);
        vertexesInLabyrinth[x][y].type = "empty";

        listOfVertexesWithNeighbours.splice(index, 1);

        let direction = ["north", "south", "east", "west"];

        while (direction.length > 0)
        {
            let directionIndex = Math.floor(Math.random()*direction.length);

            if (direction[directionIndex] == "north")
            {
                if (y-2 >= 0 && cells[x][y-2] == "empty")
                {
                    cells[x][y-1] = "empty";
                    drawCell(y-1, x, "empty", sizeOfCell, ctx);
                    vertexesInLabyrinth[x][y-1].type = "empty";
                    direction = [];
                }
            }
            else if (direction[directionIndex] == "south")
            {
                if (y+2 < width && cells[x][y+2] == "empty")
                {
                    cells[x][y+1] = "empty";
                    drawCell(y+1, x, "empty", sizeOfCell, ctx);
                    vertexesInLabyrinth[x][y+1].type = "empty";
                    direction = [];
                }
            }
            else if (direction[directionIndex] == "west")
            {
                if (x-2 >= 0 && cells[x-2][y] == "empty")
                {
                    cells[x-1][y] = "empty";
                    drawCell(y, x-1, "empty", sizeOfCell, ctx);
                    vertexesInLabyrinth[x-1][y].type = "empty";
                    direction = [];
                }

            }
            else if (direction[directionIndex] == "east")
            {
                if (x+2 < height && cells[x+2][y] == "empty")
                {
                    cells[x+1][y] = "empty";
                    drawCell(y, x+1, "empty", sizeOfCell, ctx);
                    vertexesInLabyrinth[x+1][y].type = "empty";
                    direction = [];
                }
            }
            
            direction.splice(directionIndex, 1);

        }

        if (y - 2 >= 0 && cells[x][y-2] == "wall")
        {
            listOfVertexesWithNeighbours.push(vertexesInLabyrinth[x][y-2]);
        }

        if (y + 2 < width && cells[x][y+2] == "wall")
        {
            listOfVertexesWithNeighbours.push(vertexesInLabyrinth[x][y+2]);
        }

        if (x - 2 >= 0 && cells[x-2][y] == "wall")
        {
            listOfVertexesWithNeighbours.push(vertexesInLabyrinth[x-2][y]);
        }

        if (x + 2 < height && cells[x+2][y] == "wall")
        {
            listOfVertexesWithNeighbours.push(vertexesInLabyrinth[x+2][y]);
        }


    }
}

function isCorrectSizeOfField(newNumber)
{
    if (newNumber > 0 && isFinite(newNumber) && newNumber == Math.trunc(newNumber)) return true;
    return false;
}

function makeButton(button, newId, newText, newDiv) {
    button.id = newId;
    button.textContent = newText;
    newDiv.appendChild(button);
  }

function drawCell(x, y, type, cellSize, ctx) {
    if (type == "empty") 
    {
      ctx.fillStyle = "#ffffff"; //белый
    } 
    else if (type == "start") 
    {
      ctx.fillStyle = "#00ff00"; //зелёный
    } 
    else if (type == "end") 
    {
      ctx.fillStyle = "#ff0000"; //красный
    } 
    else if (type == "wall") 
    {
      ctx.fillStyle = "#000000"; //чёрный
    }
    else if (type == "path")
    {
      ctx.fillStyle = "#0000ff";
    }
    else if (type == "potential")
    {
        ctx.fillStyle = "gray";
    }
    else if (type == "newCell")
    {
        ctx.fillStyle = "magenta";
    }

    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
  }

function makeGrid(height, width)
{
    canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.width = width * sizeOfCell;
    canvas.height = height * sizeOfCell;
    document.body.appendChild(canvas);

    let ctx = canvas.getContext("2d");

    cells = [];

    for (let i = 0; i < height; i++)
    {
        cells[i] = [];
        for (let j = 0; j < width; j++)
        {
            cells[i][j] = "empty";
        }
    }

    canvas.addEventListener("click", function(event) {

        let i = Math.floor(event.offsetX/sizeOfCell);
        let j = Math.floor(event.offsetY/sizeOfCell);

        if (cells[j][i] == "empty") 
        {
            cells[j][i] = "wall";
        } 
        else if (cells[j][i] == "start") 
        {
            cells[j][i] = "end";
        }
        else if (cells[j][i] == "wall") 
        {
            cells[j][i] = "start";
        }  
        else if (cells[j][i] == "end")
        {
            cells[j][i] = "empty";
        }
        else if (cells[j][i] == "path")
        {
            cells[j][i] = "empty";
        }

        drawCell(i, j, cells[j][i], sizeOfCell, ctx);

    });

    for (let i = 0; i < height; i++)
    {
        for (let j = 0; j < width; j++)
        {
            drawCell(j, i, cells[i][j], sizeOfCell, ctx)
        }
    }

}

function findPath(matrix, start, end) {
    let currentNode = end;
    let path = [];
    let ctx = canvas.getContext("2d");
    drawCell(start.y, start.x, "start", sizeOfCell, ctx);
    
    while (currentNode.x != start.x || currentNode.y != start.y) 
    {
      path.push(currentNode);
      currentNode = currentNode.parent;
    }
    path.push(start);
    
    let i = path.length - 2;
    
    let timer = setInterval(function() {
      let node = path[i];
      cells[node.x][node.y] = "path";

      ctx.clearRect(node.y * sizeOfCell, node.x * sizeOfCell, sizeOfCell, sizeOfCell);
      drawCell(node.y, node.x, "path", sizeOfCell, ctx);
  
      if (node.x === end.x && node.y === end.y) 
      {
        cells[node.x][node.y] = "end";
        ctx.clearRect(node.y * sizeOfCell, node.x * sizeOfCell, sizeOfCell, sizeOfCell);
        drawCell(node.y, node.x, "end", sizeOfCell, ctx);

        pathFound = true;
        clearInterval(timer);
        return;
      }
      i--;
    }, 100);
  }
  

function findNeighbours (node, matrix, start) {

    let ctx = canvas.getContext("2d");
    let nodes = [];

    if (node.x + 1 < height)
    {
        if (cells[node.x+1][node.y] != "wall" && matrix[node.x+1][node.y].closed == false)
        {
            nodes.push(matrix[node.x+1][node.y]);

            {
                let colorIndex = 0;
                let timer = setInterval(function() {
                    drawCell(node.y, node.x+1, ["newCell", "potential"][colorIndex], sizeOfCell, ctx);
                    colorIndex++;
                    if (colorIndex === 2) {
                        clearInterval(timer);
                    }
                }, 30);
            }

        }
    }

    if (node.x - 1 >= 0)
    {
        if (cells[node.x-1][node.y] != "wall" && matrix[node.x-1][node.y].closed == false)
        {
            nodes.push(matrix[node.x-1][node.y]);
            {
                let colorIndex = 0;
                let timer = setInterval(function() {
                    drawCell(node.y, node.x-1, ["newCell", "potential"][colorIndex], sizeOfCell, ctx);
                    colorIndex++;
                    if (colorIndex === 2) {
                        clearInterval(timer);
                    }
                }, 30);
            }

        }

    }

    if (node.y + 1 < width)
    {
        if (cells[node.x][node.y+1] != "wall" && matrix[node.x][node.y+1].closed == false)
        {
            nodes.push(matrix[node.x][node.y+1]);
            {
                let colorIndex = 0;
                let timer = setInterval(function() {
                    drawCell(node.y+1, node.x, ["newCell", "potential"][colorIndex], sizeOfCell, ctx);
                    colorIndex++;
                    if (colorIndex === 2) {
                        clearInterval(timer);
                    }
                }, 30);
            }
        }

    }

    if (node.y - 1 >= 0)
    {
        if (cells[node.x][node.y-1] != "wall" && matrix[node.x][node.y-1].closed == false)
        {
            nodes.push(matrix[node.x][node.y-1]);
            {
                let colorIndex = 0;
                let timer = setInterval(function() {
                    drawCell(node.y-1, node.x, ["newCell", "potential"][colorIndex], sizeOfCell, ctx);
                    colorIndex++;
                    if (colorIndex === 2) {
                        clearInterval(timer);
                    }
                }, 30);
            }
        }

    }



    return nodes;
}

function manhattonMetrics(vertex, end) {
    return (Math.abs(vertex.x - end.x) + Math.abs(vertex.y - end.y));
}

function createGraph()
{
    let ctx = canvas.getContext("2d");
    let numberOfStarts = 0;
    let numberOfEnds = 0;
    let matrix = [];

    for (let i = 0; i < height; i++)
    {
        matrix[i] = [];
        for (let j = 0; j < width; j++)
        {
            let newObject = {
                x: i,
                y: j,
                f: 0,
                g: 0,
                h: 0,
                closed: false,
                type: cells[i][j],
                parent: null,
            };

            matrix[i][j] = newObject;

            if (cells[i][j] == "empty")
            {
                drawCell(j, i, cells[i][j], sizeOfCell, ctx);
            }

            if (cells[i][j] == "start")
            {
                start = matrix[i][j];
                numberOfStarts++;
            }

            if (cells[i][j] == "end")
            {
                end = matrix[i][j];
                numberOfEnds++;
            }

            if (cells[i][j] == "wall")
            {
                matrix[i][j].f = -Infinity;
            }

        }
    }

    if (numberOfEnds == 0 || numberOfStarts == 0)
    {
        if (numberOfEnds == 0 && numberOfStarts == 0)
        {
            alert("Вы не ввели начало и конец");
        }
        else if (numberOfEnds == 0)
        {
            alert("Вы не ввели конец");
        }
        else
        {
            alert("Вы не ввели начало");
        }
    }
    else if (numberOfEnds > 1 || numberOfStarts > 1)
    {
        if (numberOfEnds > 1 && numberOfStarts > 1)
        {
            alert("Слишком много стартовых и начальных клеток");
        }
        else if (numberOfEnds > 1)
        {
            alert("Вы ввели слишком много конечных клеток");
        }
        else
        {
            alert("Вы ввели слишком много начальных вершин");
        }
    }


    return matrix;
}

function solveAStar ()
{
    let matrix = createGraph();
    let open = [];

    open.push(start);
    start.g = 0;
    start.f = start.g + start.h;

    let timer = setInterval(function()
    {
        if (open.length > 0)
        {
            let min = open[0];
            let minIndex = 0;

            for (let i = 0; i < open.length; i++)
            {
                if (open[i].f < min.f)
                {
                    min = open[i];
                    minIndex = i;
                }
            }

            if (min.x == end.x && min.y == end.y)
            {
                clearInterval(timer);
                findPath(matrix, start, end);
            }

            let node = open[minIndex];
            node.closed = true;

            let newArray = findNeighbours(node, matrix, start);

            for (let i = 0; i < newArray.length; i++)
            {
                let tentativeScore = min.g + 1;

                if (newArray[i].closed == false)
                {
                    newArray[i].parent = min;
                    newArray[i].g = tentativeScore;
                    newArray[i].f = newArray[i].g + manhattonMetrics(newArray[i], end);
                    let count = 0;

                    for (let j = 0; j < open.length; j++)
                    {
                        if (open[j] == newArray[i])
                        {
                            count++;
                        }
                    }

                    if (count == 0)
                    {
                        open.push(newArray[i]);
                    }
                }
            }

            open.splice(minIndex, 1);
        }
    }, 100);

    if (open.length == 0 && end.f == 0)
    {
        alert("Пути нет");
    }
}

let height;
let width;
let canvas;
let start;
let end;

let newButton = document.createElement("button");
let cells;
let sizeOfCell = 20;

allButtons.confirm.addEventListener("click", function()
{
    height = document.getElementById("sizeOfHeight").value;
    width = document.getElementById("sizeOfWidth").value;

    height = +height;
    width = +width;

    if (isCorrectSizeOfField(height) && isCorrectSizeOfField(width))
    {
        if (canvas != undefined)
        {
            canvas.clear();
            if (document.getElementById("sizeOfHeight").value != height || document.getElementById("sizeOfWidth").value != width)
            {
                height = document.getElementById("sizeOfHeight").value;
                width = document.getElementById("sizeOfWidth").value;
            }
        }
        makeGrid(height, width);

        let newDiv = document.createElement("div");

        newDiv.className = "secondPart";

        makeButton(newButton, "confirmCells", "Подтвердить ввод клеток", newDiv);

        document.body.appendChild(newDiv);
    }
    else 
    {
        alert("Вы ввели некорректное значение. Попробуйте ввести другое");
    }
});

allButtons.createLabyrinth.addEventListener("click", function() 
{
    if (isCorrectSizeOfField(height) && isCorrectSizeOfField(width))
    {
        let ctx = canvas.getContext("2d");
        let vertexesInLabyrinth = new Array(height);

        for (let i = 0; i < height; i++)
        {
            vertexesInLabyrinth[i] = new Array(width);

            for (let j = 0; j < width; j++)
            {
                cells[i][j] = "wall";
                drawCell(j, i, cells[i][j], sizeOfCell, ctx);

                vertexesInLabyrinth[i][j] = {
                    x: i,
                    y: j,
                    type: cells[i][j],

                };

            }
        }
                
        makeLabyrinth(vertexesInLabyrinth, height, width);
    }
    else 
    {
        alert("Создание лабиринта невозможно. Сначало введите корректные значения и подтвердите выбор");
    }
});

newButton.addEventListener("click", function() {
    solveAStar();
});
