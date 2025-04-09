// Константы игры
const GRID_SIZE = 20; // Размер одной клетки сетки в пикселях
const GRID_WIDTH = 20; // Количество клеток по ширине
const GRID_HEIGHT = 20; // Количество клеток по высоте
const SNAKE_COLOR = '#00ff00'; // Цвет змейки
const FOOD_COLOR = '#ff0000'; // Цвет еды
const GAME_SPEED = 150; // Начальная скорость игры в мс

// Получаем элементы DOM
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-btn');
const restartButton = document.getElementById('restart-btn');

// Состояние игры
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameInterval;
let gameRunning = false;
let gameOver = false;

// Инициализация игры
function initGame() {
    // Создаем начальную змейку из трех сегментов
    snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
    
    // Сбрасываем направление
    direction = 'right';
    nextDirection = 'right';
    
    // Сбрасываем счет
    score = 0;
    scoreElement.textContent = score;
    
    // Генерируем первую еду
    generateFood();
    
    // Сбрасываем состояние игры
    gameOver = false;
    
    // Отрисовываем начальное состояние
    draw();
}

// Генерация еды в случайном месте
function generateFood() {
    // Генерируем случайные координаты
    let foodX, foodY;
    let foodOnSnake;
    
    do {
        foodOnSnake = false;
        foodX = Math.floor(Math.random() * GRID_WIDTH);
        foodY = Math.floor(Math.random() * GRID_HEIGHT);
        
        // Проверяем, не находится ли еда на змейке
        for (let segment of snake) {
            if (segment.x === foodX && segment.y === foodY) {
                foodOnSnake = true;
                break;
            }
        }
    } while (foodOnSnake);
    
    food = {x: foodX, y: foodY};
}

// Отрисовка игры
function draw() {
    // Очищаем канвас
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем сетку (для пиксельного эффекта)
    drawGrid();
    
    // Рисуем змейку
    drawSnake();
    
    // Рисуем еду
    drawFood();
    
    // Если игра окончена, показываем сообщение
    if (gameOver) {
        drawGameOver();
    }
}

// Отрисовка сетки
function drawGrid() {
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    
    // Вертикальные линии
    for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Горизонтальные линии
    for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Отрисовка змейки
function drawSnake() {
    snake.forEach((segment, index) => {
        // Голова змейки немного светлее
        if (index === 0) {
            ctx.fillStyle = '#00ff00';
        } else {
            ctx.fillStyle = SNAKE_COLOR;
        }
        
        // Рисуем сегмент змейки с небольшим отступом для пиксельного эффекта
        ctx.fillRect(
            segment.x * GRID_SIZE + 1,
            segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );
        
        // Добавляем глаза для головы
        if (index === 0) {
            drawSnakeEyes(segment);
        }
    });
}

// Отрисовка глаз змейки
function drawSnakeEyes(head) {
    ctx.fillStyle = '#000';
    
    // Позиция глаз зависит от направления движения
    switch(direction) {
        case 'up':
            // Левый глаз
            ctx.fillRect(
                head.x * GRID_SIZE + 5,
                head.y * GRID_SIZE + 3,
                3, 3
            );
            // Правый глаз
            ctx.fillRect(
                head.x * GRID_SIZE + GRID_SIZE - 8,
                head.y * GRID_SIZE + 3,
                3, 3
            );
            break;
        case 'down':
            // Левый глаз
            ctx.fillRect(
                head.x * GRID_SIZE + 5,
                head.y * GRID_SIZE + GRID_SIZE - 6,
                3, 3
            );
            // Правый глаз
            ctx.fillRect(
                head.x * GRID_SIZE + GRID_SIZE - 8,
                head.y * GRID_SIZE + GRID_SIZE - 6,
                3, 3
            );
            break;
        case 'left':
            // Левый глаз
            ctx.fillRect(
                head.x * GRID_SIZE + 3,
                head.y * GRID_SIZE + 5,
                3, 3
            );
            // Правый глаз
            ctx.fillRect(
                head.x * GRID_SIZE + 3,
                head.y * GRID_SIZE + GRID_SIZE - 8,
                3, 3
            );
            break;
        case 'right':
            // Левый глаз
            ctx.fillRect(
                head.x * GRID_SIZE + GRID_SIZE - 6,
                head.y * GRID_SIZE + 5,
                3, 3
            );
            // Правый глаз
            ctx.fillRect(
                head.x * GRID_SIZE + GRID_SIZE - 6,
                head.y * GRID_SIZE + GRID_SIZE - 8,
                3, 3
            );
            break;
    }
}

// Отрисовка еды
function drawFood() {
    ctx.fillStyle = FOOD_COLOR;
    
    // Рисуем еду в виде яблока (красный квадрат с зеленым хвостиком)
    ctx.fillRect(
        food.x * GRID_SIZE + 1,
        food.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
    );
    
    // Хвостик яблока
    ctx.fillStyle = '#0f0';
    ctx.fillRect(
        food.x * GRID_SIZE + GRID_SIZE / 2 - 1,
        food.y * GRID_SIZE + 1,
        2, 3
    );
}

// Отрисовка сообщения о конце игры
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ff0000';
    ctx.font = '30px "Courier New", Courier, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ИГРА ОКОНЧЕНА', canvas.width / 2, canvas.height / 2 - 15);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px "Courier New", Courier, monospace';
    ctx.fillText(`Счёт: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}

// Обновление состояния игры
function update() {
    // Если игра окончена, не обновляем
    if (gameOver) return;
    
    // Обновляем направление
    direction = nextDirection;
    
    // Получаем координаты головы
    const head = {...snake[0]};
    
    // Обновляем координаты головы в зависимости от направления
    switch(direction) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }
    
    // Проверяем столкновение со стеной
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
        gameOver = true;
        stopGame();
        draw();
        return;
    }
    
    // Проверяем столкновение с самой собой
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            stopGame();
            draw();
            return;
        }
    }
    
    // Добавляем новую голову в начало массива
    snake.unshift(head);
    
    // Проверяем, съела ли змейка еду
    if (head.x === food.x && head.y === food.y) {
        // Увеличиваем счет
        score += 10;
        scoreElement.textContent = score;
        
        // Генерируем новую еду
        generateFood();
        
        // Увеличиваем скорость игры каждые 50 очков
        if (score % 50 === 0 && GAME_SPEED > 50) {
            stopGame();
            startGame(GAME_SPEED - 10);
        }
    } else {
        // Если змейка не съела еду, удаляем последний сегмент
        snake.pop();
    }
    
    // Перерисовываем игру
    draw();
}

// Запуск игры
function startGame(speed = GAME_SPEED) {
    if (!gameRunning) {
        gameRunning = true;
        gameInterval = setInterval(update, speed);
    }
}

// Остановка игры
function stopGame() {
    clearInterval(gameInterval);
    gameRunning = false;
}

// Обработка нажатий клавиш
function handleKeyDown(e) {
    // Предотвращаем обработку клавиш, если игра не запущена
    if (!gameRunning) return;
    
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction !== 'left') nextDirection = 'right';
            break;
        case 'p':
        case 'P':
            // Пауза/продолжение игры
            if (gameRunning) {
                stopGame();
            } else if (!gameOver) {
                startGame();
            }
            break;
    }
}

// Инициализация событий
function initEvents() {
    // Обработка нажатий клавиш
    document.addEventListener('keydown', handleKeyDown);
    
    // Обработка нажатия кнопки "Начать игру"
    startButton.addEventListener('click', () => {
        if (!gameRunning && !gameOver) {
            startGame();
        } else if (gameOver) {
            initGame();
            startGame();
        }
    });
    
    // Обработка нажатия кнопки "Перезапустить"
    restartButton.addEventListener('click', () => {
        stopGame();
        initGame();
    });
}

// Инициализация игры при загрузке страницы
window.onload = function() {
    initGame();
    initEvents();
};