const container = document.querySelector(".digit-container");
const oldDigit = document.querySelector(".old");
const newDigit = document.querySelector(".new");

let currentDigit = 3;


function changeDigit(to) {

  oldDigit.textContent = currentDigit;
  newDigit.textContent = to;

  container.classList.remove("move");

  void container.offsetWidth;

  container.classList.add("move");

  currentDigit = to;
}


setTimeout(() => {
  changeDigit(7);
}, 2000);


setTimeout(() => {
  changeDigit(4);
}, 4000);


setTimeout(() => {
  changeDigit(9);
}, 6000);
