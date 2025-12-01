const input = document.getElementById("in");
const output = document.getElementById("urls");

function addText() {
    const item = document.createElement("LI");
    item.innerText = input.value;
    output.appendChild(item);
}