/* Site behaviors ported from the design prototype: kinetic hero word, typed
   status line, particle field, scroll reveals, magnetic buttons, card tilt,
   mobile menu, subscribe placeholders. All honor prefers-reduced-motion. */
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
  if (typed) {
    var phrases = [
      'the next public prototype',
      'AI workflows that make work human',
      'a new Thoughts post',
      'Tech Innovation Made Human — new episode'
    ];
    if (reduced) {
      typed.textContent = phrases[0];
    } else {
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
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
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
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity 0.9s ease ' + (i * 0.09) + 's, transform 0.9s cubic-bezier(0.22,1,0.36,1) ' + (i * 0.09) + 's';
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

  /* --- mobile menu --- */
  var menu = document.querySelector('[data-mobile-menu]');
  var burger = document.querySelector('[data-nav-burger]');
  if (menu && burger) {
    burger.addEventListener('click', function () { menu.style.display = 'flex'; });
    menu.querySelectorAll('a, [data-menu-close]').forEach(function (el) {
      el.addEventListener('click', function () { menu.style.display = 'none'; });
    });
  }

  /* --- subscribe forms (MailerLite wiring replaces this at launch) --- */
  document.querySelectorAll('[data-subscribe]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var confirm = form.parentElement.querySelector('.subscribe-confirm');
      if (confirm) confirm.classList.add('on');
    });
  });
})();
