class Roller {

    constructor(container, startDigit = 3) {

        this.container = container;

        this.digitHeight = 100;

        this.animationDuration = 800;

        this.currentDigit = startDigit;

        this.position = 10 + startDigit;


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
            On construit plusieurs cycles :

            0 1 2 3 4 5 6 7 8 9
            0 1 2 3 4 5 6 7 8 9
            0 1 2 3 4 5 6 7 8 9

            Le cycle central est celui utilisé normalement.

            Les cycles du dessus et du dessous permettent
            de franchir 9 -> 0 ou 0 -> 9 sans saut visible.
        */

        for (let cycle = 0; cycle < 3; cycle++) {

            for (let digit = 0; digit <= 9; digit++) {

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
        // la position sans animation.
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
            On ne choisit PAS le chemin le plus court.

            Le sens dépend du changement réel :

            +1 abonnement :
            8 -> 9 -> 0 -> 1

            -1 abonnement :
            1 -> 0 -> 9 -> 8

            Pour notre test, on détermine ici le déplacement
            adjacent attendu.
        */


        const forwardDigit =
            (this.currentDigit + 1) % 10;

        const backwardDigit =
            (this.currentDigit + 9) % 10;


        if (newDigit === forwardDigit) {

            // Avance d'une position
            this.animateToPosition(
                this.position + 1
            );

        }

        else if (newDigit === backwardDigit) {

            // Recule d'une position
            this.animateToPosition(
                this.position - 1
            );

        }

        else {

            /*
                Pour l'instant, si on demande directement
                un chiffre éloigné, on se replace dans
                le cycle central.

                La gestion des changements de plusieurs
                unités sera faite par Display.
            */

            this.position =
                10 + newDigit;

            this.animateToPosition(
                this.position
            );
        }


        this.currentDigit = newDigit;
    }


    normalize() {

        /*
            Après une animation, on replace silencieusement
            le rouleau dans le cycle central.

            Visuellement, rien ne change :
            les trois cycles sont identiques.
        */

        const centralPosition =
            10 + this.currentDigit;


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
