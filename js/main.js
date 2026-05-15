/* ════════════════════════════════════════════
   ANISHA S — Portfolio JavaScript
   ════════════════════════════════════════════ */

'use strict';

/* ── Typing animation ───────────────────── */
const PHRASES = [
  'HR Recruiter',
  'Talent Acquisition Specialist',
  'Market Intelligence Expert',
  'Workforce Strategy Advisor',
  'Diversity & Inclusion Champion',
];

let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
let speed     = 80;

function typeLoop() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrase = PHRASES[phraseIdx];

  if (deleting) {
    el.textContent = phrase.slice(0, charIdx - 1);
    charIdx--;
    speed = 45;
  } else {
    el.textContent = phrase.slice(0, charIdx + 1);
    charIdx++;
    speed = 80;
  }

  if (!deleting && charIdx === phrase.length) {
    deleting = true;
    speed    = 2200;                 // pause before deleting
  } else if (deleting && charIdx === 0) {
    deleting  = false;
    phraseIdx = (phraseIdx + 1) % PHRASES.length;
    speed     = 380;
  }

  setTimeout(typeLoop, speed);
}

/* ── Particle generator ─────────────────── */
function spawnParticles() {
  const wrap = document.getElementById('particles');
  if (!wrap) return;

  const colours = [
    'rgba(139,92,246,.7)',
    'rgba(6,182,212,.6)',
    'rgba(167,139,250,.5)',
    'rgba(103,232,249,.4)',
  ];

  for (let i = 0; i < 32; i++) {
    const p    = document.createElement('div');
    p.className = 'particle';
    const size  = Math.random() * 3.5 + 1;
    const x     = Math.random() * 100;
    const dur   = Math.random() * 16 + 10;
    const delay = Math.random() * -22;
    const col   = colours[Math.floor(Math.random() * colours.length)];

    p.style.cssText =
      `left:${x}%;width:${size}px;height:${size}px;` +
      `background:${col};` +
      `animation-duration:${dur}s;animation-delay:${delay}s;`;

    wrap.appendChild(p);
  }
}

/* ── Sticky nav ─────────────────────────── */
function onScroll() {
  document.getElementById('navbar')
    .classList.toggle('scrolled', window.scrollY > 50);
}

/* ── Hamburger ──────────────────────────── */
function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  });

  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    })
  );
}

/* ── Scroll-reveal (AOS-lite) ───────────── */
function initReveal() {
  const items = document.querySelectorAll('[data-aos]');
  const io    = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('aos-animate'); }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  items.forEach(el => io.observe(el));
}

/* ── Active nav highlight ───────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          links.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(s => io.observe(s));
}

/* ── Counter animation ──────────────────── */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  const io  = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el     = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const dur    = 1400;
        let   start;

        const tick = ts => {
          if (!start) start = ts;
          const pct  = Math.min((ts - start) / dur, 1);
          const ease = 1 - Math.pow(1 - pct, 3);  // ease-out cubic
          el.textContent = Math.floor(ease * target) + suffix;
          if (pct < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );

  els.forEach(el => io.observe(el));
}

/* ── Contact form ───────────────────────── */
function initContactForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const btn    = document.getElementById('submitBtn');
  if (!form) return;

  // Assemble recipient dynamically
  const r = ['anisha', String.fromCharCode(64), 'caliberly.com'].join('');

  form.addEventListener('submit', async ev => {
    ev.preventDefault();

    btn.disabled     = true;
    btn.innerHTML    = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending…';
    status.className = 'form-status';
    status.textContent = '';

    const payload = {
      name:    form.elements['name'].value.trim(),
      email:   form.elements['email'].value.trim(),
      subject: form.elements['subject'].value.trim(),
      message: form.elements['message'].value.trim(),
    };

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${r}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();

      if (data.success === 'true' || data.success === true) {
        status.className   = 'form-status success';
        status.textContent = '✓ Message sent! I\'ll be in touch shortly.';
        form.reset();
      } else {
        throw new Error('Submission rejected');
      }
    } catch {
      status.className   = 'form-status error';
      status.textContent = '✗ Something went wrong — please reach out via LinkedIn or phone.';
    } finally {
      btn.disabled  = false;
      btn.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i> Send Message';
    }
  });
}

/* ── Profile photo fallback ─────────────── */
function initPhotoFallback() {
  const img = document.getElementById('profilePhoto');
  if (!img) return;

  // Show initials only if the photo fails to load
  img.addEventListener('error', () => {
    img.style.display = 'none';
    const initials = document.getElementById('avatarInitials');
    if (initials) initials.style.display = 'flex';
  });
}

/* ── Footer year ────────────────────────── */
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── Init ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  spawnParticles();
  typeLoop();
  initHamburger();
  initReveal();
  initActiveNav();
  initCounters();
  initContactForm();
  initPhotoFallback();
  setYear();

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
});
