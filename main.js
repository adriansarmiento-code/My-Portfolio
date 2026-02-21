/* ═══════════════════════════════════════════════════════════════
   GLOBAL JS — cursor · scroll · reveal · page transition · ticker
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Theme (persist across pages) ──────────────────────────────
  const html = document.documentElement;
  const saved = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', saved);

  // ── Custom Cursor ─────────────────────────────────────────────
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  if (dot && ring) {
    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
    });

    // Ring lags slightly behind
    (function tick() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(tick);
    })();

    // Hover states
    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });

    document.querySelectorAll('p, h1, h2, h3').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-text'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text'));
    });
  }

  // ── Scroll Progress Bar ───────────────────────────────────────
  const progBar = document.querySelector('.progress-bar');
  function updateProgress() {
    if (!progBar) return;
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progBar.style.width = (scrolled / total * 100) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  // ── Nav scroll class ──────────────────────────────────────────
  const nav = document.querySelector('.nav');
  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── Back to top button ────────────────────────────────────────
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── Hamburger / Mobile Drawer ─────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('mobileDrawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      drawer.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        drawer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });
  }

  // ── Active nav link ───────────────────────────────────────────
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // ── Intersection Observer: reveal-up ─────────────────────────
  const revealOpts = { threshold: 0.08, rootMargin: '0px 0px -40px 0px' };
  const revealObs  = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, revealOpts);

  document.querySelectorAll('.reveal-up, .reveal-clip').forEach(el => revealObs.observe(el));

  // ── Char-split text animation ─────────────────────────────────
  function splitChars(el) {
    const text = el.textContent;
    el.innerHTML = '';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      const inner = document.createElement('span');
      inner.className = 'char-inner';
      inner.textContent = ch === ' ' ? '\u00A0' : ch;
      inner.style.transitionDelay = (i * 28) + 'ms';
      span.appendChild(inner);
      el.appendChild(span);
    });
  }

  document.querySelectorAll('.split-text').forEach(el => splitChars(el));

  const splitObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        splitObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.split-text').forEach(el => splitObs.observe(el));

  // ── Skill bar animation ───────────────────────────────────────
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skills-block').forEach(el => barObs.observe(el));

  // ── Magnetic button effect ────────────────────────────────────
  document.querySelectorAll('.mag-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  // ── Parallax (mild, CSS var) ──────────────────────────────────
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      parallaxEls.forEach(el => {
        const speed  = parseFloat(el.dataset.parallax) || 0.3;
        const offset = -(sy * speed);
        el.style.transform = `translateY(${offset}px)`;
      });
    }, { passive: true });
  }

  // ── Page Transition ───────────────────────────────────────────
  const overlay = document.querySelector('.page-overlay');

  // Animate in on page load
  if (overlay) {
    overlay.classList.add('leaving');
    setTimeout(() => overlay.classList.remove('leaving'), 900);
  }

  // On link click to same origin
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      if (!overlay) { window.location = href; return; }

      overlay.classList.add('entering');
      setTimeout(() => { window.location = href; }, 800);
    });
  });

  // ── Contact form validation ───────────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    const sub = form.querySelector('#submitBtn');

    function showErr(id, errId, show) {
      const el  = document.getElementById(id);
      const err = document.getElementById(errId);
      if (!el || !err) return;
      el.classList.toggle('error', show);
      err.classList.toggle('visible', show);
      el.setAttribute('aria-invalid', show);
    }

    function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

    document.getElementById('cName')?.addEventListener('blur', function () {
      showErr('cName', 'cNameErr', this.value.trim().length < 2);
    });
    document.getElementById('cEmail')?.addEventListener('blur', function () {
      showErr('cEmail', 'cEmailErr', !validEmail(this.value.trim()));
    });
    document.getElementById('cMsg')?.addEventListener('blur', function () {
      showErr('cMsg', 'cMsgErr', this.value.trim().length < 10);
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const name  = document.getElementById('cName')?.value.trim();
      const email = document.getElementById('cEmail')?.value.trim();
      const msg   = document.getElementById('cMsg')?.value.trim();
      let ok = true;

      if (!name || name.length < 2) { showErr('cName', 'cNameErr', true); ok = false; } else showErr('cName', 'cNameErr', false);
      if (!validEmail(email))         { showErr('cEmail', 'cEmailErr', true); ok = false; } else showErr('cEmail', 'cEmailErr', false);
      if (!msg || msg.length < 10)    { showErr('cMsg', 'cMsgErr', true); ok = false; } else showErr('cMsg', 'cMsgErr', false);

      if (!ok) return;

      if (sub) { sub.textContent = 'Sending...'; sub.disabled = true; }

      setTimeout(() => {
        const succ = document.getElementById('formSuccess');
        if (succ) succ.classList.add('visible');
        if (sub) { sub.textContent = 'Send Message'; sub.disabled = false; }
        form.reset();
        setTimeout(() => succ?.classList.remove('visible'), 5000);
      }, 1400);
    });
  }

})();
