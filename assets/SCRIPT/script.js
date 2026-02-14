// Theme toggle functionality
const themeButton = document.querySelector(".themeButton");

// Mobile menu functionality
const navlist = document.querySelector("#navlist");
navlist.style.maxHeight = "0px";

function togglemenu() {
  if (navlist.style.maxHeight == "0px") {
    navlist.style.maxHeight = "550px";
  } else {
    navlist.style.maxHeight = "0px";
  }
}

// Close menu when clicking on a link
document.querySelectorAll("#navlist li").forEach(link => {
  link.addEventListener("click", () => {
    navlist.style.maxHeight = "0px";
  });
});

// WhatsApp link handler
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

// Smooth scroll to sections
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    let targetId = this.getAttribute('href').substring(1);
    let target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
      history.replaceState(null, null, ' ');
    }
  });
});

// Dark/Light mode toggle
function changeTheme() {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    themeButton.textContent = "Light Mode";
  } else {
    themeButton.textContent = "Dark Mode";
  }
}

// Typing animation using GSAP

// Typing animation using GSAP
gsap.registerPlugin(TextPlugin);

const words = [
  "Web Developer",
  "Web Designer",
  "Content Creator"
];

const typingEl = document.querySelector(".typing");
const tl = gsap.timeline({ repeat: -1 });

words.forEach(word => {
  // Type forward
  tl.to(typingEl, {
    text: word,
    duration: word.length * 0.1,
    ease: "none"
  });

  // Pause
  tl.to({}, { duration: 0.8 });

  // Delete backward (right to left)
  tl.to({}, {
    duration: word.length * 0.06,
    ease: "none",
    onUpdate() {
      const progress = this.progress();
      const cut = Math.ceil(word.length * progress);
      typingEl.textContent = word.slice(0, word.length - cut);
    }
  });
});