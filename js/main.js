/* Meed / Syde — main.js */

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navItems.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${id}`) a.classList.add('active');
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// Scroll-triggered reveal
const reveals = document.querySelectorAll('.release-card, .player-block, .contact-card, .about-img-frame, .about-content, .about-labels, .about-label-item');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

reveals.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
  revealObserver.observe(el);
});

// Particle system
(function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const PARTICLE_COUNT = 60;
  const particles = [];

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.alpha = 0;
      this.maxAlpha = Math.random() * 0.4 + 0.05;
      this.size = Math.random() * 1.5 + 0.3;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
      this.isRed = Math.random() < 0.35;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;

      const lifeRatio = this.life / this.maxLife;
      if (lifeRatio < 0.2) {
        this.alpha = (lifeRatio / 0.2) * this.maxAlpha;
      } else if (lifeRatio > 0.7) {
        this.alpha = ((1 - lifeRatio) / 0.3) * this.maxAlpha;
      } else {
        this.alpha = this.maxAlpha;
      }

      if (this.life >= this.maxLife) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.isRed ? `rgba(204,0,0,1)` : `rgba(255,255,255,1)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  let animId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animate);
  }
  animate();

  // Pause when not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else animate();
  });
})();

// BPM pulse on hero stats
(function bpmPulse() {
  const bpmEl = document.querySelector('.stat-num');
  if (!bpmEl) return;
  // 132 BPM = ~454ms interval
  const interval = Math.round(60000 / 132);
  setInterval(() => {
    bpmEl.style.textShadow = '0 0 20px rgba(255,26,26,0.9)';
    setTimeout(() => { bpmEl.style.textShadow = ''; }, 120);
  }, interval);
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
