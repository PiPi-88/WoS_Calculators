const input = document.getElementById("url");
const output = document.getElementById("urls");

function addURL() {
    const item = document.createElement("LI");
    item.innerText = input.value;
    output.appendChild(item);
}