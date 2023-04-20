// let data = [
//     { 'Я': '1', 'Маша': '2', 'Полина': '3' },
//     { 'Я': '4', 'Маша': '5', 'Полина': '6' }
// ];


// class Node {
//     constructor(value, left = null, right = null) {
//         this.value = value;
//         this.left = left;
//         this.right = right;
//     }
// }

// class BinaryTree {
//     constructor() {
//         this.root = null;
//     }

//     insert(value) {
//         const newNode = new Node(value);

//         if (!this.root) {
//             this.root = newNode;
//             return;
//         }

//         let currentNode = this.root;

//         while (currentNode) {
//             if (value < currentNode.value) {
//                 if (!currentNode.left) {
//                     currentNode.left = newNode;
//                     break;
//                 } else {
//                     currentNode = currentNode.left;
//                 }
//             } else {
//                 if (!currentNode.right) {
//                     currentNode.right = newNode;
//                     break;
//                 } else {
//                     currentNode = currentNode.right;
//                 }
//             }
//         }
//     }
// }

class El {
    constructor(t, l) {
        this.text = t;
        this.level = l;
        this.x;
        this.y;
        this.child = [];
    }
}



// Дерево (не пошло)
// let elements = [];
// let iEl = 0;

// // let str = '';//Будет содержать в себе дерево элементов


// function DOM_Tree(el, l) {
//     //l - уровень элемента
//     //el - уровень элемента
//     if ((el == '[object Text]' && el.data < 32) || el == '[object Comment]') {
//         return;
//     }
//     // текст элмента
//     t = el == '[object Text]' ? el.data : el.tagName;

//     let curEL = iEl++;
//     elements[curEL] = new El(t, l);

//     if (el.childNodes.length == 0 || el.tagName == 'SCRIPT') {
//         return;
//     }

//     else {
//         let iChild = 0;
//         for (let i = 0; i < el.childNodes.length; i++) {
//             if (!(el.childNodes[i] == '[object Text]' && el.childNodes[i].data < 32)) {
//                 elements[curEL].child[iChild++] = iEl;
//             }
//             DOM_Tree(el.childNodes[i], l + 1);
//         }
//     }
// }

// Дерево (не пошло)
// let sometext = document.querySelector('.sometext');
// DOM_Tree(sometext, 0);
// let tree = document.querySelector('.tree');
// // console.log(elements);
// str = '';
// // for (let i = 0; i < elements.length; i++) {
// //     for (let j = 0; j < elements[i].level; j++) {
// //         str += '&nbsp;&nbsp;';
// //     }
// //     str += elements[i].text + '<br>'
// // }
// // console.log(str);






// //убрал '  position:absolute;'
// let sStyleSheet = '<style>' +
//     '.block {' +
//     '  border:solid 1px;' +
//     '  text-align:center;' +
//     '  position:absolute;' +
//     '  width:80px;' +
//     '  height:50px;' +
//     '}' +
//     '.line {' +
//     '  border-left:solid 1px;' +
//     '  position: absolute;' +
//     '  border-top:solid 1px;' +
//     '}' +
//     '</style>';

// str = str + sStyleSheet;








// //Функция вывода блока
// //x,y - координата; s - строка внутри блока
// function blockDraw(x, y, s) {
//     let sTemp = '<table class = "block" style = "left:' +
//         (x - 40) +//Вставка координаты x
//         'px;top:' +
//         y +//Вставка координаты y
//         'px;"><td>' +
//         s +//Вставка текста
//         '</td></table>';
//     // console.log(sTemp);
//     str += sTemp;
// }







// //Функция рисует линию от (x1;y1) до (x2;y2)
// function lineDraw(x1, y1, x2, y2) {
//     let sTemp = '<span class = "line" style = "left:' +
//         (x1 < x2 ? x1 : x2) +
//         'px;top:' +
//         (y1 < y2 ? y1 : y2) +
//         'px;height:' +
//         Math.abs(y2 - y1) +
//         'px;width:' +
//         Math.abs(x2 - x1) +
//         'px;"></span>';

//     str += sTemp;
// }

// // blockDraw(100, 20, "hello");
// // lineDraw(100,70,100,85);





// //Функция нахождения максимального количества дочерних элементов на одном уровне
// function maxEl(iEl) {
//     let num = 0;
//     if (elements[iEl].child.length == 0)
//         num = 1
//     else {
//         for (var i = 0; i < elements[iEl].child.length; i++)
//             num += maxEl(elements[iEl].child[i]);
//     }
//     return num;
// }





// //Функция заполняет координатами элементы массива элементов
// function calcCoords(iEl, leftBorder) {
//     let mEl = maxEl(iEl);//Макс количество элементов на уровне
//     if (mEl == 0)
//         elements[iEl].x = leftBorder + 50
//     else
//         elements[iEl].x = mEl * 100 / 2 + leftBorder;
//     elements[iEl].y = elements[iEl].level * 80 + 20;
//     if (elements[iEl].child.length > 0) {
//         let lB = leftBorder;
//         for (let i = 0; i < elements[iEl].child.length; i++) {
//             calcCoords(elements[iEl].child[i], lB);
//             lB = lB + maxEl(elements[iEl].child[i]) * 100;
//         }
//     };
// }

// calcCoords(0, 0);







// //Функция соединяет линиями блоки элементов
// function lineConnect(iEl) {
//     //Если нет предков, то выходим
//     if (elements[iEl].child.length == 0) return;
//     //Рисуем линии к каждому предку
//     for (let i = 0; i < elements[iEl].child.length; i++) {
//         let x1, y1, x2, y2;
//         x1 = elements[iEl].x;
//         y1 = elements[iEl].y + 50;
//         x2 = x1;
//         y2 = y1 + 15;
//         lineDraw(x1, y1, x2, y2);
//         y1 = y2;
//         x2 = elements[elements[iEl].child[i]].x;
//         lineDraw(x1, y1, x2, y2);
//         x1 = x2;
//         y2 = elements[elements[iEl].child[i]].y;
//         lineDraw(x1, y1, x2, y2);
//     }
// }





// //Функция соединяет линиями блоки элементов
// function lineConnect(iEl) {
//     //Если нет предков, то выходим
//     if (elements[iEl].child.length == 0) return;
//     //Рисуем линии к каждому предку
//     for (var i = 0; i < elements[iEl].child.length; i++) {
//         var x1, y1, x2, y2;
//         x1 = elements[iEl].x;
//         y1 = elements[iEl].y + 50;
//         x2 = x1;
//         y2 = y1 + 15;
//         lineDraw(x1, y1, x2, y2)
//         y1 = y2;
//         x2 = elements[elements[iEl].child[i]].x;
//         lineDraw(x1, y1, x2, y2)
//         x1 = x2;
//         y2 = elements[elements[iEl].child[i]].y;
//         lineDraw(x1, y1, x2, y2)
//     }
// }


// for (var i = 0; i < elements.length; i++) {
//     blockDraw(elements[i].x, elements[i].y, elements[i].text);
//     lineConnect(i);
// }

// tree.innerHTML = str;






// let addClases = document.querySelector('.tree');
// let div = document.createElement('div');
// div.className = "tableHere";
// addClases.appendChild(div);


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





function build_tree(data) {

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
                if (data[j][headers[h]] <= value) {
                    left.push([j, data[j][headers[headers.length - 1]]])
                }
                else right.push([j, data[j][headers[headers.length - 1]]])
                all_data.push([j, data[j][headers[headers.length - 1]]])
            }

            if (left.length == 0 || right.length == 0) continue

            gain = informationGain(all_data, left, right)
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
                question = `${headers[h]}<=${value}?`;
            }

        }
    }



    best_left = [];
    best_right = [];

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
let data =
    build_tree(
        [
            { 'age': '50', 'ap_hi': '110', 'cardio': '0' },
            { 'age': '55', 'ap_hi': '120', 'cardio': '0' },
            { 'age': '60', 'ap_hi': '130', 'cardio': '1' },
            { 'age': '65', 'ap_hi': '140', 'cardio': '2' },
        ]
    )



/*
let data = {
    "Рыбы": {
        "форель": {},
        "лосось": {}
    },

    "Деревья": {
        "Огромные": {
            "секвойя": {},
            "дуб": {}
        },
        "Цветковые": {
            "яблоня": {},
            "магнолия": {}
        }
    }
}
*/

function createTree(container, data) {
    container.append(createTreeDom(data));
}

function createTreeDom(obj) {
    if (!Object.keys(obj).length) return;

    let ul = document.createElement('ul');

    for(let key in obj) {
        let li = document.createElement('li');
        li.innerHTML = key;

        let childrenUl = createTreeDom(obj[key]);
        if (childrenUl) {
            li.append(childrenUl);
        }

        ul.append(li);
    }

    return ul;
}

// let treeList = document.querySelector('.treeList');
// createTree(treeList, data);

let tree = document.querySelector('.tree');
createTree(tree, data);