const counter = document.getElementById("counter");

function changeDigit(from, to) {

  counter.innerHTML = `
    <div class="digit-window">
      <div class="digit-container">
        <div class="digit new">${to}</div>
        <div class="digit old">${from}</div>
      </div>
    </div>
  `;

  const container = document.querySelector(".digit-container");

  requestAnimationFrame(() => {
    container.classList.add("move");
  });
}


setTimeout(() => {
  changeDigit(3, 4);
}, 2000);
