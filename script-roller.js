const strip = document.querySelector(".digit-strip");

const digitHeight = 100;

// Position de chaque chiffre dans notre colonne
const positions = {
  9: 0,
  8: 1,
  7: 2,
  6: 3,
  5: 4,
  4: 5,
  3: 6,
  2: 7,
  1: 8,
  0: 9
};

let currentDigit = 3;

function moveTo(digit) {

  strip.style.transform =
    `translateY(${-positions[digit] * digitHeight}px)`;

  currentDigit = digit;
}

// Position de départ
moveTo(3);

// Démonstration
setTimeout(() => moveTo(4), 2000);
setTimeout(() => moveTo(5), 4000);
setTimeout(() => moveTo(6), 6000);
setTimeout(() => moveTo(7), 8000);
setTimeout(() => moveTo(8),10000);
setTimeout(() => moveTo(9),12000);
setTimeout(() => moveTo(0),14000);
