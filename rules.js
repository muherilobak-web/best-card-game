// Aturan permainan Pasar Rempah: Duel Saudagar.
// Mesin permainan murni tanpa tampilan: keadaan, giliran, koin aksi,
// kombo rempah, perisai, kartu khusus, dan kondisi menang/kalah.
const START_LIFE = 20;
const START_HAND = 5;
const ACTION_COINS = 3;
const MAX_TURNS = 40;

function makeSide(name) {
  return {
    name,
    life: START_LIFE,
    shield: 0,
    action: 0,
    hand: [],
    lastSpice: null,
    chain: 0,
  };
}

function createGame() {
  return {
    phase: 'title',
    turn: 0,
    current: 'player',
    player: makeSide('Kamu'),
    ai: makeSide('Saudagar Bayu'),
    aiFavorite: 'lada',
    deck: [],
    discard: [],
    log: [],
    stats: { cardsPlayed: 0, biggestCombo: 0, turnsPlayed: 0 },
    events: [],
  };
}

function log(game, text) {
  game.log.unshift(text);
  if (game.log.length > 8) game.log.length = 8;
}

function emit(game, type, data) {
  game.events.push({ type, ...data });
}

function drawCard(game, side) {
  if (game.deck.length === 0) {
    if (game.discard.length === 0) return null;
    game.deck = shuffle(game.discard.splice(0));
    log(game, 'Tumpukan habis — kartu buangan dikocok ulang.');
  }
  const card = game.deck.pop();
  side.hand.push(card);
  return card;
}

function startGame(game) {
  const fresh = createGame();
  Object.assign(game, fresh);
  game.phase = 'playing';
  game.aiFavorite = SPICE_ORDER[Math.floor(Math.random() * SPICE_ORDER.length)];
  game.deck = shuffle(buildDeck());
  for (let i = 0; i < START_HAND; i++) {
    drawCard(game, game.player);
    drawCard(game, game.ai);
  }
  game.turn = 1;
  game.stats.turnsPlayed = 1;
  startTurn(game, game.player);
  log(game, 'Saudagar Bayu menyukai rempah ' + SPICES[game.aiFavorite].name + '. Waspada!');
  emit(game, 'deal', {});
  return game;
}

// Awal giliran: ambil 1 kartu, isi 3 koin aksi, perisai berkurang separuh
// (perisai yang tersisa di akhir giliran lawan hilang separuhnya).
function startTurn(game, side) {
  game.current = side === game.player ? 'player' : 'ai';
  side.action = ACTION_COINS;
  side.lastSpice = null;
  side.chain = 0;
  if (side.shield > 0) {
    const lost = Math.floor(side.shield / 2);
    if (lost > 0) {
      side.shield -= lost;
      log(game, 'Perisai ' + side.name + ' berkurang ' + lost + ' (tersisa separuh).');
    }
  }
  drawCard(game, side);
}

// Kerusakan menembus perisai dulu, baru koin nyawa.
function dealDamage(game, target, amount, attackerName) {
  let rest = amount;
  if (target.shield > 0) {
    const absorbed = Math.min(target.shield, rest);
    target.shield -= absorbed;
    rest -= absorbed;
  }
  if (rest > 0) target.life = Math.max(0, target.life - rest);
  emit(game, 'damage', { target: target === game.player ? 'player' : 'ai', amount, life: target.life });
  return rest;
}

function checkEnd(game) {
  if (game.phase !== 'playing') return;
  if (game.player.life <= 0 && game.ai.life <= 0) {
    // Kedua nyawa nol bersamaan: yang menyerang menang.
    game.phase = game.lastAttacker === 'ai' ? 'lost' : 'won';
  } else if (game.ai.life <= 0) {
    game.phase = 'won';
  } else if (game.player.life <= 0) {
    game.phase = 'lost';
  } else if (game.turn > MAX_TURNS) {
    if (game.player.life !== game.ai.life) {
      game.phase = game.player.life > game.ai.life ? 'won' : 'lost';
    } else if (game.player.hand.length !== game.ai.hand.length) {
      game.phase = game.player.hand.length > game.ai.hand.length ? 'won' : 'lost';
    } else {
      game.phase = 'won';
    }
  }
  if (game.phase === 'won' || game.phase === 'lost') {
    emit(game, game.phase === 'won' ? 'win' : 'lose', {});
  }
}

// Memainkan satu kartu dari tangan. Mengembalikan false bila tidak bisa.
function playCard(game, side, handIndex) {
  if (game.phase !== 'playing') return false;
  const card = side.hand[handIndex];
  if (!card) return false;
  if (card.cost > side.action) return false;
  const opponent = side === game.player ? game.ai : game.player;
  const who = side === game.player ? 'player' : 'ai';

  side.hand.splice(handIndex, 1);
  side.action -= card.cost;
  game.discard.push(card);
  game.stats.cardsPlayed++;
  game.lastAttacker = who;
  emit(game, 'play', { who, card });

  if (card.kind === 'spice') {
    // Kombo rempah: rempah sama berturut-turut dalam satu giliran.
    if (side.lastSpice === card.spice) {
      side.chain += 1;
    } else {
      side.lastSpice = card.spice;
      side.chain = 1;
    }
    let bonus = 0;
    let drew = false;
    if (side.chain === 2) {
      bonus = 2;
    } else if (side.chain >= 3) {
      bonus = 5;
      drawCard(game, side);
      drew = true;
    }
    if (side.chain > game.stats.biggestCombo) game.stats.biggestCombo = side.chain;
    const totalAtk = card.atk + bonus;
    if (bonus > 0) {
      emit(game, 'combo', { who, spice: card.spice, chain: side.chain, bonus, drew });
      log(game, side.name + ' KOMBO ' + SPICES[card.spice].name + ' x' + side.chain + ': +' + bonus + ' serang' + (drew ? ' dan ambil 1 kartu' : '') + '!');
    }
    if (card.def > 0) {
      side.shield += card.def;
      emit(game, 'shield', { who, amount: card.def, shield: side.shield });
    }
    if (totalAtk > 0) {
      const dealt = dealDamage(game, opponent, totalAtk, side.name);
      log(game, side.name + ' memainkan ' + card.name + ' (' + totalAtk + ' serang' + (card.def > 0 ? ', +' + card.def + ' perisai' : '') + ').');
    } else {
      log(game, side.name + ' memainkan ' + card.name + '.');
    }
  } else if (card.spice === 'kapal') {
    side.action += 2;
    drawCard(game, side);
    side.lastSpice = null;
    side.chain = 0;
    log(game, side.name + ' memainkan Kapal Dagang: +2 koin aksi dan ambil 1 kartu.');
    emit(game, 'ship', { who });
  } else if (card.spice === 'badai') {
    opponent.shield = 0;
    let discarded = null;
    if (opponent.hand.length > 0) {
      const idx = Math.floor(Math.random() * opponent.hand.length);
      discarded = opponent.hand.splice(idx, 1)[0];
      game.discard.push(discarded);
    }
    side.lastSpice = null;
    side.chain = 0;
    log(game, side.name + ' memainkan Badai! Perisai ' + opponent.name + ' hilang' + (discarded ? ' dan kartu ' + discarded.name + ' terbuang' : '') + '.');
    emit(game, 'storm', { who, discarded: discarded ? discarded.name : null });
  } else if (card.spice === 'pasar') {
    side.shield += 3;
    drawCard(game, side);
    side.lastSpice = null;
    side.chain = 0;
    log(game, side.name + ' memainkan Pasar Ramai: +3 perisai dan ambil 1 kartu.');
    emit(game, 'market', { who });
  }

  checkEnd(game);
  return true;
}

function canAffordAny(game, side) {
  return side.hand.some((c) => c.cost <= side.action);
}

function endTurn(game) {
  if (game.phase !== 'playing') return;
  const next = game.current === 'player' ? game.ai : game.player;
  if (game.current === 'ai') {
    game.turn += 1;
    game.stats.turnsPlayed = game.turn;
  }
  log(game, (game.current === 'player' ? 'Kamu' : 'Saudagar Bayu') + ' mengakhiri giliran.');
  emit(game, 'turn', { next: game.current === 'player' ? 'ai' : 'player' });
  startTurn(game, next);
  checkEnd(game);
}
