const button = document.querySelector("#menu-button");
const menu = document.querySelector("#menu");
var x = document.getElementsByClassName("btn");

button.addEventListener("click", () => {
  menu.classList.toggle("hidden");
  if (menu.classList.contains("hidden")) {
    x[1].style.display = "block";
    x[0].style.display = "none";
  } else {
    x[1].style.display = "none";
    x[0].style.display = "block";
  }
});

function readURL(input) {
  if (input.files && input.files[0]) {
    console.log(input.files[0]);
    const newImg = URL.createObjectURL(input.files[0]);
    const img = (document.getElementById("img").src = newImg);
  }
}

const url = new URL(window.location.href);
const search = new URLSearchParams(url);
const q = search.get("token");
console.log(q)