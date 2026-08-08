class Roller {

    constructor(container, startDigit = 3) {

        this.container = container;

        this.digitHeight = 100;

        this.animationDuration = 800;

        this.currentDigit = startDigit;

        /*
            La colonne est organisée ainsi :

            9
            8
            7
            6
            5
            4
            3
            2
            1
            0

            puis le même cycle deux fois.

            Le chiffre 3 se trouve donc à la position 16
            dans le cycle central.

            Formule :
            position = 19 - chiffre
        */

        this.position = 19 - startDigit;


        // Création de la fenêtre
        this.window = document.createElement("div");

        this.window.className = "roller-window";


        // Création de la bande
        this.strip = document.createElement("div");

        this.strip.className = "roller-strip";


        this.window.appendChild(this.strip);

        this.container.appendChild(this.window);


        // Construction automatique de la bande
        this.buildStrip();


        // Placement initial sans animation
        this.jumpToPosition(this.position);
    }


    buildStrip() {

        /*
            On construit trois cycles identiques :

            9 8 7 6 5 4 3 2 1 0
            9 8 7 6 5 4 3 2 1 0
            9 8 7 6 5 4 3 2 1 0

            Le cycle central est utilisé normalement.

            Les cycles supplémentaires permettent
            de passer de 9 -> 0 et de 0 -> 9
            sans faire défiler toute la colonne.
        */

        for (let cycle = 0; cycle < 3; cycle++) {

            for (let digit = 9; digit >= 0; digit--) {

                const element =
                    document.createElement("div");

                element.className =
                    "roller-digit";

                element.textContent =
                    digit;

                this.strip.appendChild(element);
            }
        }
    }


    jumpToPosition(position) {

        this.strip.style.transition = "none";

        this.strip.style.transform =
            `translateY(${-position * this.digitHeight}px)`;

        // Force le navigateur à appliquer immédiatement
        // la nouvelle position sans animation.
        this.strip.offsetHeight;

        this.strip.style.transition =
            `transform ${this.animationDuration}ms ease`;
    }


    animateToPosition(position) {

        this.position = position;

        this.strip.style.transform =
            `translateY(${-position * this.digitHeight}px)`;
    }


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


        if (newDigit === this.currentDigit) {
            return;
        }


        /*
            Changement d'un seul chiffre vers l'avant :

            3 -> 4
            4 -> 5
            ...
            8 -> 9
            9 -> 0

            Avec notre colonne inversée, le chiffre suivant
            se trouve une position PLUS HAUT.

            Donc la bande descend visuellement.
        */

        const forwardDigit =
            (this.currentDigit + 1) % 10;


        /*
            Changement d'un seul chiffre vers l'arrière :

            1 -> 0
            0 -> 9
            9 -> 8
            ...

            Le chiffre précédent se trouve une position
            PLUS BAS dans le rouleau.

            Donc la bande monte visuellement.
        */

        const backwardDigit =
            (this.currentDigit + 9) % 10;


        if (newDigit === forwardDigit) {

            /*
                On avance d'une position dans le rouleau.

                Exemple :

                3
                ↓
                4

                Le 4 arrive par le haut.
            */

            this.animateToPosition(
                this.position - 1
            );
        }

        else if (newDigit === backwardDigit) {

            /*
                On recule d'une position.

                Exemple :

                1
                ↓
                0

                Le 0 arrive par le bas.
            */

            this.animateToPosition(
                this.position + 1
            );
        }

        else {

            /*
                Pour l'instant, si on demande directement
                un chiffre éloigné, on le place dans
                le cycle central.

                Les changements successifs seront gérés
                plus tard par Display.
            */

            this.position =
                19 - newDigit;

            this.animateToPosition(
                this.position
            );
        }


        this.currentDigit = newDigit;
    }


    normalize() {

        /*
            Après une animation, on replace silencieusement
            le rouleau dans son cycle central.

            Cela permet de continuer à tourner indéfiniment.

            Exemple :

            9 -> 0

            On utilise temporairement le 0 situé juste
            au-dessus du 9, puis on replace silencieusement
            le rouleau sur le 0 du cycle central.
        */

        const centralPosition =
            19 - this.currentDigit;


        if (this.position !== centralPosition) {

            this.position =
                centralPosition;

            this.jumpToPosition(
                centralPosition
            );
        }
    }
}



// ----------------------------------------------------
// CRÉATION DU PREMIER ROULEAU
// ----------------------------------------------------

const roller =
    new Roller(
        document.querySelector("#roller-test"),
        3
    );



// ----------------------------------------------------
// TEST AUTOMATIQUE MARK III
// ----------------------------------------------------

const testSequence = [
    4,
    5,
    6,
    7,
    8,
    9,
    0,
    1,
    0,
    9,
    8
];


let testIndex = 0;


function runNextTest() {

    if (testIndex >= testSequence.length) {
        return;
    }


    const digit =
        testSequence[testIndex];


    roller.setDigit(digit);


    setTimeout(() => {

        roller.normalize();

        testIndex++;

        setTimeout(
            runNextTest,
            700
        );

    }, roller.animationDuration);
}



// On attend 2 secondes avant de commencer.
setTimeout(
    runNextTest,
    2000
);
