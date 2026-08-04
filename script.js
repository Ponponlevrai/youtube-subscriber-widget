const workerURL = "https://ponpon-youtube-api.cyrusbouly.workers.dev/";

async function updateSubscribers() {
  try {
    const response = await fetch(workerURL);
    const data = await response.json();

    document.getElementById("subscriberCount").textContent =
      data.subscribers + " abonnés";

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
