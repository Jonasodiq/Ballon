// ordballong - mall 

/* setup
------------------------ */
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");


/* klasser för att skapa objekt
------------------------ */
ctx.font = "3rem Gerorgia";
ctx.fillStyle = "white";
ctx.fillText("Stava rätt och få poäng!", 200, 200, 500);

class Ballon {
    constructor(word) {
        this.word = word;
        this.radius = this.word.length * 10;
        this.x = getRandomBetween(100, canvas.width - 100);
        this.y = canvas.height + this.radius;
        this.vy = -1;
    }
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + 100);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "yellow";
        ctx.fill();
    }

    displayText() {
        ctx.font = "30px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.word, this.x, this.y, this.radius * 2);
    }
    move() {
        this.y += this.vy;
        this.draw();
        this.displayText();
    }
}

/* initiera, globala variabler
------------------------ */

// ord i spelet
let words = ["grön", "glad", "vår", "sol", "sommar", "val", "himmel", "träd", "vatten", "ballong", "ledsen", "snygg", "päron", "kaka", "äpple", "klockan", "vinter", "mobile", "barn", "docka", "slut"];
// array
let ballons = [];

// godkända tecken
let chars = "abcdefghijklmnopqrstuvwxyzåäöABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";

// unikt id för varje frame i animationen
let frameId;

let word = words.pop();

// text som skrivs
let text = "";

// slumpa ordföljden
shuffleArray(words);

//poäng
let score = 0;

/* händelselyssnare ------------------------ */

startButton.addEventListener("click", function () {

    // starta spel
    nextFrame();

    // inaktivera knapp
    startButton.setAttribute("disabled", true);
    spawnBallon();
})

stopButton.addEventListener("click", function () {

    // pausa spel
    cancelAnimationFrame(frameId);

    // aktivera åter startknappen
    startButton.removeAttribute("disabled");
})
// tangent
document.addEventListener("keydown", getKeyDown, false);


/* funktioner------------------------ */

function getKeyDown(event) {
    //console.log(event);

    if (chars.indexOf(event.key) >= 0) {
        text += event.key;
    }
    if (event.code === "Enter" && text.length > 0) {
    // anropa en funktion som kontrollera om texten finns i en ordballong
        checkBallonMatch(text);
        text = "";
    }
    if (event.code === "Backspace") {
        // radera sista tecknet i variabeln text
        text = text.substring(0, text.length - 1);
    }
}

// animering, game loop
function nextFrame() {

    frameId = requestAnimationFrame(nextFrame);

    // radera innehåll från föregående frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // anropa metoder och funktioner:
    renderBallons();
    
    spawnBallon();
    
    renderText();

    renderScore();
}

function checkBallonMatch(text) {
    ballons.forEach(ballon => {

        if (ballon.word === text) {
            ballon.word = "";
            score += 1;
            ballon.vy -= 2;
            playSound("katching.mp3")
        }
    })
}

function renderBallons() {
    ballons.forEach(ballon => {
    ballon.move();
    }) 
}

function spawnBallon() {
    if (words.length > 0) {

        if (frameId % 240 === 0) {
            let word = words.pop();
            let ballon = new Ballon(word);
            ballons.push(ballon); 
        }   
    }

    else {
        cancelAnimationFrame(frameId);
        renderResult();
    }
}

function renderText() {
    ctx.font = "50px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width);
}

function renderScore() {
    ctx.font = "50px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(score, 730, 100, canvas.width);
}

function renderResult() {
    ctx.font = "50px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("Antal poäng: " +score, canvas.width / 2, canvas.height / 2, canvas.width);
}

// ljud
function playSound(file) {
    let audio = new Audio ();
    audio.src = file;
    audio.play();
}


// slumpa ett tal mellan två värden
function getRandomBetween(min, max) {

    // returnera heltal
    return Math.floor(Math.random() * (max - min) + min);

}
// algoritm shuffleArray
function shuffleArray(array) {

    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}