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

  // Cas spécial : 9 -> 0
  if (currentDigit === 9 && digit === 0) {

    // On descend jusqu'au 9 du bas
    strip.style.transform =
      `translateY(${-10 * digitHeight}px)`;

    // Une fois l'animation terminée...
    setTimeout(() => {

      // On enlève la transition
      strip.style.transition = "none";

      // On replace instantanément sur le vrai 0
      strip.style.transform =
        `translateY(${-9 * digitHeight}px)`;

      // On force le navigateur à appliquer le changement
      strip.offsetHeight;

      // On remet la transition
      strip.style.transition =
        "transform .8s ease";

    }, 800);

    currentDigit = 0;
    return;
  }

  // Cas normal
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
