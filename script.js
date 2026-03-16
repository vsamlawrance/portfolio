// -------------------- Helpers --------------------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// -------------------- References --------------------
const svg = document.getElementById('robotSVG');
const headGroup = document.getElementById('headGroup');
const pupilEls = svg.querySelectorAll('.pupil');
const pupilCores = svg.querySelectorAll('.pupilCore');
const eyes = svg.querySelectorAll('.eyeShell');
const wires = [svg.querySelector('#wire1'), svg.querySelector('#wire2'), svg.querySelector('#wire3'), svg.querySelector('#wire4')];
const robotWrap = document.getElementById('robotWrap');
const waveSpan = document.querySelector('.wave');
const typingElement = document.getElementById("typing");

// -------------------- GSAP Entrance --------------------
gsap.set([svg, '.left'], {opacity:0, y:30});
gsap.timeline({defaults:{ease:"power3.out"}})
  .to("nav", {y:0, opacity:1, duration:0.8})
  .to('.left', {opacity:1, y:0, duration:0.9}, "-=0.4")
  .to(svg, {opacity:1, y:0, duration:0.9}, "-=0.7")
  .from('#headGroup', {y:-40, opacity:0, duration:0.9, ease:"elastic.out(0.9,0.55)"}, "-=0.6")
  .from('#body rect', {scale:0.92, transformOrigin:'50% 50%', duration:0.9}, "-=0.6");

// -------------------- Wire Animation --------------------
wires.forEach((w, i) => {
  const len = w.getTotalLength();
  w.style.strokeDasharray = len;
  w.style.strokeDashoffset = len;
  gsap.to(w.style, {strokeDashoffset: 0, duration: 1.6 + i*0.4, delay: 0.6 + i*0.15, ease: "power2.out"});
  gsap.to(w, {opacity: 0.5, duration: 1.8, repeat: -1, yoyo:true, ease:"sine.inOut", delay: 0.8 + i*0.12});
});

// -------------------- LED & Mouth Animation --------------------
gsap.to(svg.querySelectorAll('.led'), {scale: 1.15, transformOrigin:"50% 50%", duration: 1.6, repeat:-1, yoyo:true, ease:"sine.inOut"});
gsap.to('#mouthPixels rect', {y: -2, duration: 0.5, stagger:0.08, repeat:-1, yoyo:true, ease:"sine.inOut", delay:0.4});

// -------------------- Eye Tracking --------------------
const eyeCenters = [];
function recalcEyeCenters(){
  eyeCenters.length = 0;
  eyes.forEach(shell => {
    const ctm = shell.getBoundingClientRect();
    eyeCenters.push({x: ctm.left + ctm.width/2, y: ctm.top + ctm.height/2});
  });
}
recalcEyeCenters();
window.addEventListener('resize', recalcEyeCenters);

let mouse = {x: window.innerWidth/2, y: window.innerHeight/2};
let smoothed = {x: mouse.x, y: mouse.y};
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

function tick(){
  smoothed.x += (mouse.x - smoothed.x) * 0.18;
  smoothed.y += (mouse.y - smoothed.y) * 0.18;

  const headBox = headGroup.getBoundingClientRect();
  const headCenterX = headBox.left + headBox.width/2;
  const headCenterY = headBox.top + headBox.height/2;
  const dx = (smoothed.x - headCenterX);
  const dy = (smoothed.y - headCenterY);
  const rotY = clamp(dx / 25, -12, 12);
  const rotX = clamp(-dy / 35, -10, 10);
  headGroup.style.transform = `translate(70,28) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

  eyeCenters.forEach((center, idx) => {
    const px = smoothed.x - center.x;
    const py = smoothed.y - center.y;
    const angle = Math.atan2(py, px);
    const dist = Math.min(22, Math.hypot(px, py) / 18);
    const moveX = Math.cos(angle) * dist;
    const moveY = Math.sin(angle) * dist;
    const pupil = pupilEls[idx];
    const core = pupilCores[idx];
    if(pupil) pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
    if(core) core.style.transform = `translate(${moveX*0.4}px, ${moveY*0.4}px)`;
  });

  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// -------------------- Robot Hover Effects --------------------
robotWrap.addEventListener('mouseenter', () => gsap.to('.glow-ring', {opacity:1, duration:0.5}));
robotWrap.addEventListener('mouseleave', () => gsap.to('.glow-ring', {opacity:0.85, duration:0.5}));

// -------------------- Wave Hover Animation --------------------
waveSpan.addEventListener('mouseenter', () => gsap.to(waveSpan, {scale:1.25, rotation:0, duration:0.25, ease:"back.out(1.7)"}));
waveSpan.addEventListener('mouseleave', () => gsap.to(waveSpan, {scale:1, duration:0.28, ease:"power2.out"}));

// -------------------- Typing Effect --------------------
const texts = ["Full Stack Developer","UI/UX Designer","Software Developer"];
let index = 0, charIndex = 0, typingSpeed = 50, erasingSpeed = 10, delay = 1500;

function type() {
  if (charIndex < texts[index].length) {
    typingElement.textContent += texts[index].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingSpeed);
  } else {
    setTimeout(erase, delay);
  }
}

function erase() {
  if (charIndex > 0) {
    typingElement.textContent = texts[index].substring(0, charIndex-1);
    charIndex--;
    setTimeout(erase, erasingSpeed);
  } else {
    index = (index+1) % texts.length;
    setTimeout(type, 500);
  }
}

// -------------------- DOM Loaded --------------------
document.addEventListener("DOMContentLoaded", () => {
  // Start typing
  if(texts.length) setTimeout(type, 1000);

  // Initialize particles.js
  if(window.particlesJS) {
   particlesJS('particles-js', {
  "particles": {
    "number": {
      "value": 70,
      "density": { "enable": true, "value_area": 900 }
    },
    "color": { "value": ["#66fcf1", "#4dabf7", "#b3ffff"] },
    "shape": { "type": "circle" },
    "opacity": {
      "value": 0.5,
      "random": true,
      "anim": { "enable": true, "speed": 0.8, "opacity_min": 0.2, "sync": false }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": { "enable": true, "speed": 2, "size_min": 0.5, "sync": false }
    },
    "line_linked": {
      "enable": true,
      "distance": 130,
      "color": "#4dabf7",
      "opacity": 0.2,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 1.2,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": { "enable": true, "mode": "grab" },
      "onclick": { "enable": true, "mode": "repulse" },
      "resize": true
    },
    "modes": {
      "grab": { "distance": 150, "line_linked": { "opacity": 0.5 } },
      "repulse": { "distance": 120, "duration": 0.4 }
    }
  },
  "retina_detect": true
});


  }
});
