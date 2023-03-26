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

let height;
let width;

allButtons.confirm.addEventListener("click", function()
{
    height = document.getElementById("sizeOfHeight").value;
    width = document.getElementById("sizeOfWidth").value;

    height = +height;
    width = +width;

    if (isCorrectSizeOfField(height) && isCorrectSizeOfField(width))
    {
        const table = document.createElement('table');
        document.body.appendChild(table);

        for (let i = 0; i < height; i++) 
        {
            const row = document.createElement('tr');

            for (let j = 0; j < width; j++) 
            {
              const cell = document.createElement('td');
              const newLabel = document.createElement("label");
              const checkbox = document.createElement('input');

              checkbox.type = 'checkbox';
              checkbox.id = `checkbox_${i}_${j}`;
              checkbox.name = `checkbox_${i}_${j}`;

              newLabel.className = "checkbox";
              newLabel.id = `label_${i}_${j}`

              newLabel.appendChild(checkbox);

              cell.appendChild(newLabel);
              row.appendChild(cell);
            }
            table.appendChild(row);
        }

        const newButton = document.createElement("button");
        newButton.className = "confirm";
        newButton.id = "confirmOfInputPixels";
        newButton.textContent = "Подтвердить ввод клеток-стен лабиринта"
        document.body.appendChild(newButton);

        let isPush = document.getElementById("confirmOfInputPixels");

        isPush.addEventListener("click", function()
        {
            let allValuesOfCells = [];
            for (let i = 0; i < height; i++)
            {
                allValuesOfCells[i] = [];

                for (let j = 0; j < width; j++)
                {

                    if (document.getElementById(`checkbox_${i}_${j}`).checked)
                    {
                        allValuesOfCells[i][j] = 1;

                    }
                    else
                    {
                        allValuesOfCells[i][j] = 0;
                    }
                }

            }

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