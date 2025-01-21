const navlist = document.querySelector("#navlist"); // Correct ID selector
navlist.style.maxHeight = "0px";
function togglemenu() {
  if (navlist.style.maxHeight == "0px") {
    navlist.style.maxHeight = "300px";
  } else {
    navlist.style.maxHeight = "0px";
  }
}