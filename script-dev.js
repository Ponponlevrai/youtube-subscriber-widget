const workerURL = "https://ponpon-youtube-api.cyrusbouly.workers.dev/";

function displaySubscribers(number) {
  const container = document.querySelector(".digit-container");

  container.innerHTML = "";

  const digits = number.toString().split("");

  digits.forEach(digit => {
    const digitBox = document.createElement("div");
    digitBox.className = "digit";

    const span = document.createElement("span");
    span.textContent = digit;

    digitBox.appendChild(span);
    container.appendChild(digitBox);
  });
}

async function updateSubscribers() {
  try {
    const response = await fetch(workerURL);
    const data = await response.json();

    displaySubscribers(data.subscribers);

    document.getElementById("channelName").textContent =
      data.channelName;

    document.getElementById("avatar").src =
      data.avatar;

  } catch (error) {
    document.getElementById("subscriberCount").textContent =
      "Erreur de chargement";
  }
}

updateSubscribers();

setInterval(updateSubscribers, 60000);
