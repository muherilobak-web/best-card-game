// Definisi enam rempah Pasar Rempah: warna, bentuk lambang, dan nama.
// Lambang dibedakan lewat warna DAN bentuk, bukan hanya teks, supaya
// tetap terbaca pada gambar kecil.
const SPICES = {
  lada: {
    id: 'lada',
    name: 'Lada',
    color: '#2b2b2b',
    light: '#4a4a4a',
    text: '#ffffff',
    shape: 'round',
    blurb: 'Pedas membara.',
  },
  pala: {
    id: 'pala',
    name: 'Pala',
    color: '#8b5a2b',
    light: '#b07a42',
    text: '#ffffff',
    shape: 'oval',
    blurb: 'Harum hangat.',
  },
  cengkih: {
    id: 'cengkih',
    name: 'Cengkih',
    color: '#c0392b',
    light: '#e05a4a',
    text: '#ffffff',
    shape: 'nail',
    blurb: 'Paku merah.',
  },
  kayumanis: {
    id: 'kayumanis',
    name: 'Kayu Manis',
    color: '#a9713f',
    light: '#c98f56',
    text: '#ffffff',
    shape: 'roll',
    blurb: 'Manis bergulung.',
  },
  kunyit: {
    id: 'kunyit',
    name: 'Kunyit',
    color: '#d9a400',
    light: '#f2c200',
    text: '#3a2c00',
    shape: 'rhizome',
    blurb: 'Warna emas.',
  },
  jahe: {
    id: 'jahe',
    name: 'Jahe',
    color: '#cbb37e',
    light: '#e8d5a8',
    text: '#4a3517',
    shape: 'segment',
    blurb: 'Hangat beruas.',
  },
};

const SPICE_ORDER = ['lada', 'pala', 'cengkih', 'kayumanis', 'kunyit', 'jahe'];

// Menggambar lambang rempah sebagai SVG inline. Setiap bentuk berbeda:
// lada = bulatan, pala = lonjong, cengkih = paku, kayu manis = gulungan,
// kunyit = rimpang bercabang, jahe = ruas-ruas.
function spiceSymbolSvg(spiceId, size) {
  const s = SPICES[spiceId];
  const w = size || 64;
  const c = s.color;
  const l = s.light;
  let inner = '';
  if (s.shape === 'round') {
    inner = `<circle cx="32" cy="34" r="20" fill="${c}"/><circle cx="25" cy="27" r="6" fill="${l}" opacity="0.7"/><circle cx="40" cy="42" r="4" fill="${l}" opacity="0.5"/>`;
  } else if (s.shape === 'oval') {
    inner = `<ellipse cx="32" cy="34" rx="15" ry="22" fill="${c}"/><ellipse cx="27" cy="28" rx="5" ry="8" fill="${l}" opacity="0.7"/><path d="M32 12 q4 -6 10 -6" stroke="${c}" stroke-width="3" fill="none"/>`;
  } else if (s.shape === 'nail') {
    inner = `<rect x="28" y="14" width="8" height="30" rx="4" fill="${c}"/><circle cx="32" cy="48" r="9" fill="${l}"/><circle cx="32" cy="14" r="5" fill="${c}"/>`;
  } else if (s.shape === 'roll') {
    inner = `<circle cx="32" cy="34" r="20" fill="${c}"/><circle cx="32" cy="34" r="14" fill="${l}"/><circle cx="32" cy="34" r="8" fill="${c}"/><circle cx="32" cy="34" r="3" fill="${l}"/>`;
  } else if (s.shape === 'rhizome') {
    inner = `<ellipse cx="26" cy="36" rx="14" ry="10" fill="${c}" transform="rotate(-25 26 36)"/><ellipse cx="42" cy="28" rx="11" ry="8" fill="${l}" transform="rotate(20 42 28)"/><ellipse cx="38" cy="46" rx="10" ry="7" fill="${c}" transform="rotate(-10 38 46)"/>`;
  } else {
    inner = `<circle cx="22" cy="30" r="11" fill="${c}"/><circle cx="36" cy="24" r="11" fill="${l}"/><circle cx="42" cy="40" r="11" fill="${c}"/><circle cx="26" cy="46" r="9" fill="${l}"/>`;
  }
  return `<svg viewBox="0 0 64 64" width="${w}" height="${w}" aria-label="${s.name}">${inner}</svg>`;
}
