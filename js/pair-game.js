'use strict';


const backFaceCardMap = new Map();
const frontFaceCardMap = new Map();

const cards = Array.from(document.querySelectorAll('.card'));
const backFace = Array.from(document.querySelectorAll('.card__back')).map((elements) => elements);
const frontFace = Array.from(document.querySelectorAll('.card__front')).map((elements) => elements);

console.log(arrayToMap(backFace, backFaceCardMap));
console.log(arrayToMap(frontFace, frontFaceCardMap));

function arrayToMap(arr, faceMap) {                                     // a tömböt mapba teszi
    const tempArrayIndex = arr.map((elements, index) => index);
    return faceMap.set(tempArrayIndex, arr);
}
//const cardsFront = Array.from(document.querySelectorAll('.card__front'));
//console.log(cards);
console.log(backFace);
//console.log(frontFace);

backFace.forEach((card) => {
    card.addEventListener('click', () => {
        flipCard(card);
    });
});

// frontFace.forEach((card) => {
//     card.addEventListener('click', () => {
//         reFlipCard(card);
//     });
// });

function flipCard(card) {
    console.log(event.target);
    let mapIterator = backFaceCardMap.keys();
    for (let i = 0; i < backFaceCardMap.size; i++) {
        console.log(backFaceCardMap.values().next().value[i]);
        console.log(cards[i].firstElementChild.firstElementChild);
        if (backFaceCardMap.values().next().value[i] != cards[i].firstElementChild.firstElementChild) {
            card.style.transform = "rotateY(-90deg)";
            card.style.transition = "transform 500ms ease-out";
            console.log(i);

            setInterval(() => {
                card.style.visibility = "hidden";
            }, 1000);

        }
    }
    //console.log(mapIterator.next().value[0]);



};

// function reFlipCard(card) {

//     if (Array.from(frontFace.map((elements, index) => {
//         elements == "goblinTarot"
//     }))) {

//         card.style.transform = "rotateY(90deg)";
//         card.style.transition = "transform 500ms ease-out";
//     }
// }


// da clock


const padNumbers = (num) => {
    return num < 10 ? `0${num}` : `${num}`;
}

let ellapsedTime = 0;
let counterIsRunning = true;
setInterval(() => {
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

document.querySelector('.clock').addEventListener('click', () => {
    if (counterIsRunning) {
        counterIsRunning = false;
        ellapsedTime = 0;
    } else {
        counterIsRunning = true;

    }
})
