'use strict';

const cards = Array.from(document.querySelectorAll('card'));

cards.forEach(elements => {
    cards.addEventListener('click', flipCard(card));
});

function flipCard(cardArray) {

}


// da clock
const time = document.querySelector('.clock');

function addZero(i) {           // ott ahol lehet 10-nél kisebb az érték, ott legyen 0 előtagja a számnak (01,05,09 stb)
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

const dateObject = new Date();
let ellapsedTime = 0;
function dateForm() {

    const timeObject = new Date();
    const shortLongForm = `${addZero(timeObject.getMinutes() - dateObject.getMinutes())}:${addZero(timeObject.getSeconds() - dateObject.getSeconds())}`;       // a toLocaleDateString-nek a 2. paramétere egy objektum, és ennek van egy month objektuma, aminek lehet short vagy long propertyje
    time.textContent = shortLongForm;
    ellapsedTime = (timeObject.getMinutes() - dateObject.getMinutes()) * 60 + (timeObject.getSeconds() - dateObject.getSeconds());
}

setInterval(dateForm, 1000);            // másodpercenként frissíti így