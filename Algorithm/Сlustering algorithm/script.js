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

function solveDistance(firstVertex, secondVertex)
{
    return Math.sqrt((firstVertex.x - secondVertex.x)**2 + (firstVertex.y - secondVertex.y)**2);
}

/////////////////////////

function isCorrectSizeOfField(newNumber)
{
    if (newNumber > 0 && isFinite(newNumber) && newNumber == Math.trunc(newNumber)) return true;
    return false;
}

////////////

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

function kMeans()
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
                let distance = solveDistance(vertexes[i], centroids[j]);

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

let allColors = ["#8B0000", "#ADFF2F", "#00FFFF", "#FFD700", "#FF00FF", "#6A5ACD", "#FF6347", "#66CDAA", "#808000", "#FF1493", "33CC99"];

function chooseStyle (color) 
{
    return allColors[color];

}

function colorVertex(vertex, numberOfColor)
{
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI)
    ctx.fillStyle = chooseStyle(numberOfColor);
    ctx.fill();
}

function findCentroids (k)
{
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
        findCentroids (k);
        let clusters = kMeans();

        for (let i = 0; i < clusters.length; i++)
        {
            for (let j = 0; j < clusters[i].length; j++)
            {
                colorVertex(clusters[i][j], i);
            }
        }
    }
    else
    {
        alert("Размер поля k некорректно");
    }
});
