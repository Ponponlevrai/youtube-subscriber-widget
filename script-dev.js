// ====================================================
// CONFIGURATION YOUTUBE
// ====================================================

const workerURL =
    "https://ponpon-youtube-api.cyrusbouly.workers.dev/";


// ====================================================
// MOTEUR D'UN ROULEAU
// ====================================================

class Roller {

    constructor(container, startDigit = 0) {

        this.container = container;

        this.digitHeight = 100;

        this.animationDuration = 800;

        this.currentDigit = startDigit;

        /*
            La bande est organisée ainsi :

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

            puis deux cycles supplémentaires.

            Position centrale :
            19 - chiffre
        */

        this.position =
            19 - startDigit;


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


        // Position initiale
        this.jumpToPosition(
            this.position
        );
    }


    buildStrip() {

        for (
            let cycle = 0;
            cycle < 3;
            cycle++
        ) {

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


    jumpToPosition(position) {

        this.strip.style.transition =
            "none";

        this.strip.style.transform =
            `translateY(${-position * this.digitHeight}px)`;

        this.strip.offsetHeight;

        this.strip.style.transition =
            `transform ${this.animationDuration}ms ease`;
    }


    animateToPosition(position) {

        this.position =
            position;

        this.strip.style.transform =
            `translateY(${-position * this.digitHeight}px)`;
    }


    setDigit(newDigit) {

        newDigit =
            Number(newDigit);


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


        const forwardDigit =
            (this.currentDigit + 1) % 10;


        const backwardDigit =
            (this.currentDigit + 9) % 10;


        // ------------------------------------------------
        // +1
        // ------------------------------------------------

        if (
            newDigit === forwardDigit
        ) {

            this.animateToPosition(
                this.position - 1
            );
        }


        // ------------------------------------------------
        // -1
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
// COMPTEUR À 4 ROULEAUX
// ====================================================

class RollerDisplay {

    constructor(container, startNumber = 0) {

        this.container =
            container;

        this.rollers = [];

        this.currentNumber =
            Number(startNumber);


        // ------------------------------------------------
        // CONTENEUR DES ROULEAUX
        // ------------------------------------------------

        this.rollerContainer =
            document.createElement("div");

        this.rollerContainer.className =
            "roller-display";


        /*
            Le label "abonnés" existe déjà dans le HTML.

            On place donc les rouleaux juste AVANT lui,
            sans modifier le reste du système.
        */

        const subscriberLabel =
            document.getElementById(
                "subscriberLabel"
            );


        if (subscriberLabel) {

            this.container.insertBefore(
                this.rollerContainer,
                subscriberLabel
            );

        } else {

            /*
                Sécurité : si le label n'existe pas,
                le comportement précédent reste fonctionnel.
            */

            this.container.appendChild(
                this.rollerContainer
            );
        }


        // ------------------------------------------------
        // CHIFFRES INITIAUX
        // ------------------------------------------------

        const digits =
            String(this.currentNumber)
                .padStart(4, "0")
                .slice(-4)
                .split("")
                .map(Number);


        // ------------------------------------------------
        // CRÉATION DES 4 ROULEAUX
        // ------------------------------------------------

        for (
            let i = 0;
            i < 4;
            i++
        ) {

            const roller =
                new Roller(
                    this.rollerContainer,
                    digits[i]
                );

            this.rollers.push(
                roller
            );
        }

    }


    setNumber(newNumber) {

        newNumber =
            Number(newNumber);


        if (
            !Number.isInteger(newNumber) ||
            newNumber < 0
        ) {

            console.error(
                "RollerDisplay : nombre invalide :",
                newNumber
            );

            return;
        }


        /*
            Pour l'instant notre compteur de test
            possède quatre rouleaux.

            On limite donc l'affichage à 9999.
        */

        if (
            newNumber > 9999
        ) {

            console.error(
                "RollerDisplay : nombre supérieur à 9999 :",
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
        // MISE À JOUR DES ROULEAUX
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
        // NORMALISATION
        // ------------------------------------------------

        setTimeout(() => {

            for (
                const roller of this.rollers
            ) {

                roller.normalize();
            }

        }, 800);

    }

}



// ====================================================
// CRÉATION DU COMPTEUR
// ====================================================

const subscriberContainer =
    document.getElementById(
        "subscriberCount"
    );


let rollerDisplay = null;



// ====================================================
// AFFICHAGE DU NOMBRE D'ABONNÉS
// ====================================================

function displaySubscribers(number) {

    number =
        Number(number);


    if (
        !Number.isInteger(number)
    ) {

        console.error(
            "Nombre d'abonnés invalide :",
            number
        );

        return;
    }


    /*
        On ne crée le RollerDisplay qu'une seule fois.

        Ensuite, chaque nouvelle valeur YouTube
        est simplement envoyée à setNumber().
    */

    if (
        rollerDisplay === null
    ) {

        rollerDisplay =
            new RollerDisplay(
                subscriberContainer,
                number
            );

        return;
    }


    rollerDisplay.setNumber(
        number
    );

}



// ====================================================
// RÉCUPÉRATION DES DONNÉES YOUTUBE
// ====================================================

async function updateSubscribers() {

    try {

        const response =
            await fetch(
                workerURL
            );


        if (
            !response.ok
        ) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const data =
            await response.json();


        // ------------------------------------------------
        // ABONNÉS
        // ------------------------------------------------

        displaySubscribers(
            data.subscribers
        );


        // ------------------------------------------------
        // NOM DE LA CHAÎNE
        // ------------------------------------------------

        document.getElementById(
            "channelName"
        ).textContent =
            data.channelName;


        // ------------------------------------------------
        // PHOTO DE PROFIL
        // ------------------------------------------------

        document.getElementById(
            "avatar"
        ).src =
            data.avatar;


    } catch (error) {

        console.error(
            "Erreur lors de la récupération YouTube :",
            error
        );

        /*
            On ne remplace pas le compteur par
            "Erreur de chargement".

            Le dernier nombre connu reste affiché.
        */

    }

}



// ====================================================
// PREMIÈRE MISE À JOUR
// ====================================================

updateSubscribers();



// ====================================================
// MISE À JOUR AUTOMATIQUE
// ====================================================
//
// On conserve ton intervalle actuel :
// une récupération toutes les 60 secondes.
//
// ====================================================

setInterval(
    updateSubscribers,
    60000
);
