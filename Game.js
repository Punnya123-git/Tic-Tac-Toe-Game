let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnO = true; 
let count = 0; //to track draw

//audio file extracts
const winnerAudio = new Audio("winningAudio.wav");
const drawAudio = new Audio("drawAudio.wav");
const clickAudio = new Audio("clickAudio.wav");

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

const resetGame = () => {
    stopSounds();
    turnO = true;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        clickAudio.play();

        //to reset color x->red o->black
        box.classList.remove("x", "o");

        if(turnO){ // if player O have 1st chance
            box.innerText = "O";
            box.classList.add("o");
            turnO = false;
        }
        else{ // thn player X
            box.innerText = "X";
            box.classList.add("x");
            turnO = true;
        }
        box.disabled = true;
        count++;

        //check if we got a winner
        let isWinner = checkWinner();

        if(isWinner){
            return;
        }

        if(count === 9){
            drawGame();
        }

    });
});

const drawGame = async () => {
    drawAudio.play();
    await delay(2000);
    msg.innerText = `Game was draw!`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const disableBoxes = () => {
    for(let box of boxes){
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for(let box of boxes){
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("win");
        box.classList.remove("x");
        box.classList.remove("o");
        
    }
};

//display winner function
const showWinner = async (winner) => {
    disableBoxes();

    celebrate();
    winnerAudio.play();
    let done = await delay(2000);

    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");    
};


const checkWinner = () => {
    for(let pattern of winPatterns){
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if(pos1Val!="" && pos2Val!="" && pos3Val!=""){
            if(pos1Val === pos2Val && pos2Val === pos3Val){
                console.log("WINNER!", pos1Val);
                boxes[pattern[0]].classList.add("win");
                boxes[pattern[1]].classList.add("win");
                boxes[pattern[2]].classList.add("win");
                showWinner(pos1Val);
                return true;
            }
        }
    }
    return false;
};

const sounds = [winnerAudio, drawAudio , clickAudio  ];

//stop the sound when interupted
const stopSounds = () => {
    sounds.forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
};

//winnig celebration function
// function celebrate() {
//     confetti({
//         particleCount: 150,
//         spread: 120,
//         origin: { y: 0.6 }
//     });
// }
function celebrate() {
    let duration = 2000;
    let end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            spread: 100,
            origin: { x: Math.random(), y: Math.random() - 0.2 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

//delay function
const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
};


newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);