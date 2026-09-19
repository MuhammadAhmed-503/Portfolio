// ===== Live2D Avatar Setup =====
let live2dApp = null;
let live2dModel = null;
let currentMouthValue = 0;
let isThinkingState = false;
let thinkingStartTime = 0;
let currentBlinkValue = 1;
const avatarStartTime = performance.now();

function setParam(id, value) {
  if (!live2dModel || !live2dModel.internalModel) return;
  try {
    if (live2dModel.internalModel.coreModel && typeof live2dModel.internalModel.coreModel.setParameterValueById === 'function') {
      live2dModel.internalModel.coreModel.setParameterValueById(id, value);
    } else if (typeof live2dModel.internalModel.setParameterValue === 'function') {
      live2dModel.internalModel.setParameterValue(id, value);
    }
  } catch (e) {
    console.warn('setParam failed for parameter:', id, e);
  }
}

let speakingWeight = 0;

function updateAvatarFrame() {
  if (!live2dModel || !live2dModel.internalModel) return;

  const now = performance.now();
  const elapsed = (now - avatarStartTime) / 1000;

  // 1. Procedural Idle Breathing
  setParam('ParamBreath', (Math.sin(elapsed * 2.5) + 1) * 0.5);

  // 2. Base Expression
  const params = EXPRESSIONS[currentExpression] || EXPRESSIONS.idle;
  for (const [paramId, value] of Object.entries(params)) {
    setParam(paramId, value);
  }

  // 3. Fast & Smooth Speaking Weight Transition (lerp)
  const isSpeaking = currentMouthValue > 0.02;
  if (isSpeaking) {
    speakingWeight += (1 - speakingWeight) * 0.28; // Faster onset
  } else {
    speakingWeight += (0 - speakingWeight) * 0.12;
  }

  // 4. Dynamic Head Angles (Angle X, Y, Z) - Faster & More Expressive
  // Idle Head Sway
  const idleAngleX = Math.sin(elapsed * 0.8) * 4 + Math.cos(elapsed * 0.4) * 2;
  const idleAngleY = Math.cos(elapsed * 0.6) * 3;
  const idleAngleZ = Math.sin(elapsed * 0.5) * 3;

  // Energetic Speaking Head Gestures (Lively turns, responsive cadence nodding, expressive tilts)
  const speakAngleX = Math.sin(elapsed * 2.6) * 22 + Math.cos(elapsed * 1.3) * 11;
  const speakAngleY = Math.sin(elapsed * 4.2) * 9 - (currentMouthValue * 14); // Rhythmic conversational nodding
  const speakAngleZ = Math.sin(elapsed * 2.1) * 12 + Math.cos(elapsed * 3.1) * 6;

  let targetAngleX = idleAngleX * (1 - speakingWeight) + speakAngleX * speakingWeight;
  let targetAngleY = idleAngleY * (1 - speakingWeight) + speakAngleY * speakingWeight;
  let targetAngleZ = idleAngleZ * (1 - speakingWeight) + speakAngleZ * speakingWeight;

  // 5. Eye Gaze Shifting (Active conversation eye tracking)
  let eyeX = Math.sin(elapsed * 0.8) * 0.2 + (speakingWeight * Math.sin(elapsed * 2.2) * 0.45);
  let eyeY = Math.cos(elapsed * 0.7) * 0.15 - (speakingWeight * currentMouthValue * 0.3);

  // 6. Thinking State (Head Tilt & curious upward gaze)
  if (isThinkingState) {
    const elapsedThinking = (now - thinkingStartTime) / 1000;
    targetAngleZ = Math.sin(elapsedThinking * 1.8) * 10 + 8; // curious head tilt
    targetAngleY = Math.sin(elapsedThinking * 1.2) * 4 + 6; // looking up curiously
    targetAngleX = Math.sin(elapsedThinking * 0.9) * 8;
    eyeX = 0.4 + Math.sin(elapsedThinking * 1.4) * 0.18;
    eyeY = 0.5;
    const mouthTwitch = (Math.sin(elapsedThinking * 4.2) + 1) * 0.1;
    setParam('ParamMouthOpenY', mouthTwitch);
  }

  setParam('ParamAngleX', targetAngleX);
  setParam('ParamAngleY', targetAngleY);
  setParam('ParamAngleZ', targetAngleZ);
  setParam('ParamEyeBallX', eyeX);
  setParam('ParamEyeBallY', eyeY);

  // 7. Dynamic Body Posture & Upper Body Sway (Energetic Anime Sway)
  const bodyAngleX = targetAngleX * 0.45 + Math.sin(elapsed * 1.8) * (3 + speakingWeight * 7);
  const bodyAngleY = Math.sin(elapsed * 2.8) * 3 - (speakingWeight * currentMouthValue * 5);
  const bodyAngleZ = targetAngleZ * 0.35 + Math.sin(elapsed * 1.4) * (2 + speakingWeight * 4);

  setParam('ParamBodyAngleX', bodyAngleX);
  setParam('ParamBodyAngleY', bodyAngleY);
  setParam('ParamBodyAngleZ', bodyAngleZ);

  // 8. Natural Eye Blink
  setParam('ParamEyeLOpen', currentBlinkValue);
  setParam('ParamEyeROpen', currentBlinkValue);

  // 9. Spoken Audio Lip-Sync, Eyebrows & Communicative Gestures
  if (currentMouthValue > 0) {
    setParam('ParamMouthOpenY', currentMouthValue);
    if (currentExpression === 'happy' || currentExpression === 'laughing') {
      setParam('ParamMouthForm', 0.6 + currentMouthValue * 0.4);
    } else {
      setParam('ParamMouthForm', currentMouthValue * 0.4);
    }

    // Expressive eyebrow emphasis while talking
    setParam('ParamBrowLY', 0.1 + currentMouthValue * 0.4);
    setParam('ParamBrowRY', 0.1 + currentMouthValue * 0.4);

    // Fast, communicative arm/hand gesturing
    const speakArmL = Math.sin(elapsed * 3.2) * 28 + Math.cos(elapsed * 1.6) * 12;
    const speakArmR = -Math.sin(elapsed * 2.7 + 0.5) * 26 + Math.cos(elapsed * 1.8) * 10;
    const armL = 0 * (1 - speakingWeight) + speakArmL * speakingWeight;
    const armR = 0 * (1 - speakingWeight) + speakArmR * speakingWeight;

    setParam('ParamArmLA', armL);
    setParam('ParamArmRA', armR);
  } else {
    // Smooth return to resting arm position
    const idleArmL = Math.sin(elapsed * 1.4) * 3 * (1 - speakingWeight);
    const idleArmR = -Math.sin(elapsed * 1.4) * 3 * (1 - speakingWeight);
    setParam('ParamArmLA', idleArmL);
    setParam('ParamArmRA', idleArmR);
  }

  // 10. Secondary Motion / Hair Physics Dynamics (2x dynamic bounce)
  const hairMotion = Math.sin(elapsed * 3.8) * (0.35 + speakingWeight * 0.75);
  setParam('ParamHairAhoge', hairMotion * 1.4);
  setParam('ParamHairFront', hairMotion * 1.2);
  setParam('ParamHairSide', Math.cos(elapsed * 3.2) * (0.35 + speakingWeight * 0.65));
  setParam('ParamHairBack', Math.sin(elapsed * 2.5) * (0.25 + speakingWeight * 0.55));
}

async function initLive2DAvatar() {
  const canvas = document.getElementById('avatar-canvas');
  if (!canvas) {
    console.warn('Avatar canvas not found');
    return;
  }

  if (live2dApp) return;

  try {
    if (typeof PIXI === 'undefined' || !PIXI.live2d || !PIXI.live2d.Live2DModel) {
      console.warn('PIXI or Live2D library not ready yet, retrying...');
      setTimeout(initLive2DAvatar, 250);
      return;
    }

    live2dApp = new PIXI.Application({
      view: canvas,
      backgroundAlpha: 0,
      width: 300,
      height: 400,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
    });

    live2dModel = await PIXI.live2d.Live2DModel.from(
      'assets/Live2D/hiyori/hiyori_free_t08.model3.json'
    );
    live2dApp.stage.addChild(live2dModel);

    live2dModel.scale.set(0.13);
    live2dModel.x = 25;
    live2dModel.y = 10;

    try {
      if (live2dModel.internalModel && live2dModel.internalModel.motionManager) {
        live2dModel.internalModel.motionManager.stopAllMotions();
      }
    } catch (e) {
      console.warn('Could not stop default motions:', e);
    }

    live2dApp.ticker.add(updateAvatarFrame);
    startBlinkLoop();
    console.log('✅ AIKO Live2D avatar loaded successfully!');
  } catch (err) {
    console.error('❌ Live2D load failed:', err);
  }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initLive2DAvatar, 100);
} else {
  window.addEventListener('DOMContentLoaded', initLive2DAvatar);
  window.addEventListener('load', initLive2DAvatar);
}

// ===== Voice Assistant =====
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const BACKEND_BASE = isLocal ? `http://${window.location.hostname || "127.0.0.1"}:8000` : "https://portfolio-backend-zcy2.onrender.com";
const BACKEND_URL = `${BACKEND_BASE}/api/voice/process`;

const SECTION_MAP = {
  scroll_home: "home",
  scroll_education: "education",
  scroll_projects: "projects",
  scroll_contact: "contact",
  scroll_skills: "skills",
  scroll_certificates: "certificates",
  scroll_services: "services",
};

let conversationHistory = JSON.parse(localStorage.getItem("aikoHistory") || "[]");

// ---- Clean text for TTS (remove emojis) ----
// ---- Clean text for TTS (remove ALL emojis, no word substitution) ----
function cleanTextForSpeech(text) {
  let cleaned = text;

  try {
    cleaned = cleaned.replace(/\p{Extended_Pictographic}/gu, '');
  } catch (e) {
    cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}]/gu, '');
  }

  return cleaned.replace(/\s+/g, ' ').trim();
}

// ---- Speech Recognition & Continuous Conversational Loop ----
let continuousMode = false;
let isListening = false;
let isSpeaking = false;
let isProcessing = false;
let recognition = null;
let restartTimeout = null;
let inactivityTimer = null;
const INACTIVITY_TIMEOUT_MS = 60000; // 60 seconds of complete silence before auto-standby

function resetInactivityTimer() {
  if (inactivityTimer) clearTimeout(inactivityTimer);
  if (!continuousMode) return;
  inactivityTimer = setTimeout(() => {
    if (continuousMode && !isSpeaking && !isProcessing) {
      console.log("Aiko auto-standby due to inactivity.");
      stopVoiceAssistant();
    }
  }, INACTIVITY_TIMEOUT_MS);
}

function safeStartRecognition() {
  if (!continuousMode || isSpeaking || isProcessing) return;
  if (!recognition) {
    recognition = initSpeechRecognition();
  }
  if (!recognition) return;

  if (restartTimeout) clearTimeout(restartTimeout);

  if (!isListening) {
    try {
      recognition.start();
      isListening = true;
      resetInactivityTimer();
      updateFabUI();
    } catch (e) {
      // InvalidStateError occurs if recognition is already running or starting
    }
  }
}

function safeStopRecognition() {
  if (restartTimeout) clearTimeout(restartTimeout);
  if (inactivityTimer) clearTimeout(inactivityTimer);
  if (recognition) {
    try {
      recognition.abort();
    } catch (e) { }
  }
  isListening = false;
  updateFabUI();
}

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn("Speech Recognition not supported in this browser.");
    return null;
  }

  const rec = new SpeechRecognition();
  rec.continuous = false; // per-utterance with auto-restart is most reliable across modern browsers
  rec.interimResults = false;
  rec.lang = "en-US";

  rec.onstart = () => {
    isListening = true;
    updateMicUI(true);
    resetInactivityTimer();
  };

  rec.onresult = (event) => {
    resetInactivityTimer();
    const transcript = event.results[0][0]?.transcript;
    if (transcript && transcript.trim()) {
      console.log("User said:", transcript);
      handleUserSpeech(transcript.trim());
    }
  };

  rec.onend = () => {
    isListening = false;
    updateMicUI(false);
    // Agar continuous mode ON hai aur Aiko bol/process nahi kar rahi, smoothly restart listening
    if (continuousMode && !isSpeaking && !isProcessing) {
      if (restartTimeout) clearTimeout(restartTimeout);
      restartTimeout = setTimeout(() => {
        safeStartRecognition();
      }, 200);
    }
  };

  rec.onerror = (event) => {
    if (event.error === "no-speech") {
      // Silence timeout: onend will seamlessly handle restarting when continuousMode is ON
      return;
    }
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      console.error("Microphone permission denied:", event.error);
      continuousMode = false;
      isListening = false;
      flashMicError();
      updateMicUI(false);
      return;
    }
    console.warn("Speech recognition notice:", event.error);
  };

  return rec;
}

// ---- Send to backend ----
let currentRequestController = null;

async function handleUserSpeech(text) {
  const reqId = Date.now();
  isProcessing = true;
  safeStopRecognition(); // Mute mic immediately while processing & speaking

  // Interrupt handling: abort any pending request or speech
  if (currentRequestController) {
    currentRequestController.abort();
  }
  if (currentAudio) {
    currentAudio.pause();
    setMouth(0);
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  currentRequestController = new AbortController();
  setThinkingState(true);

  try {
    console.time(`gemini-response-${reqId}`);
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, history: conversationHistory }),
      signal: currentRequestController.signal,
    });

    const data = await response.json();
    console.timeEnd(`gemini-response-${reqId}`);
    console.log("AI response:", data);

    conversationHistory.push({ role: "user", content: text });
    conversationHistory.push({ role: "assistant", content: data.response });
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }
    localStorage.setItem("aikoHistory", JSON.stringify(conversationHistory));

    const textLower = text.toLowerCase().trim();
    if (/\b(?:dark|night)\b/i.test(textLower) && /\b(?:mod|mode|theme)\b/i.test(textLower)) {
      executeAIAdminAction({ type: "toggle_dark_mode", payload: { mode: "dark" } }, "toggle_dark_mode", text);
    } else if (/\b(?:light|day|white)\b/i.test(textLower) && /\b(?:mod|mode|theme)\b/i.test(textLower)) {
      executeAIAdminAction({ type: "toggle_dark_mode", payload: { mode: "light" } }, "toggle_dark_mode", text);
    } else if (data.action || (data.is_command && data.command)) {
      executeAIAdminAction(data.action, data.command, text);
    } else {
      for (const [cName, cHex] of Object.entries(COLOR_HEX_MAP)) {
        if (textLower.includes(cName)) {
          executeAIAdminAction({ type: "update_theme_colors", payload: { primaryColor: cHex } }, "update_theme_colors", text);
          break;
        }
      }
    }

    setThinkingState(false);
    speakResponse(data.response);
    setAvatarExpression(data.expression);

  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Request cancelled (interrupted by new speech)");
      return;
    }
    console.error("Error talking to backend:", err);
    setThinkingState(false);
    flashMicError();               // ← error indicator (#8)
    speakResponse("Sorry, I couldn't connect to my brain right now!");
  }
}

function setThinkingState(isThinking) {
  isThinkingState = isThinking;
  if (isThinking) {
    thinkingStartTime = performance.now();
    setAvatarExpression("thinking");
  } else {
    currentMouthValue = 0;
  }

  const fab = document.getElementById("voice-assistant-fab");
  const indicator = document.getElementById("thinking-indicator");
  if (fab) fab.classList.toggle("thinking", isThinking);
  if (indicator) {
    indicator.classList.toggle("hidden", !isThinking);
  }
}

function flashMicError() {
  const fab = document.getElementById("voice-assistant-fab");
  if (!fab) return;
  fab.classList.add("error-flash");
  setTimeout(() => fab.classList.remove("error-flash"), 1000);
}

// ---- Supabase client for AI assistant (Global Cloud Sync) ----
const AI_SUPABASE_URL = 'https://qethcwnjbwrjqxumanar.supabase.co';
const AI_SUPABASE_KEY = 'sb_publishable_SooiW5_L00Z3YbwS3QiTlQ_PrWiKdbQ';
let aiSupabaseClient = null;
try {
  if (window.supabase) {
    aiSupabaseClient = window.supabase.createClient(AI_SUPABASE_URL, AI_SUPABASE_KEY);
  }
} catch (e) {
  console.warn('AI Supabase init:', e);
}

const DEFAULT_PORTFOLIO_DATA = {
  skills: {
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
  projects: {
    items: [
      { title: "PDF Merger App", description: "A web app to merge multiple PDF files into one.", image: "assets/Images/project1.jpg", liveUrl: "https://pdf-merger-503.netlify.app/", githubUrl: "https://github.com/MuhammadAhmed-503/pdf-merger" },
      { title: "Tasbeeh Counter", description: "A simple digital Tasbeeh Counter to keep track of your zikar.", image: "assets/Images/tasbeeh-counter.jpg", liveUrl: "https://tasbeeh-counter-503.netlify.app", githubUrl: "https://github.com/MuhammadAhmed-503/Counter-Website" },
      { title: "Free Pic", description: "A simple web app to browse and download high-quality images for free, powered by the Unsplash API.", image: "assets/Images/free-pic-project.jpg", liveUrl: "https://free-pic-503.netlify.app", githubUrl: "https://github.com/MuhammadAhmed-503" },
      { title: "BlogShpere", description: "Full-stack blogging platform built with React, Node, Express, MongoDB and Cloudinary.", image: "assets/Images/blogsphere.png", liveUrl: "https://blogsphere-sj9b.vercel.app/", githubUrl: "https://github.com/MuhammadAhmed-503/BLOGSPHERE" },
      { title: "My School Website", description: "School website built with HTML, CSS, JS and Firebase (R2).", image: "assets/Images/ghss.png", liveUrl: "https://ghss-sarai-public.web.app/", githubUrl: "" },
      { title: "Alamgir Fashion Center", description: "E-commerce website built with React, Node, Express, MongoDB and Cloudinary.", image: "assets/Images/afc-yaseen.png", liveUrl: "https://afc-yaseen.vercel.app/", githubUrl: "https://github.com/MuhammadAhmed-503/alamgir-fashion-center" },
      { title: "Delicious", description: "Restaurant table booking website with full-stack features using React, Node, Express, MongoDB and Cloudinary.", image: "assets/Images/deliciousone.png", liveUrl: "https://deliciousone.vercel.app/", githubUrl: "https://github.com/MuhammadAhmed-503/delicious" }
    ]
  }
};

function getTechIconUrl(skillName) {
  if (!skillName) return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg";
  const name = skillName.toLowerCase().trim();

  const ICON_MAP = {
    html: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    html5: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    css: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    css3: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    js: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    ts: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    typescript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    py: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    c: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
    "c++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    cpp: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    "c#": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
    csharp: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
    react: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "react js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "react.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "react native": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    next: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    "next.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    nextjs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    node: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    "node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    nodejs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    express: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    "express.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    expressjs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    mongodb: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    mongo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    firebase: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
    github: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    postman: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg",
    gsap: "https://cdn.worldvectorlogo.com/logos/gsap-greensock.svg",
    php: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    ruby: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
    rails: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-original-wordmark.svg",
    rust: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
    go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
    golang: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
    docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    kubernetes: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
    flutter: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
    dart: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
    tailwind: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
    tailwindcss: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
    bootstrap: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
    sass: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",
    vue: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    vuejs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    angular: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
    angularjs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
    sql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    mysql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    postgresql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    postgres: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    sqlite: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
    redis: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    django: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
    flask: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
    fastapi: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
    spring: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
    aws: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    linux: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    figma: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    photoshop: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
    wordpress: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
    graphql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
    redux: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
    webpack: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg",
    vite: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
    tensorflow: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    pytorch: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg"
  };

  if (ICON_MAP[name]) return ICON_MAP[name];

  const slug = name.replace(/[^a-z0-9]/g, '');
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
}

const SKILL_ALIASES = {
  "c plus plus": "C++",
  "c plus": "C++",
  "cpp": "C++",
  "c++": "C++",
  "c sharp": "C#",
  "c#": "C#",
  "my sql": "MySQL",
  "mysql": "MySQL",
  "sql": "SQL",
  "postgre sql": "PostgreSQL",
  "postgres": "PostgreSQL",
  "postgresql": "PostgreSQL",
  "mongo db": "MongoDB",
  "mongodb": "MongoDB",
  "react js": "React",
  "reactjs": "React",
  "react": "React",
  "next js": "Next.js",
  "nextjs": "Next.js",
  "next": "Next.js",
  "node js": "Node.js",
  "nodejs": "Node.js",
  "node": "Node.js",
  "express js": "Express",
  "expressjs": "Express",
  "express": "Express",
  "java script": "JavaScript",
  "javascript": "JavaScript",
  "js": "JavaScript",
  "type script": "TypeScript",
  "typescript": "TypeScript",
  "ts": "TypeScript",
  "html5": "HTML",
  "html": "HTML",
  "css3": "CSS",
  "css": "CSS",
  "tailwind css": "Tailwind CSS",
  "tailwindcss": "Tailwind CSS",
  "tailwind": "Tailwind CSS",
  "bootstrap": "Bootstrap",
  "python": "Python",
  "py": "Python",
  "java": "Java",
  "flutter": "Flutter",
  "dart": "Dart",
  "docker": "Docker",
  "kubernetes": "Kubernetes",
  "k8s": "Kubernetes",
  "git hub": "GitHub",
  "github": "GitHub",
  "git": "Git",
  "postman": "Postman",
  "gsap": "GSAP",
  "vue js": "Vue.js",
  "vue": "Vue.js",
  "angular": "Angular",
  "django": "Django",
  "flask": "Flask",
  "fastapi": "FastAPI",
  "fast api": "FastAPI",
  "firebase": "Firebase",
  "figma": "Figma",
  "photoshop": "Photoshop",
  "wordpress": "WordPress",
  "redux": "Redux",
  "graphql": "GraphQL"
};

function normalizeSkillName(raw) {
  if (!raw) return "";
  let clean = raw.toLowerCase().trim();
  clean = clean.replace(/^(?:the\s+|a\s+|new\s+|skills?\s+|named\s+)+/i, "");
  clean = clean.replace(/(?:\s+(?:as|in|into|to)\s+(?:my\s+)?(?:skills|portfolio|profile).*)$/i, "");
  clean = clean.replace(/(?:\s+skills?)$/i, "");
  clean = clean.trim();
  if (SKILL_ALIASES[clean]) return SKILL_ALIASES[clean];
  for (const [alias, standard] of Object.entries(SKILL_ALIASES)) {
    if (clean === alias || clean === alias.replace(/\s+/g, '')) {
      return standard;
    }
  }
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function extractSkillNames(text) {
  if (!text) return [];
  let clean = text.toLowerCase().trim();
  
  // Remove command prefixes like "add a new skills", "remove the named skills", etc.
  clean = clean.replace(/^(?:please\s+)?(?:add|insert|include|remove|delete|hatao|daalo)\s+(?:the\s+)?(?:a\s+)?(?:new\s+)?(?:skills?|projects?)\s+(?:called\s+|named\s+(?:as\s+)?)?/i, "");
  clean = clean.replace(/^(?:the\s+)?(?:named\s+)?(?:skills?|projects?)\s+/i, "");
  clean = clean.replace(/(?:\s+(?:from|as|in|into|to)\s+(?:my\s+)?(?:skills|projects|portfolio|profile).*)$/i, "");
  clean = clean.replace(/(?:\s+skills?)$/i, "");

  // Split by conjunctions: "and", "in", "&", "aur", commas
  const parts = clean.split(/\s+(?:and|in|aur|as\s+well\s+as|with|\&|,)\s+|\s*,\s*/i).map(p => p.trim()).filter(Boolean);
  
  const results = [];
  parts.forEach(part => {
    const norm = normalizeSkillName(part);
    if (norm && norm.length > 1 && !results.includes(norm)) {
      results.push(norm);
    }
  });

  return results.length > 0 ? results : (normalizeSkillName(clean) ? [normalizeSkillName(clean)] : []);
}

function getSanitizedSkills() {
  const rawSaved = localStorage.getItem("portfolioData");
  let data = rawSaved ? JSON.parse(rawSaved) : {};
  let list = Array.isArray(data.skills?.items) ? [...data.skills.items] : [];

  // Filter out corrupted test items like "A new", "New Skill", "Skills c plus...", empty names
  list = list.filter(s => {
    if (!s || !s.name) return false;
    const n = s.name.toLowerCase();
    if (n === "a new" || n === "new skill" || n.startsWith("skills ") || n.includes(" in mysql")) return false;
    return true;
  });

  // Normalize all names and ensure right icons
  list = list.map(s => ({
    name: normalizeSkillName(s.name),
    icon: s.icon && !s.icon.includes("undefined") ? s.icon : getTechIconUrl(s.name)
  }));

  // Merge default skills if missing
  const defaultList = DEFAULT_PORTFOLIO_DATA.skills.items;
  defaultList.forEach(defSkill => {
    if (!list.some(s => s.name.toLowerCase() === defSkill.name.toLowerCase())) {
      list.push(defSkill);
    }
  });

  return list;
}

function getSanitizedProjects() {
  const rawSaved = localStorage.getItem("portfolioData");
  let data = rawSaved ? JSON.parse(rawSaved) : {};
  let list = Array.isArray(data.projects?.items) ? [...data.projects.items] : [];

  list = list.filter(p => p && p.title && p.title.toLowerCase() !== "new project");

  const defaultList = DEFAULT_PORTFOLIO_DATA.projects.items;
  defaultList.forEach(defProj => {
    if (!list.some(p => p.title.toLowerCase() === defProj.title.toLowerCase())) {
      list.push(defProj);
    }
  });

  return list;
}

function extractProjectTitle(text) {
  if (!text) return "AI Assistant";
  let clean = text.trim();
  clean = clean.replace(/^(?:please\s+)?(?:add|insert|create)\s+(?:a\s+)?(?:new\s+)?(?:project\s+)?(?:called\s+|named\s+(?:as\s+)?)?/i, "");
  clean = clean.replace(/(?:\s+(?:in|into|to)\s+(?:my\s+)?(?:projects|portfolio).*)$/i, "");
  return clean.trim() || "AI Assistant";
}

function extractLogoOrName(text) {
  if (!text) return "";
  let clean = text.trim();
  const m = clean.match(/(?:from\s+[\w\s]+\s+)?to\s+([A-Za-z0-9_ -]+)/i);
  if (m && m[1]) return m[1].trim();
  clean = clean.replace(/^(?:please\s+)?(?:change|update|set|make)\s+(?:the\s+)?(?:logo|name)\s+(?:to\s+|as\s+)?/i, "");
  return clean.trim();
}

function parseFullName(fullName) {
  if (!fullName) return { first: "", last: "" };
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "" };
  return {
    first: parts.slice(0, -1).join(" "),
    last: parts[parts.length - 1]
  };
}

function extractHeroNames(text, payload) {
  if (payload.firstName && payload.lastName) {
    return { first: payload.firstName, last: payload.lastName };
  }
  let combined = "";
  if (payload.firstName && !payload.lastName) {
    const parsed = parseFullName(payload.firstName);
    if (parsed.last) return parsed;
    combined = payload.firstName;
  } else if (text) {
    const m = text.match(/\bto\s+([A-Za-z\s]+)$/i);
    if (m && m[1]) {
      combined = m[1].trim();
    } else {
      const alt = text.match(/(?:from\s+.+?\s+)?to\s+([A-Za-z\s]+)/i);
      if (alt && alt[1]) combined = alt[1].trim();
      else {
        combined = text.replace(/^(?:please\s+)?(?:change|update|set|make)\s+(?:the\s+)?(?:name|hero\s+name|my\s+name)\s+(?:in\s+hero\s+)?(?:to\s+|as\s+)?/i, "").trim();
      }
    }
  }
  return parseFullName(combined);
}

const COLOR_HEX_MAP = {
  blue: "#2196f3",
  gold: "#ffd700",
  yellow: "#ffd600",
  purple: "#9c27b0",
  violet: "#8a2be2",
  green: "#00e676",
  emerald: "#00e676",
  red: "#ff1744",
  crimson: "#ee0033",
  pink: "#ff4081",
  magenta: "#e91e63",
  orange: "#ff6d00",
  cyan: "#00e5ff",
  teal: "#00bfa5"
};

function applyLiveThemeColors(primaryColor, bgColor, textColor) {
  if (primaryColor) {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.body.style.setProperty('--primary-color', primaryColor);
    
    let styleTag = document.getElementById('ai-live-theme-override');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'ai-live-theme-override';
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
      :root, .dark-mode, body, .container {
        --primary-color: ${primaryColor} !important;
      }
      .heading, .heading span, .mydetails h1 span, .logo span, nav ul li a:hover {
        color: ${primaryColor} !important;
      }
      .image1 {
        border-color: ${primaryColor} !important;
        box-shadow: 0 0 25px ${primaryColor} !important;
      }
      header, .home-div, .about, .myskills {
        border-bottom-color: ${primaryColor} !important;
      }
      .stylebutton, .box:hover, .skill-card:hover, .project-card:hover {
        border-color: ${primaryColor} !important;
      }
      .project-card a {
        background: ${primaryColor} !important;
        border-color: ${primaryColor} !important;
        color: #ffffff !important;
      }
      .project-card a:hover {
        filter: brightness(1.15);
      }
    `;
  }
  if (bgColor) {
    document.documentElement.style.setProperty('--bg-color', bgColor);
    document.body.style.setProperty('--bg-color', bgColor);
  }
  if (textColor) {
    document.documentElement.style.setProperty('--text-color', textColor);
    document.body.style.setProperty('--text-color', textColor);
  }
}

// ---- Execute AI Admin Actions with Local Sandbox / Global Sync Isolation ----
async function executeAIAdminAction(action, command, userSpeechText = "") {
  const actionType = action?.type && action.type !== 'none' ? action.type : command;
  const payload = action?.payload || {};

  if (!actionType) return;

  // 1. Navigation Actions
  if (SECTION_MAP[actionType]) {
    const el = document.getElementById(SECTION_MAP[actionType]);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (actionType === "scroll_section" && payload.section) {
    const cleanSection = payload.section.replace("#", "").toLowerCase();
    const el = document.getElementById(cleanSection);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    return;
  }

  // Load sanitized data with all defaults preserved
  const rawSaved = localStorage.getItem("portfolioData");
  let data = rawSaved ? JSON.parse(rawSaved) : {};
  data.skills = data.skills || {};
  data.skills.items = getSanitizedSkills();
  data.projects = data.projects || {};
  data.projects.items = getSanitizedProjects();

  let modified = false;

  switch (actionType) {
    case "toggle_dark_mode": {
      const mode = payload.mode;
      const isDark = document.body.classList.contains("dark-mode");
      if (mode === "dark" || (mode !== "light" && !isDark)) {
        document.body.classList.add("dark-mode");
        document.documentElement.classList.add("dark-mode");
        document.body.style.removeProperty('--bg-color');
        document.body.style.removeProperty('--text-color');
        document.documentElement.style.removeProperty('--bg-color');
        document.documentElement.style.removeProperty('--text-color');
        const themeBtn = document.querySelector(".themeButton");
        if (themeBtn) themeBtn.textContent = "Light Mode";
        if (typeof initializeBackgroundAnimation === "function") initializeBackgroundAnimation();
      } else {
        document.body.classList.remove("dark-mode");
        document.documentElement.classList.remove("dark-mode");
        document.body.style.removeProperty('--bg-color');
        document.body.style.removeProperty('--text-color');
        document.documentElement.style.removeProperty('--bg-color');
        document.documentElement.style.removeProperty('--text-color');
        const themeBtn = document.querySelector(".themeButton");
        if (themeBtn) themeBtn.textContent = "Dark Mode";
        if (typeof initializeBackgroundAnimation === "function") initializeBackgroundAnimation();
      }
      console.log('✅ Theme toggled by AI!');
      break;
    }

    case "update_background_animation":
    case "change_background": {
      let animName = payload.animationName;
      if (!animName && userSpeechText) {
        const textLow = userSpeechText.toLowerCase();
        if (textLow.includes("animated") || textLow.includes("wallpaper") || textLow.includes("video") || textLow.includes("live")) {
          animName = "animated-wallpaper";
        } else if (textLow.includes("space") || textLow.includes("star") || textLow.includes("galaxy")) {
          animName = "space";
        } else if (textLow.includes("particle") || textLow.includes("dot") || textLow.includes("mesh")) {
          animName = "dot-particles";
        }
      }

      if (animName) {
        const isDark = document.body.classList.contains("dark-mode");
        data.animations = data.animations || {};
        if (isDark) data.animations.darkModeAnimation = animName;
        else data.animations.lightModeAnimation = animName;
        localStorage.setItem("portfolioData", JSON.stringify(data));
        if (typeof initializeBackgroundAnimation === "function") {
          initializeBackgroundAnimation();
        }
        modified = true;
      } else {
        cycleBackgroundAnimation();
      }
      break;
    }

    case "update_theme_colors": {
      data.colors = data.colors || {};
      const isDarkMode = document.body.classList.contains("dark-mode");
      let primary = payload.primaryColor;
      if (!primary && userSpeechText) {
        const textLow = userSpeechText.toLowerCase();
        for (const [cName, cHex] of Object.entries(COLOR_HEX_MAP)) {
          if (textLow.includes(cName)) {
            primary = cHex;
            break;
          }
        }
      }
      if (primary) {
        if (isDarkMode) data.colors.primaryDark = primary;
        else data.colors.primaryLight = primary;
        applyLiveThemeColors(primary, null, null);
        modified = true;
      }
      if (payload.bgColor) {
        if (isDarkMode) data.colors.bgDark = payload.bgColor;
        else data.colors.bgLight = payload.bgColor;
        applyLiveThemeColors(null, payload.bgColor, null);
        modified = true;
      }
      if (payload.textColor) {
        if (isDarkMode) data.colors.textDark = payload.textColor;
        else data.colors.textLight = payload.textColor;
        applyLiveThemeColors(null, null, payload.textColor);
        modified = true;
      }
      break;
    }

    case "update_site": {
      data.site = data.site || {};
      let logoText = payload.logo || payload.siteTitle || extractLogoOrName(userSpeechText);
      if (logoText) {
        data.site.logo = logoText;
        const logoEl = document.querySelector('.logo span');
        if (logoEl) logoEl.textContent = logoText;
      }
      if (payload.siteTitle || payload.title) {
        data.site.title = payload.siteTitle || payload.title;
        document.title = data.site.title;
      }
      if (payload.copyright) {
        data.site.copyright = payload.copyright;
        const footerText = document.querySelector('.footer-bottom p');
        if (footerText) footerText.innerHTML = payload.copyright;
      }
      modified = true;
      break;
    }

    case "update_hero": {
      data.hero = data.hero || {};
      data.site = data.site || {};
      
      // If user mentioned logo in speech, update the navbar logo as well
      if (userSpeechText && /logo/i.test(userSpeechText)) {
        let extractedLogo = payload.firstName || extractLogoOrName(userSpeechText);
        if (extractedLogo) {
          data.site.logo = extractedLogo;
          const logoEl = document.querySelector('.logo span');
          if (logoEl) logoEl.textContent = extractedLogo;
        }
      }

      const { first, last } = extractHeroNames(userSpeechText, payload);
      if (first) data.hero.firstName = first;
      if (last !== undefined) data.hero.lastName = last;
      if (payload.typingWords && payload.typingWords.length) data.hero.typingWords = payload.typingWords;
      if (payload.image) data.hero.image = payload.image;

      // Apply live DOM updates to Hero Section
      const heroNameEl = document.querySelector('.mydetails h1');
      if (heroNameEl) {
        heroNameEl.innerHTML = `${data.hero.firstName || ''} <span>${data.hero.lastName || ''}</span>`;
      }
      if (payload.image) {
        const heroImgEl = document.querySelector('.image1');
        if (heroImgEl) heroImgEl.src = payload.image;
      }
      const homeSec = document.getElementById("home");
      if (homeSec) homeSec.scrollIntoView({ behavior: "smooth" });
      modified = true;
      break;
    }

    case "update_about": {
      data.about = data.about || {};
      if (payload.heading) {
        data.about.heading = payload.heading;
        const h2 = document.querySelector('#about h2, .about h2, .aboutdiv h2');
        if (h2) h2.textContent = payload.heading;
      }
      if (payload.description) {
        data.about.description = payload.description;
        const p = document.querySelector('#about p, .about p, .aboutdiv p');
        if (p) p.textContent = payload.description;
      }
      const aboutSec = document.getElementById("about");
      if (aboutSec) aboutSec.scrollIntoView({ behavior: "smooth" });
      modified = true;
      break;
    }

    case "update_education": {
      data.education = data.education || {};
      if (payload.heading) {
        data.education.heading = payload.heading;
        const eduH2 = document.querySelector('#education h2');
        if (eduH2) eduH2.textContent = payload.heading;
      }
      if (payload.title || payload.description) {
        data.education.items = data.education.items || [];
        data.education.items.unshift({
          year: payload.year || new Date().getFullYear().toString(),
          title: payload.title || "Education Milestone",
          description: payload.description || ""
        });
      }
      const eduSec = document.getElementById("education");
      if (eduSec) eduSec.scrollIntoView({ behavior: "smooth" });
      modified = true;
      break;
    }

    case "update_services": {
      data.services = data.services || {};
      if (payload.heading) {
        data.services.heading = payload.heading;
        const sH2 = document.querySelector('#services h2');
        if (sH2) sH2.textContent = payload.heading;
      }
      if (payload.title) {
        data.services.items = data.services.items || [];
        data.services.items.unshift({
          title: payload.title,
          description: payload.description || "Professional service provided with top industry standards.",
          icon: "https://cdn-icons-png.flaticon.com/512/11987/11987364.png"
        });
      }
      const sSec = document.getElementById("services");
      if (sSec) sSec.scrollIntoView({ behavior: "smooth" });
      modified = true;
      break;
    }

    case "update_certificates": {
      data.certificates = data.certificates || {};
      if (payload.heading) {
        data.certificates.heading = payload.heading;
        const cH2 = document.querySelector('#certificates h2');
        if (cH2) cH2.textContent = payload.heading;
      }
      if (payload.title) {
        data.certificates.items = data.certificates.items || [];
        data.certificates.items.unshift({
          title: payload.title,
          issuer: payload.issuer || "Verified Certification",
          description: payload.description || "Professional certified achievement.",
          image: "assets/Certificates/ai-e.jpg",
          verifyUrl: "#"
        });
      }
      const cSec = document.getElementById("certificates");
      if (cSec) cSec.scrollIntoView({ behavior: "smooth" });
      modified = true;
      break;
    }

    case "update_contact": {
      data.contact = data.contact || {};
      if (payload.whatsapp) {
        data.contact.whatsapp = payload.whatsapp;
        const whatsappLink = document.getElementById('whatsapp-link');
        if (whatsappLink) {
          whatsappLink.onclick = (e) => {
            e.preventDefault();
            window.location.href = 'https://wa.me/' + payload.whatsapp.replace(/[^0-9+]/g, '');
          };
        }
      }
      if (payload.heading) {
        data.contact.heading = payload.heading;
        const contactHeading = document.querySelector('#contact .heading h2, #contact h2');
        if (contactHeading) contactHeading.textContent = payload.heading;
      }
      const contactSec = document.getElementById("contact");
      if (contactSec) contactSec.scrollIntoView({ behavior: "smooth" });
      modified = true;
      break;
    }

    case "update_social": {
      data.social = data.social || {};
      if (payload.instagram) data.social.instagram = payload.instagram;
      if (payload.github) data.social.github = payload.github;
      if (payload.linkedin) data.social.linkedin = payload.linkedin;
      const socialLinks = document.querySelectorAll('.social-media a');
      if (socialLinks[0] && data.social.instagram) socialLinks[0].href = data.social.instagram;
      if (socialLinks[1] && data.social.github) socialLinks[1].href = data.social.github;
      if (socialLinks[2] && data.social.linkedin) socialLinks[2].href = data.social.linkedin;
      modified = true;
      break;
    }

    case "add_skill": {
      let skillNames = payload.skillName ? [payload.skillName] : extractSkillNames(userSpeechText);
      if (skillNames.length > 0) {
        skillNames.forEach(rawSkill => {
          const normName = normalizeSkillName(rawSkill);
          const iconUrl = getTechIconUrl(normName);
          const existingIdx = data.skills.items.findIndex(s => s.name.toLowerCase() === normName.toLowerCase());
          if (existingIdx >= 0) {
            data.skills.items[existingIdx].icon = iconUrl;
            data.skills.items[existingIdx].name = normName;
          } else {
            data.skills.items.push({
              name: normName,
              icon: iconUrl
            });
          }
        });
        renderLiveSkills(data.skills.items);

        const skillsSection = document.getElementById("skills");
        if (skillsSection) skillsSection.scrollIntoView({ behavior: "smooth" });
        modified = true;
      }
      break;
    }

    case "remove_skill": {
      let skillNames = payload.skillName ? [payload.skillName] : extractSkillNames(userSpeechText);
      if (skillNames.length > 0 && data.skills?.items) {
        const toRemove = skillNames.map(s => normalizeSkillName(s).toLowerCase());
        data.skills.items = data.skills.items.filter(s => {
          const sNorm = normalizeSkillName(s.name).toLowerCase();
          return !toRemove.includes(sNorm) && !toRemove.includes(s.name.toLowerCase());
        });
        renderLiveSkills(data.skills.items);
        const skillsSection = document.getElementById("skills");
        if (skillsSection) skillsSection.scrollIntoView({ behavior: "smooth" });
        modified = true;
      }
      break;
    }

    case "add_project": {
      let projectTitle = payload.title || extractProjectTitle(userSpeechText);
      if (projectTitle) {
        const normTitle = projectTitle.toLowerCase();
        const exists = data.projects.items.find(p => p.title.toLowerCase() === normTitle);
        if (!exists) {
          data.projects.items.unshift({
            title: projectTitle,
            description: payload.projectDescription || "New full-stack project built with modern technologies.",
            image: payload.image || "assets/Images/project1.jpg",
            liveUrl: "#",
            githubUrl: "https://github.com/MuhammadAhmed-503"
          });
          renderLiveProjects(data.projects.items);
        }
        const projectsSection = document.getElementById("projects");
        if (projectsSection) projectsSection.scrollIntoView({ behavior: "smooth" });
        modified = true;
      }
      break;
    }

    case "remove_project": {
      let projectTitle = payload.title || extractProjectTitle(userSpeechText);
      if (projectTitle && data.projects?.items) {
        data.projects.items = data.projects.items.filter(p => p.title.toLowerCase() !== projectTitle.toLowerCase());
        renderLiveProjects(data.projects.items);
        modified = true;
      }
      break;
    }

    case "update_contact":
      data.contact = data.contact || {};
      if (payload.whatsapp) data.contact.whatsapp = payload.whatsapp;
      modified = true;
      break;

    default:
      console.log('Action type:', actionType);
  }

  if (modified) {
    // 1. Always persist to localStorage (Instant local preview for visitor or admin)
    localStorage.setItem("portfolioData", JSON.stringify(data));
    console.log("💾 AI applied changes locally to localStorage");

    // 2. Global Sync to Supabase ONLY if Admin has toggled it ON
    const isGlobalSyncOn = localStorage.getItem("aiGlobalSyncEnabled") === "true";
    if (isGlobalSyncOn) {
      syncAIToSupabase(data);
    } else {
      console.log("🔒 Local Sandbox Mode: Changes saved locally only (Cloud database untouched)");
    }
  }
}

function renderLiveSkills(skillsList) {
  const container = document.querySelector('.skills-grid-container');
  if (!container || !Array.isArray(skillsList)) return;

  container.innerHTML = skillsList.map(skill => `
    <div data-aos="zoom-in-up" class="skill-card">
      <img src="${skill.icon || getTechIconUrl(skill.name)}" alt="${skill.name}" />
      <h3>${skill.name}</h3>
    </div>
  `).join('');
}

function renderLiveProjects(projectsList) {
  const container = document.querySelector('.projects-container');
  if (!container || !Array.isArray(projectsList)) return;

  container.innerHTML = projectsList.map(project => `
    <article data-aos="fade-up-right" class="project-card">
      <img src="${project.image || 'assets/Images/project1.jpg'}" alt="${project.title}" />
      <h3>${project.title}</h3>
      <p>${project.description || ''}</p>
      ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank">Live Demo</a>` : ''}
      ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank">GitHub</a>` : ''}
    </article>
  `).join('');
}



function cycleBackgroundAnimation() {
  const savedData = localStorage.getItem("portfolioData");
  let data = savedData ? JSON.parse(savedData) : { animations: {} };
  const isDarkMode = document.body.classList.contains("dark-mode");
  const key = isDarkMode ? "darkModeAnimation" : "lightModeAnimation";
  const current = data.animations?.[key] || (isDarkMode ? "space" : "dot-particles");

  const ALL_ANIMATIONS = ["space", "dot-particles", "animated-wallpaper"];
  let currIdx = ALL_ANIMATIONS.indexOf(current);
  if (currIdx === -1) currIdx = 0;
  const next = ALL_ANIMATIONS[(currIdx + 1) % ALL_ANIMATIONS.length];

  data.animations = data.animations || {};
  data.animations[key] = next;
  localStorage.setItem("portfolioData", JSON.stringify(data));

  if (typeof initializeBackgroundAnimation === "function") {
    initializeBackgroundAnimation();
  }

  // Global sync check
  if (localStorage.getItem("aiGlobalSyncEnabled") === "true") {
    syncAIToSupabase(data);
  }
}

// ---- Text-to-Speech with real audio-based lip-sync ----
const TTS_URL = `${BACKEND_BASE}/api/voice/tts`;

let audioContext = null;
let analyser = null;
let audioSource = null;
let currentAudio = null;
let lipsyncFrameId = null;

async function speakResponse(text) {
  const reqId = Date.now();
  const cleanText = cleanTextForSpeech(text);
  if (!cleanText) {
    isProcessing = false;
    isSpeaking = false;
    if (continuousMode) safeStartRecognition();
    return;
  }

  isSpeaking = true;
  safeStopRecognition(); // Echo prevention: ensure mic is off while speaking

  if (currentAudio) {
    currentAudio.pause();
    if (lipsyncFrameId) cancelAnimationFrame(lipsyncFrameId);
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  try {
    console.time(`tts-response-${reqId}`);
    const response = await fetch(TTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: cleanText }),
    });

    if (!response.ok) throw new Error("TTS backend failed");

    const audioBlob = await response.blob();
    console.timeEnd(`tts-response-${reqId}`);
    const audioUrl = URL.createObjectURL(audioBlob);
    playAudioWithLipsync(audioUrl);

  } catch (err) {
    console.error("TTS fetch error, falling back to browser voice:", err);
    speakWithBrowserTTS(cleanText);
  }
}

function playAudioWithLipsync(audioUrl) {
  if (currentAudio) currentAudio.pause();
  if (lipsyncFrameId) cancelAnimationFrame(lipsyncFrameId);

  currentAudio = new Audio(audioUrl);

  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  if (audioSource) {
    try { audioSource.disconnect(); } catch (e) { }
  }

  try {
    audioSource = audioContext.createMediaElementSource(currentAudio);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
  } catch (e) {
    console.warn("Audio element routing issue:", e);
  }

  const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;

  currentAudio.onplay = () => {
    isSpeaking = true;
    if (dataArray) animateLipsyncFromAudio(dataArray);
  };

  const finishSpeaking = () => {
    if (lipsyncFrameId) cancelAnimationFrame(lipsyncFrameId);
    setMouth(0);
    URL.revokeObjectURL(audioUrl);
    isSpeaking = false;
    isProcessing = false;

    // Continuous mode: Aiko bol chuki, ab 300ms pause ke baad dobara sunna shuru karein (echo prevention)
    if (continuousMode) {
      setTimeout(() => {
        safeStartRecognition();
      }, 300);
    }
  };

  currentAudio.onended = finishSpeaking;
  currentAudio.onerror = finishSpeaking;

  currentAudio.play().catch(err => {
    console.error("Audio play failed:", err);
    finishSpeaking();
  });
}

function animateLipsyncFromAudio(dataArray) {
  if (!analyser || !currentAudio || currentAudio.paused) {
    currentMouthValue = 0;
    return;
  }
  analyser.getByteFrequencyData(dataArray);

  let sum = 0;
  const relevantBins = Math.floor(dataArray.length * 0.6);
  for (let i = 0; i < relevantBins; i++) sum += dataArray[i];
  const average = sum / relevantBins;

  // Divisor 14 yields wider, articulate mouth openings on speech volume
  const normalized = Math.min(average / 14, 1.2);
  const now = performance.now() / 1000;
  // Syllable cadence modulation for fast, natural mouth articulation
  const cadence = 0.85 + Math.sin(now * 28) * 0.15;
  const mouthValue = Math.min(Math.pow(normalized, 0.6) * cadence, 1.0);

  setMouth(mouthValue);

  lipsyncFrameId = requestAnimationFrame(() => animateLipsyncFromAudio(dataArray));
}

// Fallback agar backend TTS fail ho jaye
function speakWithBrowserTTS(text) {
  if (!("speechSynthesis" in window)) {
    isSpeaking = false;
    isProcessing = false;
    if (continuousMode) safeStartRecognition();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.1;

  isSpeaking = true;

  const onEndOrError = () => {
    isSpeaking = false;
    isProcessing = false;
    setMouth(0);
    if (continuousMode) {
      setTimeout(() => {
        safeStartRecognition();
      }, 300);
    }
  };

  utterance.onend = onEndOrError;
  utterance.onerror = onEndOrError;

  window.speechSynthesis.speak(utterance);
}

// ---- Mouth movement ----
function setMouth(value) {
  currentMouthValue = value;
}

// ---- Expressions ----
const EXPRESSIONS = {
  idle: {
    ParamMouthForm: 0,
    ParamBrowLForm: 0,
    ParamBrowRForm: 0,
    ParamEyeLSmile: 0,
    ParamEyeRSmile: 0,
  },
  happy: {
    ParamMouthForm: 1,
    ParamBrowLForm: 0.5,
    ParamBrowRForm: 0.5,
    ParamEyeLSmile: 1,
    ParamEyeRSmile: 1,
  },
  surprised: {
    ParamMouthForm: 0,
    ParamBrowLForm: 1,
    ParamBrowRForm: 1,
    ParamEyeLSmile: 0,
    ParamEyeRSmile: 0,
  },
  thinking: {
    ParamMouthForm: -0.3,
    ParamBrowLForm: -0.3,
    ParamBrowRForm: 0.3,
    ParamEyeLSmile: 0,
    ParamEyeRSmile: 0,
  },
  laughing: {
    ParamMouthForm: 1,
    ParamBrowLForm: 0.7,
    ParamBrowRForm: 0.7,
    ParamEyeLSmile: 1,
    ParamEyeRSmile: 1,
  },
  annoyed: {
    ParamMouthForm: -1,
    ParamBrowLForm: -0.8,
    ParamBrowRForm: -0.8,
    ParamEyeLSmile: 0,
    ParamEyeRSmile: 0,
  },
};

let currentExpression = 'idle';

function setAvatarExpression(expression) {
  if (!EXPRESSIONS[expression]) expression = 'idle';
  currentExpression = expression;
  console.log('Expression set to:', expression);
}

function applyExpressionOverride() {
  if (live2dModel && live2dModel.internalModel) {
    const params = EXPRESSIONS[currentExpression];
    const coreModel = live2dModel.internalModel.coreModel;
    for (const [paramId, value] of Object.entries(params)) {
      try {
        coreModel.setParameterValueById(paramId, value);
      } catch (e) { }
    }
  }
}

// ---- Smart Floating Assistant Action Button (FAB) & AIKO Visibility Controller ----
let isAikoVisible = false;

function updateFabUI() {
  const fab = document.getElementById("voice-assistant-fab");
  const faceView = document.getElementById("fab-face-view");
  const micView = document.getElementById("fab-mic-view");
  const stopView = document.getElementById("fab-stop-view");
  const container = document.getElementById("aiko-avatar-container");

  if (!fab) return;

  if (!isAikoVisible) {
    // State 1: Aiko Hidden -> Button shows Aiko's Face
    if (container) {
      container.classList.remove("aiko-visible");
      container.classList.add("aiko-hidden");
    }
    if (faceView) faceView.classList.remove("hidden");
    if (micView) micView.classList.add("hidden");
    if (stopView) stopView.classList.add("hidden");
    fab.classList.remove("mic-mode", "listening", "thinking");
    fab.title = "Summon AI Assistant (Aiko)";
  } else {
    // Aiko is Visible!
    if (container) {
      container.classList.remove("aiko-hidden");
      container.classList.add("aiko-visible");
    }
    if (faceView) faceView.classList.add("hidden");

    if (isListening || continuousMode) {
      // State 3: Listening -> Button shows STOP Icon with pulsing red glow
      if (micView) micView.classList.add("hidden");
      if (stopView) stopView.classList.remove("hidden");
      fab.classList.add("listening");
      fab.classList.remove("mic-mode");
      fab.title = "Stop Listening";
    } else {
      // State 2: Standby Mic -> Button shows SVG MIC Icon
      if (micView) micView.classList.remove("hidden");
      if (stopView) stopView.classList.add("hidden");
      fab.classList.remove("listening");
      fab.classList.add("mic-mode");
      fab.title = "Start Auto Listen";
    }
  }
}

function handleFabClick() {
  if (!isAikoVisible) {
    // 1. Click on Aiko Face -> Pop up Aiko & switch button to Mic
    toggleAikoVisibility(true);
  } else {
    // Aiko is already visible:
    if (isListening || continuousMode) {
      // 2. Click Stop -> Stop listening & switch back to Mic icon
      stopVoiceAssistant();
    } else {
      // 3. Click Mic -> Start Auto Listen & switch to Stop icon
      startVoiceAssistantAutoListen();
    }
  }
}

function toggleAikoVisibility(show) {
  isAikoVisible = (typeof show === "boolean") ? show : !isAikoVisible;
  if (!isAikoVisible) {
    // If hiding Aiko, stop listening as well
    stopVoiceAssistant();
  }
  updateFabUI();
}

function startVoiceAssistantAutoListen() {
  continuousMode = true;
  if (currentAudio) {
    currentAudio.pause();
    setMouth(0);
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  isSpeaking = false;
  isProcessing = false;

  safeStartRecognition();
  updateFabUI();
}

function stopVoiceAssistant() {
  continuousMode = false;
  isSpeaking = false;
  isProcessing = false;
  if (currentRequestController) {
    currentRequestController.abort();
  }
  if (currentAudio) {
    currentAudio.pause();
    setMouth(0);
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  safeStopRecognition();
  setThinkingState(false);
  updateFabUI();
}

function updateMicUI(listening) {
  updateFabUI();
}

window.addEventListener("DOMContentLoaded", () => {
  updateFabUI();
});

window.addEventListener("load", () => {
  recognition = initSpeechRecognition();
  updateFabUI();
});

// ---- Natural blinking ----
function startBlinkLoop() {
  function blink() {
    let progress = 0;
    const blinkDuration = 120; // ms
    const startTime = performance.now();

    function animateBlink(now) {
      const elapsed = now - startTime;
      progress = Math.min(elapsed / blinkDuration, 1);

      currentBlinkValue = progress < 0.5
        ? 1 - (progress * 2)
        : (progress - 0.5) * 2;

      if (progress < 1) {
        requestAnimationFrame(animateBlink);
      } else {
        currentBlinkValue = 1;
      }
    }
    requestAnimationFrame(animateBlink);

    const nextBlinkDelay = 2000 + Math.random() * 4000;
    setTimeout(blink, nextBlinkDelay);
  }

  blink();
}