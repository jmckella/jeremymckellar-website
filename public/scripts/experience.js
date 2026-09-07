(function () {
  const track = document.getElementById('journey-track');
  if (!track) return;
  const cards = Array.from(track.querySelectorAll('.journey-card'));
  const controls = document.querySelector('.journey-controls');
  const years = Array.from(document.querySelectorAll('[data-chapter-index]'));
  const previous = document.querySelector('[data-previous]');
  const next = document.querySelector('[data-next]');
  const status = document.querySelector('.journey-status');
  let active = 0;
  controls.hidden = false;
  status.hidden = false;
  document.getElementById('journey-hint').textContent = 'Swipe, choose a year, or use the arrows to explore.';
  function update() {
    const left = track.getBoundingClientRect().left;
    active = cards.reduce((best, card, index) => Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[best].getBoundingClientRect().left - left) ? index : best, 0);
    years.forEach((button, index) => {
      if (index === active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    previous.disabled = active === 0;
    next.disabled = active === cards.length - 1;
    status.textContent = 'Chapter ' + (active + 1) + ' of ' + cards.length + ' · ' + years[active].textContent;
  }
  function go(index) {
    index = Math.max(0, Math.min(cards.length - 1, index));
    const left = cards[index].getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({left, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }
  years.forEach((button, index) => button.addEventListener('click', () => go(index)));
  previous.addEventListener('click', () => go(active - 1));
  next.addEventListener('click', () => go(active + 1));
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    const targets = {ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: cards.length - 1};
    if (Object.hasOwn(targets, event.key)) { event.preventDefault(); go(targets[event.key]); }
  });
  let frame;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  }, {passive: true});
  new ResizeObserver(update).observe(track);
  update();
})();
