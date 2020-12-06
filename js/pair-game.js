'use strict';


//const backFaceCardMap = new Map();
//const frontFaceCardMap = new Map();

const cards = Array.from(document.querySelectorAll('.card'));
const backFace = Array.from(document.querySelectorAll('.card__back')).map((elements) => elements);
const frontFace = Array.from(document.querySelectorAll('.card__front')).map((elements) => elements);
const ellapsedTimeFace = document.querySelector('.clock');

let matchCounter = 0;
let flipCounter = 0;
let firstClick;
let secondClick;
let ellapsedTime = 0;
let counterIsRunning = false;

let gameTimeIsRunning = null;

function gameTimeModeSelector(isRunning, doTimer, time){
    if(!isRunning){
        clearInterval(gameTimeIsRunning);
    }
    else{
        gameTimeIsRunning = setInterval(doTimer,time);
    }
}
    let doTimer = () => {

        if(!counterIsRunning){     
            return;
        }
        ellapsedTime += 1;
        let ellapsedTimeSeconds = padNumbers(ellapsedTime % 60);
        let ellapsedTimeMinutes = padNumbers(Math.floor(ellapsedTime / 60));          // a floor lefelé kerekít (floor = padló)
        const time = `${ellapsedTimeMinutes}:${ellapsedTimeSeconds}`;                 // a másik a Math.ceil()        (ceil mennyezet) fölfelé kerekít

        ellapsedTimeFace.textContent = time;

    }

// console.log(arrayToMap(backFace, backFaceCardMap));
// console.log(arrayToMap(frontFace, frontFaceCardMap));

function arrayToMap(arr, faceMap) {                                                 // a tömböt mapba teszi
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
    flipCounter += 1;
    if (flipCounter === 1) {
        gameTimeModeSelector(counterIsRunning,doTimer,1000);    // az első kattintásra induljon
    }
                      // !!!!!!!!!!!!!!!!!!!!!!!!!!!              sajnos az újraindítás után 2-szeresen megy az óra           !!!!!!!!!!!!!!!!!!

    for (let i = 0; i < cards.length; i++) {
        //console.log(backFaceCardMap.values().next().value[i]);
        //console.log(cards[i].childNodes[3].firstElementChild);              // azért childNodes[3], mert az tartalmazza a back__face div-et, de lehet lehet a black__face-el is cards helyett
        if (cards[i].childNodes[3].firstElementChild == event.currentTarget.firstElementChild) {
            backFace[i].style.transform = "rotateY(-90deg)";
            card.style.transition = "transform 750ms ease-out";
            //console.log(event.currentTarget);
            // console.log(i);
            firstClick == undefined ? firstClick = i : secondClick = i;

            i = cards.length + 1;
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
        counterIsRunning = isGameWin(matchCounter);                     // itt mindig megnézzük vége van-e a játéknak
        if (!counterIsRunning) {                                        // ha megáll a számláló
            //clearInterval(gameTime);                                    // ez állítja meg az órát
            gameTimeModeSelector(counterIsRunning, doTimer, 0);     // itt false-t kap, ezért törli az előző számlálót
            gameRestart();                                              // újraindítja a játékot 5 sec után
        }
    } else {


        setTimeout(() => {                                              // setTimeout az időzítő (sleep)
            backFace[first].style.transform = "rotateY(0deg)";                  // ez visszaforgatja
            backFace[first].style.transition = "transform 1000ms ease-in";
        }, 2000);                                                               // 2 sec-ig várunk, mielőtt visszaforgatjuk
        setTimeout(() => {
            backFace[second].style.transform = "rotateY(0deg)";                 // ez visszaforgatja
            backFace[second].style.transition = "transform 1000ms ease-in";
        }, 2000);

        firstClick = undefined;
        secondClick = undefined;
    }
}


const isGameWin = (matchCounter) => {
    return matchCounter == (cards.length / 2) ? false : true;
};

const padNumbers = (num) => {
    return num < 10 ? `0${num}` : `${num}`;
}


const gameRestart = () => {

    let delay = setTimeout(() => {
        ellapsedTime = 0;
        clearInterval(delay);
        ellapsedTimeFace.textContent = `00:00`;
        for (let i = 0; i < backFace.length; i++) {                         // ez visszaállítja az eredeti állapotába a játékot
            backFace[i].style.transform = "rotateY(0deg)";
            backFace[i].style.transition = "transform 1000ms ease-in";
        }
    }, 5000);

    matchCounter = 0;
    flipCounter = 0;
    firstClick = null;
    secondClick = null;

    ellapsedTime = 0;
    counterIsRunning = false;
    gameTimeIsRunning = null;

}