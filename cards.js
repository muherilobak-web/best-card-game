// Tampilan kartu Pasar Rempah: kartu krem seperti kertas tua dengan
// bingkai warna rempah, lingkaran emas biaya di kiri atas, pedang merah
// serang di kiri bawah, perisai biru bertahan di kanan bawah, lambang
// rempah besar di tengah, dan nama kartu di bawah lambang.
function specialIcon(card) {
  if (card.spice === 'kapal') return '⛵';
  if (card.spice === 'badai') return '⛈';
  if (card.spice === 'pasar') return '🏮';
  return '';
}

function createCardElement(card, opts) {
  const o = opts || {};
  const el = document.createElement('div');
  el.className = 'card' + (card.kind === 'special' ? ' special' : '');
  el.dataset.uid = String(card.uid);
  const spice = SPICES[card.spice];
  const frameColor = card.kind === 'special' ? '#7a5c1e' : (spice ? spice.color : '#7a5c1e');
  el.style.setProperty('--frame', frameColor);
  if (o.small) el.classList.add('small');
  if (o.playable === false) el.classList.add('unaffordable');
  if (o.selected) el.classList.add('selected');
  if (o.comboReady) el.classList.add('combo-ready');

  const symbol = card.kind === 'spice'
    ? spiceSymbolSvg(card.spice, o.small ? 38 : 58)
    : `<div class="special-icon">${specialIcon(card)}</div>`;

  el.innerHTML =
    '<div class="card-cost" title="Biaya koin aksi">' + card.cost + '</div>' +
    '<div class="card-symbol">' + symbol + '</div>' +
    '<div class="card-name">' + card.name + '</div>' +
    '<div class="card-text">' + card.text + '</div>' +
    '<div class="card-stats">' +
      '<span class="stat-atk" title="Serang">⚔ ' + card.atk + '</span>' +
      '<span class="stat-def" title="Bertahan">🛡 ' + card.def + '</span>' +
    '</div>';
  if (o.onClick) el.addEventListener('click', () => o.onClick(card, el));
  return el;
}

function createCardBack() {
  const el = document.createElement('div');
  el.className = 'card card-back';
  el.innerHTML = '<div class="card-back-inner">✦<br>REMPAH</div>';
  return el;
}
