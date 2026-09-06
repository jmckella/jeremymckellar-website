/* Site behaviors ported from the design prototype: kinetic hero word, typed
   status line, particle field, scroll reveals, magnetic buttons, card tilt,
   mobile menu. Decorative motion honors prefers-reduced-motion; the typed
   status line stays active across desktop and mobile browsers. */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- kinetic hero word --- */
  var roll = document.querySelector('[data-roll]');
  if (roll && !reduced) {
    var wordIndex = 0;
    var count = roll.children.length;
    setInterval(function () {
      wordIndex = (wordIndex + 1) % count;
      roll.style.transform = 'translateY(' + (-wordIndex * 1.1) + 'em)';
    }, 2600);
  }

  /* --- typed status line --- */
  var typed = document.querySelector('[data-typed]');
  // Keep the signature ticker typing even when the device requests less motion.
  if (typed) {
    var phrases = [
      'practical AI and everyday workflows',
      'useful tools, built with curiosity',
      'technology that brings people together'
    ];
    (function typeLoop(pi) {
      var phrase = phrases[pi % phrases.length];
      var i = 0;
      function step() {
        i++;
        typed.textContent = phrase.slice(0, i);
        if (i < phrase.length) setTimeout(step, 40 + Math.random() * 45);
        else setTimeout(erase, 2600);
      }
      function erase() {
        i--;
        typed.textContent = phrase.slice(0, i);
        if (i > 0) setTimeout(erase, 16);
        else setTimeout(function () { typeLoop(pi + 1); }, 350);
      }
      step();
    })(0);
  }

  /* --- particle field (hero only) --- */
  var canvas = document.querySelector('[data-particles]');
  if (canvas && !reduced) {
    var ctx = canvas.getContext('2d');
    var hero = canvas.parentElement;
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var size = function () {
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    new ResizeObserver(size).observe(hero);

    var parts = [];
    for (var i = 0; i < 90; i++) {
      parts.push({
        x: Math.random(), y: Math.random(),
        r: 0.6 + Math.random() * 1.6,
        depth: 0.25 + Math.random() * 0.75,
        vx: (Math.random() - 0.5) * 0.00012,
        vy: (Math.random() - 0.5) * 0.00009,
        gold: Math.random() < 0.4,
        tw: Math.random() * Math.PI * 2
      });
    }
    var mx = 0.5, my = 0.5, smx = 0.5, smy = 0.5;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
    });
    var particleFrame = 0;
    var heroVisible = true;
    var particlePreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    var syncParticles = function () {
      cancelAnimationFrame(particleFrame);
      particleFrame = 0;
      if (heroVisible && !document.hidden && !particlePreference.matches) particleFrame = requestAnimationFrame(tick);
    };
    var tick = function (t) {
      smx += (mx - smx) * 0.04; smy += (my - smy) * 0.04;
      ctx.clearRect(0, 0, W, H);
      for (var j = 0; j < parts.length; j++) {
        var p = parts[j];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -0.02) p.x = 1.02; if (p.x > 1.02) p.x = -0.02;
        if (p.y < -0.02) p.y = 1.02; if (p.y > 1.02) p.y = -0.02;
        var ox = (smx - 0.5) * 46 * p.depth;
        var oy = (smy - 0.5) * 30 * p.depth;
        var a = (0.16 + 0.5 * p.depth) * (0.7 + 0.3 * Math.sin(t * 0.001 + p.tw));
        ctx.beginPath();
        ctx.arc(p.x * W + ox, p.y * H + oy, p.r * p.depth + 0.4, 0, Math.PI * 2);
        ctx.fillStyle = p.gold ? 'rgba(232,180,76,' + a + ')' : 'rgba(91,116,255,' + a + ')';
        ctx.fill();
      }
      particleFrame = requestAnimationFrame(tick);
    };
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      syncParticles();
    }).observe(hero);
    document.addEventListener('visibilitychange', syncParticles);
    particlePreference.addEventListener('change', syncParticles);
  }

  /* Scroll-linked depth: native scroll stays in control. Only decorative
     layers move; copy and click targets remain stable. One frame per scroll. */
  var story = document.querySelector('[data-scroll-story]');
  if (story) {
    var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    var opening = story.querySelector('.hero-section');
    var chapters = story.querySelectorAll('[data-chapter]');
    var framePending = false;
    var updateDepth = function () {
      framePending = false;
      if (motionPreference.matches) {
        opening.style.removeProperty('--opening-depth');
        return;
      }
      var rect = opening.getBoundingClientRect();
      var progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      opening.style.setProperty('--opening-depth', progress.toFixed(3));
    };
    var scheduleDepth = function () {
      if (!framePending) { framePending = true; requestAnimationFrame(updateDepth); }
    };
    window.addEventListener('scroll', scheduleDepth, { passive: true });
    window.addEventListener('resize', scheduleDepth, { passive: true });
    motionPreference.addEventListener('change', scheduleDepth);
    scheduleDepth();
    var chapterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          story.setAttribute('data-current-chapter', entry.target.getAttribute('data-chapter'));
        }
      });
    }, { rootMargin: '-15% 0px -45% 0px', threshold: 0 });
    chapters.forEach(function (chapter) { chapterObserver.observe(chapter); });
  }

  /* --- scroll reveals --- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && !reduced) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.opacity = '1';
          en.target.style.transform = 'translateY(0px)';
          observer.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) {
      var i = parseInt(el.getAttribute('data-reveal') || '0', 10);
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.65s ease ' + (Math.min(i, 3) * 0.07) + 's, transform 0.75s cubic-bezier(0.22,1,0.36,1) ' + (Math.min(i, 3) * 0.07) + 's';
      el.addEventListener('focusin', function () { el.style.opacity = '1'; el.style.transform = 'none'; observer.unobserve(el); });
      observer.observe(el);
    });
  }

  /* --- magnetic buttons --- */
  if (!reduced) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        var dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        el.style.transition = 'transform 0.12s ease-out';
        el.style.transform = 'translate(' + (dx * 5).toFixed(1) + 'px,' + (dy * 4).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () {
        el.style.transition = 'transform 0.45s cubic-bezier(0.22,1,0.36,1)';
        el.style.transform = 'translate(0px,0px)';
      });
    });

    /* --- card tilt --- */
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;
        var dy = (e.clientY - r.top) / r.height - 0.5;
        el.style.transition = 'transform 0.15s ease-out, box-shadow 0.3s ease';
        el.style.transform = 'perspective(900px) rotateX(' + (-dy * 3).toFixed(2) + 'deg) rotateY(' + (dx * 3).toFixed(2) + 'deg) translateY(-4px)';
        el.style.boxShadow = '0 24px 60px rgba(0,0,0,0.35)';
      });
      el.addEventListener('pointerleave', function () {
        el.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease';
        el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        el.style.boxShadow = 'none';
      });
    });
  }

  /* --- keyboard-accessible mobile menu --- */
  var menu = document.querySelector('[data-mobile-menu]');
  var burger = document.querySelector('[data-nav-burger]');
  if (menu && burger) {
    var close = function (restoreFocus) {
      menu.style.display = 'none';
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (restoreFocus) burger.focus();
    };
    burger.addEventListener('click', function () {
      menu.style.display = 'flex';
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      menu.querySelector('[data-menu-close]').focus();
    });
    menu.querySelector('[data-menu-close]').addEventListener('click', function () { close(true); });
    menu.querySelectorAll('a').forEach(function (el) {
      el.addEventListener('click', function () { close(true); });
    });
    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(true); }
      if (e.key !== 'Tab') return;
      var controls = menu.querySelectorAll('a, button');
      var first = controls[0], last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
})();
