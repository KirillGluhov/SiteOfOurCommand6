"use strict"

let k;
let vertexes = [];
let centroids = [];
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function drawVertexes () 
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    vertexes.forEach((vertex) => {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function solveDistance(firstVertex, secondVertex, color)
{
    
    switch (color) {
        case 0:
            return Math.sqrt((firstVertex.x - secondVertex.x)**2 + (firstVertex.y - secondVertex.y)**2); // евклидово
        case 1:
            return (firstVertex.x - secondVertex.x)**2 + (firstVertex.y - secondVertex.y)**2; //квадрат евклидова
        case 2:
            return Math.abs(firstVertex.x - secondVertex.x) + Math.abs(firstVertex.y - secondVertex.y); // манхэттенское
        case 3:
            return Math.max(Math.abs(firstVertex.x - secondVertex.x) + Math.abs(firstVertex.y - secondVertex.y)); // чебышева
        case 4:
            let answer = (firstVertex.x - secondVertex.x)**2 + (firstVertex.y - secondVertex.y)**2;
            return Math.pow(answer, 0.2); //степенное расстояние для r = 5, p = 2
        default:
            break;
    }
}

function isCorrectSizeOfField(newNumber)
{
    if (newNumber > 0 && isFinite(newNumber) && newNumber == Math.trunc(newNumber)) return true;
    return false;
}

function newCentroids (clusters) 
{
    let answer = [];

    for (let i = 0; i < k; i++)
    {
        let result = {
            x: 0,
            y: 0,
        };

        for (let j = 0; j < clusters[i].length; j++)
        {
            result.x += clusters[i][j].x;
            result.y += clusters[i][j].y;
        }

        result.x /= clusters[i].length;
        result.y /= clusters[i].length;

        answer.push(result);
    }

    return answer;

}

function kMeans(color)
{
    let oldClusters = new Array(k);

    for (let i = 0; i < k; i++)
    {
        oldClusters[i] = [];
    }

    while (true)
    {
        let clusters = new Array(k);

        for (let i = 0; i < k; i++)
        {
            clusters[i] = [];
        }

        for (let i = 0; i < vertexes.length; i++)
        {
            let minDistance = Infinity;
            let minIndex;

            for (let j = 0; j < centroids.length; j++)
            {
                let distance = solveDistance(vertexes[i], centroids[j], color);

                if (distance < minDistance)
                {
                    minDistance = distance;
                    minIndex = j;
                }
            }

            clusters[minIndex].push(vertexes[i]);
        }

        centroids = newCentroids(clusters);

        let countOfNonEquality = 0;

        for (let i = 0; i < k; i++)
        {
            if (oldClusters[i].length == clusters[i].length)
            {
                for (let j = 0; j < clusters[i].length; j++)
                {
                    if (oldClusters[i][j].x != clusters[i][j].x || oldClusters[i][j].y != clusters[i][j].y)
                    {
                        countOfNonEquality += 1;
                    }
                }
            }
            else
            {
                countOfNonEquality += Math.max(oldClusters[i].length, clusters[i].length);
            }
        }

        if (countOfNonEquality == 0)
        {
            return clusters;
        }
        else
        {
            oldClusters = new Array(k);

            for (let i = 0; i < k; i++)
            {
                oldClusters[i] = [];
                for (let j = 0; j < clusters[i].length; j++)
                {
                    let newObject = { 
                        x: clusters[i][j].x,
                        y: clusters[i][j].y
                    };

                    oldClusters[i].push(newObject);
                    
                }
            }
        }
    }

}

let allColors = ["#000000","#FFFFFF", "#8B0000", "#ADFF2F", "#00FFFF", "#FFD700", "#FF00FF", "#6A5ACD", "#FF6347", "#66CDAA", "#808000", "#FF1493", "33CC99"];

function chooseStyle (color) 
{
    return allColors[color];
}

function colorVertex(vertex, numberOfColor, color)
{
    

    switch (color) {
        case 0:
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, 10, 0, 1* Math.PI);
            ctx.fillStyle = "lime";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, 5, 0, 1 * Math.PI)
            ctx.fillStyle = chooseStyle(numberOfColor);
            ctx.fill();
            break;
        case 1:
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, 10, 1 * Math.PI, 0)
            ctx.fillStyle = "tomato";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, 5, 1 * Math.PI, 0)
            ctx.fillStyle = chooseStyle(numberOfColor);
            ctx.fill();
            break;
        case 2:
            ctx.strokeStyle = "black";
            break;
        case 3:
            ctx.strokeStyle = "magenta";
            break;
        case 4:
            ctx.strokeStyle = "aqua";
            break;
    
        default:
            break;
    }

    if (color > 1)
    {
        ctx.beginPath();
        ctx.moveTo(vertex.x, vertex.y);
        ctx.lineTo(centroids[numberOfColor].x, centroids[numberOfColor].y);
        ctx.stroke();
    }

}

function findCentroids (k)
{
    centroids = [];
    let usedVertexes = new Array(vertexes.length).fill(0);

    if (k > vertexes.length)
    {
        alert("Количество кластеров больше числа точек");
    }
    else
    {
        for (let i = 0; i < k; i++)
        {
            let indexOfNewCentroid = Math.floor(Math.random()*vertexes.length);

            if (usedVertexes[indexOfNewCentroid] == 0)
            {
                centroids.push(vertexes[indexOfNewCentroid]);
                usedVertexes[indexOfNewCentroid] = 1;
            }
            else
            {
                while (usedVertexes[indexOfNewCentroid] != 0)
                {
                    indexOfNewCentroid = Math.floor(Math.random()*vertexes.length);
                }
            
                centroids.push(vertexes[indexOfNewCentroid]);
                usedVertexes[indexOfNewCentroid] = 1;
            }
        }
    }
}

canvas.addEventListener("click", function(event) 
{
    let i = event.offsetX;
    let j = event.offsetY;

    let newObject = {
        x: i,
        y: j,
    }

    vertexes.push(newObject);
    drawVertexes();
});

let flag = false;
let buttonToConfirm = document.getElementById("confirmStartingOfProcess");

buttonToConfirm.addEventListener("click", function()
{
    k = document.getElementById("size").value;
    k = +k;

    if (isCorrectSizeOfField(k))
    {
        for (let color = 0; color < 5; color++)
        {
            findCentroids (k);
            let clusters = kMeans(color);

            for (let i = 0; i < clusters.length; i++)
            {
                for (let j = 0; j < clusters[i].length; j++)
                {
                    colorVertex(clusters[i][j], i, color);
                }
            }
        }
    }
    else
    {
        alert("Размер поля k некорректно");
    }
});
