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
function handleWhatsAppClick(e) {
  e.preventDefault();
  const phoneNumber = "+923439692843";
  const appLink = `whatsapp://send?phone=${phoneNumber}`;
  const webLink = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
  window.location.href = appLink;
  setTimeout(() => {
    window.open(webLink, "_blank");
  }, 1000);
}

document.getElementById("whatsapp-link").addEventListener("click", handleWhatsAppClick);

// Footer WhatsApp link (if exists)
const footerWhatsApp = document.getElementById("footer-whatsapp");
if (footerWhatsApp) {
  footerWhatsApp.addEventListener("click", handleWhatsAppClick);
}

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
  "SEO Expert",
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

// ========== EmailJS Contact Form ==========
// Initialize EmailJS with your Public Key
(function() {
  emailjs.init("4VnVdzOudEasDxmqH"); // Replace with your EmailJS public key
})();

// Contact form submission - wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      formStatus.textContent = '';
      formStatus.className = 'form-status';
      
      // EmailJS service configuration
      const serviceID = 'service_js5vers'; // Replace with your EmailJS service ID
      const templateID = 'template_a77kgvm'; // Replace with your EmailJS template ID
      
      // Send email using EmailJS
      emailjs.sendForm(serviceID, templateID, contactForm)
        .then(function() {
          // Success
          formStatus.textContent = '✓ Message sent successfully!';
          formStatus.className = 'form-status success';
          contactForm.reset();
          
          // Re-enable button
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
          
          // Clear success message after 5 seconds
          setTimeout(() => {
            formStatus.textContent = '';
          }, 5000);
        }, function(error) {
          // Error
          formStatus.textContent = '✗ Failed to send message. Please try again.';
          formStatus.className = 'form-status error';
          
          // Re-enable button
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
          
          console.error('EmailJS Error:', error);
        });
    });
  } else {
    console.warn('Contact form not found');
  }
});

// ========== Image Modal Functions for Certificates ==========
function openImageModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const captionText = document.getElementById('modalCaption');
  
  modal.style.display = 'block';
  modalImg.src = imageSrc;
  
  // Extract certificate name from image path
  let certName = "";
  if (imageSrc.includes('ai-f-e')) {
    certName = "AI for Everyone Certificate";
  } else if (imageSrc.includes('f-s-s-d')) {
    certName = "IBM Full Stack Software Developer Certificate";
  } else if (imageSrc.includes('ai-e')) {
    certName = "AI Essentials Certificate";
  } else if (imageSrc.includes('a-p-m')) {
    certName = "Agile Project Management Certificate";
  } else {
    certName = "Certificate";
  }
  
  captionText.innerHTML = certName;
  
  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden';
}

function closeImageModal() {
  const modal = document.getElementById('imageModal');
  modal.style.display = 'none';
  document.getElementById('modalImage').src = '';
  document.getElementById('modalCaption').innerHTML = '';
  
  // Re-enable body scrolling
  document.body.style.overflow = 'auto';
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  const modal = document.getElementById('imageModal');
  if (event.key === 'Escape' && modal.style.display === 'block') {
    closeImageModal();
  }
});