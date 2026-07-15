/* Generative abstract article header — seeded by article slug so each post
   gets a unique but consistent cobalt/gold constellation composition. */
(function () {
  if (customElements.get('abstract-header')) return;

  function strHash(s) {
    var h = 1779033703 ^ s.length;
    for (var i = 0; i < s.length; i++) {
      h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  }

  function mulberry(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  class AbstractHeader extends HTMLElement {
    connectedCallback() {
      this.style.cssText = 'display:block;width:100%;height:100%;overflow:hidden;';
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'width:100%;height:100%;display:block;';
        this.appendChild(this.canvas);
      }
      this.ro = new ResizeObserver(() => this.draw());
      this.ro.observe(this);
      this.draw();
    }

    disconnectedCallback() {
      if (this.ro) this.ro.disconnect();
    }

    draw() {
      var c = this.canvas;
      if (!c) return;
      var w = this.clientWidth || 800, h = this.clientHeight || 300;
      if (!w || !h) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = w * dpr; c.height = h * dpr;
      var x = c.getContext('2d');
      x.setTransform(dpr, 0, 0, dpr, 0, 0);

      var seed = this.getAttribute('seed') || 'jm';
      var variant = this.getAttribute('variant') || 'hero';
      var rnd = mulberry(strHash(seed));

      // canvas base
      var g = x.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#0D173D');
      g.addColorStop(1, '#0A1130');
      x.fillStyle = g;
      x.fillRect(0, 0, w, h);

      // cobalt glow
      var gx = w * (0.2 + rnd() * 0.6), gy = h * (0.2 + rnd() * 0.6);
      var rg = x.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.6);
      rg.addColorStop(0, 'rgba(59,91,255,0.28)');
      rg.addColorStop(1, 'rgba(59,91,255,0)');
      x.fillStyle = rg;
      x.fillRect(0, 0, w, h);

      // concentric arcs
      var ax = w * (0.15 + rnd() * 0.7), ay = h * (0.1 + rnd() * 0.8);
      var arcs = 3 + Math.floor(rnd() * 3);
      for (var i = 0; i < arcs; i++) {
        x.beginPath();
        var r = h * 0.25 + i * h * 0.22 + rnd() * h * 0.1;
        var a0 = rnd() * Math.PI * 2, a1 = a0 + 1 + rnd() * 2.5;
        x.arc(ax, ay, r, a0, a1);
        x.strokeStyle = rnd() < 0.35 ? 'rgba(232,180,76,0.4)' : 'rgba(122,144,255,0.3)';
        x.lineWidth = 1;
        x.stroke();
      }

      // constellation
      var N = variant === 'band' ? 7 : 10 + Math.floor(rnd() * 6);
      var pts = [];
      for (var j = 0; j < N; j++) {
        pts.push({
          x: w * (0.05 + rnd() * 0.9),
          y: h * (0.12 + rnd() * 0.76),
          r: 1.5 + rnd() * 3,
          gold: rnd() < 0.35
        });
      }
      x.lineWidth = 1;
      for (var k = 0; k < N; k++) {
        var a = pts[k], b = pts[(k + 1) % N];
        if (rnd() < 0.65) {
          x.beginPath();
          x.moveTo(a.x, a.y);
          x.lineTo(b.x, b.y);
          x.strokeStyle = 'rgba(138,147,168,0.25)';
          x.stroke();
        }
      }
      for (var m = 0; m < pts.length; m++) {
        var p = pts[m];
        x.beginPath();
        x.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        x.fillStyle = p.gold ? '#E8B44C' : '#5B74FF';
        x.fill();
        if (p.gold && rnd() < 0.6) {
          x.beginPath();
          x.arc(p.x, p.y, p.r + 5, 0, Math.PI * 2);
          x.strokeStyle = 'rgba(232,180,76,0.35)';
          x.stroke();
        }
      }

      // dust
      var D = variant === 'band' ? 30 : 70;
      for (var d = 0; d < D; d++) {
        x.beginPath();
        x.arc(rnd() * w, rnd() * h, 0.5 + rnd() * 1.2, 0, Math.PI * 2);
        x.fillStyle = rnd() < 0.3 ? 'rgba(232,180,76,0.5)' : 'rgba(122,144,255,0.4)';
        x.fill();
      }
    }
  }

  customElements.define('abstract-header', AbstractHeader);
})();
