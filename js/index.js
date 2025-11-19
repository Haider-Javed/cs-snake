//Game constants and variables
let inputDir = {x: 0, y: 0};
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');
let speed = 5;
let lastPaintTime = 0;
let score = 0;
let snakeArr = [
    {x: 13, y: 15}
];
let food = {x: 6, y: 7}; // Fixed: added 'let' keyword

//Game functions
function main(ctime){
    window.requestAnimationFrame(main);
    if((ctime - lastPaintTime) / 1000 < 1 / speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake){
    // Check collision with self
    for (let i = 1; i < snakeArr.length; i++){
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){ // Fixed: added [0] for y coordinate
            return true;
        }
    }
    // Check collision with wall
    if(snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0){
        return true;
    }
    return false; // Fixed: added return false if no collision
}

function gameEngine(){
    // Update snake position
    for(let i = snakeArr.length - 2; i >= 0; i--){
        snakeArr[i + 1] = {...snakeArr[i]};
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Check if snake ate food
    if(snakeArr[0].x === food.x && snakeArr[0].y === food.y){ // Fixed: corrected condition
        foodSound.play();
        score += 1;
        document.getElementById("scoreBox").innerHTML = "Score: " + score; // Fixed: added document.getElementById
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y}); // Fixed: corrected calculation
        
        let a = 2;
        let b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        }; // Fixed: corrected food generation
    }

    // Check collision
    if(isCollide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();
        inputDir = {x: 0, y: 0};
        alert("Game Over. Press any key to continue");
        snakeArr = [{x: 13, y: 15}]; // Fixed: removed 'let' to reassign global variable
        score = 0;
        document.getElementById("scoreBox").innerHTML = "Score: " + score;
        return;
    }

    // Display the snake and food
    const board = document.getElementById('board'); // Fixed: get board element
    board.innerHTML = "";
    
    // Display snake
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div'); // Fixed: added 'let'
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if(index === 0){
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Display food
    let foodElement = document.createElement('div'); // Fixed: added 'let'
    foodElement.style.gridRowStart = food.y; // Fixed: changed e.y to food.y
    foodElement.style.gridColumnStart = food.x; // Fixed: changed e.x to food.x
    foodElement.classList.add('food');
    board.appendChild(foodElement); // Fixed: changed snakeElement to foodElement
}

// Start the game
window.requestAnimationFrame(main);

// Main logic starts here
window.addEventListener('keydown', e => {
    moveSound.play();
    switch(e.key){
        case "ArrowUp":
            if(inputDir.y !== 1) { // Prevent moving backwards
                inputDir.x = 0;
                inputDir.y = -1;
            }
            break;
        case "ArrowDown":
            if(inputDir.y !== -1) { // Prevent moving backwards
                inputDir.x = 0;
                inputDir.y = 1;
            }
            break;
        case "ArrowLeft": 
            if(inputDir.x !== 1) { // Prevent moving backwards
                inputDir.x = -1;
                inputDir.y = 0;
            }
            break;
        case "ArrowRight":
            if(inputDir.x !== -1) { // Prevent moving backwards
                inputDir.x = 1;
                inputDir.y = 0;
            }
            break;
        default:
            break;
    }
});