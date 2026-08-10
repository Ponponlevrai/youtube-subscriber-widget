// ====================================================
// CONFIGURATION
// ====================================================

const workerURL =
    "https://ponpon-youtube-api.cyrusbouly.workers.dev/";


// ====================================================
// CLASSE ROLLER
// ====================================================

class Roller {

    constructor(container, startDigit = 0) {

        this.container = container;

        this.digitHeight = 100;

        this.animationDuration = 800;

        this.currentDigit = startDigit;

        this.position = 10 + startDigit;


        // Fenêtre
        this.window =
            document.createElement("div");

        this.window.className =
            "roller-window";


        // Bande
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


        if (
            newDigit ===
            this.currentDigit
        ) {

            return;
        }


        const forwardDigit =
            (this.currentDigit + 1) % 10;

        const backwardDigit =
            (this.currentDigit + 9) % 10;


        if (
            newDigit ===
            forwardDigit
        ) {

            this.animateToPosition(
                this.position + 1
            );
        }

        else if (
            newDigit ===
            backwardDigit
        ) {

            this.animateToPosition(
                this.position - 1
            );
        }

        else {

            this.position =
                10 + newDigit;

            this.animateToPosition(
                this.position
            );
        }


        this.currentDigit =
            newDigit;
    }


    normalize() {

        const centralPosition =
            10 + this.currentDigit;


        if (
            this.position !==
            centralPosition
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
// CRÉATION DU COMPTEUR
// ====================================================

const subscriberCount =
    document.querySelector(
        "#subscriberCount"
    );


// Conteneur des rouleaux
const rollerDisplay =
    document.createElement("div");

rollerDisplay.className =
    "roller-display";

subscriberCount.appendChild(
    rollerDisplay
);


// Conteneur du texte "abonnés"
const subscriberLabel =
    document.createElement("div");

subscriberLabel.className =
    "subscriber-label";

subscriberLabel.textContent =
    "abonnés";

subscriberCount.appendChild(
    subscriberLabel
);


// ====================================================
// CRÉATION DES 4 ROULEAUX
// ====================================================

const rollers = [];

for (
    let i = 0;
    i < 4;
    i++
) {

    const roller =
        new Roller(
            rollerDisplay,
            0
        );

    rollers.push(
        roller
    );
}


// ====================================================
// AFFICHAGE DU NOMBRE
// ====================================================

function displaySubscribers(number) {

    const digits =
        number
            .toString()
            .padStart(4, "0")
            .slice(-4)
            .split("");


    digits.forEach(
        (digit, index) => {

            rollers[index].setDigit(
                Number(digit)
            );
        }
    );
}


// ====================================================
// NORMALISATION DES ROULEAUX
// ====================================================

function normalizeRollers() {

    rollers.forEach(
        roller => {

            roller.normalize();

        }
    );
}


// ====================================================
// RÉCUPÉRATION DES DONNÉES YOUTUBE
// ====================================================

async function updateSubscribers() {

    try {

        const response =
            await fetch(workerURL);

        const data =
            await response.json();


        // Nombre d'abonnés
        displaySubscribers(
            data.subscribers
        );


        // Nom de la chaîne
        document.getElementById(
            "channelName"
        ).textContent =
            data.channelName;


        // Photo de profil
        document.getElementById(
            "avatar"
        ).src =
            data.avatar;


        // Normalisation après animation
        setTimeout(
            normalizeRollers,
            850
        );

    }

    catch (error) {

        console.error(
            "Erreur de chargement :",
            error
        );
    }
}


// ====================================================
// PREMIÈRE MISE À JOUR
// ====================================================

updateSubscribers();


// ====================================================
// MISE À JOUR AUTOMATIQUE
// ====================================================

setInterval(
    updateSubscribers,
    60000
);
