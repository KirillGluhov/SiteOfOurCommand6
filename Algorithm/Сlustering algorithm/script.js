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
            let answer = (Math.abs(firstVertex.x - secondVertex.x))**3 + (Math.abs(firstVertex.y - secondVertex.y))**3;
            return Math.pow(answer, 0.2); //степенное расстояние для r = 5, p = 3
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

function findDistance(first, second, currentClasters, color)
{
    switch (color) {
        case 5:
            {
                let min = Infinity;

                for (let i = 0; i < currentClasters[first].length; i++)
                {
                    for (let j = 0; j < currentClasters[second].length; j++)
                    {
                        let distance = solveDistance(currentClasters[first][i], currentClasters[second][j], 0);

                        if (distance < min)
                        {
                            min = distance;
                        }

                    }
                }
                return min;
                //Метод одиночной связи
            }
            return;
        case 6:
            {
                let max = -Infinity;

                for (let i = 0; i < currentClasters[first].length; i++)
                {
                    for (let j = 0; j < currentClasters[second].length; j++)
                    {
                        let distance = solveDistance(currentClasters[first][i], currentClasters[second][j], 0);

                        if (distance > max)
                        {
                            max = distance;
                        }

                    }
                }
                return max;
                //Метод полной связи
            }
            return;
        case 7:
            {
                let average = 0;

                for (let i = 0; i < currentClasters[first].length; i++)
                {
                    for (let j = 0; j < currentClasters[second].length; j++)
                    {
                        let distance = solveDistance(currentClasters[first][i], currentClasters[second][j], 0);

                        average += distance;
                    }
                }
                return average/(currentClasters[first].length * currentClasters[second].length);
                //Метод средней связи

            }
            return;
        case 8:
            {
                let distanceCentroids;
                
                let centroidFirst = {
                    x: 0,
                    y: 0,
                };

                let centroidSecond = {
                    x: 0,
                    y: 0,
                };

                for (let i = 0; i < currentClasters[first].length; i++)
                {
                    centroidFirst.x += currentClasters[first][i].x;
                    centroidFirst.y += currentClasters[first][i].y;

                }

                centroidFirst.x /= currentClasters[first].length;
                centroidFirst.y /= currentClasters[first].length;

                for (let j = 0; j < currentClasters[second].length; j++)
                {
                    centroidSecond.x += currentClasters[second][j].x;
                    centroidSecond.y += currentClasters[second][j].y;

                }

                centroidSecond.x /= currentClasters[second].length;
                centroidSecond.y /= currentClasters[second].length;

                distanceCentroids = solveDistance(centroidFirst, centroidSecond, 0);
                return distanceCentroids;
                //Центроидный метод
            }
            return distanceCentroids;
        case 9:
            let distanceCentroids;
            {

                let centroidFirst = {
                    x: 0,
                    y: 0,
                };

                let centroidSecond = {
                    x: 0,
                    y: 0,
                };

                for (let i = 0; i < currentClasters[first].length; i++)
                {
                    centroidFirst.x += currentClasters[first][i].x;
                    centroidFirst.y += currentClasters[first][i].y;

                }

                centroidFirst.x /= currentClasters[first].length;
                centroidFirst.y /= currentClasters[first].length;

                for (let j = 0; j < currentClasters[second].length; j++)
                {
                    centroidSecond.x += currentClasters[second][j].x;
                    centroidSecond.y += currentClasters[second][j].y;

                }

                centroidSecond.x /= currentClasters[second].length;
                centroidSecond.y /= currentClasters[second].length;

                distanceCentroids = solveDistance(centroidFirst, centroidSecond, 0);
                distanceCentroids *= ((currentClasters[first].length*currentClasters[second].length)/(currentClasters[first].length+currentClasters[second].length));
                return distanceCentroids;
                //Метод Уорда
            }
            return distanceCentroids;
        default:
            break;
    }
}

function makeMatrixOfLengthes(currentClasters, color)
{
    let matrixes = new Array(currentClasters.length);

    for (let i = 0; i < currentClasters.length; i++)
    {
        matrixes[i] = new Array(currentClasters.length);

        for (let j = 0; j < currentClasters.length; j++)
        {
            if (j == i)
            {
                matrixes[i][j] = Infinity;
            }
            else
            {
                matrixes[i][j] = findDistance(i, j, currentClasters, color);
            }

        }
    }

    return matrixes;

}

function hierarchicalClustering(color, k)
{
    let currentClasters = new Array(vertexes.length);

    for (let i = 0; i < vertexes.length; i++)
    {
        currentClasters[i] = [vertexes[i]];
    }

    while (true)
    {
        let matrixes = makeMatrixOfLengthes(currentClasters, color);
        let jNear = new Array(matrixes.length);

        for (let i = 0; i < matrixes.length; i++)
        {
            let minDistanceBetweenClusters = Infinity;

            for (let j = 0; j < matrixes[i].length; j++)
            {
                if (minDistanceBetweenClusters > matrixes[i][j])
                {
                    minDistanceBetweenClusters = matrixes[i][j];
                    jNear[i] = j;
                }
            }
        }

        let newCurrentClasters = [];
        let connectedVertexes = new Array(currentClasters.length).fill(0);
        let size = currentClasters.length;

        for (let i = 0; i < currentClasters.length; i++)
        {
            if (size == k)
            {
                for (let j = 0; j < currentClasters.length; j++)
                {
                    if (connectedVertexes[j] == 0)
                    {
                        newCurrentClasters.push(currentClasters[j]);
                        connectedVertexes[j] = 1;
                    }
                }

                return newCurrentClasters;
            }
            else if (connectedVertexes[i] == 0 || connectedVertexes[jNear[i]] == 0)
            {
                if (connectedVertexes[i] == 0 && connectedVertexes[jNear[i]] == 0)
                {
                    let newArray = currentClasters[i].concat(currentClasters[jNear[i]]);
                    newCurrentClasters.push(newArray);
                    size--;
                }
                else if (connectedVertexes[i] == 0)
                {
                    newCurrentClasters.push(currentClasters[i]);
                }
                else if (connectedVertexes[jNear[i]] == 0)
                {
                    newCurrentClasters.push(currentClasters[jNear[i]]);
                }

                connectedVertexes[i] = 1;
                connectedVertexes[jNear[i]] = 1;
            }

        }

        currentClasters = newCurrentClasters;
    }
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

function colorVertex(vertex, numberOfColor, color)
{
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(vertex.x, vertex.y);
    ctx.lineTo(centroids[numberOfColor].x, centroids[numberOfColor].y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI)
    ctx.fillStyle = "black";
    ctx.fill();

}

function colorVertexes(vertex, color)
{
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI)
    ctx.fillStyle = color;
    ctx.fill();
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

document.getElementById("euclidian").addEventListener("click", function()
{
    k = document.getElementById("size").value;
    k = +k;

    if (isCorrectSizeOfField(k))
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        findCentroids (k);
        let clusters = kMeans(0);
        let color = '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase();

        for (let i = 0; i < clusters.length; i++)
        {
            for (let j = 0; j < clusters[i].length; j++)
            {
                colorVertex(clusters[i][j], i, color);
            }
        }
    }
    else
    {
        alert("Размер поля k некорректно");
    }
});

document.getElementById("squareEuclidian").addEventListener("click", function()
{
    k = document.getElementById("size").value;
    k = +k;

    if (isCorrectSizeOfField(k))
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        findCentroids (k);
        let clusters = kMeans(1);
        let color = '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase();

        for (let i = 0; i < clusters.length; i++)
        {
            for (let j = 0; j < clusters[i].length; j++)
            {
                colorVertex(clusters[i][j], i, color);
            }
        }
    }
    else
    {
        alert("Размер поля k некорректно");
    }
});

document.getElementById("manhattan").addEventListener("click", function()
{
    k = document.getElementById("size").value;
    k = +k;

    if (isCorrectSizeOfField(k))
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        findCentroids (k);
        let clusters = kMeans(2);
        let color = '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase();

        for (let i = 0; i < clusters.length; i++)
        {
            for (let j = 0; j < clusters[i].length; j++)
            {
                colorVertex(clusters[i][j], i, color);
            }
        }
    }
    else
    {
        alert("Размер поля k некорректно");
    }
});

document.getElementById("chebyshev").addEventListener("click", function()
{
    k = document.getElementById("size").value;
    k = +k;

    if (isCorrectSizeOfField(k))
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        findCentroids (k);
        let clusters = kMeans(3);
        let color = '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase();

        for (let i = 0; i < clusters.length; i++)
        {
            for (let j = 0; j < clusters[i].length; j++)
            {
                colorVertex(clusters[i][j], i, color);
            }
        }
    }
    else
    {
        alert("Размер поля k некорректно");
    }
});

document.getElementById("pow").addEventListener("click", function()
{
    k = document.getElementById("size").value;
    k = +k;

    if (isCorrectSizeOfField(k))
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        findCentroids (k);
        let clusters = kMeans(4);
        let color = '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase();

        for (let i = 0; i < clusters.length; i++)
        {
            for (let j = 0; j < clusters[i].length; j++)
            {
                colorVertex(clusters[i][j], i, color);
            }
        }
    }
    else
    {
        alert("Размер поля k некорректно");
    }
});

////////////////////////////////////////////

document.getElementById("singleConnection").addEventListener("click", function()
{
    k = document.getElementById("size").value;
    k = +k;

    if (isCorrectSizeOfField(k))
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let clusters = hierarchicalClustering(5, k);

        for (let i = 0; i < clusters.length; i++)
        {
            let color = '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase();
            for (let j = 0; j < clusters[i].length; j++)
            {
                colorVertexes(clusters[i][j], color);
            }
        }
    }
    else
    {
        alert("Размер поля k некорректно");
    }
});

document.getElementById("fullConnection").addEventListener("click", function()
{
    k = document.getElementById("size").value;
    k = +k;

    if (isCorrectSizeOfField(k))
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let clusters = hierarchicalClustering(6, k);

        for (let i = 0; i < clusters.length; i++)
        {
            let color = '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase();
            for (let j = 0; j < clusters[i].length; j++)
            {
                colorVertexes(clusters[i][j], color);
            }
        }
    }
    else
    {
        alert("Размер поля k некорректно");
    }
});

document.getElementById("averageConnection").addEventListener("click", function()
{
    k = document.getElementById("size").value;
    k = +k;

    if (isCorrectSizeOfField(k))
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let clusters = hierarchicalClustering(7, k);

        for (let i = 0; i < clusters.length; i++)
        {
            let color = '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase();
            for (let j = 0; j < clusters[i].length; j++)
            {
                colorVertexes(clusters[i][j], color);
            }
        }
    }
    else
    {
        alert("Размер поля k некорректно");
    }
});

document.getElementById("centroid").addEventListener("click", function()
{
    k = document.getElementById("size").value;
    k = +k;

    if (isCorrectSizeOfField(k))
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let clusters = hierarchicalClustering(8, k);

        for (let i = 0; i < clusters.length; i++)
        {
            let color = '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase();
            for (let j = 0; j < clusters[i].length; j++)
            {
                colorVertexes(clusters[i][j], color);
            }
        }
    }
    else
    {
        alert("Размер поля k некорректно");
    }
});

document.getElementById("ward").addEventListener("click", function()
{
    k = document.getElementById("size").value;
    k = +k;

    if (isCorrectSizeOfField(k))
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let clusters = hierarchicalClustering(9, k);

        for (let i = 0; i < clusters.length; i++)
        {
            let color = '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase();
            for (let j = 0; j < clusters[i].length; j++)
            {
                colorVertexes(clusters[i][j], color);
            }
        }
    }
    else
    {
        alert("Размер поля k некорректно");
    }
});


