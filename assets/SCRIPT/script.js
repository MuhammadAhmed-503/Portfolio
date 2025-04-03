const navlist = document.querySelector("#navlist");
navlist.style.maxHeight = "0px";
function togglemenu() {
  if (navlist.style.maxHeight == "0px") {
    navlist.style.maxHeight = "400px";
  } else {
    navlist.style.maxHeight = "0px";
  }
}

document.querySelectorAll("#navlist li").forEach(link => {
  link.addEventListener("click", () => {
    navlist.style.maxHeight = "0px";
  });
});

document.getElementById("whatsapp-link").addEventListener("click", function (e) {
  e.preventDefault();
  const phoneNumber = "+923439692843";
  const appLink = `whatsapp://send?phone=${phoneNumber}`;
  const webLink = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
  window.location.href = appLink;
  setTimeout(() => {
    window.open(webLink, "_blank");
  }, 1000);
});

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        let targetId = this.getAttribute('href').substring(1);
        let target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            history.replaceState(null, null, ' ');
        }
    });
});

function changeTheme() {
    document.body.classList.toggle("dark");
}

/*const container = document.querySelector(".container");
container.style.background = "#12172b"*/

