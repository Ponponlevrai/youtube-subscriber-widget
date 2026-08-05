const counter = document.getElementById("counter");

let number = 993;

function displayNumber(value){

    counter.innerHTML = "";

    value.toString().split("").forEach(digit=>{

        const div=document.createElement("div");

        div.textContent=digit;

        counter.appendChild(div);

    });

}

displayNumber(number);
