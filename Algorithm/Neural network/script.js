

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function DCanvas(el) {
    const ctx = el.getContext('2d');
    const pixel = 20;

    let is_mouse_down = false;

    canv.width = 500;
    canv.height = 500;

    this.drawLine = function (x1, y1, x2, y2, color = 'gray') {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineJoin = 'miter';
        ctx.lineWidth = 1;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    this.drawCell = function (x, y, w, h) {
        ctx.fillStyle = 'blue';
        ctx.strokeStyle = 'blue';
        ctx.lineJoin = 'miter';
        ctx.lineWidth = 1;
        ctx.rect(x, y, w, h);
        ctx.fill();
    }

    this.clear = function () {
        ctx.clearRect(0, 0, canv.width, canv.height);
    }

    this.drawGrid = function () {
        const w = canv.width;
        const h = canv.height;
        const p = w / pixel;

        const xStep = w / p;
        const yStep = h / p;

        for (let x = 0; x < w; x += xStep) {
            this.drawLine(x, 0, x, h);
        }

        for (let y = 0; y < h; y += yStep) {
            this.drawLine(0, y, w, y);
        }
    }

    this.calculate = function (draw = false) {
        const w = canv.width;
        const h = canv.height;
        const p = w / pixel;

        const xStep = w / p;
        const yStep = h / p;

        const vector = [];
        let __draw = [];

        for (let x = 0; x < w; x += xStep) {
            for (let y = 0; y < h; y += yStep) {
                const data = ctx.getImageData(x, y, xStep, yStep);

                let nonEmptyPixelsCount = 0;
                for (i = 0; i < data.data.length; i += 10) {
                    const isEmpty = data.data[i] === 0;

                    if (!isEmpty) {
                        nonEmptyPixelsCount += 1;
                    }
                }

                if (nonEmptyPixelsCount > 1 && draw) {
                    __draw.push([x, y, xStep, yStep]);
                }

                vector.push(nonEmptyPixelsCount > 1 ? 1 : 0);
            }
        }

        if (draw) {
            this.clear();
            this.drawGrid();

            for (_d in __draw) {
                this.drawCell(__draw[_d][0], __draw[_d][1], __draw[_d][2], __draw[_d][3]);
            }
        }

        return vector;
    }

    el.addEventListener('mousedown', function (e) {
        is_mouse_down = true;
        ctx.beginPath();
    })

    el.addEventListener('mouseup', function (e) {
        is_mouse_down = false;
    })

    el.addEventListener('mousemove', function (e) {
        if (is_mouse_down) {
            ctx.fillStyle = 'red';
            ctx.strokeStyle = 'red';
            ctx.lineWidth = pixel;

            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(e.offsetX, e.offsetY, pixel / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }
    })
}

let vector = [];
const d = new DCanvas(document.getElementById('canv'));

//train
let net = new brain.NeuralNetwork();
net.train(train_data, { log: true });



document.addEventListener('keypress', function (e) {
    if (e.key.toLowerCase() === 'c') {
        d.clear();
    }
    else
        if (e.key.toLowerCase() === 'b') {

            //const result = brain.likely(d.calculate(), net);
            const result = net.run(d.calculate(true));
            let dd = document.querySelector('.dd');
            // dd.innerHTML = Object.values(result);
            let val = Object.values(result);
            let maxInd = -1
            let maxValue = -1
            let st = '';
            for (let i = 0; i < val.length; i++) {
                let full = val[i].toFixed(2);
                console.log(full);
                let full_procent = val[i] * 100;
                let empty = 1 - full;
                let empty_procent = 100 - full_procent;

                if(val[i]>maxValue){
                    maxValue = val[i];
                    maxInd = i;
                }

                st += `<div class="probabilities">
                    <div class="numbers">${i}</div> 
                    <div class="crossbar"><div class="true" style="width: ${full_procent}%"></div><div class="true">${full}</div><div class="false" style="width: ${empty_procent}%"></div></div>
                    </div>`;
            }
            
            dd.innerHTML = `<div class="predict">Скорее всего, ваша цифра... это....     вот эта:..<span style="font-size: 30px;color: green">${maxInd}</span></div>` + st;




            //<div class="val">${values[i]}</div>
        }
        else {
            vector = d.calculate(false);
            switch (e.key) {

                case '1':
                    //train
                    train_data.push({
                        input: vector,
                        output: { 1: 1 }
                    })
                    break

                case '2':
                    //train
                    train_data.push({
                        input: vector,
                        output: { 2: 1 }
                    })
                    break

                case '3':
                    //train
                    train_data.push({
                        input: vector,
                        output: { 3: 1 }
                    })
                    break

                case '4':
                    //train
                    train_data.push({
                        input: vector,
                        output: { 4: 1 }
                    })
                    break

                case '5':
                    //train
                    train_data.push({
                        input: vector,
                        output: { 5: 1 }
                    })
                    break

                case '6':
                    //train
                    train_data.push({
                        input: vector,
                        output: { 6: 1 }
                    })
                    break

                case '7':
                    //train
                    train_data.push({
                        input: vector,
                        output: { 7: 1 }
                    })
                    break

                case '8':
                    //train
                    train_data.push({
                        input: vector,
                        output: { 8: 1 }
                    })
                    break

                case '9':
                    //train
                    train_data.push({
                        input: vector,
                        output: { 9: 1 }
                    })
                    break

                case '0':
                    //train
                    train_data.push({
                        input: vector,
                        output: { 0: 1 }
                    })
                    break

                case 'j':
                    //train
                    jsonData = JSON.stringify(train_data)
                    download(jsonData, 'json.txt', 'text/plain');
                    console.log(train_data)
                    break
            }
        }
})