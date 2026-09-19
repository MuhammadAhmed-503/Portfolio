// Preloader / Loading Screen Controller
function hidePreloader() {
  const preloader = document.getElementById("preloader");
  if (preloader && !preloader.classList.contains("fade-out")) {
    preloader.classList.add("fade-out");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 650);
  }
}

// Fade out preloader when page finishes loading
window.addEventListener("load", () => {
  setTimeout(hidePreloader, 400);
});

// Fallback: Ensure preloader is dismissed within 2.5s maximum
setTimeout(hidePreloader, 2500);

// Theme toggle functionality
const themeButton = document.querySelector(".themeButton");

// Mobile menu functionality (Modern Glass Drawer)
const navlist = document.querySelector("#navlist");
const menuicon = document.querySelector(".menuicon");
const menuOverlay = document.querySelector("#menu-overlay");

function togglemenu(forceState) {
  if (!navlist) return;
  const isOpen = typeof forceState === "boolean" 
    ? forceState 
    : !navlist.classList.contains("active");

  if (isOpen) {
    navlist.classList.add("active");
    if (menuicon) menuicon.classList.add("active");
    if (menuOverlay) menuOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  } else {
    navlist.classList.remove("active");
    if (menuicon) menuicon.classList.remove("active");
    if (menuOverlay) menuOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Close menu when clicking on any link or button inside navlist
document.querySelectorAll("#navlist li a, #navlist button").forEach(item => {
  item.addEventListener("click", () => {
    togglemenu(false);
  });
});

// Close with Escape key for accessibility
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navlist && navlist.classList.contains("active")) {
    togglemenu(false);
  }
});

// WhatsApp link handler
function handleWhatsAppClick(e) {
  e.preventDefault();
  const phoneNumber = "923439692843";
  const webLink = `https://wa.me/${phoneNumber}`;
  window.open(webLink, "_blank", "noopener,noreferrer");
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
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      event.preventDefault();
      let targetId = href.substring(1);
      let target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
        history.replaceState(null, null, ' ');
      }
    }
  });
});

// Active Tab Auto Scroll-Spy & Reading Progress
const navLinks = document.querySelectorAll("#navlist li a[href^='#']");
const trackedSections = document.querySelectorAll("section[id]");
const scrollProgressBar = document.getElementById("scroll-progress");

function updateScrollProgress() {
  if (!scrollProgressBar) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
}

function updateActiveNavOnScroll() {
  updateScrollProgress();
  const scrollPosition = window.scrollY + 180;

  // If at very top, highlight Home
  if (window.scrollY < 120) {
    navLinks.forEach(link => {
      if (link.getAttribute("href") === "#home") {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
    return;
  }

  // If at bottom of page, highlight Contact
  if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 50)) {
    navLinks.forEach(link => {
      if (link.getAttribute("href") === "#contact") {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
    return;
  }

  trackedSections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  });
}

window.addEventListener("scroll", updateActiveNavOnScroll, { passive: true });
window.addEventListener("load", updateActiveNavOnScroll);
if (document.readyState === "complete" || document.readyState === "interactive") {
  updateActiveNavOnScroll();
}

// Dark/Light mode toggle
function changeTheme() {
  document.body.classList.toggle("dark-mode");
  document.documentElement.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    themeButton.textContent = "Light Mode";
  } else {
    themeButton.textContent = "Dark Mode";
  }
}

// Typing animation using GSAP
function initTypingAnimation(customWords) {
  if (typeof gsap === "undefined" || typeof TextPlugin === "undefined") {
    console.warn("GSAP or TextPlugin not loaded for typing animation");
    return;
  }
  
  gsap.registerPlugin(TextPlugin);

  const wordsToType = (Array.isArray(customWords) && customWords.length > 0)
    ? customWords
    : [
        "Web Developer",
        "Web Designer",
        "SEO Expert",
      ];

  const typingEl = document.querySelector(".typing");
  if (!typingEl) return;

  if (window.typingTimeline) {
    window.typingTimeline.kill();
  }

  window.typingTimeline = gsap.timeline({ repeat: -1 });

  wordsToType.forEach(word => {
    // Type forward
    window.typingTimeline.to(typingEl, {
      text: word,
      duration: word.length * 0.1,
      ease: "none"
    });

    // Pause
    window.typingTimeline.to({}, { duration: 0.8 });

    // Delete backward (right to left)
    window.typingTimeline.to({}, {
      duration: word.length * 0.06,
      ease: "none",
      onUpdate() {
        const progress = this.progress();
        const cut = Math.ceil(word.length * progress);
        typingEl.textContent = word.slice(0, word.length - cut);
      }
    });
  });
}

// Initial start
initTypingAnimation();
window.initTypingAnimation = initTypingAnimation;

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

  // Clear previous image
  modalImg.src = '';

  // Show modal
  modal.style.display = 'block';

  // Set new image
  modalImg.src = imageSrc;

  // Set caption
  if (imageSrc.includes('ai-f-e') || imageSrc.includes('ai-for-everyone')) {
    captionText.innerHTML = 'AI for Everyone Certificate';
  } else if (imageSrc.includes('f-s-s-d') || imageSrc.includes('ibm-full-stack')) {
    captionText.innerHTML = 'IBM Full Stack Software Developer Certificate';
  } else if (imageSrc.includes('ai-e') || imageSrc.includes('ai-essentials')) {
    captionText.innerHTML = 'AI Essentials Certificate';
  } else if (imageSrc.includes('a-p-m') || imageSrc.includes('agile-project')) {
    captionText.innerHTML = 'Agile Project Management Certificate';
  } else {
    captionText.innerHTML = 'Certificate';
  }

  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
}

function closeImageModal() {
  const modal = document.getElementById('imageModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Close with Escape key
document.addEventListener('keydown', function(event) {
  const modal = document.getElementById('imageModal');
  if (event.key === 'Escape' && modal.style.display === 'block') {
    closeImageModal();
  }
});

// Close when clicking outside image
document.getElementById('imageModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeImageModal();
  }
});