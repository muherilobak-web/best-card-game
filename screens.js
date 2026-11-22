// Keempat layar Pasar Rempah: judul, menang, kalah, dan panel cara bermain.
// Layar judul menampilkan tiga contoh kartu rempah dengan angka terbaca.
const Screens = (function () {
  function sampleCards() {
    const samples = [
      { uid: 9001, kind: 'spice', spice: 'lada', name: 'Lada Langka', cost: 3, atk: 5, def: 3, text: 'Pedas membara.' },
      { uid: 9002, kind: 'spice', spice: 'kunyit', name: 'Kunyit Pilihan', cost: 2, atk: 3, def: 2, text: 'Warna emas.' },
      { uid: 9003, kind: 'spice', spice: 'cengkih', name: 'Cengkih Pedas', cost: 1, atk: 3, def: 0, text: 'Paku merah.' },
    ];
    const wrap = document.createElement('div');
    wrap.className = 'sample-cards';
    samples.forEach((c) => wrap.appendChild(createCardElement(c, { small: true })));
    return wrap;
  }

  function showTitle(handlers) {
    const root = document.getElementById('title-screen');
    root.innerHTML =
      '<div class="harbor">' +
        '<div class="sailboat">⛵</div>' +
        '<div class="sacks">🛍️ 🛍️</div>' +
        '<h1 class="game-title">Pasar Rempah</h1>' +
        '<h2 class="game-subtitle">Duel Saudagar</h2>' +
        '<p class="tagline">Dua saudagar, satu pasar. Habiskan 20 koin lawan dengan kombo rempah!</p>' +
      '</div>' +
      '<div id="title-samples"></div>' +
      '<div class="title-buttons">' +
        '<button id="start-btn" class="big-btn start">Mulai Berdagang</button>' +
        '<button id="howto-btn" class="small-btn">Cara Bermain</button>' +
      '</div>' +
      '<p class="credit">oleh Muheri Lobak</p>' +
      '<div id="howto-panel" class="howto hidden">' +
        '<h3>Cara Bermain</h3>' +
        '<ol>' +
          '<li>Setiap giliran kamu mendapat <b>3 koin aksi</b> dan 1 kartu baru.</li>' +
          '<li>Klik kartu lalu klik lagi untuk memainkannya. Serang mengurangi koin lawan, bertahan menambah perisai.</li>' +
          '<li>Mainkan <b>rempah yang sama berturut-turut</b>: kartu ke-2 dapat +2 serang, kartu ke-3 dapat +5 serang dan 1 kartu baru.</li>' +
          '<li>Perisai menyerap serangan dulu, lalu berkurang separuh di awal giliranmu.</li>' +
          '<li>Menang bila koin lawan habis. Lawanmu, <b>Saudagar Bayu</b>, menimbun satu rempah favorit — potong rencananya dengan kartu Badai!</li>' +
        '</ol>' +
        '<button id="howto-close" class="small-btn">Tutup</button>' +
      '</div>';
    root.querySelector('#title-samples').appendChild(sampleCards());
    root.querySelector('#start-btn').addEventListener('click', () => { Sounds.click(); handlers.onStart(); });
    const panel = root.querySelector('#howto-panel');
    root.querySelector('#howto-btn').addEventListener('click', () => { Sounds.click(); panel.classList.remove('hidden'); });
    root.querySelector('#howto-close').addEventListener('click', () => { Sounds.click(); panel.classList.add('hidden'); });
  }

  function bestCards(game) {
    const played = (game.playedCards || []).filter((c) => c.kind === 'spice');
    played.sort((a, b) => (b.atk + b.def) - (a.atk + a.def));
    return played.slice(0, 3);
  }

  function showEnd(game, handlers) {
    const won = game.phase === 'won';
    const root = document.getElementById('end-screen');
    const stats = game.stats;
    const lifeLeft = won ? game.player.life : game.ai.life;
    const best = bestCards(game);
    let cardsHtml = '';
    if (best.length > 0) {
      const wrap = document.createElement('div');
      wrap.className = 'sample-cards end-cards';
      best.forEach((c) => wrap.appendChild(createCardElement(c, { small: true })));
      cardsHtml = wrap.outerHTML;
    }
    let finisherHtml = '';
    if (!won && game.lastPlayed) {
      const wrap = document.createElement('div');
      wrap.className = 'sample-cards end-cards';
      wrap.appendChild(createCardElement(game.lastPlayed.card, { small: true }));
      finisherHtml = '<p class="finisher-label">Kartu terakhir Saudagar Bayu:</p>' + wrap.outerHTML;
    }

    root.innerHTML =
      '<div class="end-inner ' + (won ? 'win' : 'lose') + '">' +
        '<h1 class="end-title">' + (won ? 'PASAR MILIKMU!' : 'Saudagar Bayu Merebut Pasarmu') + '</h1>' +
        '<p class="end-sub">' + (won
          ? 'Kamu menguasai pelabuhan! Koin emas berjatuhan untuk sang pemenang.'
          : 'Pelabuhan jatuh ke tangan lawan. Kumpulkan rempahmu dan coba lagi.') + '</p>' +
        '<div class="end-stats">' +
          '<div><span class="stat-big">' + lifeLeft + '</span><span class="stat-label">' + (won ? 'koinmu tersisa' : 'koin lawan tersisa') + '</span></div>' +
          '<div><span class="stat-big">' + stats.turnsPlayed + '</span><span class="stat-label">giliran</span></div>' +
          '<div><span class="stat-big">' + stats.cardsPlayed + '</span><span class="stat-label">kartu dimainkan</span></div>' +
          '<div><span class="stat-big">x' + Math.max(1, stats.biggestCombo) + '</span><span class="stat-label">kombo terbesar</span></div>' +
        '</div>' +
        (won ? '<p class="finisher-label">Tiga kartu rempah terbaikmu:</p>' + cardsHtml : finisherHtml) +
        '<div class="title-buttons">' +
          '<button id="again-btn" class="big-btn start">' + (won ? 'Main Lagi' : 'Coba Lagi') + '</button>' +
          '<button id="menu-btn" class="small-btn">Kembali ke Judul</button>' +
        '</div>' +
      '</div>';
    root.querySelector('#again-btn').addEventListener('click', () => { Sounds.click(); handlers.onAgain(); });
    root.querySelector('#menu-btn').addEventListener('click', () => { Sounds.click(); handlers.onMenu(); });
    if (won) Animations.coinRain(root, 30);
  }

  return { showTitle, showEnd };
})();
