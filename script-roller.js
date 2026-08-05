const strip = document.querySelector(".digit-strip");

const digitHeight = 100;

// On démarre sur le 3
strip.style.transform = `translateY(${-6 * digitHeight}px)`;

// Deux secondes après,
// on roule vers le 4
setTimeout(() => {

    strip.style.transform =
        `translateY(${-5 * digitHeight}px)`;

},2000);
