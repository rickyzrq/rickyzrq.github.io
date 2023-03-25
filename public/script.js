import Deck from './deck.js'

const cardSlot1 = document.querySelector('#container-1')
const cardSlot2 = document.querySelector('#container-2')
const cardSlot3 = document.querySelector('#container-3')
const cardSlot4 = document.querySelector('#container-4')

const skipsButton = document.getElementById("next/skip");



//game
let playerScore = 0;
let totalRounds = 4;
let currentRound = 1;
let skipsLeft = 2;

//timer

let timeDifference;
let timer = document.getElementById('timer');
let startTime = Date.now();

//round
let orderOfCards = [0, 1, 2, 3];
let selectedSlot;

let cardValues = [0, 0, 0, 0];

let operations = ['+', '–', '×', '÷'];
let nativeOperations = ['+', '-', '*', '/'];
let orderOfOperations = [0, 0, 0];

let bracketBooleans = [false, false, false, false, false, false, false, false];
let NextSkipBool = false;



const deck = new Deck()
shuffleCards(false);

function setupNewCards() {
    let getCard = (currentRound - 1) * 4
    cardSlot1.appendChild(deck.cards[orderOfCards[0]].getHTML((getCard + 1).toString()))
    cardSlot2.appendChild(deck.cards[orderOfCards[1]].getHTML((getCard + 2).toString()))
    cardSlot3.appendChild(deck.cards[orderOfCards[2]].getHTML((getCard + 3).toString()))
    cardSlot4.appendChild(deck.cards[orderOfCards[3]].getHTML((getCard + 4).toString()))
}

//setup
addEventListenerForInfo();
refreshRounds();
setupNewCards();
addEventListenersForCards();
defineOperations();
calculateCardValues();
calculateAll();

//////
//info eventListeners
function addEventListenerForInfo() {
    const nextSkipButton = document.getElementById('next/skip-container')
    nextSkipButton.addEventListener('click', e => {
        NextSkip();
    }, false)

    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', e => {
        resetValues();
    }, false)
}

function NextSkip() {

    if (NextSkipBool == false) {
        //skip
        if (skipsLeft > 0) {
            console.log("skipped pressed")
            skipsButton.style.color = "white";

            shuffleCards(true)

            skipsLeft--;
            skipsButton.innerHTML = "Skip Round-> " + skipsLeft + "/2";
        }
        if (skipsLeft == 0) {
            skipsButton.style.color = "red";
            skipsButton.classList.remove('hover-class')
        }
    }
    else {
        //next
        console.log("next pressed")
        nextRound();
    }
}

function refreshRounds() {
    let roundsDiv = document.getElementById('remaining-rounds');
    roundsDiv.innerHTML = "Round " + currentRound + "/" + totalRounds
}

function resetValues() {

    //reset operations
    orderOfOperations = [0, 0, 0];
    defineOperations();

    //
    //reset brackets
    bracketBooleans = [false, false, false, false, false, false, false, false]
    let brackets = document.querySelectorAll('.bracket');
    for (let i = 0; i < brackets.length; i++) {
        brackets[i].classList.remove('show')
    }
}

/////
//drag/drop

const empties = document.querySelectorAll('.card-container');
for (const empty of empties) {
    empty.addEventListener("dragover", dragOver)
    empty.addEventListener("dragenter", dragEnter)
    empty.addEventListener("dragleave", dragLeave)
    empty.addEventListener("drop", dragDrop)
}

function dragStart() {
    let thisParent = this.parentElement.id;
    selectedSlot = convertToChar(thisParent)
    setTimeout(() => this.className = 'invisible', 0);
}
function dragEnd() {
    this.className = 'card'
}
function dragOver(e) {
    e.preventDefault();

}
function dragEnter(e) {
    e.preventDefault();
}
function dragLeave() {

}

function dragDrop() {
    //  selectedSlot
    let swapSlot = convertToChar(this.id)
    swap((selectedSlot - 1), (swapSlot - 1));
    //call function to rearange places
    addEventListenersForCards()
}

function addEventListenersForCards() {
    let getCard = (currentRound - 1) * 4

    const card1 = document.getElementById((getCard + 1).toString());
    const card2 = document.getElementById((getCard + 2).toString());
    const card3 = document.getElementById((getCard + 3).toString());
    const card4 = document.getElementById((getCard + 4).toString());

    card1.addEventListener('dragstart', dragStart)
    card1.addEventListener('dragend', dragEnd)
    card2.addEventListener('dragstart', dragStart)
    card2.addEventListener('dragend', dragEnd)
    card3.addEventListener('dragstart', dragStart)
    card3.addEventListener('dragend', dragEnd)
    card4.addEventListener('dragstart', dragStart)
    card4.addEventListener('dragend', dragEnd)
}

function convertToChar(thisID) {
    const lastChar = thisID.charAt(thisID.length - 1)
    return lastChar
}

function swap(select, swap) {
    var temp = orderOfCards[select];
    orderOfCards[select] = orderOfCards[swap];
    orderOfCards[swap] = temp;
    calculateCardValues();

    cardSlot1.removeChild(cardSlot1.firstElementChild);
    cardSlot2.removeChild(cardSlot2.firstElementChild);
    cardSlot3.removeChild(cardSlot3.firstElementChild);
    cardSlot4.removeChild(cardSlot4.firstElementChild);
    setupNewCards();

    calculateAll()

}

//convert card values to numbers
function calculateCardValues() {
    for (let i = 0; i < 4; i++) {
        let value = deck.cards[orderOfCards[i]].value;
        if (value <= 10) {
            cardValues[i] = value
        }
        else if (value == 'A') {
            cardValues[i] = '1';
        }
        else if (value == 'J') {
            cardValues[i] = '11';
        }
        else if (value == 'Q') {
            cardValues[i] = '12';
        }
        else if (value == 'K') {
            cardValues[i] = '13';
        }
        else {
            console.log("error")
        }
    }
}

//////
//Operations

const operation1 = document.querySelector('.operation-container-1')
const operation2 = document.querySelector('.operation-container-2')
const operation3 = document.querySelector('.operation-container-3')

operation1.addEventListener('click', e => {
    operationChange(0);
}, false)
operation2.addEventListener('click', e => {
    operationChange(1);
}, false)
operation3.addEventListener('click', e => {
    operationChange(2);
}, false)

function operationChange(operationNum) {

    let operationCurrent = orderOfOperations[operationNum]

    if (operationCurrent < 3) operationCurrent++;
    else operationCurrent = 0;
    orderOfOperations[operationNum] = operationCurrent;

    defineOperations()

}

function defineOperations() {
    const operation1 = document.querySelector('.operation-text-1')
    const operation2 = document.querySelector('.operation-text-2')
    const operation3 = document.querySelector('.operation-text-3')

    operation1.textContent = operations[orderOfOperations[0]]
    operation2.textContent = operations[orderOfOperations[1]]
    operation3.textContent = operations[orderOfOperations[2]]

    if (orderOfOperations[0] % 2 == 0) operation1.style.color = 'black'
    else operation1.style.color = 'red'
    if (orderOfOperations[1] % 2 == 0) operation2.style.color = 'black'
    else operation2.style.color = 'red'
    if (orderOfOperations[2] % 2 == 0) operation3.style.color = 'black'
    else operation3.style.color = 'red'

    calculateAll()
}

document.querySelectorAll('.bracket').forEach(item => {
    item.addEventListener('click', event => {
        let bracketID = item.id.charAt(item.id.length - 1);

        if (item.classList.contains('show')) {
            item.classList.remove('show')
            bracketBooleans[bracketID - 1] = false
        }
        else {
            item.classList.add('show')
            bracketBooleans[bracketID - 1] = true
        }
        calculateAll()
    })
})


function calculateAll() {
    let calculateString = ['(', '('];
    let bracketDirection = 0;
    for (let i = 1; i < 16; i++) {
        if (i % 2 == 1) {
            let bracketMod = ((i + 1) / 2) - 1
            if (bracketBooleans[bracketMod] == false) calculateString.push('')
            else {
                if (bracketMod % 2 == 0) calculateString.push('('), bracketDirection++;
                if (bracketMod % 2 == 1) calculateString.push(')'), bracketDirection--;
            }
            //console.log("br " + (i + 1) / 2)
        }
        if (i % 4 == 2) {
            let cardMod = ((i + 2) / 4) - 1
            calculateString.push(cardValues[cardMod])
            //console.log("cd " + (i + 2) / 4)
        }
        if (i % 4 == 0) {
            let operationMod = (i / 4) - 1
            calculateString.push(nativeOperations[orderOfOperations[operationMod]])
            //console.log("op " + (i) / 4)
        }
    }
    calculateString.push(')', ')')

    //add & remove brackets
    for (let i = 0; i < Math.abs(bracketDirection); i++) {
        if (bracketDirection > 0) calculateString.push(')')
        else calculateString.unshift('(')
    }

    let equation = calculateString.join('')
    let equationSolved = Math.trunc(eval(equation))
    if (equationSolved == 24) questionSolved();

    document.getElementById("value").innerHTML = String(equationSolved)
}


function questionSolved() {
    clearInterval(gameTimer);

    let score = getTime();
    score = Math.floor(1 / ((score + 15) / 10000))
    playerScore += score
    document.getElementById('score').innerHTML = playerScore;
    
    document.getElementById('value').classList.add('bright-green')
    document.getElementById('value-sub').classList.add('bright-green')

    NextSkipBool = true;
    skipsButton.style.color = "white";
    document.getElementById('next/skip').innerHTML = 'Next Round ->'
}

function nextRound() {
    if (currentRound < totalRounds) {

        currentRound++
        skipsLeft = 2
        skipsButton.innerHTML = "Skip Round-> " + skipsLeft + "/2";
        skipsButton.classList.add('hover-class')

        document.getElementById('value').classList.remove('bright-green')
        document.getElementById('value-sub').classList.remove('bright-green')

        refreshRounds();
        NextSkipBool = false;

        //setup new cards
        shuffleCards(true)

        //setup timer
        startTime = Date.now();
        gameTimer = setInterval(Timer, 1000);
    }
    else {
        //finish game
        const game = document.getElementById('game-container');
        const form = document.getElementById('form-container');

        game.style.display = 'none';
        form.style.display = 'block';

        const scoreDisplay = document.getElementById('score-final');
        const scoreHidden = document.getElementById('hidden-score');
        scoreDisplay.innerHTML = "Score: " + playerScore;
        scoreHidden.value = playerScore;
        console.log(playerScore)
    }
}

function shuffleCards(bool) {

    let goodShuffle = false;
    while(goodShuffle == false){
        deck.shuffle();
        calculateCardValues();
        let sum = 0;
        for(let i = 0; i < cardValues.length; i++)sum += parseInt(cardValues[i]);
        if (sum != 24) goodShuffle = true
        else console.log("Bad Shuffle")
    }
    if (bool == true){
        swap(0, 0);
        addEventListenersForCards();
        resetValues();
    }
}

///////
//timer

function Timer() {
    let now = Date.now();
    timeDifference = Math.floor((now - startTime) / 1000)
    let minutes = Math.floor(timeDifference / 60)
    let seconds = (timeDifference % 60)
    if (seconds < 10) seconds = '0' + seconds
    timer.innerHTML = minutes + ':' + seconds
}
let gameTimer = setInterval(Timer, 1000);

function getTime() {
    return timeDifference;
}

