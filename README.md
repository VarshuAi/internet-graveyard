<div align="center">

# † INTERNET GRAVEYARD
### *Defunct Web Archaeology & Living Digital Cemetery*

> **"The internet forgets. We archive what disappeared."**

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Web Audio API](https://img.shields.io/badge/Audio-Procedural_Synthesis-red?style=for-the-badge&logo=webrtc&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)

[**Explore Live Grounds**](https://internet-graveyard-seven.vercel.app/) • [**Audio Vault**](https://internet-graveyard-seven.vercel.app/sounds) • [**Autopsy Rivals**](https://internet-graveyard-seven.vercel.app/compare) • [**Sunset Gazette**](https://internet-graveyard-seven.vercel.app/gazette) • [**Cemetery Map**](https://internet-graveyard-seven.vercel.app/grounds)

---

</div>

## 🪦 Overview

**Internet Graveyard** is an open-source digital archaeology platform and cyber-cemetery dedicated to documenting, researching, and preserving deceased internet platforms, products, and online communities.

When tech giants pull the plug on beloved platforms, servers go dark, domains expire, and decades of human culture evaporate. **Internet Graveyard** treats defunct web entities with the forensic rigor of archaeological artifacts:

- **12,500+ archived digital relics** with forensic autopsies, peak reach stats, and coroners' verdicts.
- **Procedural soundboard engine** reviving dial-up modems, ICQ chirps, and MSN nudges directly in the browser with zero external audio assets.
- **Historical snapshots** powered by the Internet Archive Wayback Machine.
- **Head-to-head autopsies** exploring why pioneers fell while their algorithmic successors conquered.
- **Official Coroner Death Certificates** with printable forensic reports and tamper-proof wax seals.

---

## ✨ Archaeological Laboratories & Features

### 📜 1. Official Coroner Death Certificate & Autopsy Exporter
- Generated on-demand for every buried grave (e.g. Vine, Club Penguin, ICQ, MySpace, Google Reader).
- Features official **Bureau of Digital Demise** case serials (e.g. `MORT-2017-VINE-2202`), primary kill factor classification, and fatal forensic notes.
- Tamper-proof digital wax seal with Chief Digital Pathologist signature line.
- Instant **"Print / Save PDF"**, direct link copy, and one-click social sharing.

### 🔊 2. "Sounds of the Dead Web" (Relic Audio Vault)
- **100% Procedural Web Audio API Synthesis** — zero external MP3s, zero network latency, zero broken links:
  - **AOL 56k Dial-Up:** Complete handshake sequence (DTMF dialing + carrier negotiation + static hiss).
  - **ICQ "Uh-Oh!":** Iconic dual-tone incoming message chirp.
  - **MSN Messenger Nudge:** High-frequency rattle and dual bass punch with viewport earthquake animation.
  - **Skype Incoming Call:** Procedural marimba bell arpeggios.
  - **Windows 95/98 Startup:** Multi-oscillator ethereal chord pad inspired by Brian Eno.
  - **Club Penguin Dance Club:** Synthesized 8-bit chiptune loop.
  - **AIM Instant Messenger:** Procedural wooden door latches.

### ⚖️ 3. Head-to-Head Archaeological Autopsy Tool (`/compare`)
- Direct side-by-side forensic comparisons dissecting why pioneers collapsed while successors survived:
  - **Vine vs. TikTok:** Creative brevity vs. relentless algorithmic distribution.
  - **MySpace vs. Facebook:** Unrestrained HTML anarchy vs. standardized directory speed.
  - **Napster vs. Spotify:** Unchecked P2P piracy vs. streaming label compromise.
  - **Google Reader vs. Feedly:** Corporate sunsetting vs. agile independent survival.
  - **Club Penguin vs. Roblox:** Curated Flash worlds vs. player-led creator economies.

### ⏳ 4. Wayback Time Machine Retro Browser Frame
- Embedded on every memorial dossier.
- Wraps historical snapshots into an authentic vintage browser chassis with window controls, status bar, and HTTP response codes.
- Chronological jump points: **Launch Day / Birth** ➔ **Golden Era Peak** ➔ **Final Farewell Notice**.

### 🪦 5. Interactive Cemetery Grounds Map (`/grounds`)
- Categorized architectural crypts:
  - **The Google Mausoleum** (Reader, Plus, Wave, Stadia, Orkut)
  - **The P2P & Pirate Cove** (Napster, LimeWire, Kazaa, Grooveshark, Rdio)
  - **Social Media Grounds** (Vine, MySpace, Friendster, Path, Secret)
  - **Messaging Valley** (ICQ, AIM, MSN, Yahoo Messenger, Omegle)
  - **Gaming & Virtual Crypt** (Club Penguin, Adobe Flash, Quibi, Heardle)
- Interactive granite gravestones with engraved epitaphs and live memorial candle lighting.

### 🗞️ 6. The Sunset Gazette & Today in Web History (`/gazette`)
- Daily dynamic headline generator calculating anniversaries of shutdowns, announcements, and acquisitions matching today's calendar date.
- Historical wire dispatches, famous last words, and month-by-month historical timelines.

### 💓 7. Vital Signs Domain Prober (`/lookup`)
- Forensic URL analyzer inspecting live HTTP status codes, server headers, SSL certificates, and detecting shutdown or farewell language patterns.

---

## 🛡️ Archaeology Command Center (`/admin`)

The platform contains an internal Curator Terminal for managing submissions and reviewing automated scanner discoveries.

### Security Architecture:
- **Hidden from Navigation:** Removed from public navigation headers and sitemaps.
- **API Guard (`401 Unauthorized`):** Server-side verification on all `/api/admin` requests via bearer token or encrypted session cookie.
- **Passkey Gate:** Unauthenticated visitors encounter a cyber-archival lock terminal.
- **Session Control:** Generates a secure 24-hour HTTP-only cookie with a 1-click **"Lock Terminal"** logout button.

| Configuration | Local Default | Production Environment |
| :--- | :--- | :--- |
| **Passkey** | `graveyard-curator-2024` | `process.env.ADMIN_SECRET_KEY` |
| **Direct URL** | `/admin` | `/admin` |

---

## 🏗️ Architecture & Tech Stack

```
internet-graveyard/
├── app/                        # Next.js 14 App Router
│   ├── api/                    # Route handlers (admin, auth, prober, submissions)
│   ├── admin/                  # Curator Access Terminal (password-gated)
│   ├── compare/                # Head-to-Head Autopsy Rivalries
│   ├── dying-now/              # At-Risk Platform Radar
│   ├── explore/                # Search & Tag-Based Archaeology Directory
│   ├── gazette/                # The Sunset Gazette Newspaper
│   ├── grave/[slug]/           # Memorial Dossier & Death Certificate
│   ├── grounds/                # Visual Cemetery Map
│   ├── lookup/                 # Vital Signs URL Prober
│   ├── sounds/                 # Sounds of the Dead Web Soundboard
│   ├── timeline/               # Decade-by-Decade Web History
│   └── page.tsx                # Central Hub & Laboratories
├── components/                 # UI & Archaeological Components
│   ├── AudioRelicPlayer.tsx    # In-Memorial Soundboard Widget
│   ├── DeathCertificateModal.tsx # Printable Official Autopsy Certificate
│   ├── Navbar.tsx              # Clean Cyber-Archival Navigation
│   ├── TodayInHistoryBanner.tsx# Daily Anniversary Dispatch
│   └── WaybackTimeMachine.tsx  # Retro Browser Snapshot Frame
├── data/                       # Curated Relic Databases
│   ├── graveyard.ts            # Primary Defunct Relics Archive
│   ├── rivalries.ts            # Forensic Head-to-Head Comparisons
│   └── sounds.ts               # Audio Relics Catalog
├── lib/                        # Core Systems
│   ├── audio/soundArchive.ts   # Web Audio API Procedural Synthesizers
│   ├── auth/admin.ts           # Curator Security & Token Authorization
│   └── history/anniversaries.ts# Calendar Date Anniversary Engine
└── types/                      # TypeScript Schemas & Enums
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+ recommended
- **npm** or **pnpm**

### 2. Clone and Install
```bash
# Clone the repository
git clone https://github.com/VarshuAi/internet-graveyard.git

# Enter project directory
cd internet-graveyard

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to explore the graveyard.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📜 Documentation & Policies

- **[LICENSE](LICENSE)**: MIT License
- **[CREDITS.md](CREDITS.md)**: Digital preservation archives & audio engine attributions
- **[CONTRIBUTING.md](CONTRIBUTING.md)**: Guidelines for excavating and submitting defunct entities
- **[SECURITY.md](SECURITY.md)**: Curator Terminal security policy & vulnerability disclosure

---

## 👤 Author & Maintainer

**Varshan (VarshuAi)**
- GitHub: [@VarshuAi](https://github.com/VarshuAi)
- Project: [internet-graveyard](https://github.com/VarshuAi/internet-graveyard)

*"May their servers rest in peace, and their protocols never be forgotten."*
