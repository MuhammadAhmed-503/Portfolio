// Default data structure
const defaultData = {
    site: {
        title: "Muhammad Ahmed - Portfolio",
        logo: "Ahmed",
        copyright: "© 2026 Muhammad Ahmed. All rights reserved.",
        favicon: "assets/Icons/android-icon-192x192.png",
        seoDescription: "Portfolio of Muhammad Ahmed, Software Engineering student from University of Gujrat."
    },
    hero: {
        firstName: "Muhammad",
        lastName: "Ahmed",
        typingWords: ["Web Developer", "Web Designer", "SEO Expert"],
        image: "assets/Images/Front3.JPG"
    },
    about: {
        heading: "About Me",
        description: "Hello! I'm Ahmed, a Full-Stack Developer specializing in the MERN stack. I build high-performance web applications with smooth user experiences and robust backend architectures."
    },
    skills: {
        heading: "My Skills",
        items: [
            { name: "HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
            { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
            { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
            { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
            { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
            { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
            { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
            { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
            { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
            { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
            { name: "Postman", icon: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
            { name: "GSAP", icon: "https://cdn.worldvectorlogo.com/logos/gsap-greensock.svg" }
        ]
    },
    education: {
        heading: "Education",
        items: [
            { year: "2021", title: "High School", description: "Matriculation from Government Model High School, Sarai Alamgir with 90% marks." },
            { year: "2023", title: "College", description: "Intermediate from Saint Francis Degree College, Sarai Alamgir with 80% marks." },
            { year: "2024", title: "University", description: "Currently enrolled in BS Software Engineering at University of Gujrat." }
        ]
    },
    services: {
        heading: "Our Services",
        items: [
            { title: "Front-End Web Development", description: "Build interactive, responsive, and dynamic websites using cutting-edge technologies.", icon: "https://cdn-icons-png.flaticon.com/512/11987/11987364.png" },
            { title: "Web Design", description: "Create beautiful and user-friendly designs tailored to meet your business goals.", icon: "https://cdn-icons-png.flaticon.com/512/3852/3852620.png" },
            { title: "Maintenance", description: "Ensure your website stays secure, up-to-date, and performs optimally at all times.", icon: "https://cdn-icons-png.flaticon.com/512/9042/9042130.png" },
            { title: "SEO Services", description: "Improve your website’s visibility and ranking on search engines with our expert SEO strategies.", icon: "https://cdn-icons-png.flaticon.com/512/1238/1238682.png" }
        ]
    },
    projects: {
        heading: "My Projects",
        items: [
            { title: "PDF Merger App", description: "A web app to merge multiple PDF files into one.", image: "assets/Images/project1.jpg", liveUrl: "https://pdf-merger-503.netlify.app/", githubUrl: "https://github.com/MuhammadAhmed-503/pdf-merger" },
            { title: "Tasbeeh Counter", description: "A simple digital Tasbeeh Counter to keep track of your zikar.", image: "assets/Images/tasbeeh-counter.jpg", liveUrl: "https://tasbeeh-counter-503.netlify.app", githubUrl: "https://github.com/MuhammadAhmed-503/Counter-Website" },
            { title: "Free Pic", description: "A simple web app to browse and download high-quality images for free, powered by the Unsplash API.", image: "assets/Images/free-pic-project.jpg", liveUrl: "https://free-pic-503.netlify.app", githubUrl: "https://github.com/MuhammadAhmed-503" },
            { title: "BlogShpere", description: "Full-stack blogging platform built with React, Node, Express, MongoDB and Cloudinary.", image: "assets/Images/blogsphere.png", liveUrl: "https://blogsphere-sj9b.vercel.app/", githubUrl: "https://github.com/MuhammadAhmed-503/BLOGSPHERE" },
            { title: "My School Website", description: "School website built with HTML, CSS, JS and Firebase (R2).", image: "assets/Images/ghss.png", liveUrl: "https://ghss-sarai-public.web.app/", githubUrl: "" },
            { title: "Alamgir Fashion Center", description: "E-commerce website built with React, Node, Express, MongoDB and Cloudinary.", image: "assets/Images/afc-yaseen.png", liveUrl: "https://afc-yaseen.vercel.app/", githubUrl: "https://github.com/MuhammadAhmed-503/alamgir-fashion-center" },
            { title: "Delicious", description: "Restaurant table booking website with full-stack features using React, Node, Express, MongoDB and Cloudinary.", image: "assets/Images/deliciousone.png", liveUrl: "https://deliciousone.vercel.app/", githubUrl: "https://github.com/MuhammadAhmed-503/delicious" }
        ]
    },
    certificates: {
        heading: "My Certificates",
        items: [
            { title: "AI for Everyone", issuer: "DeepLearning.AI (Coursera)", description: "Comprehensive understanding of AI concepts.", image: "assets/Certificates/ai-f-e.jpg", verifyUrl: "https://coursera.org/share/eb425a09b43e4841d9dafee5c1d6319d" },
            { title: "IBM Full Stack Software Developer", issuer: "IBM (Coursera)", description: "Professional certificate covering front-end, back-end.", image: "assets/Certificates/f-s-s-d.jpg", verifyUrl: "https://coursera.org/share/a470f909c24b92851b6cc1d7f8b2f2f3" },
            { title: "AI Essentials", issuer: "Coursera", description: "Essential AI tools, techniques, and practical applications for modern problem-solving.", image: "assets/Certificates/ai-e.jpg", verifyUrl: "https://coursera.org/share/99e0fb1aad08c6d7342b608f2bd81019" },
            { title: "Agile Project Management", issuer: "Coursera", description: "Mastering Agile methodologies, Scrum framework, and effective project management strategies.", image: "assets/Certificates/a-p-m.jpg", verifyUrl: "https://coursera.org/share/4f22b03a8ce8075057f865d78be93f92" }
        ]
    },
    contact: {
        heading: "Contact Me",
        whatsapp: "+923439692843",
        emailjsKey: "4VnVdzOudEasDxmqH",
        emailjsService: "service_js5vers",
        emailjsTemplate: "template_a77kgvm",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13398.9320547222!2d73.758555!3d32.905226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDU0JzE4LjgiTiA3M8KwNDUnMzAuOCJF!4v0!5m2!1sen!2s"
    },
    social: {
        instagram: "https://www.instagram.com/o.ahmed503?igsh=MnNsZWdjdXNzcHdv",
        github: "https://github.com/MuhammadAhmed-503",
        linkedin: "https://www.linkedin.com/in/muhammad-ahmed-238459288"
    },
    colors: {
        primaryLight: "#2C3E7F",
        primaryDark: "#ee0033",
        bgLight: "#ffffff",
        bgDark: "#12172b",
        textLight: "#000000",
        textDark: "#f1f1f1"
    }
};

function cloneDefaultData() {
    return JSON.parse(JSON.stringify(defaultData));
}

function mergeCollection(defaultItems, savedItems) {
    const merged = Array.isArray(savedItems) ? [...savedItems] : [];
    defaultItems.forEach((item, index) => {
        if (!merged[index]) {
            merged[index] = item;
        }
    });
    return merged;
}

function normalizePortfolioData(rawData) {
    if (!rawData || typeof rawData !== 'object') {
        return cloneDefaultData();
    }

    const merged = cloneDefaultData();

    merged.site = { ...merged.site, ...(rawData.site || {}) };
    merged.hero = { ...merged.hero, ...(rawData.hero || {}) };
    merged.about = { ...merged.about, ...(rawData.about || {}) };
    merged.skills = {
        ...merged.skills,
        ...(rawData.skills || {}),
        items: mergeCollection(defaultData.skills.items, rawData.skills?.items),
    };
    merged.education = {
        ...merged.education,
        ...(rawData.education || {}),
        items: mergeCollection(defaultData.education.items, rawData.education?.items),
    };
    merged.services = {
        ...merged.services,
        ...(rawData.services || {}),
        items: mergeCollection(defaultData.services.items, rawData.services?.items),
    };
    merged.projects = {
        ...merged.projects,
        ...(rawData.projects || {}),
        items: mergeCollection(defaultData.projects.items, rawData.projects?.items),
    };
    merged.certificates = {
        ...merged.certificates,
        ...(rawData.certificates || {}),
        items: mergeCollection(defaultData.certificates.items, rawData.certificates?.items),
    };
    merged.contact = { ...merged.contact, ...(rawData.contact || {}) };
    merged.social = { ...merged.social, ...(rawData.social || {}) };
    merged.colors = { ...merged.colors, ...(rawData.colors || {}) };

    return merged;
}

// Load or initialize data
let portfolioData = normalizePortfolioData(JSON.parse(localStorage.getItem('portfolioData')));

// Save data to localStorage
function saveAllData() {
    // Collect all form values
    portfolioData = {
        site: {
            title: document.getElementById('siteTitle').value,
            logo: document.getElementById('logoText').value,
            copyright: document.getElementById('copyrightText').value,
            favicon: document.getElementById('faviconUrl').value,
            seoDescription: document.getElementById('seoDescription').value
        },
        hero: {
            firstName: document.getElementById('heroFirstName').value,
            lastName: document.getElementById('heroLastName').value,
            typingWords: document.getElementById('heroTypingWords').value.split(',').map(w => w.trim()),
            image: document.getElementById('heroImage').value
        },
        about: {
            heading: document.getElementById('aboutHeading').value,
            description: document.getElementById('aboutDescription').value
        },
        skills: {
            heading: document.getElementById('skillsHeading').value,
            items: window.skillsItems || portfolioData.skills.items
        },
        education: {
            heading: document.getElementById('educationHeading').value,
            items: window.educationItems || portfolioData.education.items
        },
        services: {
            heading: document.getElementById('servicesHeading').value,
            items: window.servicesItems || portfolioData.services.items
        },
        projects: {
            heading: document.getElementById('projectsHeading').value,
            items: window.projectsItems || portfolioData.projects.items
        },
        certificates: {
            heading: document.getElementById('certificatesHeading').value,
            items: window.certificatesItems || portfolioData.certificates.items
        },
        contact: {
            heading: document.getElementById('contactHeading').value,
            whatsapp: document.getElementById('whatsappNumber').value,
            emailjsKey: document.getElementById('emailjsKey').value,
            emailjsService: document.getElementById('emailjsService').value,
            emailjsTemplate: document.getElementById('emailjsTemplate').value,
            mapEmbed: document.getElementById('mapEmbedUrl').value
        },
        social: {
            instagram: document.getElementById('instagramUrl').value,
            github: document.getElementById('githubUrl').value,
            linkedin: document.getElementById('linkedinUrl').value
        },
        colors: {
            primaryLight: document.getElementById('primaryColorLight').value,
            primaryDark: document.getElementById('primaryColorDark').value,
            bgLight: document.getElementById('bgColorLight').value,
            bgDark: document.getElementById('bgColorDark').value,
            textLight: document.getElementById('textColorLight').value,
            textDark: document.getElementById('textColorDark').value
        }
    };
    
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    showStatus('✅ All changes saved!');
    
    // Also save to a separate file for live site
    generateDynamicCSS();
    generateDynamicHTML();
}

// Show status message
function showStatus(message) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 2000);
}

// Export data as JSON file
function exportData() {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().slice(0,19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus('📥 Data exported successfully!');
}

// Import data from JSON file
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const importedData = JSON.parse(event.target.result);
                portfolioData = normalizePortfolioData(importedData);
                localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
                loadDataToForms();
                showStatus('📤 Data imported successfully! Page will reload.');
                setTimeout(() => location.reload(), 1500);
            } catch (error) {
                showStatus('❌ Invalid JSON file!');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Reset to default
function resetToDefault() {
    if (confirm('⚠️ This will reset ALL your custom data. Are you sure?')) {
        portfolioData = cloneDefaultData();
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        loadDataToForms();
        showStatus('🔄 Reset to default settings!');
        setTimeout(() => location.reload(), 1000);
    }
}

// Load data to form inputs
function loadDataToForms() {
    document.getElementById('siteTitle').value = portfolioData.site.title;
    document.getElementById('logoText').value = portfolioData.site.logo;
    document.getElementById('copyrightText').value = portfolioData.site.copyright;
    document.getElementById('faviconUrl').value = portfolioData.site.favicon;
    document.getElementById('seoDescription').value = portfolioData.site.seoDescription;
    
    document.getElementById('heroFirstName').value = portfolioData.hero.firstName;
    document.getElementById('heroLastName').value = portfolioData.hero.lastName;
    document.getElementById('heroTypingWords').value = portfolioData.hero.typingWords.join(', ');
    document.getElementById('heroImage').value = portfolioData.hero.image;
    updateHeroImagePreview();
    
    document.getElementById('aboutHeading').value = portfolioData.about.heading;
    document.getElementById('aboutDescription').value = portfolioData.about.description;
    
    document.getElementById('skillsHeading').value = portfolioData.skills.heading;
    document.getElementById('educationHeading').value = portfolioData.education.heading;
    document.getElementById('servicesHeading').value = portfolioData.services.heading;
    document.getElementById('projectsHeading').value = portfolioData.projects.heading;
    document.getElementById('certificatesHeading').value = portfolioData.certificates.heading;
    document.getElementById('contactHeading').value = portfolioData.contact.heading;
    document.getElementById('whatsappNumber').value = portfolioData.contact.whatsapp;
    document.getElementById('emailjsKey').value = portfolioData.contact.emailjsKey;
    document.getElementById('emailjsService').value = portfolioData.contact.emailjsService;
    document.getElementById('emailjsTemplate').value = portfolioData.contact.emailjsTemplate;
    document.getElementById('mapEmbedUrl').value = portfolioData.contact.mapEmbed;
    
    document.getElementById('instagramUrl').value = portfolioData.social.instagram;
    document.getElementById('githubUrl').value = portfolioData.social.github;
    document.getElementById('linkedinUrl').value = portfolioData.social.linkedin;
    
    document.getElementById('primaryColorLight').value = portfolioData.colors.primaryLight;
    document.getElementById('primaryColorDark').value = portfolioData.colors.primaryDark;
    document.getElementById('bgColorLight').value = portfolioData.colors.bgLight;
    document.getElementById('bgColorDark').value = portfolioData.colors.bgDark;
    document.getElementById('textColorLight').value = portfolioData.colors.textLight;
    document.getElementById('textColorDark').value = portfolioData.colors.textDark;

    applyThemePreview();
    
    // Load dynamic lists
    renderSkillsList();
    renderEducationList();
    renderServicesList();
    renderProjectsList();
    renderCertificatesList();
}

function updateHeroImagePreview() {
    const preview = document.getElementById('heroImagePreview');
    const input = document.getElementById('heroImage');

    if (!preview || !input) {
        return;
    }

    if (input.value.trim()) {
        preview.src = input.value.trim();
        preview.style.display = 'block';
        preview.alt = 'Hero image preview';
    } else {
        preview.style.display = 'none';
        preview.removeAttribute('src');
    }
}

function applyThemePreview() {
    const root = document.documentElement;
    const primaryLight = document.getElementById('primaryColorLight')?.value || defaultData.colors.primaryLight;
    const bgLight = document.getElementById('bgColorLight')?.value || defaultData.colors.bgLight;
    const textLight = document.getElementById('textColorLight')?.value || defaultData.colors.textLight;

    root.style.setProperty('--primary-color', primaryLight);
    root.style.setProperty('--bg-color', bgLight);
    root.style.setProperty('--text-color', textLight);
    root.style.setProperty('--card-bg', bgLight === '#ffffff' ? '#f8f9fa' : 'rgba(255,255,255,0.08)');
}

// Render Skills List
function renderSkillsList() {
    const container = document.getElementById('skillsList');
    container.innerHTML = '';
    portfolioData.skills.items.forEach((skill, index) => {
        container.innerHTML += `
            <div class="skill-item">
                <input type="text" placeholder="Skill Name" value="${skill.name}" onchange="updateSkill(${index}, 'name', this.value)">
                <input type="text" placeholder="Icon URL" value="${skill.icon}" onchange="updateSkill(${index}, 'icon', this.value)">
                <button class="remove-btn" onclick="removeSkill(${index})">Remove</button>
            </div>
        `;
    });
}

function addSkill() {
    portfolioData.skills.items.push({ name: "New Skill", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" });
    renderSkillsList();
}

function updateSkill(index, field, value) {
    portfolioData.skills.items[index][field] = value;
}

function removeSkill(index) {
    portfolioData.skills.items.splice(index, 1);
    renderSkillsList();
}

// Similar functions for Education, Services, Projects, Certificates
function renderEducationList() {
    const container = document.getElementById('educationList');
    container.innerHTML = '';
    portfolioData.education.items.forEach((item, index) => {
        container.innerHTML += `
            <div class="project-item">
                <input type="text" placeholder="Year" value="${item.year}" onchange="updateEducation(${index}, 'year', this.value)">
                <input type="text" placeholder="Title" value="${item.title}" onchange="updateEducation(${index}, 'title', this.value)">
                <textarea placeholder="Description" onchange="updateEducation(${index}, 'description', this.value)">${item.description}</textarea>
                <button class="remove-btn" onclick="removeEducation(${index})">Remove</button>
            </div>
        `;
    });
}

function addEducation() {
    portfolioData.education.items.push({ year: "2024", title: "New Degree", description: "Description here" });
    renderEducationList();
}

function updateEducation(index, field, value) {
    portfolioData.education.items[index][field] = value;
}

function removeEducation(index) {
    portfolioData.education.items.splice(index, 1);
    renderEducationList();
}

function renderServicesList() {
    const container = document.getElementById('servicesList');
    container.innerHTML = '';
    portfolioData.services.items.forEach((item, index) => {
        container.innerHTML += `
            <div class="project-item">
                <input type="text" placeholder="Title" value="${item.title}" onchange="updateService(${index}, 'title', this.value)">
                <textarea placeholder="Description" onchange="updateService(${index}, 'description', this.value)">${item.description}</textarea>
                <input type="text" placeholder="Icon URL" value="${item.icon}" onchange="updateService(${index}, 'icon', this.value)">
                <button class="remove-btn" onclick="removeService(${index})">Remove</button>
            </div>
        `;
    });
}

function addService() {
    portfolioData.services.items.push({ title: "New Service", description: "Service description", icon: "https://cdn-icons-png.flaticon.com/512/11987/11987364.png" });
    renderServicesList();
}

function updateService(index, field, value) {
    portfolioData.services.items[index][field] = value;
}

function removeService(index) {
    portfolioData.services.items.splice(index, 1);
    renderServicesList();
}

function renderProjectsList() {
    const container = document.getElementById('projectsList');
    container.innerHTML = '';
    portfolioData.projects.items.forEach((item, index) => {
        container.innerHTML += `
            <div class="project-item">
                <input type="text" placeholder="Title" value="${item.title}" onchange="updateProject(${index}, 'title', this.value)">
                <textarea placeholder="Description" onchange="updateProject(${index}, 'description', this.value)">${item.description}</textarea>
                <input type="text" placeholder="Image URL" value="${item.image}" onchange="updateProject(${index}, 'image', this.value)">
                <input type="text" placeholder="Live Demo URL" value="${item.liveUrl}" onchange="updateProject(${index}, 'liveUrl', this.value)">
                <input type="text" placeholder="GitHub URL" value="${item.githubUrl}" onchange="updateProject(${index}, 'githubUrl', this.value)">
                <button class="remove-btn" onclick="removeProject(${index})">Remove</button>
            </div>
        `;
    });
}

function addProject() {
    portfolioData.projects.items.push({ title: "New Project", description: "Project description", image: "assets/Images/project1.jpg", liveUrl: "#", githubUrl: "#" });
    renderProjectsList();
}

function updateProject(index, field, value) {
    portfolioData.projects.items[index][field] = value;
}

function removeProject(index) {
    portfolioData.projects.items.splice(index, 1);
    renderProjectsList();
}

function renderCertificatesList() {
    const container = document.getElementById('certificatesList');
    container.innerHTML = '';
    portfolioData.certificates.items.forEach((item, index) => {
        container.innerHTML += `
            <div class="project-item">
                <input type="text" placeholder="Title" value="${item.title}" onchange="updateCertificate(${index}, 'title', this.value)">
                <input type="text" placeholder="Issuer" value="${item.issuer}" onchange="updateCertificate(${index}, 'issuer', this.value)">
                <textarea placeholder="Description" onchange="updateCertificate(${index}, 'description', this.value)">${item.description}</textarea>
                <input type="text" placeholder="Image URL" value="${item.image}" onchange="updateCertificate(${index}, 'image', this.value)">
                <input type="text" placeholder="Verify URL" value="${item.verifyUrl}" onchange="updateCertificate(${index}, 'verifyUrl', this.value)">
                <button class="remove-btn" onclick="removeCertificate(${index})">Remove</button>
            </div>
        `;
    });
}

function addCertificate() {
    portfolioData.certificates.items.push({ title: "New Certificate", issuer: "Issuer Name", description: "Description", image: "assets/Certificates/ai-f-e.jpg", verifyUrl: "#" });
    renderCertificatesList();
}

function updateCertificate(index, field, value) {
    portfolioData.certificates.items[index][field] = value;
}

function removeCertificate(index) {
    portfolioData.certificates.items.splice(index, 1);
    renderCertificatesList();
}

// Generate dynamic CSS
function generateDynamicCSS() {
    const css = `
        :root {
            --bg-color: ${portfolioData.colors.bgLight};
            --text-color: ${portfolioData.colors.textLight};
            --primary-color: ${portfolioData.colors.primaryLight};
        }
        .dark-mode {
            --bg-color: ${portfolioData.colors.bgDark};
            --text-color: ${portfolioData.colors.textDark};
            --primary-color: ${portfolioData.colors.primaryDark};
        }
    `;
    localStorage.setItem('dynamicCSS', css);
}

// Generate dynamic HTML injector
function generateDynamicHTML() {
    const injectorScript = `
        // Dynamic content loader
        (function() {
            const data = ${JSON.stringify(portfolioData)};
            
            // Update site title
            document.title = data.site.title;
            
            // Update logo
            const logo = document.querySelector('.logo span');
            if(logo) logo.textContent = data.site.logo;
            
            // Update hero section
            const heroName = document.querySelector('.mydetails h1');
            if(heroName) heroName.innerHTML = data.hero.firstName + ' <span>' + data.hero.lastName + '</span>';
            
            // Update about section
            const aboutHeading = document.querySelector('#about h2');
            if(aboutHeading) aboutHeading.textContent = data.about.heading;
            const aboutDesc = document.querySelector('#about p');
            if(aboutDesc) aboutDesc.textContent = data.about.description;
            
            // Update footer
            const footer = document.querySelector('.footer-bottom p');
            if(footer) footer.innerHTML = data.site.copyright;
            
            // Update social links
            const socialLinks = document.querySelectorAll('.social-media a');
            if(socialLinks[0]) socialLinks[0].href = data.social.instagram;
            if(socialLinks[1]) socialLinks[1].href = data.social.github;
            if(socialLinks[2]) socialLinks[2].href = data.social.linkedin;
            
            // Update WhatsApp number
            const whatsappLink = document.getElementById('whatsapp-link');
            if(whatsappLink) {
                whatsappLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'https://wa.me/' + data.contact.whatsapp;
                });
            }
            
            console.log('✅ Dynamic content loaded from admin panel');
        })();
    `;
    localStorage.setItem('dynamicHTMLInjector', injectorScript);
}

// View live site
function viewLiveSite() {
    saveAllData();
    window.open('../index.html', '_blank');
}

// Switch tabs
function switchTab(tabName, button) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (button) {
        button.classList.add('active');
    }
}

document.getElementById('heroImage')?.addEventListener('input', updateHeroImagePreview);
['primaryColorLight', 'bgColorLight', 'textColorLight'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', applyThemePreview);
});

// Initialize
loadDataToForms();

// Auto-save every 30 seconds
setInterval(() => {
    saveAllData();
}, 30000);