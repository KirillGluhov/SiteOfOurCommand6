"use strict"

let allButtons = {
    confirm: document.getElementById("confirmStartingOfProcess"),
    createLabyrinth: document.getElementById("createLabirinth"),
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

//////////////////////////////

function findPath (matrix, start, end) {

    let currentNode = end;
    let i = end.f;

    while (currentNode.x != start.x || currentNode.y != start.y)
    {
        if (currentNode.f == i && cells[currentNode.x][currentNode.y] != "wall")
        {
            if (currentNode != end)
            {
                cells[currentNode.x][currentNode.y] == "path";
                let ctx = canvas.getContext("2d");
                ctx.clearRect(currentNode.y * sizeOfCell, currentNode.x * sizeOfCell, sizeOfCell, sizeOfCell);
                drawCell(currentNode.y, currentNode.x, "path", sizeOfCell, ctx);
            }

            if (currentNode.x+1 < height && matrix[currentNode.x+1][currentNode.y].f == i-1)
            {
                currentNode = matrix[currentNode.x+1][currentNode.y];
            }
            else if (currentNode.x-1 >= 0 && matrix[currentNode.x-1][currentNode.y].f == i-1)
            {
                currentNode = matrix[currentNode.x-1][currentNode.y];
            }
            else if (currentNode.y+1 < width && matrix[currentNode.x][currentNode.y+1].f == i-1)
            {
                currentNode = matrix[currentNode.x][currentNode.y+1];
            }
            else if (currentNode.y-1 >= 0 && matrix[currentNode.x][currentNode.y-1].f == i-1)
            {
                currentNode = matrix[currentNode.x][currentNode.y-1];
            }

            i--;
        }
        else
        {
            if (currentNode.x+1 < height && matrix[currentNode.x+1][currentNode.y].f == i)
            {
                currentNode = matrix[currentNode.x+1][currentNode.y];
            }
            else if (currentNode.x-1 >= 0 && matrix[currentNode.x-1][currentNode.y].f == i)
            {
                currentNode = matrix[currentNode.x-1][currentNode.y];
            }
            else if (currentNode.y+1 < width && matrix[currentNode.x][currentNode.y+1].f == i)
            {
                currentNode = matrix[currentNode.x][currentNode.y+1];
            }
            else if (currentNode.y-1 >= 0 && matrix[currentNode.x][currentNode.y-1].f == i)
            {
                currentNode = matrix[currentNode.x][currentNode.y-1];
            }
        }
    }
}

function findF (parentNode, childNode) {
    if (childNode.closed == false)
    {
        childNode.f = parentNode.f + 1;
    }
    else
    {
        childNode.f = min(parentNode.f + 1, childNode.f);
    }

    return childNode.f;

}

function solveManhattonMetrics (node, matrix) {

    let nodes = [];

    if (node.x + 1 < height)
    {
        if (cells[node.x+1][node.y] != "wall" && matrix[node.x+1][node.y].closed == false)
        {
            matrix[node.x+1][node.y].f = findF(matrix[node.x][node.y], matrix[node.x+1][node.y]);
            matrix[node.x+1][node.y].parent.push(matrix[node.x][node.y]);
            nodes.push(matrix[node.x+1][node.y]);

        }
    }

    if (node.x - 1 >= 0)
    {
        if (cells[node.x-1][node.y] != "wall" && matrix[node.x-1][node.y].closed == false)
        {
            matrix[node.x-1][node.y].f = findF(matrix[node.x][node.y], matrix[node.x-1][node.y]);
            matrix[node.x-1][node.y].parent.push(matrix[node.x][node.y]);
            nodes.push(matrix[node.x-1][node.y]);

        }

    }

    if (node.y + 1 < width)
    {
        if (cells[node.x][node.y+1] != "wall" && matrix[node.x][node.y+1].closed == false)
        {
            matrix[node.x][node.y+1].f = findF(matrix[node.x][node.y], matrix[node.x][node.y+1]);
            matrix[node.x][node.y+1].parent.push(matrix[node.x][node.y]);
            nodes.push(matrix[node.x][node.y+1]);
        }

    }

    if (node.y - 1 >= 0)
    {
        if (cells[node.x][node.y-1] != "wall" && matrix[node.x][node.y-1].closed == false)
        {
            matrix[node.x][node.y-1].f = findF(matrix[node.x][node.y], matrix[node.x][node.y-1]);
            matrix[node.x][node.y-1].parent.push(matrix[node.x][node.y]);
            nodes.push(matrix[node.x][node.y-1]);
        }

    }

    return nodes;
}

function createGraph()
{
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
                closed: false,
                type: cells[i][j],
                parent: [],
            };

            matrix[i][j] = newObject;

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
                matrix[i][j].f = -1;
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

    while (open.length > 0)
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
            findPath(matrix, start, end);
        }

        let node = open[minIndex];
        open.splice(minIndex, 1);
        node.closed = true;

        let newArray = solveManhattonMetrics(node, matrix);

        for (let i = 0; i < newArray.length; i++)
        {
            open.push(newArray[i]);
        }
    }

    if (open.length == 0 && end.f == 0)
    {
        alert("Пути нет");
    }
}

/////////////////////////////////

let height;
let width;
let canvas;
let start;
let end;

let newButton;
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

        newButton = document.createElement("button");
        let newDiv = document.createElement("div");

        newDiv.className = "secondPart";

        makeButton(newButton, "confirmCells", "Подтвердить ввод клеток", newDiv);

        document.body.appendChild(newDiv);

        newButton.addEventListener("click", function() {
            solveAStar();
        });
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
        alert("Создание лабиринта");
    }
    else 
    {
        alert("Создание лабиринта невозможно. Сначало введите корректные значения и подтвердите выбор");
    }
});
