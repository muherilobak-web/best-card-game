// Tumpukan kartu Pasar Rempah: 40 kartu.
// 30 kartu rempah (5 untuk tiap dari 6 rempah, dari murah sampai mahal)
// dan 10 kartu khusus: 4 Kapal Dagang, 3 Badai, 3 Pasar Ramai.
const SPICE_CARD_TIERS = [
  { suffix: 'Muda', cost: 1, atk: 2, def: 1 },
  { suffix: 'Pedas', cost: 1, atk: 3, def: 0 },
  { suffix: 'Pilihan', cost: 2, atk: 3, def: 2 },
  { suffix: 'Kuat', cost: 2, atk: 4, def: 1 },
  { suffix: 'Langka', cost: 3, atk: 5, def: 3 },
];

const SPECIAL_CARDS = [
  {
    id: 'kapal', kind: 'special', name: 'Kapal Dagang', cost: 2, atk: 0, def: 0,
    text: '+2 koin aksi, ambil 1 kartu.',
    copies: 4,
  },
  {
    id: 'badai', kind: 'special', name: 'Badai', cost: 3, atk: 0, def: 0,
    text: 'Buang kartu lawan, hapus perisai.',
    copies: 3,
  },
  {
    id: 'pasar', kind: 'special', name: 'Pasar Ramai', cost: 1, atk: 0, def: 3,
    text: '+3 perisai, ambil 1 kartu.',
    copies: 3,
  },
];

let cardUid = 0;

function buildDeck() {
  const deck = [];
  for (const spiceId of SPICE_ORDER) {
    const spice = SPICES[spiceId];
    for (const tier of SPICE_CARD_TIERS) {
      deck.push({
        uid: ++cardUid,
        kind: 'spice',
        spice: spiceId,
        name: spice.name + ' ' + tier.suffix,
        cost: tier.cost,
        atk: tier.atk,
        def: tier.def,
        text: spice.blurb,
      });
    }
  }
  for (const spec of SPECIAL_CARDS) {
    for (let i = 0; i < spec.copies; i++) {
      deck.push({
        uid: ++cardUid,
        kind: 'special',
        spice: spec.id,
        name: spec.name,
        cost: spec.cost,
        atk: spec.atk,
        def: spec.def,
        text: spec.text,
      });
    }
  }
  return deck;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
  return array;
}
