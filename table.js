// Tampilan meja Pasar Rempah: latar kayu dan kain tenun, baris tangan
// lawan di atas, tumpukan kartu di tengah, tangan pemain di bawah,
// penghitung nyawa, perisai, koin aksi, panel kombo aktif, dan catatan.
const TableView = (function () {
  function coinBag(life) {
    return '<span class="coin-bag" aria-label="Koin nyawa">🪙</span><span class="life-num" data-life>' + life + '</span>';
  }

  function shieldBadge(shield) {
    return '<span class="shield-badge">🛡 <span data-shield>' + shield + '</span></span>';
  }

  function actionDots(action) {
    let dots = '';
    for (let i = 0; i < ACTION_COINS; i++) {
      dots += '<span class="action-dot' + (i < action ? ' on' : ' off') + '">●</span>';
    }
    return '<span class="action-label">Koin aksimu</span><span class="action-coins" title="Koin aksi giliran ini">' + dots + '</span>';
  }

  function comboText(game) {
    const p = game.player;
    if (!p.lastSpice || p.chain === 0) return 'Belum ada kombo. Mainkan dua kartu rempah yang sama berturut-turut.';
    const spice = SPICES[p.lastSpice];
    if (p.chain === 1) return 'Kombo ' + spice.name + ' x1 — mainkan ' + spice.name + ' lagi untuk +2 serang!';
    if (p.chain === 2) return 'Kombo ' + spice.name + ' x2: +2 serang! Satu lagi untuk +5 dan ambil kartu!';
    return 'Kombo ' + spice.name + ' x' + p.chain + ': +5 serang dan ambil 1 kartu!';
  }

  function render(game, handlers) {
    const root = document.getElementById('table-screen');
    if (!root) return;
    const player = game.player;
    const ai = game.ai;
    const fav = SPICES[game.aiFavorite];

    root.innerHTML =
      '<div class="table-top">' +
        '<div class="side-info opponent">' +
          '<div class="side-name">Saudagar Bayu <span class="fav" title="Rempah favorit lawan">' + spiceSymbolSvg(game.aiFavorite, 26) + ' ' + fav.name + '</span></div>' +
          '<div class="side-stats">' + coinBag(ai.life) + shieldBadge(ai.shield) + '</div>' +
        '</div>' +
        '<div class="turn-banner" id="turn-banner">' +
          (game.phase === 'playing'
            ? (game.current === 'player' ? 'Giliranmu — mainkan kartu!' : 'Saudagar Bayu berpikir…')
            : '') +
        '</div>' +
        '<div class="side-info player-info">' +
          '<div class="side-name">Kamu <span class="deck-count">Giliran ' + game.turn + ' / ' + MAX_TURNS + '</span></div>' +
          '<div class="side-stats">' + coinBag(player.life) + shieldBadge(player.shield) + actionDots(player.action) + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="ai-hand" id="ai-hand"></div>' +
      '<div class="table-middle">' +
        '<div class="deck-pile" id="deck-pile"><div class="mini-card">✦</div><div class="pile-label">Tumpukan<br><b>' + game.deck.length + '</b> kartu</div></div>' +
        '<div class="combo-panel" id="combo-panel"><div class="combo-title">⚜ Kombo Aktif</div><div class="combo-body">' + comboText(game) + '</div></div>' +
        '<div class="deck-pile discard-pile"><div class="mini-card discard">✦</div><div class="pile-label">Buangan<br><b>' + game.discard.length + '</b> kartu</div></div>' +
      '</div>' +
      '<div class="played-row" id="played-row"></div>' +
      '<div class="player-hand" id="player-hand"></div>' +
      '<div class="table-bottom">' +
        '<button id="end-turn-btn" class="big-btn">Akhiri Giliran ⏎</button>' +
        '<div class="game-log" id="game-log">' + game.log.map((l) => '<div>' + l + '</div>').join('') + '</div>' +
      '</div>';

    const aiHand = root.querySelector('#ai-hand');
    ai.hand.forEach(() => aiHand.appendChild(createCardBack()));

    const handEl = root.querySelector('#player-hand');
    player.hand.forEach((card, idx) => {
      const comboReady = card.kind === 'spice' && player.lastSpice === card.spice && player.chain >= 1;
      const el = createCardElement(card, {
        playable: game.current === 'player' && game.phase === 'playing' && card.cost <= player.action,
        selected: handlers.selectedUid === card.uid,
        comboReady,
        onClick: (c) => handlers.onCardClick(idx, c),
      });
      handEl.appendChild(el);
    });

    const endBtn = root.querySelector('#end-turn-btn');
    endBtn.disabled = game.phase !== 'playing' || game.current !== 'player';
    endBtn.addEventListener('click', () => handlers.onEndTurn());

    const played = root.querySelector('#played-row');
    const last = game.lastPlayed;
    if (last) {
      const label = document.createElement('div');
      label.className = 'last-played-label';
      label.textContent = last.who === 'player' ? 'Kartu yang kamu mainkan:' : 'Saudagar Bayu memainkan:';
      played.appendChild(label);
      played.appendChild(createCardElement(last.card, {}));
    }
  }

  return { render };
})();
