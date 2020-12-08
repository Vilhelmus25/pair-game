'use strict';

const startImages = [
    'gladius',
    'goblinTarot',
    'heavenAndHell',
    'dragons',
    'endora',
];
let isRestart = false;
let container = document.createElement('div');      // létrehozunk egy div-et
container.classList.add('card__container');         // megadjuk neki a 'card__container'  className-t
let cardDiv;
document.body.appendChild(container);               // a 'card__container' osztályt a body leszármazottává tessszük

let images = startImages.concat(startImages);           // duplikáljuk a front-kártyákat

let cardContainer;
let cards;
let backFace;
let frontFace;
let ellapsedTimeFace;;

let blockClicks = false;

let matchCounter = 0;
let flipCounter = 0;
let firstClick;
let secondClick;
let ellapsedTime = 0;
let counterIsRunning = false;

let gameTimeIsRunning = null;

function initGame() {               // a játék indító
    cardShuffler();
    querySelelctorForCards();
    eventlistenerAdder();
}

function cardShuffler() {                       // a kártyák létrehozása a html-be

    images = shuffle(images);                   // keverés

    //showCards
    function getOneCard(image, index) {                             // itt hozza létre a kártyákat a html-ben
        cardDiv = document.createElement('div');
        container.appendChild(cardDiv);
        cardDiv.classList.add('card');

        cardDiv.innerHTML = `
                   <div class="card__front card__face">
                       <img src="./assets/images/${image}.jpg" alt="${image}" class="${image}">
                   </div>
                   <div class="card__back card__face">
                       <img src="./assets/images/creator.jpg" alt="Creator" class="creator--${index}">
                   </div>`;

        return cardDiv;
    }


    for (let i = 0; i < images.length; i += 1) {
        getOneCard(images[i], i);                                       // itt kapja meg a képeket
    }
    return getOneCard;

};

function querySelelctorForCards() {                                             // a queryselectorokat egy fv-be rakom, hogy később is elérhető legyen
    cardContainer = Array.from(document.querySelectorAll('.card__front'));
    cards = Array.from(document.querySelectorAll('.card'));
    backFace = Array.from(document.querySelectorAll('.card__back')).map((elements) => elements);
    frontFace = Array.from(document.querySelectorAll('.card__front')).map((elements) => elements);
    ellapsedTimeFace = document.querySelector('.clock');

}


function shuffle(array) {                                           // összekeverjük a kártyafront típusokat, hogy random legyen
    let currentIndex = array.length, tempElement, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        tempElement = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempElement;

    }
    return array;
};


function gameTimeModeSelector(isRunning, doTimer, time) {       // idő számláló
    if (!isRunning) {
        clearInterval(gameTimeIsRunning);
    }
    else {
        gameTimeIsRunning = setInterval(doTimer, time);
    }
}
const doTimer = () => {

    if (!counterIsRunning) {
        return;
    }
    ellapsedTime += 1;
    let ellapsedTimeSeconds = padNumbers(ellapsedTime % 60);
    let ellapsedTimeMinutes = padNumbers(Math.floor(ellapsedTime / 60));          // a floor lefelé kerekít (floor = padló)
    const time = `${ellapsedTimeMinutes}:${ellapsedTimeSeconds}`;                 // a másik a Math.ceil()        (ceil mennyezet) fölfelé kerekít

    ellapsedTimeFace.textContent = time;

}
function eventlistenerAdder() {                             // kattintás eseményfigyelő a hátlapra

    backFace.forEach((card) => {
        card.addEventListener('click', (event) => {
            flipCard(card, event);
        });
    });
}


function flipCard(card, event) {
    //console.log(event.currentTarget.firstElementChild);

    if (blockClicks) {                      // blokkolja a kattintást, ha egyszerre kettő van felfordítva
        return;
    }
    counterIsRunning = true;
    flipCounter += 1;
    if (flipCounter === 1) {
        gameTimeModeSelector(counterIsRunning, doTimer, 1000);    // az első kattintásra induljon
    }

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
    // console.log(Object.values(checkCards)[0]);
    // console.log(Object.values(checkCards)[1]);

    if (Object.values(checkCards)[0] == Object.values(checkCards)[1]) {
        matchCounter += 1;
        firstClick = undefined;
        secondClick = undefined;
        counterIsRunning = isGameWin(matchCounter);                     // itt mindig megnézzük vége van-e a játéknak
        if (!counterIsRunning) {                                        // ha megáll a számláló
            gameTimeModeSelector(counterIsRunning, doTimer, 0);         // itt false-t kap, ezért törli az előző számlálót
            gameRestart();                                              // újraindítja a játékot 5 sec után
        }
    } else {

        blockClicks = true;                                                     // Ez gátolja meg, hogy ne lehessen kattintani amikor 2-őt felfordítottunk

        setTimeout(() => {                                                      // setTimeout az időzítő (sleep)
            backFace[first].style.transform = "rotateY(0deg)";                  // ez visszaforgatja
            backFace[first].style.transition = "transform 750ms ease-in";
        }, 1500);                                                               // 2 sec-ig várunk, mielőtt visszaforgatjuk
        setTimeout(() => {
            backFace[second].style.transform = "rotateY(0deg)";                 // ez visszaforgatja
            backFace[second].style.transition = "transform 750ms ease-in";
            blockClicks = false;
        }, 1500);

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
        isRestart = true;
        if (isRestart) {
            while (container.firstChild) {                                  // kitöröljük a lapokat a html-ből
                container.removeChild(container.lastChild);
            }
            isRestart = false;
        }

        initGame();     // újraindítjuk a játékot, miután töröltünk
    }, 5000);

    // 0-ára állítunk valamennyi változót
    matchCounter = 0;
    flipCounter = 0;
    firstClick = null;
    secondClick = null;

    ellapsedTime = 0;
    counterIsRunning = false;
    gameTimeIsRunning = null;
    blockClicks = false;

}
initGame();             // az első indításhoz