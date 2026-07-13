// ── Particle Background ──
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - .5) * .4,
    vy: (Math.random() - .5) * .4,
    r: Math.random() * 1.5 + .5,
    alpha: Math.random() * .5 + .1,
  };
}

for (let i = 0; i < 120; i++) particles.push(createParticle());

function getParticleColor() {
  return document.body.classList.contains('light')
    ? 'rgba(2,132,199,'
    : 'rgba(0,212,255,';
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const col = getParticleColor();
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `${col}${p.alpha})`;
    ctx.fill();
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `${col}${.12 * (1 - dist / 120)})`;
        ctx.lineWidth = .5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── Terminal Typewriter ──
const lines = [
  { text: '$ whoami', cls: 'cmd' },
  { text: 'amir_hassen_ibrahim', cls: '' },
  { text: '$ cat skills.txt', cls: 'cmd' },
  { text: '[+] Red Teaming & Offensive Security', cls: '' },
  { text: '[+] Penetration Testing (Web/Mobile/Net)', cls: '' },
  { text: '[+] EDR Evasion & Custom Tool Dev', cls: '' },
  { text: '[+] Cisco Networking & Server Admin', cls: '' },
  { text: '$ cat rank.txt', cls: 'cmd' },
  { text: '[★] TryHackMe — Top 5%', cls: 'warn' },
  { text: '[★] 7+ Industry Certifications', cls: 'warn' },
  { text: '$ _', cls: 'cmd' },
];

const terminal = document.getElementById('terminal');
let lineIdx = 0, charIdx = 0;
let currentEl = null;

function typeNext() {
  if (lineIdx >= lines.length) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    terminal.appendChild(cursor);
    return;
  }

  if (charIdx === 0) {
    currentEl = document.createElement('div');
    if (lines[lineIdx].cls) currentEl.className = lines[lineIdx].cls;
    terminal.appendChild(currentEl);
  }

  const line = lines[lineIdx];
  currentEl.textContent = line.text.slice(0, charIdx + 1);
  charIdx++;

  if (charIdx < line.text.length) {
    setTimeout(typeNext, 40);
  } else {
    lineIdx++;
    charIdx = 0;
    setTimeout(typeNext, lineIdx % 2 === 0 ? 300 : 80);
  }
}

setTimeout(typeNext, 600);

// ── Scroll Reveal ──
const revealEls = document.querySelectorAll(
  '.skill-card, .project-card, .cert-card, .contact-card, .stat-card, .timeline-item, .about-text, .about-stats'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// ── Theme Toggle ──
const themeBtn = document.getElementById('themeToggle');
const icon = themeBtn.querySelector('.theme-icon');

const saved = localStorage.getItem('theme');
if (saved === 'light') { document.body.classList.add('light'); icon.textContent = '🌙'; }

themeBtn.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  icon.textContent = isLight ? '🌙' : '☀️';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// ── Skill sub-topic smooth animation ──
document.querySelectorAll('.sub-topic').forEach(detail => {
  const summary = detail.querySelector('summary');
  const content = detail.querySelector('.sub-list');
  content.style.overflow = 'hidden';

  summary.addEventListener('click', e => {
    e.preventDefault();
    if (detail.open) {
      const h = content.scrollHeight;
      content.style.height = h + 'px';
      requestAnimationFrame(() => {
        content.style.transition = 'height .28s ease';
        content.style.height = '0';
      });
      content.addEventListener('transitionend', () => {
        detail.removeAttribute('open');
        content.style.height = '';
        content.style.transition = '';
      }, { once: true });
    } else {
      detail.setAttribute('open', '');
      const h = content.scrollHeight;
      content.style.height = '0';
      requestAnimationFrame(() => {
        content.style.transition = 'height .28s ease';
        content.style.height = h + 'px';
      });
      content.addEventListener('transitionend', () => {
        content.style.height = '';
        content.style.transition = '';
      }, { once: true });
    }
  });
});

// ── Active nav highlight on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
  });
});
