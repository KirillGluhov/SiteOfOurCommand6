function entropy(data) {
    const counts = {};
    for (let i = 0; i < data.length; i++) {
        const target = data[i][data[i].length - 1];
        if (target in counts) {
            counts[target]++;
        } else {
            counts[target] = 1;
        }
    }
    // Вычисляем энтропию
    let result = 0;
    for (let key in counts) {
        const p = counts[key] / data.length;
        result -= p * Math.log2(p);
    }
    return result;
}

// Функция для вычисления прироста информации
function informationGain(data, left, right) {
    const startEntropy = entropy(data);
    if (startEntropy == 0) { return -1; }
    const leftEntropy = entropy(left);
    const rightEntropy = entropy(right);
    //if (leftEntropy === 0 && rightEntropy === 0) return -1;
    const leftWeight = left.length / data.length;
    const rightWeight = right.length / data.length;
    const result = startEntropy - (leftWeight * leftEntropy) - (rightWeight * rightEntropy);
    return result;
}


function createTree(container, data, dec = null) {
    container.append(createTreeDom(data, dec, "", true));
}

function createTreeDom(obj, dec, dir = "", isChoosen = false) {
    if (!Object.keys(obj).length) return;

    let ul = document.createElement('ul');

    for (let key in obj) {
        let li = document.createElement('li');

        li.innerHTML = key;


        if (key == "YES" && dir == "Left") {
            li.innerHTML = `<p style="color:green">${key}</p>`;
            //li.style = "color:red";
        }
        else if (key == "NO" && dir == "Right") {
            li.innerHTML = `<p style="color:green">${key}</p>`;
            //li.style = "color:red";
        }

        
        let childrenUl;

        if (isChoosen && dec != null) {
            const str = key;
            const match = str.match(/^(\w+)<=(\w+)$/);

            if (match != null) {
                const header = match[1];
                const value = match[2];

                console.log(dec);
                console.log(value);
                console.log(header);
                console.log(dec[header])

                if (Number(dec[header]) <= Number(value)) {
                    childrenUl = createTreeDom(obj[key], dec, "Left", true);

                    //li.classList.add("userDecison");
                }
                else {
                    childrenUl = createTreeDom(obj[key], dec, "Right", true);

                    //li.classList.add("red");
                }
            }
            else if (key == "YES" && dir == "Left") {
                childrenUl = createTreeDom(obj[key], dec, "", true);
            }
            else if(key == "NO" && dir == "Right") {
                childrenUl = createTreeDom(obj[key], dec, "", true);
            }
            else childrenUl = createTreeDom(obj[key], dec, "", false);

        }
        else childrenUl = createTreeDom(obj[key], dec, "", false);

        if (childrenUl) {
            li.append(childrenUl);
        }
        
         ul.append(li);

    }
   
    return ul;
}


function build_tree(_data) {


    let data = _data

    let maxGain = -1;
    let bestSplit = [];

    let question;
    let headers = data[0];
    headers = Object.getOwnPropertyNames(headers);


    if (data.length == 1) return { [`predict = ${data[0][headers[headers.length - 1]]}`]: {} };


    console.log(data);

    for (let h = 0; h < headers.length - 1; h++) {
        for (let i = 0; i < data.length; i++) {

            //console.log(headers[h]);

            let value = data[i][headers[h]];

            // console.log(value);

            let left = []
            let right = []
            let all_data = []

            for (let j = 0; j < data.length; j++) {
                if (Number(data[j][headers[h]]) <= Number(value)) {
                    left.push([j, data[j][headers[headers.length - 1]]])
                }
                else right.push([j, data[j][headers[headers.length - 1]]])
                all_data.push([j, data[j][headers[headers.length - 1]]])
            }

            if (left.length == 0 || right.length == 0) continue

            let gain = informationGain(all_data, left, right)
            if (gain == -1) {
                return { [`predict = ${all_data[0][1]}`]: {} }

                /*
                return {
                    [`${headers[h]}<=${value}?`]: {
                        "YES": {
                            [`predict = ${left[0][1]}`]: {}
                        }
                        ,
                        "NO": {
                            [`predict = ${right[0][1]}`]: {}
                        }
                    }
                }
                */
            }

            if (gain > maxGain) {

                maxGain = gain;
                bestSplit = [left, right]
                question = `${headers[h]}<=${value}`;
            }

        }
    }



    let best_left = [];
    let best_right = [];

    for (let j = 0; j < bestSplit[0].length; j++) {
        best_left.push(data[bestSplit[0][j][0]])
    }
    for (let j = 0; j < bestSplit[1].length; j++) {
        best_right.push(data[bestSplit[1][j][0]])
    }


    console.log(best_left, question)

    return {
        [question]: {
            "YES": build_tree(best_left),
            "NO": build_tree(best_right)
        }
    }

    /*
    return {
        [question]:
            Object.assign(
                {},
                build_tree(best_left),
                build_tree(best_right)
            )
    }
    */
}

// let data =
//     build_tree(
//         [
//             { 'age': '50', 'ap_hi': '110', 'cardio': '0' },
//             { 'age': '55', 'ap_hi': '140', 'cardio': '1' },
//             { 'age': '52', 'ap_hi': '130', 'cardio': '1' },
//             { 'age': '48', 'ap_hi': '150', 'cardio': '1' },
//             { 'age': '48', 'ap_hi': '100', 'cardio': '0' },
//             { 'age': '60', 'ap_hi': '150', 'cardio': '0' }
//         ])


let button = document.querySelector('.buttonOfSave');
let table = document.querySelector('table');
table.hidden = true;

let buttonChose = document.querySelector('.buttonOfSaveChoose');
buttonChose.style.display = "none";


let textAreaInput = document.querySelector('.textAreaChoose');
textAreaInput.style.display = "none";

let titles = document.querySelectorAll('.title');

for (let title = 0; title < titles.length; title++) {
    titles[title].hidden = true;
}

let dataArr;

button.onclick = function () {


    //появление заголовков по нажатию
    for (let title = 0; title < titles.length; title++) {
        titles[title].hidden = false;
    }

    buttonChose.style.display = "block";

    let text = document.querySelector('.textArea').value;
    let textArea = '';

    textAreaInput.style.display = "block";

    //убрать пробелы из строки //
    for (let i = 0; i < text.length; i++) {
        if (text[i] != ' ') {
            textArea += text[i];
        }
    }





    //преобразование строки в таблицу формата csv //

    // Get the value of the textarea
    const csvData = textArea;

    // Parse the CSV data using Papa Parse library
    const parsedData = Papa.parse(csvData, { header: true }).data;

    // Create an array of objects from the parsed CSV data
    const dataArray = parsedData.map(row => {
        const obj = {};
        Object.keys(row).forEach(key => {
            obj[key] = row[key];
        });
        return obj;
    });


    dataArr = dataArray;
    // console.log(data);

    //рисует дерево
    let tree = document.querySelector('.tree');
    createTree(tree, build_tree(dataArr));
    // console.log(build_tree(data));


    // ДЛЯ ТАБЛИЦЫ //

    //получение заголовков //

    let headers = dataArr[0];
    headers = Object.getOwnPropertyNames(headers);
    // console.log(headers);


    //получение всех ключей из заданного массива //

    let valueOfHeaders = [];

    for (let i = 0; i < dataArr.length; i++) {
        let tmp = dataArr[i];

        for (let value of Object.values(tmp)) {
            valueOfHeaders.push(value);
        }
    }
    // console.log(valueOfHeaders);


    //соединения массивов с заголовками и значениями //

    let tableData = headers.concat(valueOfHeaders);
    let heightOfTable = tableData.length / headers.length;
    //console.log(tableData);




    //проверка на пустоту таблицы //
    let isEmpty = document.querySelector('table').innerHTML === "";
    if (isEmpty == false) {
        return;
    }




    //добавление таблицы в документ //

    let div = document.querySelector('table');
    div.hidden = false;
    let table = document.querySelector('.selectionOfData');
    let k = 0; //идёт по всему массиву tableData


    for (let i = 0; i < heightOfTable; i++) {

        let tr = document.createElement('tr'); //создаём tr

        for (let j = 0; j < headers.length; j++) {

            let td = document.createElement('td'); //создаём tr
            td.textContent = tableData[k]; //добавляем значение в td
            tr.appendChild(td);
            k++;
        }

        table.appendChild(tr); //заносим в table готовую таблицу
    }

    //добавление в div таблицы
    div.appendChild(table);


    //подключение стилей для таблицы
    let first_tr = document.querySelector('tr');
    first_tr.style.backgroundColor = 'gray';




    // let data_exs = {
    //     "Рыбы": {
    //         "форель": {},
    //         "лосось": {}
    //     },

    //     "Деревья": {
    //         "Огромные": {
    //             "секвойя": {},
    //             "дуб": {}
    //         },
    //         "Цветковые": {
    //             "яблоня": {},
    //             "магнолия": {}
    //         }
    //     }
    // }

    // function createTree(container, data) {
    //     container.append(createTreeDom(data));
    // }

    // function createTreeDom(obj) {
    //     if (!Object.keys(obj).length) return;

    //     let ul = document.createElement('ul');

    //     for(let key in obj) {
    //         let li = document.createElement('li');
    //         li.innerHTML = key;

    //         let childrenUl = createTreeDom(obj[key]);
    //         if (childrenUl) {
    //             li.append(childrenUl);
    //         }

    //         ul.append(li);
    //     }

    //     return ul;
    // }

    // let treeList = document.querySelector('.treeList');
    // createTree(treeList, data_exs);



}

let dataDec = 0;

buttonChose.onclick = function () {
    let inputDataDec = document.querySelector('.textAreaChoose').value.split(',');
    //let inputDataDecArea = ''
    // console.log(inputDataDeg);


    /*
    //убрать пробелы из строки //
    for (let i = 0; i < inputDataDec.length; i++) {
        if (inputDataDec[i] != ' ') {
            inputDataDecArea += inputDataDec[i];
        }
    }
    */

    let obj = {};
    let headers = dataArr[0];
    headers = Object.getOwnPropertyNames(headers);

    for (let i = 0; i < inputDataDec.length; i++) {
        obj[headers[i]] = inputDataDec[i];
    }
    
    console.log(obj);
    /*
    const csvData = inputDataDecArea;

    // Parse the CSV data using Papa Parse library
    const parsedData = Papa.parse(csvData, { header: true }).data;

    // Create an array of objects from the parsed CSV data
    const dataArray = parsedData.map(row => {
        const obj = {};
        Object.keys(row).forEach(key => {
            obj[key] = row[key];
            });
        return obj;
    });

    */
    

    let tree = document.querySelector('.tree');

    document.querySelector('.tree').innerHTML = "";

    createTree(tree, build_tree(dataArr), obj);
}







