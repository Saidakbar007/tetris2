// index.js
import { shapes } from './shapes.js';  // Импортируем объект shapes

// Функция для отрисовки игрового поля
function drawTetrisPlayground(x, y, target) {
    if (x <= 0 || y <= 0) throw new Error('x and y cannot be negative');
    if (target.children.length) throw new Error('Aborted: target element should be empty');

    for (let rowCount = 0; rowCount < y; rowCount++) {
        const row = document.createElement('div');
        row.className = 'row';
        row.dataset['row'] = rowCount;

        for (let cellsCount = 0; cellsCount < x; cellsCount++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset['cell'] = cellsCount;
            row.append(cell);
        }
        target.append(row);
    }
}

const tetrisPlaygroundTarget = document.querySelector('.tetris-playground');

// Проверяем и рисуем игровое поле
try {
    drawTetrisPlayground(10, 20, tetrisPlaygroundTarget);
} catch (e) {
    console.log(e.message);
}

// Выбираем случайную фигуру
const shapeKeys = Object.keys(shapes);
const shapeKeyIndex = Math.floor(Math.random() * shapeKeys.length);
const shapeKey = shapeKeys[shapeKeyIndex];
const currentShape = shapes[shapeKey];

// Начальная форма
currentShape.shape = rotateShape(currentShape.shape);

// Функция отрисовки фигуры
function renderShape() {
    removePreviousShape();  // Убираем предыдущую фигуру

    const rowsToColor = currentShape.shape.length;
    const cellsToColor = currentShape.shape[0].length;

    // Проходим по строкам и ячейкам
    for (let rowIndex = 0; rowIndex < rowsToColor; rowIndex++) {
        const row = tetrisPlaygroundTarget.children[rowIndex];

        for (let cellIndex = 0; cellIndex < cellsToColor; cellIndex++) {
            const cell = row.children[cellIndex];
            if (currentShape.shape[rowIndex][cellIndex]) {
                cell.style.backgroundColor = currentShape.color;  // Закрашиваем ячейку
            } else {
                cell.style.backgroundColor = '';  // Сбрасываем цвет для пустых ячеек
            }
        }
    }
}

// Функция поворота фигуры
function rotateShape(shape) {
    // Поворачиваем квадратную форму 2x2 без изменений
    if (shape.length === 2 && shape[0].length === 2) return shape;

    const rotatedShape = [];

    // Создаем пустую матрицу для поворота
    for (let rows = 0; rows < shape[0].length; rows++) {
        const row = [];
        rotatedShape.push(row);
    }

    // Заполняем новую матрицу, поворачивая на 90 градусов
    for (let i = shape.length - 1, k = 0; i >= 0; i--, k++) {
        for (let j = 0; j < shape[0].length; j++) {
            rotatedShape[j][k] = shape[i][j];
        }
    }
    return rotatedShape;  // Возвращаем повёрнутую фигуру
}

// Убираем предыдущую фигуру с игрового поля
function removePreviousShape() {
    Array.from(tetrisPlaygroundTarget.children).forEach(row => {
        Array.from(row.children).forEach(cell => {
            cell.style.backgroundColor = '';  // Сбрасываем цвет всех ячеек
        });
    });
}

// Обработчик события для поворота фигуры
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        currentShape.shape = rotateShape(currentShape.shape);  // Поворачиваем фигуру
        renderShape();  // Отображаем измененную фигуру
    }
});

// Отображаем начальную фигуру
renderShape();



//[              [
//[0, 1, 1],         [1, 0],
//[1, 1, 0]          [1, 1],
//]                  [0, 1],
//]              ]