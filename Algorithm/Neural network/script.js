

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function DCanvas(el) {
    const ctx = el.getContext('2d');
    const pixel = 10;

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
let net = new brain.NeuralNetwork();


function addNet(input) {

    let reader = new FileReader();

    reader.onload = (event) => {
        netJson = JSON.parse(event.target.result);
        net = new brain.NeuralNetwork().fromJSON(netJson);
        }

    reader.readAsText(input.files[0]);

}



document.addEventListener('keypress', function (e) {
    if (e.key.toLowerCase() === 'c') {
        d.clear();
    }
    else if (e.key.toLowerCase() === 'b') {

        const result = net.run(d.calculate(true));
        let dd = document.querySelector('.dd');
        // dd.innerHTML = Object.values(result);
        let val = Object.values(result);
        let maxInd = -1
        let maxValue = -1
        let st = '';
        for (let i = 0; i < val.length; i++) {
            let full = val[i].toFixed(2);
            let full_procent = val[i] * 100;
            let empty_procent = 100 - full_procent;

            if (val[i] > maxValue) {
                maxValue = val[i];
                maxInd = i;
            }

            st += `<div class="probabilities">
                    <div class="numbers">${i}</div> 
                    <div class="crossbar"><div class="true" style="width: ${full_procent}%"></div><div class="true">${full}</div><div class="false" style="width: ${empty_procent}%"></div></div>
                    </div>`;
        }

        dd.innerHTML = `<div class="predict">Скорее всего, ваша цифра... это....     вот эта:..<span style="font-size: 30px;color: green">${maxInd}</span></div>` + st;

    }
    else if (e.key.toLowerCase() === 'j') {
        jsonData = JSON.stringify(train_data)
        jsonNet = JSON.stringify(net)
        download(jsonData, 'jsonData.txt', 'text/plain');
        download(jsonNet, 'jsonNet.json', 'text/plain');
    }
    else if (/[0-9]/.test(e.key)) {
        vector = d.calculate(false);
        // train
        train_data.push({
            input: vector,
            output: { [e.key]: 1 }
        });
        d.clear();
    }
})