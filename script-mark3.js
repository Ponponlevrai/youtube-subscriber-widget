// ====================================================
// ROLLER ENGINE MARK III
// ====================================================
//
// Un rouleau indépendant capable de tourner dans les
// deux sens.
//
// Ordre physique de la bande :
//
// 9
// 8
// 7
// 6
// 5
// 4
// 3
// 2
// 1
// 0
//
// puis deux cycles supplémentaires.
//
// ====================================================


class Roller {

    constructor(container, startDigit = 0) {

        this.container = container;

        this.digitHeight = 100;

        this.animationDuration = 800;

        this.currentDigit = startDigit;

        /*
            Avec une bande :

            9 8 7 6 5 4 3 2 1 0
            9 8 7 6 5 4 3 2 1 0
            9 8 7 6 5 4 3 2 1 0

            La position centrale d'un chiffre est :

            19 - chiffre
        */

        this.position = 19 - startDigit;


        // ------------------------------------------------
        // FENÊTRE
        // ------------------------------------------------

        this.window =
            document.createElement("div");

        this.window.className =
            "roller-window";


        // ------------------------------------------------
        // BANDE
        // ------------------------------------------------

        this.strip =
            document.createElement("div");

        this.strip.className =
            "roller-strip";


        this.window.appendChild(
            this.strip
        );

        this.container.appendChild(
            this.window
        );


        // Construction de la bande
        this.buildStrip();


        // Position initiale sans animation
        this.jumpToPosition(
            this.position
        );
    }


    // ====================================================
    // CONSTRUCTION DE LA BANDE
    // ====================================================

    buildStrip() {

        for (let cycle = 0; cycle < 3; cycle++) {

            for (
                let digit = 9;
                digit >= 0;
                digit--
            ) {

                const element =
                    document.createElement("div");

                element.className =
                    "roller-digit";

                element.textContent =
                    digit;

                this.strip.appendChild(
                    element
                );
            }
        }
    }


    // ====================================================
    // POSITIONNEMENT SANS ANIMATION
    // ====================================================

    jumpToPosition(position) {

        this.strip.style.transition =
            "none";

        this.strip.style.transform =
            `translateY(${-position * this.digitHeight}px)`;


        // Force le navigateur à appliquer
        // immédiatement la position.

        this.strip.offsetHeight;


        this.strip.style.transition =
            `transform ${this.animationDuration}ms ease`;
    }


    // ====================================================
    // ANIMATION
    // ====================================================

    animateToPosition(position) {

        this.position = position;

        this.strip.style.transform =
            `translateY(${-position * this.digitHeight}px)`;
    }


    // ====================================================
    // CHANGEMENT D'UN CHIFFRE
    // ====================================================

    setDigit(newDigit) {

        newDigit = Number(newDigit);


        if (
            !Number.isInteger(newDigit) ||
            newDigit < 0 ||
            newDigit > 9
        ) {

            console.error(
                "Roller : chiffre invalide :",
                newDigit
            );

            return;
        }


        if (
            newDigit === this.currentDigit
        ) {

            return;
        }


        // ------------------------------------------------
        // CHIFFRE SUIVANT
        // ------------------------------------------------

        const forwardDigit =
            (this.currentDigit + 1) % 10;


        // ------------------------------------------------
        // CHIFFRE PRÉCÉDENT
        // ------------------------------------------------

        const backwardDigit =
            (this.currentDigit + 9) % 10;


        // ------------------------------------------------
        // AVANCE
        //
        // Exemple :
        //
        // 3 -> 4
        // 4 -> 5
        // ...
        // 9 -> 0
        //
        // Le nouveau chiffre arrive par le haut.
        // ------------------------------------------------

        if (
            newDigit === forwardDigit
        ) {

            this.animateToPosition(
                this.position - 1
            );
        }


        // ------------------------------------------------
        // RECULE
        //
        // Exemple :
        //
        // 1 -> 0
        // 0 -> 9
        // 9 -> 8
        //
        // Le nouveau chiffre arrive par le bas.
        // ------------------------------------------------

        else if (
            newDigit === backwardDigit
        ) {

            this.animateToPosition(
                this.position + 1
            );
        }


        // ------------------------------------------------
        // CHANGEMENT DIRECT
        // ------------------------------------------------

        else {

            this.position =
                19 - newDigit;

            this.animateToPosition(
                this.position
            );
        }


        this.currentDigit =
            newDigit;
    }


    // ====================================================
    // NORMALISATION
    // ====================================================

    normalize() {

        const centralPosition =
            19 - this.currentDigit;


        if (
            this.position !== centralPosition
        ) {

            this.position =
                centralPosition;

            this.jumpToPosition(
                centralPosition
            );
        }
    }
}



// ====================================================
// CLASSE DU COMPTEUR À 4 ROULEAUX
// ====================================================

class RollerDisplay {

    constructor(container, startNumber = 0) {

        this.container = container;

        this.rollers = [];


        // ------------------------------------------------
        // CRÉATION DES 4 ROULEAUX
        // ------------------------------------------------

        const digits =
            String(startNumber)
                .padStart(4, "0")
                .split("")
                .map(Number);


        for (
            let i = 0;
            i < 4;
            i++
        ) {

            const roller =
                new Roller(
                    this.container,
                    digits[i]
                );

            this.rollers.push(
                roller
            );
        }


        this.currentNumber =
            Number(startNumber);
    }


    // ====================================================
    // AFFICHER UN NOMBRE
    // ====================================================

    setNumber(newNumber) {

        newNumber =
            Number(newNumber);


        if (
            !Number.isInteger(newNumber) ||
            newNumber < 0 ||
            newNumber > 9999
        ) {

            console.error(
                "RollerDisplay : nombre invalide :",
                newNumber
            );

            return;
        }


        if (
            newNumber === this.currentNumber
        ) {

            return;
        }


        const oldDigits =
            String(this.currentNumber)
                .padStart(4, "0")
                .split("")
                .map(Number);


        const newDigits =
            String(newNumber)
                .padStart(4, "0")
                .split("")
                .map(Number);


        // ------------------------------------------------
        // CHANGEMENT DES 4 ROULEAUX
        // ------------------------------------------------

        for (
            let i = 0;
            i < 4;
            i++
        ) {

            if (
                oldDigits[i] !== newDigits[i]
            ) {

                this.rollers[i].setDigit(
                    newDigits[i]
                );
            }
        }


        this.currentNumber =
            newNumber;


        // ------------------------------------------------
        // NORMALISATION APRÈS L'ANIMATION
        // ------------------------------------------------

        setTimeout(() => {

            for (
                const roller of this.rollers
            ) {

                roller.normalize();
            }

        }, Roller.prototype.animationDuration || 800);
    }
}



// ====================================================
// CRÉATION DU COMPTEUR
// ====================================================

const display =
    new RollerDisplay(
        document.querySelector("#roller-test"),
        998
    );



// ====================================================
// TEST MARK III — 4 ROULEAUX
// ====================================================
//
// Le test est volontairement conçu pour faire bouger
// TOUS les rouleaux.
//
// ====================================================

const testSequence = [

    // Rouleaux de droite
    999,
    1000,

    // Unités
    1001,
    1002,
    1003,
    1004,
    1005,
    1006,
    1007,
    1008,
    1009,

    // Dizaines
    1010,
    1011,
    1019,
    1020,

    // Centaines
    1099,
    1100,

    // Milliers
    1999,
    2000,

    // Gros changement
    2999,
    3000,

    3999,
    4000,

    4999,
    5000,

    5999,
    6000,

    6999,
    7000,

    7999,
    8000,

    8999,
    9000,

    // Passage extrême
    9998,
    9999,
    0,
    1,

    // Retours
    99,
    100,
    999,
    1000
];


let testIndex = 0;


// ====================================================
// EXÉCUTION DU TEST
// ====================================================

function runNextTest() {

    if (
        testIndex >= testSequence.length
    ) {

        console.log(
            "✅ TEST MARK III TERMINÉ"
        );

        return;
    }


    const number =
        testSequence[testIndex];


    console.log(
        "Roller test :",
        number
    );


    display.setNumber(
        number
    );


    testIndex++;


    setTimeout(
        runNextTest,
        1500
    );
}



// ====================================================
// DÉMARRAGE
// ====================================================

setTimeout(
    runNextTest,
    2000
);
