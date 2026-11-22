# Pasar Rempah: Duel Saudagar

[![Best Card Game](https://make.fun/badge/best-card-game-20261122-1826.svg)](https://make.fun/bounty/best-card-game-20261122-1826)
[![Rank](https://make.fun/badge/best-card-game-20261122-1826/muherilobak-web/best-card-game/rank.svg)](https://make.fun/bounty/best-card-game-20261122-1826)
[![Reward](https://make.fun/badge/best-card-game-20261122-1826/muherilobak-web/best-card-game/reward.svg)](https://make.fun/bounty/best-card-game-20261122-1826)

Duel kartu dua saudagar rempah di pelabuhan Nusantara. Kamu dan **Saudagar Bayu**
masing-masing punya 20 koin nyawa. Mainkan kartu rempah — lada, pala, cengkih,
kayu manis, kunyit, jahe — untuk menyerang, bertahan, dan membangun **kombo**:
dua kartu rempah yang sama berturut-turut memberi +2 serang, tiga beruntun
memberi +5 serang dan satu kartu tambahan. Kartu Kapal Dagang, Badai, dan Pasar
Ramai mengubah tempo permainan. Saudagar Bayu menimbun satu rempah favorit
yang terlihat di meja — baca rencananya dan potong dengan Badai.

## Cara bermain

Buka `game/index.html` di peramban — tanpa server, tanpa jaringan.

- Klik kartu untuk memilih, klik lagi untuk memainkannya (atau tekan `1`–`7`,
  lalu `Enter`). `E` mengakhiri giliran, `M` mematikan suara, `R` mulai ulang.
- Setiap giliran: 3 koin aksi dan 1 kartu baru. Perisai menyerap serangan dulu
  dan berkurang separuh di awal giliranmu.
- Menang bila koin lawan habis; kalah bila koinmu habis. Batas 40 giliran.

## Struktur

- `game/js/spices.js` — enam rempah dan lambangnya
- `game/js/deck.js` — tumpukan 40 kartu
- `game/js/rules.js` — aturan: giliran, koin aksi, kombo, perisai, menang/kalah
- `game/js/ai.js` — kecerdasan Saudagar Bayu
- `game/js/cards.js` — tampilan kartu
- `game/js/table.js` — tampilan meja
- `game/js/screens.js` — layar judul, menang, dan kalah
- `game/js/animations.js` — animasi kartu dan perayaan
- `game/js/sounds.js` — bunyi WebAudio tanpa berkas audio
- `game/js/main.js` — pengikat, masukan, dan alur permainan

Bounty: https://make.fun/bounty/best-card-game-20261122-1826
