const container = document.querySelector(".digit-container");
const oldDigit = document.querySelector(".old");
const newDigit = document.querySelector(".new");


function changeDigit(from, to) {

  oldDigit.textContent = from;
  newDigit.textContent = to;

  container.classList.remove("move");

  // petite pause pour remettre l'animation à zéro
  void container.offsetWidth;

  container.classList.add("move");
}


setTimeout(() => {

  changeDigit(3, 4);

}, 2000);
