'use strict';


const backFaceCardMap = new Map();
const frontFaceCardMap = new Map();

const cards = Array.from(document.querySelectorAll('.card'));
const backFace = Array.from(document.querySelectorAll('.card__back')).map((elements) => elements);
const frontFace = Array.from(document.querySelectorAll('.card__front')).map((elements) => elements);

let matchCounter = 0;
let flipCounter = 0;
let firstClick;
let secondClick;

let ellapsedTime = 0;
let counterIsRunning = false;

let gameTime = setInterval(() => {
    if (!counterIsRunning) {
        return;
    }
    ellapsedTime += 1;
    let ellapsedTimeSeconds = padNumbers(ellapsedTime % 60);
    let ellapsedTimeMinutes = padNumbers(Math.floor(ellapsedTime / 60));          // a floor lefelé kerekít (floor = padló)
    const time = `${ellapsedTimeMinutes}:${ellapsedTimeSeconds}`;                 // a másik a Math.ceil()        (ceil mennyezet) fölfelé kerekít
    const ellapsedTimeFace = document.querySelector('.clock');
    ellapsedTimeFace.textContent = time;

}, 1000);

// console.log(arrayToMap(backFace, backFaceCardMap));
// console.log(arrayToMap(frontFace, frontFaceCardMap));

function arrayToMap(arr, faceMap) {                                     // a tömböt mapba teszi
    const tempArrayIndex = arr.map((elements, index) => index);
    return faceMap.set(tempArrayIndex, arr);
}
//const cardsFront = Array.from(document.querySelectorAll('.card__front'));
//console.log(cards);
// console.log(backFace);
// console.log(frontFace);

backFace.forEach((card) => {
    card.addEventListener('click', (event) => {
        flipCard(card, event);
    });
});

// frontFace.forEach((card) => {
//     card.addEventListener('click', () => {
//         reFlipCard(card);
//     });
// });

function flipCard(card, event) {
    //console.log(event.currentTarget.firstElementChild);
    //let mapIterator = backFaceCardMap.keys();
    counterIsRunning = true;
    if (flipCounter == 0) {
        counterIsRunning;
    }
    for (let i = 0; i < cards.length; i++) {
        //console.log(backFaceCardMap.values().next().value[i]);
        //console.log(cards[i].childNodes[3].firstElementChild);              // azért childNodes[3], mert az tartalmazza a back__face div-et, de lehet lehet a black__face-el is cards helyett
        if (cards[i].childNodes[3].firstElementChild == event.currentTarget.firstElementChild) {
            backFace[i].style.transform = "rotateY(-90deg)";
            card.style.transition = "transform 750ms ease-out";
            //console.log(event.currentTarget);
            console.log(i);
            firstClick == undefined ? firstClick = i : secondClick = i;
            flipCounter += 1;
            i = cards.length;
        }

    }
    if (secondClick != undefined)                                   // csak akkor nézze, ha volt 2. felfordítás
        checkMatch(firstClick, secondClick);
};

function checkMatch(first, second) {
    const firstCard = cards[first].childNodes[1].firstElementChild.className;               // jaj de nehéz szülés volt így beazonosítani!!! A konzol sokat segített.
    const secondCard = cards[second].childNodes[1].firstElementChild.className;             // a kattintott kártya childNodejai a divek és a textContentek, a [1]-es a frontface div. Annak az első gyereke (node-ja a firstElementChild adja vissza). Annak a node-nak van egy className propertyje, azok egyedik
    const checkCards = {
        firstCard,                      //  property-shorthand!!!
        secondCard,
    }
    console.log(Object.values(checkCards)[0]);
    console.log(Object.values(checkCards)[1]);


    if (Object.values(checkCards)[0] == Object.values(checkCards)[1]) {
        matchCounter += 1;
        firstClick = undefined;
        secondClick = undefined;
        counterIsRunning = isGameWin(matchCounter);
        if (!counterIsRunning) {
            clearInterval(gameTime);                                    // ez állítja meg az órát
            gameRestart();
        }
    } else {


        setInterval(() => { // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   Ez forgatja vissza, mert ez egy időzítő és a meghívástól folyamatosan csinálja     !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            backFace[first].style.transform = "rotateY(0deg)";
            backFace[first].style.transition = "transform 1000ms ease-in";
        }, 1500);

        backFace[second].style.transform = "rotateY(360deg)";
        backFace[second].style.transition = "transform 2500ms ease-in";


        firstClick = undefined;
        secondClick = undefined;
    }
}

// function reFlipCard(card) {

//     if (Array.from(frontFace.map((elements, index) => {
//         elements == "goblinTarot"
//     }))) {

//         card.style.transform = "rotateY(90deg)";
//         card.style.transition = "transform 500ms ease-out";
//     }
// }


// da clock
const isGameWin = (matchCounter) => {

    return matchCounter == (cards.length / 2) ? false : true;
};

const padNumbers = (num) => {
    return num < 10 ? `0${num}` : `${num} `;
}

// document.querySelector('.card').addEventListener('click', () => {               // ha az órára kattintunk, akkor tudjuk indítani/megállítani
//     if (counterIsRunning) {
//         counterIsRunning = false;
//         ellapsedTime = 0;
//     } else {
//         counterIsRunning = true;

//     }
// })

const gameRestart = () => {

    let delay = setInterval(() => {
        ellapsedTime = 0;

    }, 5000);
    if (ellapsedTime == 0) {
        clearInterval(delay);
        ellapsedTimeFace.textContent = `00:00`;
    }
}