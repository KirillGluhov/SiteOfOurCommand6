let button = document.querySelector('.buttonOfSave');
let table = document.querySelector('table');
table.hidden = true;




let titles = document.querySelectorAll('.title');

for(let title = 0; title < titles.length; title++) {
    titles[title].hidden = true;
}


button.onclick = function () {


    //появление заголовков по нажатию
    for(let title = 0; title < titles.length; title++) {
        titles[title].hidden = false;
    }
    

    let text = document.querySelector('.textArea').value;
    let textArea = '';



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






    //data - готовый объект в формате csv //

    let data = dataArray;
    //console.log(data);





    // ДЛЯ ТАБЛИЦЫ //

    //получение заголовков //

    let headers = data[0];
    headers = Object.getOwnPropertyNames(headers);
    // console.log(headers);





    //получение всех ключей из заданного массива //

    let valueOfHeaders = [];

    for (let i = 0; i < data.length; i++) {
        let tmp = data[i];

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


    for(let i = 0; i < heightOfTable; i++) {

        let tr = document.createElement('tr'); //создаём tr

        for(let j = 0; j < headers.length; j++) {

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






    let data_exs = {
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
    
    let treeList = document.querySelector('.treeList');
    createTree(treeList, data_exs);
    
}










