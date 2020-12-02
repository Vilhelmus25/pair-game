'use strict';

const cards = Array.from(document.querySelectorAll('.card__face'));
//const cardsFront = Array.from(document.querySelectorAll('.card__front'));
console.log(cards);
cards.forEach((card, index) => {
    card.addEventListener('click', () => {
        flipCardBack(card, index);
    });
});

// cardsFront.forEach(card => {
//     card.addEventListener('click', () => {
//         flipCardFront(card);
//     });
// });

function flipCardBack(card, index) {
    console.log(card);
    card.style.transform = "rotateY(-180deg)";

}
// function flipCardFront(card) {
//     card.style.transform = "rotateY(-180deg)";

// }



// da clock
const time = document.querySelector('.clock');

function addZero(i) {           // ott ahol lehet 10-nél kisebb az érték, ott legyen 0 előtagja a számnak (01,05,09 stb)
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

const startTimeObject = new Date();
let ellapsedTime = 0;
function dateForm() {

    const timeObject = new Date();
    const shortLongForm = `${addZero(timeObject.getMinutes() - startTimeObject.getMinutes())}:${addZero(timeObject.getSeconds() - startTimeObject.getSeconds())}`;       // a toLocaleDateString-nek a 2. paramétere egy objektum, és ennek van egy month objektuma, aminek lehet short vagy long propertyje
    time.textContent = shortLongForm;

    ellapsedTime = (timeObject.getMinutes() - startTimeObject.getMinutes()) * 60 + (timeObject.getSeconds() - startTimeObject.getSeconds());
    //return shortLongForm;
}

setInterval(dateForm, 1000);            // másodpercenként frissíti így