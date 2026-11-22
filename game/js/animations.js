// Animasi Pasar Rempah: angka melayang, getar layar saat Badai,
// hujan koin emas saat menang, dan kilau kombo. Semua animasi murni
// CSS dan DOM, tidak pernah menghalangi tombol ditekan.
const Animations = (function () {
  function floatText(container, text, cls) {
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'float-text ' + (cls || '');
    el.textContent = text;
    container.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }

  function damageFloat(targetEl, amount) {
    if (!targetEl) return;
    floatText(targetEl, '-' + amount, 'dmg');
  }

  function shake() {
    const table = document.getElementById('table-screen');
    if (!table) return;
    table.classList.remove('shake');
    void table.offsetWidth;
    table.classList.add('shake');
  }

  function comboGlow(cardEl) {
    if (!cardEl) return;
    cardEl.classList.remove('combo-glow');
    void cardEl.offsetWidth;
    cardEl.classList.add('combo-glow');
  }

  function coinRain(container, count) {
    if (!container) return;
    const n = count || 24;
    for (let i = 0; i < n; i++) {
      const coin = document.createElement('div');
      coin.className = 'coin-rain';
      coin.textContent = '◉';
      coin.style.left = Math.random() * 100 + '%';
      coin.style.animationDelay = (Math.random() * 1.2) + 's';
      coin.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
      coin.style.fontSize = (18 + Math.random() * 22) + 'px';
      container.appendChild(coin);
      setTimeout(() => coin.remove(), 4200);
    }
  }

  return { floatText, damageFloat, shake, comboGlow, coinRain };
})();
