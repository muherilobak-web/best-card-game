// Pengikat utama Pasar Rempah: alur layar, masukan tetikus dan papan ketik,
// giliran lawan komputer, pengurasan kejadian aturan menjadi bunyi dan
// animasi, serta keadaan tangkapan layar (?shot=title|table|win|lose)
// yang hanya aktif bila parameter itu diberikan.
const game = createGame();
game.lastPlayed = null;
game.playedCards = [];
let selectedUid = null;
let aiTimer = null;

function currentScreen() {
  return game.phase === 'title' ? 'title' : (game.phase === 'playing' ? 'table' : 'end');
}

function showScreen(name) {
  for (const id of ['title-screen', 'table-screen', 'end-screen']) {
    document.getElementById(id).classList.add('hidden');
  }
  document.getElementById(name + '-screen').classList.remove('hidden');
}

function drainEvents() {
  const events = game.events.splice(0);
  for (const ev of events) {
    if (ev.type === 'deal') Sounds.deal();
    if (ev.type === 'play') {
      Sounds.place();
      game.lastPlayed = { who: ev.who, card: ev.card };
      game.playedCards.push(ev.card);
    }
    if (ev.type === 'damage') {
      Sounds.coin();
      const side = ev.target === 'ai' ? '.side-info.opponent' : '.side-info.player-info';
      const el = document.querySelector(side + ' .life-num');
      if (el) Animations.damageFloat(el.parentElement, ev.amount);
    }
    if (ev.type === 'combo') {
      Sounds.combo();
      const el = document.querySelector('.played-row .card');
      if (el) Animations.comboGlow(el);
    }
    if (ev.type === 'storm') { Sounds.storm(); Animations.shake(); }
    if (ev.type === 'ship' || ev.type === 'market') Sounds.click();
    if (ev.type === 'win') Sounds.win();
    if (ev.type === 'lose') Sounds.lose();
  }
}

function render() {
  const screen = currentScreen();
  showScreen(screen);
  if (screen === 'table') {
    TableView.render(game, {
      selectedUid,
      onCardClick: (idx, card) => onCardClick(idx, card),
      onEndTurn: () => onEndTurn(),
    });
  } else if (screen === 'end') {
    Screens.showEnd(game, { onAgain: () => startNewGame(), onMenu: () => toTitle() });
  }
  drainEvents();
}

function onCardClick(idx, card) {
  if (game.phase !== 'playing' || game.current !== 'player') return;
  if (selectedUid === card.uid) {
    // Klik kedua pada kartu yang sama: mainkan.
    tryPlay(idx);
    selectedUid = null;
  } else {
    selectedUid = card.uid;
    Sounds.click();
    render();
  }
}

function tryPlay(idx) {
  const card = game.player.hand[idx];
  if (!card) return;
  if (card.cost > game.player.action) {
    Animations.floatText(document.getElementById('table-screen'), 'Koin aksi tidak cukup!', 'warn');
    return;
  }
  if (playCard(game, game.player, idx)) {
    selectedUid = null;
    render();
    maybeRunAi();
  }
}

function onEndTurn() {
  if (game.phase !== 'playing' || game.current !== 'player') return;
  Sounds.click();
  endTurn(game);
  render();
  maybeRunAi();
}

function maybeRunAi() {
  if (aiTimer) { clearTimeout(aiTimer); aiTimer = null; }
  if (game.phase !== 'playing' || game.current !== 'ai') return;
  aiTimer = setTimeout(() => {
    if (game.phase !== 'playing' || game.current !== 'ai') return;
    const choice = aiChoose(game);
    if (choice.type === 'play') {
      playCard(game, game.ai, choice.index);
      render();
      maybeRunAi();
    } else {
      endTurn(game);
      render();
    }
  }, 950);
}

function startNewGame() {
  if (aiTimer) { clearTimeout(aiTimer); aiTimer = null; }
  selectedUid = null;
  game.lastPlayed = null;
  game.playedCards = [];
  startGame(game);
  render();
  maybeRunAi();
}

function toTitle() {
  if (aiTimer) { clearTimeout(aiTimer); aiTimer = null; }
  game.phase = 'title';
  Screens.showTitle({ onStart: () => startNewGame() });
  showScreen('title');
}

// Keadaan tangkapan layar: membangun keadaan tengah permainan yang nyata
// dari aturan yang sama, hanya bila ?shot= diberikan di URL.
function buildShotState(kind) {
  startNewGame();
  if (kind === 'table') {
    const deck = buildDeck();
    const pick = (spice, suffix) => deck.find((c) => c.spice === spice && c.name === SPICES[spice].name + ' ' + suffix);
    game.player.life = 14;
    game.player.shield = 4;
    game.player.action = 2;
    game.player.lastSpice = 'lada';
    game.player.chain = 2;
    game.ai.life = 11;
    game.ai.shield = 2;
    game.turn = 7;
    game.stats.turnsPlayed = 7;
    game.stats.cardsPlayed = 9;
    game.stats.biggestCombo = 3;
    game.player.hand = [
      pick('lada', 'Langka'), pick('lada', 'Kuat'), pick('kunyit', 'Pilihan'),
      pick('cengkih', 'Pedas'), pick('kayumanis', 'Muda'), deck.find((c) => c.spice === 'kapal'),
      deck.find((c) => c.spice === 'badai'),
    ];
    game.ai.hand = [deck[0], deck[1], deck[2], deck[3], deck[4]];
    game.deck = deck.slice(10, 34);
    game.discard = deck.slice(30, 36);
    game.lastPlayed = { who: 'player', card: pick('lada', 'Pilihan') };
    game.playedCards = [pick('lada', 'Pilihan'), pick('lada', 'Kuat'), pick('kunyit', 'Langka')];
    game.log = [
      'Kamu KOMBO Lada x2: +2 serang!',
      'Saudagar Bayu memainkan Kayu Manis Kuat (4 serang, +1 perisai).',
      'Kamu memainkan Lada Pilihan (3 serang, +2 perisai).',
    ];
    game.current = 'player';
    game.phase = 'playing';
  } else if (kind === 'win' || kind === 'lose') {
    const deck = buildDeck();
    const pick = (spice, suffix) => deck.find((c) => c.spice === spice && c.name === SPICES[spice].name + ' ' + suffix);
    game.stats.turnsPlayed = 12;
    game.stats.cardsPlayed = 21;
    game.stats.biggestCombo = 3;
    game.playedCards = [pick('lada', 'Langka'), pick('kunyit', 'Langka'), pick('cengkih', 'Kuat')];
    if (kind === 'win') {
      game.phase = 'won';
      game.player.life = 9;
      game.ai.life = 0;
      game.lastPlayed = { who: 'player', card: pick('lada', 'Langka') };
    } else {
      game.phase = 'lost';
      game.player.life = 0;
      game.ai.life = 7;
      game.lastPlayed = { who: 'ai', card: pick('pala', 'Langka') };
    }
  }
  render();
}

function init() {
  const params = new URLSearchParams(location.search);
  const shot = params.get('shot');
  document.getElementById('sound-btn').addEventListener('click', (e) => {
    const muted = Sounds.toggle();
    e.target.textContent = muted ? '🔇 Suara Mati' : '🔊 Suara';
  });
  document.getElementById('restart-btn').addEventListener('click', () => {
    Sounds.click();
    if (game.phase === 'playing') startNewGame();
    else toTitle();
  });

  document.addEventListener('keydown', (e) => {
    if (game.phase !== 'playing' || game.current !== 'player') {
      if (e.key === 'Enter' && game.phase === 'title') startNewGame();
      return;
    }
    if (e.key >= '1' && e.key <= '7') {
      const idx = Number(e.key) - 1;
      const card = game.player.hand[idx];
      if (card) onCardClick(idx, card);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (selectedUid !== null) {
        const idx = game.player.hand.findIndex((c) => c.uid === selectedUid);
        if (idx >= 0) tryPlay(idx);
      }
    } else if (e.key === 'e' || e.key === 'E') {
      onEndTurn();
    } else if (e.key === 'm' || e.key === 'M') {
      document.getElementById('sound-btn').click();
    } else if (e.key === 'r' || e.key === 'R') {
      startNewGame();
    }
  });

  if (shot === 'table' || shot === 'win' || shot === 'lose') {
    buildShotState(shot);
  } else {
    Screens.showTitle({ onStart: () => startNewGame() });
    showScreen('title');
  }
  window.__game = game;
}

document.addEventListener('DOMContentLoaded', init);
