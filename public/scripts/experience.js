(function () {
  const filterGroup = document.querySelector('.career-filters');
  const buttons = Array.from(document.querySelectorAll('[data-focus]'));
  const roles = Array.from(document.querySelectorAll('[data-career-role]'));
  const items = Array.from(document.querySelectorAll('[data-accomplishment]'));
  const status = document.getElementById('filter-status');
  if (!filterGroup || !status) return;
  filterGroup.hidden = false;
  function applyFilter(focus) {
    const selected = buttons.find(button => button.dataset.focus === focus) || buttons[0];
    focus = selected.dataset.focus;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button === selected)));
    items.forEach(item => { item.hidden = focus !== 'all' && item.dataset.category !== focus; });
    let matches = 0;
    roles.forEach((role, index) => {
      const visible = Array.from(role.querySelectorAll('[data-accomplishment]')).some(item => !item.hidden);
      role.hidden = !visible;
      role.open = focus !== 'all' || index === 0;
      role.querySelector('.role-summary').hidden = focus !== 'all';
      if (visible) matches++;
    });
    status.textContent = focus === 'all' ? 'Showing all 3 roles.' : selected.textContent + ' · ' + matches + (matches === 1 ? ' matching role.' : ' matching roles.');
    const url = new URL(window.location.href);
    if (focus === 'all') url.searchParams.delete('focus');
    else url.searchParams.set('focus', focus);
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  }
  buttons.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.focus)));
  applyFilter(new URL(window.location.href).searchParams.get('focus') || 'all');
  const printButton = document.getElementById('print-resume');
  if (printButton) {
    printButton.hidden = false;
    printButton.addEventListener('click', () => window.print());
  }
  let printState = null;
  window.addEventListener('beforeprint', () => {
    printState = Array.from(document.querySelectorAll('details')).map(detail => [detail, detail.open]);
    printState.forEach(([detail]) => { detail.open = true; });
  });
  window.addEventListener('afterprint', () => {
    if (printState) printState.forEach(([detail, open]) => { detail.open = open; });
    printState = null;
  });
})();
