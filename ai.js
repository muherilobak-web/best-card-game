// Kecerdasan Saudagar Bayu, lawan komputer Pasar Rempah.
// Gaya yang bisa dibaca: ia memilih satu rempah favorit di awal permainan
// dan berusaha memainkannya berturut-turut demi kombo.
// Urutan prioritas: habisi pemain bila bisa, lanjutkan kombo, Badai bila
// pemain menimbun perisai, Kapal Dagang bila koin aksi menipis, Pasar Ramai
// bila nyawa menipis, lalu kartu termahal yang mampu dibayar.
function aiChoose(game) {
  const ai = game.ai;
  const player = game.player;

  function damageOf(card) {
    if (card.kind !== 'spice') return 0;
    let bonus = 0;
    if (ai.lastSpice === card.spice) {
      bonus = ai.chain + 1 >= 3 ? 5 : 2;
    }
    return card.atk + bonus;
  }

  // 1. Kartu yang bisa menghabisi pemain saat ini juga.
  for (let i = 0; i < ai.hand.length; i++) {
    const card = ai.hand[i];
    if (card.cost > ai.action || card.kind !== 'spice') continue;
    const net = Math.max(0, damageOf(card) - player.shield);
    if (net >= player.life) return { type: 'play', index: i };
  }

  // 2. Lanjutkan kombo rempah favorit (atau rempah yang sedang dirangkai).
  const wanted = ai.lastSpice || game.aiFavorite;
  for (let i = 0; i < ai.hand.length; i++) {
    const card = ai.hand[i];
    if (card.kind === 'spice' && card.spice === wanted && card.cost <= ai.action) {
      return { type: 'play', index: i };
    }
  }

  // 3. Badai bila pemain menimbun perisai besar.
  if (player.shield >= 6) {
    for (let i = 0; i < ai.hand.length; i++) {
      const card = ai.hand[i];
      if (card.spice === 'badai' && card.cost <= ai.action) return { type: 'play', index: i };
    }
  }

  // 3b. Kapal Dagang bila koin aksi menipis: +2 koin aksi dan 1 kartu baru.
  if (ai.action <= 2) {
    for (let i = 0; i < ai.hand.length; i++) {
      const card = ai.hand[i];
      if (card.spice === 'kapal' && card.cost <= ai.action) return { type: 'play', index: i };
    }
  }

  // 3c. Pasar Ramai bila nyawa menipis: +3 perisai dan 1 kartu baru.
  if (ai.life <= 8) {
    for (let i = 0; i < ai.hand.length; i++) {
      const card = ai.hand[i];
      if (card.spice === 'pasar' && card.cost <= ai.action) return { type: 'play', index: i };
    }
  }

  // 4. Kartu termahal yang mampu dibayar (rempah favorit didahulukan).
  let best = -1;
  let bestCost = -1;
  for (let i = 0; i < ai.hand.length; i++) {
    const card = ai.hand[i];
    if (card.cost > ai.action) continue;
    const score = card.cost * 10 + (card.spice === game.aiFavorite ? 3 : 0) + card.atk;
    if (score > bestCost) {
      bestCost = score;
      best = i;
    }
  }
  if (best >= 0) return { type: 'play', index: best };

  // 5. Akhiri giliran.
  return { type: 'end' };
}
