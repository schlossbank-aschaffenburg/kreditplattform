/* ==========================================================================
   SCHLOSSBANK KREDITPLATTFORM – PROGRAMM
   Inhalte (Kundin, Zahlen, Texte, Freischaltungen) stehen in daten.js.
   Es werden keine Daten an einen Server übertragen. Eingaben bleiben
   ausschließlich im Browser dieses Geräts (localStorage).
   ========================================================================== */
(function () {
  'use strict';
  const D = window.SB;
  const $app = document.getElementById('app');
  const SALZ = 'schlossbank-kreditplattform:';
  const SPEICHER = 'sb-kreditplattform-v1';

  /* ------------------------------------------------------------ Zustand */
  const LEER = () => ({
    kuerzel: '', frei: {}, lehrkraft: false, gelesen: {}, antwort: {}, notizen: [], sa: {}, saGeprueft: false,
    hh: { modus: 'selbst', w: {}, versuche: {}, erg: null, notiz: '' },
    re: { modus: 'selbst', versuche: 0, erg: null, notiz: '' }, sp: {}
  });
  let st = LEER();
  try { st = Object.assign(LEER(), JSON.parse(localStorage.getItem(SPEICHER) || '{}')); } catch (e) { /* ohne Speicher weiter */ }
  let meldung = null; // kurzlebige Rückmeldung (z. B. nach Code-Eingabe)
  const sichern = () => { try { localStorage.setItem(SPEICHER, JSON.stringify(st)); } catch (e) { /* privat-Modus */ } };

  /* ------------------------------------------------------------- Helfer */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const eur = n => (Math.round(n * 100) / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  const proz = (n, st = 2) => n.toLocaleString('de-DE', { minimumFractionDigits: st, maximumFractionDigits: st }) + ' %';
  const datum = iso => { const [j, m, t] = iso.split('-'); return `${t}.${m}.${j}`; };
  const rund = n => Math.round((n + Number.EPSILON) * 100) / 100;
  // Zahl aus deutscher Eingabe lesen: "2.250,00 €" → 2250
  function zahl(v) {
    if (v == null) return NaN;
    let s = String(v).replace(/[€\s]/g, '');
    if (s === '') return NaN;
    if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
    else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    return /^-?\d+(\.\d+)?$/.test(s) ? parseFloat(s) : NaN;
  }
  const zahl0 = v => { const z = zahl(v); return isNaN(z) ? 0 : z; };
  const istFrei = f => !f || st.lehrkraft || !!st.frei[f];
  const kunde = () => D.kunden.sophie;

  // SHA-256 (für die Prüfwerte der Freischaltcodes; läuft auch ohne Internet und ohne https)
  function sha256(text) {
    const K = [], H = []; let p = 2, n = 0;
    const frac = x => ((x - Math.floor(x)) * 4294967296) | 0;
    while (n < 64) { let prim = true; for (let i = 2; i * i <= p; i++) if (p % i === 0) { prim = false; break; }
      if (prim) { if (n < 8) H[n] = frac(Math.pow(p, 1 / 2)); K[n++] = frac(Math.pow(p, 1 / 3)); } p++; }
    const b = Array.from(new TextEncoder().encode(text)); const l = b.length * 8;
    b.push(0x80); while (b.length % 64 !== 56) b.push(0);
    for (let i = 7; i >= 0; i--) b.push(i > 3 ? 0 : (l >>> (i * 8)) & 255);
    const rr = (x, k) => (x >>> k) | (x << (32 - k));
    for (let o = 0; o < b.length; o += 64) {
      const w = [];
      for (let i = 0; i < 16; i++) w[i] = (b[o + i * 4] << 24) | (b[o + i * 4 + 1] << 16) | (b[o + i * 4 + 2] << 8) | b[o + i * 4 + 3];
      for (let i = 16; i < 64; i++) {
        const s0 = rr(w[i - 15], 7) ^ rr(w[i - 15], 18) ^ (w[i - 15] >>> 3), s1 = rr(w[i - 2], 17) ^ rr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      let [a, bb, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const t1 = (h + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
        const t2 = ((rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & bb) ^ (a & c) ^ (bb & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = bb; bb = a; a = (t1 + t2) | 0;
      }
      [a, bb, c, d, e, f, g, h].forEach((v, i) => { H[i] = (H[i] + v) | 0; });
    }
    return H.map(v => (v >>> 0).toString(16).padStart(8, '0')).join('');
  }
  const pruefwert = code => sha256(SALZ + String(code).trim().toUpperCase());
  window.SB_pruefwert = pruefwert;

  const ICON = {
    start: '<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
    post: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    kunde: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    antrag: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/>',
    bank: '<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
    schloss: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
    pfeil: '<path d="M9 6l6 6-6 6"/>', druck: '<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>'
  };
  const icon = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;

  /* ---------------------------------------------------- Kreditmathematik */
  function annuitaet(betrag, sollzins, monate) {
    const i = sollzins / 1200;
    return i === 0 ? betrag / monate : betrag * i / (1 - Math.pow(1 + i, -monate));
  }
  // Gerechnet wird wie in Excel (RMZ, ZINSZ, KAPZ) mit ungerundeten Werten; gerundet wird nur die Anzeige.
  function tilgungsplan(betrag, sollzins, monate) {
    const i = sollzins / 1200, rate = annuitaet(betrag, sollzins, monate);
    const zeilen = []; let rest = betrag, zinsSumme = 0;
    for (let m = 1; m <= monate; m++) {
      const zins = rest * i, tilg = rate - zins;
      rest = Math.max(0, rest - tilg); zinsSumme += zins;
      zeilen.push({ m, rate, zins, tilg, rest });
    }
    return { rate: rund(rate), zeilen, zinsSumme: rund(zinsSumme), gesamt: rund(betrag + zinsSumme), eff: (Math.pow(1 + i, 12) - 1) * 100 };
  }
  // Kompetenz- und Produktprüfung: liefert Systemmeldungen
  function systemmeldungen(betrag, laufzeit, rk) {
    const m = [], k = D.konditionen.kredit, ko = D.kompetenz;
    if (!isNaN(betrag)) {
      if (betrag < k.minBetrag) m.push(['fehler', `Der SchlossKredit beginnt bei ${eur(k.minBetrag)}. Der Antrag kann so nicht angelegt werden.`]);
      else if (betrag > k.maxBetrag) m.push(['fehler', `Der Kreditbetrag übersteigt die Produktgrenze des SchlossKredits (${eur(k.maxBetrag)}). Der Antrag kann so nicht angelegt werden.`]);
      else if (betrag > ko.beraterBetrag) m.push(['warn', `Ihre Kompetenz ist überschritten: Über ${eur(ko.beraterBetrag)} ist ein Zweitvotum des Kreditmanagements (Sabine Roth) erforderlich.`]);
      else m.push(['ok', `Der Kreditbetrag liegt in Ihrer Kompetenz (bis ${eur(ko.beraterBetrag)}, Risikoklassen ${ko.beraterRk[0]} bis ${ko.beraterRk[ko.beraterRk.length - 1]}).`]);
    }
    if (rk === 'D' && betrag <= ko.beraterBetrag) m.push(['warn', 'Risikoklasse D: Zweitvotum des Kreditmanagements erforderlich.']);
    if (rk === 'E') m.push(['fehler', 'Risikoklasse E: Entscheidung nur mit Zweitvotum und Bereichsleitung Kreditmanagement.']);
    if (!isNaN(laufzeit) && (laufzeit < k.minLaufzeit || laufzeit > k.maxLaufzeit || laufzeit % 1 !== 0))
      m.push(['fehler', `Die Laufzeit muss zwischen ${k.minLaufzeit} und ${k.maxLaufzeit} Monaten liegen.`]);
    return m;
  }
  const meldungenHtml = liste => liste.map(([art, t]) => `<div class="hinweis ${art}"><div>${art === 'fehler' ? '<b>Systemmeldung:</b> ' : ''}${esc(t)}</div></div>`).join('');

  /* -------------------------------------------------------- Freischalten */
  function codeEinloesen(code) {
    const h = pruefwert(code);
    if (h === D.lehrkraftHash) { st.lehrkraft = true; sichern(); return { ok: true, text: 'Lehrkraft-Zugang aktiv: Alle Funktionen sind auf diesem Gerät geöffnet.' }; }
    const f = D.freischaltungen.find(x => x.hash === h);
    if (!f) return { ok: false, text: 'Dieser Code ist nicht gültig. Bitte prüfen Sie die Schreibweise.' };
    f.frei.forEach(x => { st.frei[x] = true; });
    if (f.fahrplan) st.frei['fahrplan' + f.fahrplan] = true;
    sichern();
    return { ok: true, text: `Freigeschaltet: ${f.titel}.` };
  }
  const fahrplanStand = () => { let s = kunde().fahrplanStand; [2, 3, 4, 5, 6].forEach(n => { if (st.frei['fahrplan' + n]) s = n; }); return s; };
  const sperre = (titel, text) => `
    <div class="karte sperre">${icon('schloss')}
      <h2>${esc(titel)}</h2>
      <p class="klein">${esc(text || 'Diese Funktion ist für Sie noch nicht freigeschaltet. Sie erhalten den Freischaltcode von Ihrer Lehrkraft.')}</p>
      <form class="codezeile" data-form="code"><input name="code" autocomplete="off" autocapitalize="characters" placeholder="Freischaltcode" aria-label="Freischaltcode"><button class="knopf">Öffnen</button></form>
    </div>`;

  /* ---------------------------------------------------------- Nachrichten */
  const nachrichten = () => D.nachrichten.filter(n => istFrei(n.frei)).sort((a, b) => (b.datum + b.zeit).localeCompare(a.datum + a.zeit));
  const ungelesen = () => nachrichten().filter(n => !st.gelesen[n.id]).length;

  /* ------------------------------------------------------------- Drucken */
  function drucken(titel, unter, html) {
    document.getElementById('druck').innerHTML = `
      <div class="d-kopf"><img src="assets/logo.png" alt="Schlossbank Aschaffenburg">
        <div>${esc(D.bank.team)}<br>Bearbeitet von: ${esc(st.kuerzel || '____')} &nbsp;·&nbsp; Datum: ${new Date().toLocaleDateString('de-DE')}</div></div>
      <h1>${esc(titel)}</h1><div class="d-unter">${esc(unter || '')}</div>${html}
      <div class="d-fuss">${esc(D.bank.hinweis)}</div>`;
    setTimeout(() => window.print(), 60);
  }
  const notizBlock = (text, titel) => `<h2>${esc(titel || 'Meine Notizen und Begründung')}</h2>` +
    (text && text.trim() ? `<div class="notiz">${esc(text)}</div>` : '<div class="d-linien"><div></div><div></div><div></div><div></div></div>');

  /* ============================================================ ANSICHTEN */
  const titel = (t, u, rechts) => `<div class="titel"><div><h1>${esc(t)}</h1>${u ? `<div class="unter">${u}</div>` : ''}</div>${rechts ? `<div class="rechts">${rechts}</div>` : ''}</div>`;
  const paare = liste => `<dl class="paare">${liste.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl>`;

  function vAnmeldung() {
    return `<div class="anmeldung"><form class="karte" data-form="anmelden">
      <img src="assets/logo.png" alt="Schlossbank Aschaffenburg">
      <h1>${esc(D.bank.system)}</h1>
      <p class="klein">Anmeldung für Mitarbeitende der Kreditberatung</p>
      <label class="feld"><span>Ihr Mitarbeiterkürzel (2 bis 4 Buchstaben)</span>
        <input name="kuerzel" maxlength="4" autocomplete="off" autocapitalize="characters" placeholder="z. B. MK" required pattern="[A-Za-zÄÖÜäöü]{2,4}"></label>
      <button class="knopf">Anmelden</button>
      <p class="klein" style="margin:14px 0 0">Bitte keine echten Namen und keine echten Kundendaten eingeben. Alle Eingaben bleiben nur auf diesem Gerät.</p>
      <p class="klein" style="margin:8px 0 0">${esc(D.bank.hinweis)}</p>
    </form></div>`;
  }

  function vStart() {
    const k = kunde(), stand = fahrplanStand(), post = nachrichten().slice(0, 3);
    return titel('Mein Arbeitsplatz', esc(D.bank.team)) + `
      <div class="karte"><h2>Kreditfahrplan: ${esc(k.vorname)} ${esc(k.name)}</h2>
        <ol class="fahrplan">${D.fahrplan.map((f, i) => `<li data-nr="${i + 1}" class="${i + 1 < stand ? 'fertig' : i + 1 === stand ? 'jetzt' : ''}">${esc(f)}</li>`).join('')}</ol></div>
      <div class="raster zwei">
        <div class="karte eng"><h2 style="padding:16px 16px 4px">Meine Aufgaben</h2><ul class="liste">
          <li><a class="zeile" href="#/kunde/sophie"><span class="kuerzel kunde">${k.kuerzel}</span><span class="mitte"><b>Kreditanfrage ${esc(k.vorname)} ${esc(k.name)}</b><span>${esc(k.anliegen)}</span></span><span class="pfeil">${icon('pfeil')}</span></a></li>
          <li><a class="zeile" href="#/antrag/sophie"><span class="kuerzel">${icon('antrag')}</span><span class="mitte"><b>Kreditantrag bearbeiten</b><span>Stationen entlang des Kreditfahrplans</span></span><span class="pfeil">${icon('pfeil')}</span></a></li>
        </ul></div>
        <div class="karte eng"><h2 style="padding:16px 16px 4px">Posteingang</h2><ul class="liste">${post.map(postZeile).join('')}</ul></div>
      </div>
      <div class="raster zwei">
        <div class="karte eng"><h2 style="padding:16px 16px 4px">Meine Kundinnen und Kunden</h2><ul class="liste">
          <li><a class="zeile" href="#/kunde/sophie"><span class="kuerzel kunde">${k.kuerzel}</span><span class="mitte"><b>${esc(k.vorname)} ${esc(k.name)}</b><span>Kundennr. ${esc(k.kundennr)}</span></span><span class="marke gelb">${esc(k.status)}</span></a></li>
          ${D.weitereKunden.map(w => `<li><div class="zeile aus"><span class="kuerzel kunde">${icon('schloss')}</span><span class="mitte"><b>${esc(w.name)}</b><span>Kundennr. ${esc(w.kundennr)} · noch nicht zugewiesen</span></span></div></li>`).join('')}
        </ul></div>
        <div class="karte"><h2>Funktion freischalten</h2>
          <p class="klein">Neue Funktionen und Nachrichten erhalten Sie mit einem Freischaltcode von Ihrer Lehrkraft.</p>
          <form class="codezeile" style="margin-left:0" data-form="code"><input name="code" autocomplete="off" autocapitalize="characters" placeholder="Freischaltcode" aria-label="Freischaltcode"><button class="knopf">Öffnen</button></form>
          <div class="knopfreihe"><a class="knopf hell klein-k" href="#/rechner">Kreditrechner (Spielwiese)</a></div>
        </div>
      </div>`;
  }

  const postZeile = n => `<li><a class="zeile ${st.gelesen[n.id] ? '' : 'neu'}" href="#/post/${n.id}"><span class="kuerzel ${n.kunde ? 'kunde' : ''}">${esc(n.kuerzel)}</span>
    <span class="mitte"><b>${esc(n.betreff)}</b><span>${esc(n.von)} · ${esc(n.rolle)}</span></span><span class="rechts">${datum(n.datum)}<br>${esc(n.zeit)}</span></a></li>`;

  function vPost(id) {
    if (!id) return titel('Posteingang', 'Nachrichten an das Team Kreditberatung') + `<div class="karte eng"><ul class="liste">${nachrichten().map(postZeile).join('')}</ul></div>
      <p class="klein">Neue Nachrichten erscheinen, sobald Ihre Lehrkraft sie freischaltet.</p>`;
    const n = nachrichten().find(x => x.id === id);
    if (!n) return vPost();
    if (!st.gelesen[id]) { st.gelesen[id] = true; sichern(); }
    return `<a class="zurueck" href="#/post">‹ Posteingang</a>
      <div class="karte"><div class="nachricht-kopf"><span class="kuerzel gross ${n.kunde ? 'kunde' : ''}">${esc(n.kuerzel)}</span>
        <div style="flex:1;min-width:0"><h2>${esc(n.betreff)}</h2><div class="klein">${esc(n.von)} · ${esc(n.rolle)}<br>${datum(n.datum)}, ${esc(n.zeit)} Uhr · An: Team Kreditberatung Privatkunden</div></div></div>
        <div class="nachricht-text">${n.text.map(p => `<p>${esc(p)}</p>`).join('')}</div>
        ${n.kunde ? `<div class="knopfreihe"><a class="knopf hell" href="#/kunde/${n.kunde}">Kundenübersicht öffnen</a></div>` : ''}
      </div>
      ${n.antwortbar ? `<div class="karte"><h2>Antwort verfassen</h2>
        <p class="klein">Ihre Antwort geht über das Postfach im SchlossBanking an die Kundin. Der Entwurf wird nur auf diesem Gerät gespeichert.</p>
        <textarea data-k="antwort.${id}" rows="9" placeholder="Sehr geehrte Frau Keller, …">${esc(st.antwort[id] || '')}</textarea>
        <div class="knopfreihe"><button class="knopf" data-act="druck-antwort" data-id="${id}">${icon('druck')} Drucken / als PDF</button></div></div>` : ''}`;
  }

  /* ---------------------------------------------------------------- Kunde */
  const KUNDE_REITER = [['', 'Übersicht'], ['stammdaten', 'Stammdaten'], ['konten', 'Konten und Umsätze'], ['akte', 'Kundenakte'], ['dokumente', 'Dokumente'], ['auskunftei', 'Auskunftei'], ['scoring', 'Scoring']];
  function saldoListe(k) { let s = k.saldoStart; return k.umsaetze.map(u => { s = rund(s + u[4]); return { d: u[0], art: u[1], wer: u[2], zweck: u[3], betrag: u[4], saldo: s }; }); }

  function vKunde(tab, arg) {
    const k = kunde(), um = saldoListe(k), saldo = um[um.length - 1].saldo;
    const kopf = `<div class="karte"><div class="kundenkopf"><span class="kuerzel kunde gross">${k.kuerzel}</span>
        <div class="daten"><h1>${esc(k.vorname)} ${esc(k.name)}</h1><div class="klein">Kundennr. ${esc(k.kundennr)} · Kundin seit ${esc(k.kundeSeit)} · Betreuung: ${esc(k.betreuung)}</div></div>
        <span class="marke gelb">${esc(k.status)}</span></div></div>
      <nav class="reiter">${KUNDE_REITER.map(([id, t]) => `<a href="#/kunde/sophie${id ? '/' + id : ''}" class="${(tab || '') === id ? 'aktiv' : ''}">${t}</a>`).join('')}</nav>`;
    let inhalt = '';
    if (!tab) {
      const tg = k.produkte.find(p => p.id === 'tagesgeld').saldo;
      inhalt = `<div class="raster drei"><div class="karte"><h2>Hinweise</h2>${k.hinweise.filter(h => istFrei(h.frei)).map(h => `<div class="hinweis ${h.art}"><div>${esc(h.text)}</div></div>`).join('')}</div>
          <div class="karte"><h2>Finanzstatus</h2><div class="kacheln">
            <div class="kachel"><b>${eur(saldo)}</b><span>Girokonto</span></div><div class="kachel"><b>${eur(tg)}</b><span>Tagesgeld</span></div>
            <div class="kachel"><b>${eur(saldo + tg)}</b><span>Guthaben gesamt</span></div><div class="kachel"><b>0,00 €</b><span>Kredite bei uns</span></div></div>
            <p class="klein" style="margin:10px 0 0">Stand ${datum(D.heute)}. Dispositionsrahmen 2.000,00 €, aktuell nicht genutzt.</p></div></div>
        <div class="karte"><h2>Anliegen</h2><p>${esc(k.anliegen)}</p>
          <div class="knopfreihe"><a class="knopf" href="#/antrag/sophie">Kreditantrag bearbeiten</a><a class="knopf hell" href="#/post/anfrage">Nachricht der Kundin</a></div></div>`;
    } else if (tab === 'stammdaten') {
      inhalt = `<div class="raster zwei">${k.stammdaten.map(([t, l]) => `<div class="karte"><h2>${esc(t)}</h2>${paare(l)}</div>`).join('')}</div>
        <p class="klein">Stammdaten können nur vom Kreditservice Markt geändert werden.</p>`;
    } else if (tab === 'konten') {
      inhalt = `<div class="raster zwei">${k.produkte.map(p => `<div class="karte"><h2>${esc(p.name)}</h2><p class="klein">${esc(p.art)}${p.iban ? ' · ' + esc(p.iban) : ''}</p>
          ${p.id === 'giro' ? `<div class="kachel ${saldo < 0 ? 'minus' : ''}" style="margin-bottom:10px"><b>${eur(saldo)}</b><span>Kontostand am ${datum(D.heute)}</span></div>` : ''}
          ${p.saldo != null ? `<div class="kachel" style="margin-bottom:10px"><b>${eur(p.saldo)}</b><span>Guthaben</span></div>` : ''}${paare(p.details)}</div>`).join('')}</div>` +
        (istFrei('umsaetze') ? vUmsaetze(k, um) : sperre('Umsätze Girokonto', 'Die Umsatzanzeige ist für Sie noch nicht freigeschaltet. Sie erhalten den Freischaltcode von Ihrer Lehrkraft.'));
    } else if (tab === 'akte') {
      inhalt = `<div class="karte"><h2>Neuer Vermerk</h2>
          <form data-form="notiz"><textarea name="text" rows="4" placeholder="Was wurde besprochen? Was ist als Nächstes zu tun?" required></textarea>
          <div class="knopfreihe"><button class="knopf">Vermerk speichern</button>${st.notizen.length ? `<button type="button" class="knopf hell" data-act="druck-akte">${icon('druck')} Kundenakte drucken / als PDF</button>` : ''}</div></form></div>
        <div class="karte eng"><h2 style="padding:16px 16px 4px">Kontakthistorie</h2><ul class="liste">
          ${st.notizen.slice().reverse().map((n, i) => `<li><div class="zeile" style="align-items:flex-start"><span class="kuerzel">${esc(st.kuerzel)}</span><span class="mitte"><b>${esc(n.datum)} · Kreditberatung</b><span style="white-space:pre-wrap">${esc(n.text)}</span></span>
            <button class="knopf hell klein-k" data-act="notiz-weg" data-i="${st.notizen.length - 1 - i}" aria-label="Vermerk löschen">Löschen</button></div></li>`).join('')}
          ${k.kontakte.map(c => `<li><div class="zeile" style="align-items:flex-start"><span class="kuerzel kunde">${esc(c.wer === 'Kundin' ? k.kuerzel : 'CS')}</span><span class="mitte"><b>${datum(c.datum)} · ${esc(c.kanal)} · ${esc(c.wer)}</b><span style="white-space:normal">${esc(c.text)}</span></span></div></li>`).join('')}
        </ul></div>`;
    } else if (tab === 'dokumente') {
      if (arg) return kopf + vDokument(k, arg);
      const docs = k.dokumente.filter(d => istFrei(d.frei));
      inhalt = `<div class="karte eng"><ul class="liste">${docs.map(d => `<li><a class="zeile" href="#/kunde/sophie/dokumente/${d.id}"><span class="kuerzel">${icon('antrag')}</span><span class="mitte"><b>${esc(d.titel)}</b><span>abgelegt am ${datum(d.datum)}</span></span><span class="pfeil">${icon('pfeil')}</span></a></li>`).join('')}</ul></div>` +
        (istFrei('dokumente') ? '' : '<p class="klein">Weitere Unterlagen erscheinen hier, sobald die Kundin sie einreicht.</p>');
    } else if (tab === 'auskunftei') {
      const a = k.auskunftei;
      inhalt = !istFrei('auskunftei') ? sperre('Auskunftei anfragen', 'Die Auskunftei-Abfrage ist für Sie noch nicht freigeschaltet. Sie darf erst gestellt werden, wenn ein Kreditantrag vorliegt.') :
        `<div class="papier"><h2>Auskunft über ${esc(k.vorname)} ${esc(k.name)}</h2><p class="klein">Auskunftei (Muster) · Abfrage vom ${datum(a.abfrage)} · Im echten Bankbetrieb liefert diese Auskunft die SCHUFA.</p>
          <div class="kacheln" style="margin:12px 0"><div class="kachel"><b>${esc(a.wert)}</b><span>Erfüllungswahrscheinlichkeit</span></div><div class="kachel"><b style="font-size:1rem">${esc(a.einstufung)}</b><span>Einstufung</span></div></div>
          <div class="tabelle-wrap"><table><tr><th>Art</th><th>Vertragspartner</th><th>seit</th><th>Angaben</th></tr>${a.eintraege.map(e => `<tr>${e.map(x => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</table></div>
          <div class="hinweis ok" style="margin-top:12px"><div>${esc(a.negativ)}</div></div><div class="hinweis"><div>${esc(a.anfragen)}</div></div><div class="hinweis"><div>${esc(a.nichtEnthalten)}</div></div></div>`;
    } else if (tab === 'scoring') {
      inhalt = `<div class="karte sperre">${icon('schloss')}<h2>Bankinternes Scoring</h2><p class="klein">Diese Funktion folgt im Laufe der Kreditprüfung.</p></div>`;
    }
    return kopf + inhalt;
  }

  function vUmsaetze(k, um) {
    const f = (st.umFilter || '').toLowerCase(), art = st.umArt || '';
    const liste = um.slice().reverse().filter(u => (!f || (u.wer + ' ' + u.zweck + ' ' + u.art).toLowerCase().includes(f)) && (!art || (art === 'plus' ? u.betrag > 0 : u.betrag < 0)));
    const summe = liste.reduce((s, u) => s + u.betrag, 0);
    return `<div class="karte"><h2>Umsätze Girokonto</h2>
      <div class="felder" style="margin-bottom:12px"><label class="feld"><span>Suche (Empfänger, Verwendungszweck)</span><input type="search" data-k="umFilter" data-neu="1" value="${esc(st.umFilter || '')}" placeholder="z. B. Miete, Gehalt, Lastschrift"></label>
        <label class="feld"><span>Anzeigen</span><select data-k="umArt" data-neu="1"><option value="">alle Umsätze</option><option value="plus" ${art === 'plus' ? 'selected' : ''}>nur Gutschriften</option><option value="minus" ${art === 'minus' ? 'selected' : ''}>nur Belastungen</option></select></label></div>
      <p class="klein">${liste.length} Umsätze vom ${datum(um[0].d)} bis ${datum(um[um.length - 1].d)}${f || art ? ` · Summe der Auswahl: <b class="num">${eur(summe)}</b>` : ''} · Anfangssaldo am ${datum(k.saldoStartDatum)}: ${eur(k.saldoStart)}</p>
      <div class="tabelle-wrap"><table><tr><th>Datum</th><th>Umsatz</th><th class="r">Betrag</th><th class="r">Saldo</th></tr>
      ${liste.map(u => `<tr><td class="num">${datum(u.d)}</td><td><b>${esc(u.wer)}</b><br><span class="klein">${esc(u.art)} · ${esc(u.zweck)}</span></td><td class="r ${u.betrag < 0 ? 'minus' : 'plus'}">${eur(u.betrag)}</td><td class="r ${u.saldo < 0 ? 'minus' : ''}">${eur(u.saldo)}</td></tr>`).join('') || '<tr><td colspan="4" class="leer">Keine Umsätze gefunden.</td></tr>'}
      </table></div></div>`;
  }

  /* -------------------------------------------------------- Selbstauskunft */
  const OPT = {
    familienstand: ['ledig', 'verheiratet', 'eingetragene Lebenspartnerschaft', 'geschieden', 'verwitwet'],
    gueterstand: ['Zugewinngemeinschaft', 'Gütertrennung', 'Gütergemeinschaft'],
    arbeitsverh: ['unbefristet', 'befristet', 'in Probezeit', 'selbstständig', 'Ausbildung'],
    wohnen: ['Miete', 'eigene Immobilie', 'bei den Eltern', 'sonstige']
  };
  const SA = [
    ['1 Persönliche Angaben', [['name', 'Name', 1], ['vorname', 'Vorname', 1], ['geburtsname', 'Geburtsname'], ['geburtsdatum', 'Geburtsdatum (TT.MM.JJJJ)', 1], ['geburtsort', 'Geburtsort'], ['staat', 'Staatsangehörigkeit'],
      ['strasse', 'Straße, Hausnummer', 1], ['ort', 'PLZ, Ort', 1], ['wohnhaftSeit', 'wohnhaft dort seit'], ['telefon', 'Telefon'], ['email', 'E-Mail'], ['kundennr', 'Kundennummer'],
      ['familienstand', 'Familienstand', 1, 'opt'], ['gueterstand', 'Güterstand (nur bei Ehe)', 0, 'opt'], ['personen', 'Personen im Haushalt (Anzahl)'], ['kinder', 'davon unterhaltsberechtigte Kinder']]],
    ['2 Beruf und Arbeitgeber', [['beruf', 'ausgeübter Beruf', 1], ['beschSeit', 'beschäftigt seit'], ['arbeitgeber', 'Arbeitgeber (Name, Ort)', 1], ['arbeitsverh', 'Arbeitsverhältnis', 1, 'opt']]],
    ['3 Monatliche Einnahmen (netto)', [['gehalt', 'Gehalt / Lohn (netto)', 1, 'eur'], ['zulagen', 'Zulagen, Nebeneinkünfte', 0, 'eur'], ['kindergeld', 'Kindergeld', 0, 'eur'], ['sonstEin', 'sonstige Einnahmen', 0, 'eur']]],
    ['4 Wohnen und monatliche Ausgaben', [['wohnen', 'Wohnsituation', 0, 'opt'], ['miete', 'Warmmiete (Ihr Anteil)', 1, 'eur'], ['versicherungen', 'Versicherungen', 0, 'eur'], ['kfz', 'Kfz-Kosten (Versicherung, Steuer, Kraftstoff)', 0, 'eur'],
      ['telefonKosten', 'Telefon, Internet, Streaming', 0, 'eur'], ['sonstAus', 'sonstige regelmäßige Ausgaben', 0, 'eur'], ['raten', 'Raten für bestehende Kredite / Leasing', 0, 'eur'],
      ['bnpl', 'Ratenkäufe, „später bezahlen“, Finanzierungen', 0, 'eur'], ['sparen', 'Spar- und Bausparverträge', 0, 'eur'], ['unterhalt', 'Unterhaltszahlungen', 0, 'eur']]],
    ['5 Bestehende Verbindlichkeiten', [['verb', 'Kredite, Leasing, Ratenkäufe (Anbieter, Restschuld, Rate)', 0, 'breit']]],
    ['6 Vermögen', [['vermGiro', 'Giro-, Tagesgeld-, Festgeldkonten', 0, 'eur'], ['vermWp', 'Wertpapiere, Bausparguthaben', 0, 'eur'], ['vermSonst', 'Fahrzeuge, Immobilien, sonstiges', 0, 'eur']]],
    ['7 Kreditwunsch', [['zweck', 'Verwendungszweck', 1], ['kaufpreis', 'Kaufpreis', 1, 'eur'], ['eigenkapital', 'Eigenkapital', 0, 'eur'], ['kreditbetrag', 'gewünschter Kreditbetrag', 1, 'eur'], ['wunschrate', 'gewünschte Monatsrate', 0, 'eur'], ['laufzeit', 'gewünschte Laufzeit (Monate)', 1]]]
  ];
  const SA_EIN = ['gehalt', 'zulagen', 'kindergeld', 'sonstEin'], SA_AUS = ['miete', 'versicherungen', 'kfz', 'telefonKosten', 'sonstAus', 'raten', 'bnpl', 'sparen', 'unterhalt'];
  const saWert = (w, id, typ) => { const v = w[id]; if (v == null || v === '') return '–'; return typ === 'eur' && !isNaN(zahl(v)) ? eur(zahl(v)) : v; };
  const saTabelle = w => SA.map(([t, felder]) => `<h2>${esc(t)}</h2><table>${felder.map(([id, l, , typ]) => `<tr><td style="width:55%">${esc(l)}</td><td class="${typ === 'eur' ? 'r' : ''}">${esc(saWert(w, id, typ))}</td></tr>`).join('')}
      ${t[0] === '3' ? `<tr class="summe"><td>Summe Einnahmen</td><td class="r">${eur(SA_EIN.reduce((s, f) => s + zahl0(w[f]), 0))}</td></tr>` : ''}${t[0] === '4' ? `<tr class="summe"><td>Summe Ausgaben</td><td class="r">${eur(SA_AUS.reduce((s, f) => s + zahl0(w[f]), 0))}</td></tr>` : ''}</table>`).join('');

  function vDokument(k, id) {
    const d = k.dokumente.find(x => x.id === id && istFrei(x.frei));
    if (!d) return '<div class="karte leer">Dokument nicht gefunden.</div>';
    let body = '';
    if (d.typ === 'selbstauskunft') body = `<p class="klein">Formular PK-07 · von der Kundin ausgefüllt und über das Postfach eingereicht am ${datum(d.datum)}</p>${saTabelle(k.selbstauskunft)}<p class="klein" style="margin-top:12px">Alzenau, ${datum(d.datum)} · gez. Sophie Keller</p>`;
    else if (d.typ === 'gehalt') body = `<p class="klein">Kahlgrund-Klinikum Alzenau · Personalabteilung · vereinfachte Darstellung</p>
      <table><tr><td>Mitarbeiterin</td><td class="r">Sophie Keller, Pflegefachfrau</td></tr><tr><td>Abrechnungsmonat</td><td class="r">${esc(d.monat)}</td></tr><tr><td>Beschäftigung</td><td class="r">Vollzeit, unbefristet, Eintritt 01.09.2019</td></tr>
      <tr><td>Bruttogehalt</td><td class="r">${eur(d.brutto)}</td></tr><tr><td>Steuern und Sozialversicherung</td><td class="r">${eur(d.netto - d.brutto)}</td></tr><tr><td>Nettogehalt (fest)</td><td class="r">${eur(d.netto)}</td></tr>
      <tr><td>Zuschläge Schichtdienst (Nacht, Sonntag, Feiertag), je nach Dienstplan</td><td class="r">${eur(d.zuschlag)}</td></tr><tr class="summe"><td>Auszahlungsbetrag</td><td class="r">${eur(d.netto + d.zuschlag)}</td></tr></table>`;
    else body = d.text.map(p => `<p>${esc(p)}</p>`).join('');
    st._druckDok = { titel: d.titel, html: body };
    return `<a class="zurueck" href="#/kunde/sophie/dokumente">‹ Dokumente</a><div class="papier"><h2>${esc(d.titel)}</h2>${body}</div>
      <div class="knopfreihe"><button class="knopf hell" data-act="druck-dok">${icon('druck')} Drucken / als PDF</button></div>`;
  }

  /* --------------------------------------------------------------- Antrag */
  function vAntrag(station) {
    const k = kunde();
    if (station === 'selbstauskunft') return vSelbstauskunft(k);
    if (station === 'haushalt') return vHaushalt(k);
    if (station === 'rechner') return vRechner(k, false);
    const stationen = [
      ['selbstauskunft', 'Selbstauskunft erfassen', 'Angaben der Kundin ins System übernehmen und prüfen', 'selbstauskunft'],
      ['haushalt', 'Haushaltsrechnung', 'Einnahmen und Ausgaben gegenüberstellen, frei verfügbares Einkommen ermitteln', 'haushalt'],
      [null, 'Scoring und Risikoklasse', 'folgt im Laufe der Kreditprüfung', '-'],
      ['rechner', 'Kreditrechner und Tilgungsplan', 'Rate, Laufzeit und Gesamtkosten berechnen', 'rechner'],
      [null, 'Kreditentscheidung (Votum)', 'folgt im Laufe der Kreditprüfung', '-']
    ];
    return titel('Kreditantrag', `${esc(k.vorname)} ${esc(k.name)} · Kundennr. ${esc(k.kundennr)} · ${esc(k.anliegen)}`) +
      `<div class="karte eng"><ul class="liste">${stationen.map(([id, t, u, f], i) => {
        const offen = id && istFrei(f);
        return `<li><a class="station ${offen ? '' : 'zu'}" ${id ? `href="#/antrag/sophie/${id}"` : ''}><span class="nr">${offen ? i + 1 : icon('schloss')}</span><span class="mitte" style="flex:1"><b>${esc(t)}</b><br><span class="klein">${esc(u)}</span></span>${offen ? `<span class="pfeil">${icon('pfeil')}</span>` : '<span class="marke">gesperrt</span>'}</a></li>`;
      }).join('')}</ul></div>
      <p class="klein">Die Stationen werden von Ihrer Lehrkraft nach und nach freigeschaltet. Jede Station können Sie am Ende drucken oder als PDF sichern.</p>`;
  }
  const stationKopf = (t, u) => `<a class="zurueck" href="#/antrag/sophie">‹ Kreditantrag</a>` + titel(t, u);

  function saPruefung(k) {
    const w = st.sa, m = [];
    const fehlt = SA.flatMap(([, f]) => f).filter(([id, , pflicht]) => pflicht && !(w[id] || '').trim()).map(([, l]) => l);
    if (fehlt.length) m.push(['fehler', 'Pflichtfelder fehlen: ' + fehlt.join(', ') + '.']);
    const g = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec((w.geburtsdatum || '').trim());
    if (g) {
      const heute = new Date(D.heute), geb = new Date(+g[3], +g[2] - 1, +g[1]);
      let alter = heute.getFullYear() - geb.getFullYear(); if (heute < new Date(heute.getFullYear(), geb.getMonth(), geb.getDate())) alter--;
      if (alter < 18) m.push(['fehler', `Kreditfähigkeit: Die Antragstellerin bzw. der Antragsteller ist ${alter} Jahre alt und nicht voll geschäftsfähig. Der Antrag kann so nicht angelegt werden.`]);
      else m.push(['ok', `Kreditfähigkeit: ${alter} Jahre, voll geschäftsfähig. Bitte Personalausweis im Termin prüfen.`]);
    } else if ((w.geburtsdatum || '').trim()) m.push(['warn', 'Das Geburtsdatum bitte im Format TT.MM.JJJJ erfassen.']);
    if (/verheiratet|Lebenspartner/.test(w.familienstand || '') && !w.gueterstand) m.push(['warn', 'Bei Ehe oder eingetragener Lebenspartnerschaft bitte den Güterstand erfassen und einen Mitantrag prüfen.']);
    const betrag = zahl(w.kreditbetrag), preis = zahl(w.kaufpreis), ek = zahl0(w.eigenkapital), lz = zahl(w.laufzeit);
    systemmeldungen(betrag, lz).forEach(x => m.push(x));
    if (!isNaN(betrag) && !isNaN(preis)) {
      const bedarf = rund(preis - ek);
      if (betrag > bedarf + 0.005) m.push(['warn', `Der Kreditbetrag (${eur(betrag)}) ist höher als der Finanzierungsbedarf (Kaufpreis minus Eigenkapital = ${eur(bedarf)}).`]);
      else if (betrag < bedarf - 0.005) m.push(['warn', `Finanzierungslücke: Kaufpreis minus Eigenkapital ergibt ${eur(bedarf)}, erfasst sind ${eur(betrag)}.`]);
    }
    const ab = [];
    if (istFrei('abgleich')) (k.abgleich || []).forEach(r => {
      const x = zahl0(w[r.feld]);
      if ((r.op === 'groesser' && x > r.wert) || (r.op === 'kleiner' && x < r.wert)) ab.push(['warn', r.text.replace('{x}', eur(x))]);
    });
    return { m, ab };
  }

  function vSelbstauskunft(k) {
    if (!istFrei('selbstauskunft')) return stationKopf('Selbstauskunft erfassen') + sperre('Selbstauskunft erfassen');
    const w = st.sa;
    const feld = ([id, l, pflicht, typ]) => {
      const v = esc(w[id] || ''), stern = pflicht ? ' *' : '';
      if (typ === 'opt') return `<label class="feld"><span>${esc(l)}${stern}</span><select data-k="sa.${id}"><option value="">bitte wählen</option>${OPT[id].map(o => `<option ${w[id] === o ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select></label>`;
      if (typ === 'breit') return `<label class="feld breit"><span>${esc(l)}</span><textarea data-k="sa.${id}" rows="2" style="min-height:70px">${v}</textarea></label>`;
      return `<label class="feld"><span>${esc(l)}${typ === 'eur' ? ' in €' : ''}${stern}</span><input data-k="sa.${id}" value="${v}" ${typ === 'eur' ? 'class="eur" inputmode="decimal"' : ''} autocomplete="off"></label>`;
    };
    let erg = '';
    if (st.saGeprueft) {
      const p = saPruefung(k);
      erg = `<div class="karte" id="ergebnis"><h2>Systemprüfung</h2>${meldungenHtml(p.m)}
        ${istFrei('abgleich') ? `<h2 style="margin:14px 0 8px">Systemabgleich mit den Daten der Bank</h2>${p.ab.length ? meldungenHtml(p.ab) : '<div class="hinweis ok"><div>Keine Abweichungen zwischen Selbstauskunft und Bankdaten gefunden.</div></div>'}` :
          '<p class="klein" style="margin-top:10px">Das System prüft hier nur Vollständigkeit und Regeln. Ob die Angaben stimmen, prüfen Sie selbst anhand der Nachweise.</p>'}</div>`;
    }
    return stationKopf('Selbstauskunft erfassen', 'Formular PK-07 · Übernehmen Sie die Angaben der Kundin aus ihrer Selbstauskunft.') +
      `<div class="hinweis"><div>Die eingereichte Selbstauskunft finden Sie in der <a href="#/kunde/sophie/dokumente">Kundenübersicht unter Dokumente</a>. Felder mit * sind Pflichtfelder.</div></div>
      <div class="karte" style="margin-top:12px">${SA.map(([t, felder]) => `<div class="abschnitt">${esc(t)}</div><div class="felder">${felder.map(feld).join('')}</div>`).join('')}
        <div class="knopfreihe"><button class="knopf" data-act="sa-pruefen">Prüfen und speichern</button><button class="knopf hell" data-act="druck-sa">${icon('druck')} Drucken / als PDF</button></div></div>${erg}
      <div class="karte"><h2>Meine Notizen zur Station</h2><textarea data-k="saNotiz" placeholder="Was ist mir aufgefallen? Was frage ich die Kundin im Termin?">${esc(st.saNotiz || '')}</textarea></div>`;
  }

  /* ------------------------------------------------------ Haushaltsrechnung */
  function hhRechnen(k) {
    const z = k.haushalt.zeilen, w = st.hh.w;
    const ein = z.filter(x => x.gruppe === 'ein').reduce((s, x) => s + zahl0(w[x.id]), 0), aus = z.filter(x => x.gruppe === 'aus').reduce((s, x) => s + zahl0(w[x.id]), 0);
    const sollEin = z.filter(x => x.gruppe === 'ein').reduce((s, x) => s + x.soll, 0), sollAus = z.filter(x => x.gruppe === 'aus').reduce((s, x) => s + x.soll, 0);
    return { ein: rund(ein), aus: rund(aus), frei: rund(ein - aus), sollFrei: rund(sollEin - sollAus) };
  }
  function vHaushalt(k) {
    if (!istFrei('haushalt')) return stationKopf('Haushaltsrechnung') + sperre('Haushaltsrechnung');
    const h = st.hh, tool = h.modus === 'tool' && istFrei('haushalt-tool'), z = k.haushalt.zeilen, r = hhRechnen(k), erg = tool ? null : h.erg;
    const zeile = x => {
      const ok = erg && erg.z[x.id], stufe = h.versuche[x.id] || 0;
      return `<tr><td>${esc(x.label)}</td><td class="eingabe"><input class="eur" inputmode="decimal" data-k="hh.w.${x.id}" ${tool ? 'data-live="hh"' : ''} value="${esc(h.w[x.id] || '')}" placeholder="0,00" aria-label="${esc(x.label)}"></td>
        ${tool ? '' : `<td class="urteil ${erg ? (ok ? 'ok' : 'falsch') : ''}">${erg ? (ok ? '✓' : '✗') : ''}</td>`}</tr>` +
        (erg && !ok ? `<tr class="tipp"><td colspan="3"><b>${stufe > 1 ? 'Lösungsweg' : 'Denkanstoß'}:</b> ${esc(stufe > 1 ? x.t2 : x.t1)}</td></tr>` : '');
    };
    const summe = (id, label, wert) => tool
      ? `<tr class="summe"><td>${label}</td><td class="r" id="hh-${id}">${eur(wert)}</td></tr>`
      : `<tr class="summe"><td>${label}</td><td class="eingabe"><input class="eur" inputmode="decimal" data-k="hh.w.${id}" value="${esc(h.w[id] || '')}" placeholder="selbst rechnen" aria-label="${label}"></td><td class="urteil ${erg ? (erg.s[id] ? 'ok' : 'falsch') : ''}">${erg ? (erg.s[id] ? '✓' : '✗') : ''}</td></tr>`;
    const rate = zahl(h.w.rate);
    let fazit = '';
    if (erg) {
      const n = z.filter(x => erg.z[x.id]).length;
      fazit = `<div class="karte" id="ergebnis"><h2>Rückmeldung</h2>
        <div class="hinweis ${n === z.length ? 'ok' : 'warn'}"><div><b>${n} von ${z.length} Positionen</b> stimmen mit den Unterlagen und der Richtlinie überein.${n < z.length ? ' Lesen Sie die Denkanstöße in der Tabelle, korrigieren Sie und prüfen Sie erneut.' : ''}</div></div>
        <div class="hinweis ${erg.s.sumEin && erg.s.sumAus && erg.s.frei ? 'ok' : 'fehler'}"><div>${erg.s.sumEin && erg.s.sumAus && erg.s.frei ? 'Ihre Summen und das frei verfügbare Einkommen sind rechnerisch richtig (bezogen auf Ihre Eingaben).' : 'Mindestens eine Summe passt rechnerisch nicht zu Ihren Eingaben. Rechnen Sie noch einmal nach.'}</div></div>
        ${erg.fertig ? `<div class="hinweis ok"><div><b>Geschafft:</b> Das frei verfügbare Einkommen von Frau Keller beträgt ${eur(r.sollFrei)}. Übertragen Sie Rechenweg und Ergebnis auf Ihr Arbeitsblatt.</div></div>` : ''}</div>`;
    }
    const toolFazit = tool ? `<div class="karte"><h2>Ergebnis</h2><div class="kacheln vier">
        <div class="kachel"><b id="hh-k-ein">${eur(r.ein)}</b><span>Einnahmen</span></div><div class="kachel"><b id="hh-k-aus">${eur(r.aus)}</b><span>Ausgaben</span></div>
        <div class="kachel" id="hh-k-frei-k"><b id="hh-k-frei">${eur(r.frei)}</b><span>frei verfügbares Einkommen</span></div>
        <div class="kachel"><b id="hh-k-rest">${isNaN(rate) ? '–' : eur(r.frei - rate)}</b><span>Überschuss nach neuer Rate</span></div></div>
        <label class="feld" style="margin-top:12px;max-width:260px"><span>Geplante Kreditrate in € (zum Ausprobieren)</span><input class="eur" inputmode="decimal" data-k="hh.w.rate" data-live="hh" value="${esc(h.w.rate || '')}" placeholder="0,00"></label>
        <div id="hh-ampel" style="margin-top:12px">${hhAmpel(r.frei, rate)}</div></div>` : '';
    return stationKopf('Haushaltsrechnung', `${esc(k.vorname)} ${esc(k.name)} · monatliche Beträge in €`) +
      `<div class="karte"><div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between">
          <div class="umschalter" role="group" aria-label="Modus"><button class="${tool ? '' : 'aktiv'}" data-act="hh-modus" data-m="selbst">Selbst rechnen</button><button class="${tool ? 'aktiv' : ''}" data-act="hh-modus" data-m="tool" ${istFrei('haushalt-tool') ? '' : 'disabled title="noch nicht freigeschaltet"'}>Beratertool${istFrei('haushalt-tool') ? '' : ' 🔒'}</button></div>
          <a class="knopf hell klein-k" href="#/bank/richtlinie">Richtlinie Haushaltsrechnung</a></div>
        <p class="klein" style="margin:10px 0 0">${tool ? 'Das Beratertool rechnet für Sie. Probieren Sie aus, wie sich Änderungen auswirken.' : 'Ermitteln Sie die Beträge aus Selbstauskunft, Gehaltsabrechnungen und Kontoumsätzen. Rechnen Sie die Summen selbst aus und tragen Sie sie ein. Das System kontrolliert nur.'}</p></div>
      <div class="karte eng"><div class="tabelle-wrap"><table class="rechen">
        <tr><th>Position</th><th class="r">Betrag in €</th>${tool ? '' : '<th></th>'}</tr>
        <tr class="gruppe"><td colspan="3">Einnahmen</td></tr>${z.filter(x => x.gruppe === 'ein').map(zeile).join('')}${summe('sumEin', 'Summe Einnahmen', r.ein)}
        <tr class="gruppe"><td colspan="3">Ausgaben</td></tr>${z.filter(x => x.gruppe === 'aus').map(zeile).join('')}${summe('sumAus', 'Summe Ausgaben', r.aus)}
        ${summe('frei', 'Frei verfügbares Einkommen', r.frei)}</table></div></div>
      ${tool ? '' : `<div class="knopfreihe" style="margin:0 0 14px"><button class="knopf" data-act="hh-pruefen">Eingaben prüfen</button></div>`}${fazit}${toolFazit}
      <div class="karte"><h2>Meine Notizen und Begründung</h2><textarea data-k="hh.notiz" placeholder="Welche Angaben habe ich korrigiert und warum? Ist die Rate tragbar?">${esc(h.notiz || '')}</textarea>
        <div class="knopfreihe"><button class="knopf hell" data-act="druck-hh">${icon('druck')} Drucken / als PDF</button><button class="knopf hell" data-act="hh-leer">Eingaben leeren</button></div></div>`;
  }
  function hhAmpel(frei, rate) {
    if (isNaN(rate) || rate <= 0) return '<div class="hinweis"><div>Tragen Sie eine geplante Rate ein, um die Tragbarkeit zu prüfen.</div></div>';
    if (rate > frei) return `<div class="hinweis fehler"><div><b>Systemmeldung:</b> Die Rate übersteigt das frei verfügbare Einkommen um ${eur(rate - frei)}. Der Antrag kann so nicht eingereicht werden.</div></div>`;
    if (frei - rate < 100) return `<div class="hinweis warn"><div>Die Rate ist rechnerisch tragbar, es bleibt aber nur ein Puffer von ${eur(frei - rate)}.</div></div>`;
    return `<div class="hinweis ok"><div>Die Rate ist tragbar. Nach der Rate bleibt ein Überschuss von ${eur(frei - rate)}.</div></div>`;
  }
  function hhLive() {
    const r = hhRechnen(kunde()), rate = zahl(st.hh.w.rate), set = (id, t) => { const e = document.getElementById(id); if (e) e.textContent = t; };
    set('hh-sumEin', eur(r.ein)); set('hh-sumAus', eur(r.aus)); set('hh-frei', eur(r.frei)); set('hh-k-ein', eur(r.ein)); set('hh-k-aus', eur(r.aus)); set('hh-k-frei', eur(r.frei));
    set('hh-k-rest', isNaN(rate) ? '–' : eur(r.frei - rate));
    const a = document.getElementById('hh-ampel'); if (a) a.innerHTML = hhAmpel(r.frei, rate);
  }
  function hhPruefen() {
    const k = kunde(), h = st.hh, r = hhRechnen(k), erg = { z: {}, s: {} };
    k.haushalt.zeilen.forEach(x => { erg.z[x.id] = Math.abs(zahl0(h.w[x.id]) - x.soll) < 0.005; if (!erg.z[x.id]) h.versuche[x.id] = (h.versuche[x.id] || 0) + 1; });
    const nah = (id, soll) => { const v = zahl(h.w[id]); return !isNaN(v) && Math.abs(v - soll) < 0.005; };
    erg.s.sumEin = nah('sumEin', r.ein); erg.s.sumAus = nah('sumAus', r.aus); erg.s.frei = nah('frei', r.frei);
    erg.fertig = Object.values(erg.z).every(Boolean) && erg.s.sumEin && erg.s.sumAus && erg.s.frei;
    h.erg = erg;
  }
  function hhDruck() {
    const k = kunde(), h = st.hh, z = k.haushalt.zeilen, r = hhRechnen(k), tool = h.modus === 'tool' && istFrei('haushalt-tool');
    const zl = x => `<tr><td>${esc(x.label)}</td><td class="r">${(h.w[x.id] || '').trim() ? eur(zahl0(h.w[x.id])) : '–'}</td></tr>`;
    const s = (id, l, wert) => `<tr class="summe"><td>${l}</td><td class="r">${tool ? eur(wert) : ((h.w[id] || '').trim() ? eur(zahl0(h.w[id])) : '')}</td></tr>`;
    const rate = zahl(h.w.rate);
    drucken('Haushaltsrechnung', `${k.vorname} ${k.name} · Kundennr. ${k.kundennr} · Modus: ${tool ? 'Beratertool' : 'Selbst rechnen'}${h.erg && h.erg.fertig && !tool ? ' · vom System geprüft: alle Positionen richtig' : ''}`,
      `<table><tr><th>Position</th><th class="r">Betrag im Monat</th></tr><tr class="gruppe"><td colspan="2"><b>Einnahmen</b></td></tr>${z.filter(x => x.gruppe === 'ein').map(zl).join('')}${s('sumEin', 'Summe Einnahmen', r.ein)}
        <tr class="gruppe"><td colspan="2"><b>Ausgaben</b></td></tr>${z.filter(x => x.gruppe === 'aus').map(zl).join('')}${s('sumAus', 'Summe Ausgaben', r.aus)}${s('frei', 'Frei verfügbares Einkommen', r.frei)}
        ${tool && !isNaN(rate) ? `<tr><td>Geplante Kreditrate</td><td class="r">${eur(rate)}</td></tr><tr class="summe"><td>Überschuss nach neuer Rate</td><td class="r">${eur(r.frei - rate)}</td></tr>` : ''}</table>` + notizBlock(h.notiz));
  }

  /* ----------------------------------------------------------- Kreditrechner */
  function vRechner(k, spielwiese) {
    const kk = D.konditionen.kredit;
    if (spielwiese && !istFrei('rechner-tool')) return titel('Kreditrechner', 'Spielwiese zum freien Ausprobieren') + sperre('Kreditrechner (Spielwiese)');
    if (!spielwiese && !istFrei('rechner')) return stationKopf('Kreditrechner und Tilgungsplan') + sperre('Kreditrechner und Tilgungsplan');
    const s = spielwiese ? st.sp : st.re;
    if (s.betrag == null) { s.betrag = spielwiese ? '10000' : (st.sa.kreditbetrag || '12500'); s.laufzeit = spielwiese ? '60' : (st.sa.laufzeit || '48'); s.rk = 'B'; s.auto = !spielwiese; }
    const tool = spielwiese || (s.modus === 'tool' && istFrei('rechner-tool'));
    const betrag = zahl(s.betrag), lz = zahl(s.laufzeit), rk = kk.risikoklassen.find(x => x.rk === s.rk) || kk.risikoklassen[1];
    const zins = rund(rk.sollzins - (s.auto ? kk.autoAbschlag : 0)), gueltig = betrag > 0 && lz >= 1 && lz <= 600 && lz % 1 === 0;
    const tp = gueltig ? tilgungsplan(betrag, zins, lz) : null;
    const hr = hhRechnen(kunde()), freiBekannt = !spielwiese && hr.frei > 0 && istFrei('haushalt');
    let ergebnis = '';
    if (tp && tool) {
      ergebnis = `<div class="karte"><h2>Ergebnis</h2><div class="kacheln vier"><div class="kachel"><b>${eur(tp.rate)}</b><span>Monatsrate</span></div><div class="kachel"><b>${eur(tp.zinsSumme)}</b><span>Zinsen gesamt</span></div>
          <div class="kachel"><b>${eur(tp.gesamt)}</b><span>Gesamtbetrag</span></div><div class="kachel"><b>${proz(tp.eff)}</b><span>effektiver Jahreszins</span></div></div>
          ${freiBekannt ? `<div style="margin-top:12px">${hhAmpel(hr.frei, tp.rate)}</div>` : ''}
          <details class="tp" style="margin-top:10px" ${s.tpAuf ? 'open' : ''}><summary>Tilgungsplan anzeigen (${tp.zeilen.length} Raten)</summary><div class="tabelle-wrap">${tpTabelle(tp)}</div></details>
          <div class="knopfreihe"><button class="knopf hell" data-act="druck-tp" data-sp="${spielwiese ? 1 : ''}">${icon('druck')} Tilgungsplan drucken / als PDF</button></div></div>`;
    } else if (tp) {
      const e = s.erg;
      ergebnis = `<div class="karte"><h2>Ihre Berechnung</h2><p class="klein">Berechnen Sie die Monatsrate (Annuität) auf Ihrem Arbeitsblatt und tragen Sie sie ein. Das System kontrolliert nur.</p>
        <label class="feld" style="max-width:260px"><span>Monatsrate in €</span><input class="eur" inputmode="decimal" data-k="re.rate" value="${esc(s.rate || '')}" placeholder="0,00"></label>
        <div class="knopfreihe"><button class="knopf" data-act="re-pruefen">Rate prüfen</button></div>
        ${e ? `<div style="margin-top:12px" id="ergebnis">${e.ok ? `<div class="hinweis ok"><div><b>Richtig:</b> Die Monatsrate beträgt ${eur(tp.rate)}.</div></div>` :
          `<div class="hinweis warn"><div><b>${s.versuche > 1 ? 'Lösungsweg' : 'Denkanstoß'}:</b> ${s.versuche > 1
            ? `Monatszins i = ${proz(zins)} : 12 = ${proz(zins / 12, 4)}. Rate = Kreditbetrag × i : (1 − (1 + i)<sup>−${lz}</sup>). Setzen Sie ${eur(betrag)} ein.`
            : 'Die Rate bleibt über die Laufzeit gleich. Rechnen Sie mit dem Monatszins (Jahreszins geteilt durch 12) und der Laufzeit in Monaten.'}</div></div>`}</div>` : ''}</div>`;
    }
    const kopf = spielwiese ? titel('Kreditrechner', 'Spielwiese zum freien Ausprobieren, ohne Kundenbezug') : stationKopf('Kreditrechner und Tilgungsplan', `${esc(k.vorname)} ${esc(k.name)} · SchlossKredit`);
    const p = spielwiese ? 'sp' : 're';
    return kopf + `<div class="karte">
        ${spielwiese ? '' : `<div class="umschalter" role="group" style="margin-bottom:14px"><button class="${tool ? '' : 'aktiv'}" data-act="re-modus" data-m="selbst">Selbst rechnen</button><button class="${tool ? 'aktiv' : ''}" data-act="re-modus" data-m="tool" ${istFrei('rechner-tool') ? '' : 'disabled'}>Beratertool${istFrei('rechner-tool') ? '' : ' 🔒'}</button></div>`}
        <div class="felder">
          <label class="feld"><span>Kreditbetrag in €</span><input class="eur" inputmode="decimal" data-k="${p}.betrag" data-neu="1" value="${esc(s.betrag)}"></label>
          <label class="feld"><span>Laufzeit in Monaten</span><input class="eur" inputmode="numeric" data-k="${p}.laufzeit" data-neu="1" value="${esc(s.laufzeit)}"></label>
          <label class="feld"><span>Risikoklasse</span><select data-k="${p}.rk" data-neu="1">${kk.risikoklassen.map(x => `<option value="${x.rk}" ${x.rk === rk.rk ? 'selected' : ''}>${x.rk} · ${esc(x.text)} · ${proz(x.sollzins)}</option>`).join('')}</select></label>
          <label class="feld"><span>Verwendung</span><select data-k="${p}.auto" data-neu="1" data-bool="1"><option value="">SchlossKredit (frei)</option><option value="1" ${s.auto ? 'selected' : ''}>SchlossKredit Auto (−${proz(kk.autoAbschlag, 1)}-Punkte)</option></select></label>
        </div>
        <p style="margin:12px 0 0">Gebundener Sollzins: <b>${proz(zins)} p. a.</b></p>
        <div style="margin-top:10px">${meldungenHtml(systemmeldungen(betrag, lz, rk.rk))}</div></div>${ergebnis}
      ${spielwiese ? '' : `<div class="karte"><h2>Meine Notizen und Begründung</h2><textarea data-k="re.notiz" placeholder="Welche Laufzeit empfehle ich und warum?">${esc(s.notiz || '')}</textarea></div>`}`;
  }
  const tpTabelle = tp => `<table><tr><th>Monat</th><th class="r">Rate</th><th class="r">Zinsen</th><th class="r">Tilgung</th><th class="r">Restschuld</th></tr>
    ${tp.zeilen.map(z => `<tr><td class="num">${z.m}</td><td class="r">${eur(z.rate)}</td><td class="r">${eur(z.zins)}</td><td class="r">${eur(z.tilg)}</td><td class="r">${eur(z.rest)}</td></tr>`).join('')}
    <tr class="summe"><td>Summe</td><td class="r">${eur(tp.gesamt)}</td><td class="r">${eur(tp.zinsSumme)}</td><td class="r">${eur(tp.gesamt - tp.zinsSumme)}</td><td></td></tr></table>`;

  /* ------------------------------------------------------------ Unsere Bank */
  const BANK_REITER = [['', 'Profil'], ['team', 'Team und Kompetenzen'], ['konditionen', 'Konditionen'], ['richtlinie', 'Richtlinie'], ['glossar', 'Glossar']];
  function vBank(tab) {
    const b = D.bank, kk = D.konditionen;
    let inhalt = '';
    if (!tab) inhalt = `<div class="karte">${b.profil.map(p => `<p>${esc(p)}</p>`).join('')}<div class="kacheln vier" style="margin-top:6px">${b.zahlen.map(([z, l]) => `<div class="kachel"><b>${esc(z)}</b><span>${esc(l)}</span></div>`).join('')}</div></div>
      <div class="raster zwei"><div class="karte"><h2>Auf einen Blick</h2>${paare(b.steckbrief)}</div><div class="karte"><h2>Vorstand</h2>${paare(b.vorstand)}</div></div>
      <div class="karte"><h2>Leitbild: ${esc(b.slogan)}</h2><div class="raster zwei" style="margin:0">${b.werte.map(([w, t]) => `<div><b>${esc(w)}</b><br><span class="klein">${esc(t)}</span></div>`).join('')}</div></div>`;
    else if (tab === 'team') inhalt = `<div class="karte"><h2>Kompetenzregelung Ratenkredit</h2><div class="tabelle-wrap"><table><tr><th>Kreditbetrag</th><th>Risikoklasse</th><th>Entscheidung</th></tr>${D.kompetenz.tabelle.map(z => `<tr>${z.map(x => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</table></div>
        <p class="klein" style="margin:10px 0 0">Das System prüft diese Grenzen automatisch und meldet, wenn Ihre Kompetenz überschritten ist.</p></div>
      <div class="karte"><h2>Ablauf Ratenkredit</h2><ol style="margin:0;padding-left:22px">${b.ablauf.map(a => `<li>${esc(a)}</li>`).join('')}</ol></div>
      <div class="karte eng"><h2 style="padding:16px 16px 4px">Ansprechpartner im Kreditgeschäft</h2><ul class="liste">${b.ansprechpartner.map(([n, f, a]) => `<li><div class="zeile" style="align-items:flex-start"><span class="mitte"><b>${esc(n)}</b><span style="white-space:normal">${esc(f)} · ${esc(a)}</span></span></div></li>`).join('')}</ul></div>`;
    else if (tab === 'konditionen') inhalt = `<div class="karte"><h2>Konten, Überziehung und Sparen</h2><p class="klein">Stand ${esc(kk.stand)}</p><div class="tabelle-wrap"><table><tr><th>Produkt</th><th>Konditionen</th></tr>${kk.konten.map(z => `<tr><td>${esc(z[0])}</td><td>${esc(z[1])}</td></tr>`).join('')}</table></div></div>
      <div class="karte"><h2>SchlossKredit (Ratenkredit)</h2><p class="klein">${eur(kk.kredit.minBetrag)} bis ${eur(kk.kredit.maxBetrag)}, ${kk.kredit.minLaufzeit} bis ${kk.kredit.maxLaufzeit} Monate, gebundener Sollzins, kostenlose Sondertilgungen</p>
        <div class="tabelle-wrap"><table><tr><th>Risikoklasse</th><th>Bonität</th><th class="r">Sollzins p. a.</th><th class="r">eff. Jahreszins</th></tr>${kk.kredit.risikoklassen.map(r => `<tr><td><b>${r.rk}</b></td><td>${esc(r.text)}</td><td class="r">${proz(r.sollzins)}</td><td class="r">${proz((Math.pow(1 + r.sollzins / 1200, 12) - 1) * 100)}</td></tr>`).join('')}</table></div>
        <p style="margin:12px 0 6px"><b>SchlossKredit Auto:</b> ${proz(kk.kredit.autoAbschlag, 1)}-Punkte günstiger bei Sicherungsübereignung des Fahrzeugs.</p><p class="klein" style="margin:0">${esc(kk.kredit.beispiel)} Die Restschuldversicherung ist freiwillig und keine Voraussetzung für den Kredit.</p></div>`;
    else if (tab === 'richtlinie') inhalt = `<div class="karte"><h2>Richtlinie Haushaltsrechnung</h2><p class="klein">Auszug aus dem Beraterhandbuch der Kreditberatung Privatkunden</p><ol style="margin:0;padding-left:22px">${D.richtlinie.punkte.map(p => `<li style="margin-bottom:8px">${esc(p)}</li>`).join('')}</ol></div>`;
    else if (tab === 'glossar') inhalt = `<div class="karte">${D.glossar.map(([w, t]) => `<p><b>${esc(w)}</b><br>${esc(t)}</p>`).join('')}</div>`;
    return titel('Unsere Bank', esc(b.name)) + `<nav class="reiter">${BANK_REITER.map(([id, t]) => `<a href="#/bank${id ? '/' + id : ''}" class="${(tab || '') === id ? 'aktiv' : ''}">${t}</a>`).join('')}</nav>` + inhalt;
  }

  /* -------------------------------------------------- Lehrkraft, Einstellungen */
  function vKonto() {
    return titel('Mein Gerät', `Angemeldet als ${esc(st.kuerzel)}`) + `
      <div class="karte"><h2>Freigeschaltete Funktionen</h2>${D.freischaltungen.map(f => `<div class="zeile" style="padding:8px 0;min-height:0"><span class="mitte"><b>${esc(f.titel)}</b></span>${f.frei.every(x => istFrei(x)) ? '<span class="marke gruen">offen</span>' : '<span class="marke">gesperrt</span>'}</div>`).join('')}
        <form class="codezeile" style="margin-left:0" data-form="code"><input name="code" autocomplete="off" autocapitalize="characters" placeholder="Freischaltcode" aria-label="Freischaltcode"><button class="knopf">Öffnen</button></form></div>
      <div class="karte"><h2>Datenschutz</h2><p class="klein">Diese Plattform überträgt keine Daten. Alles, was Sie eingeben, bleibt im Browser dieses Geräts und kann von niemandem eingesehen werden, auch nicht von Ihrer Lehrkraft. Sichern Sie Ihre Ergebnisse deshalb über „Drucken / als PDF“. Geben Sie keine echten Namen oder Kundendaten ein.</p>
        <div class="knopfreihe"><button class="knopf hell" data-act="abmelden">Kürzel ändern</button><button class="knopf hell" data-act="reset">Alle Eingaben auf diesem Gerät löschen</button></div></div>
      ${st.lehrkraft ? `<div class="karte"><h2>Lehrkraft</h2><p class="klein">Der Lehrkraft-Zugang ist aktiv: Alle Funktionen sind auf diesem Gerät geöffnet.</p>
        <label class="feld"><span>Prüfwert für einen neuen Freischaltcode erzeugen (zum Eintragen in daten.js)</span><input data-k="_hashCode" data-neu="1" value="${esc(st._hashCode || '')}" placeholder="neuer Code" autocomplete="off"></label>
        ${st._hashCode ? `<p class="klein" style="overflow-wrap:anywhere;margin-top:8px">Code <b>${esc(st._hashCode.trim().toUpperCase())}</b> → Prüfwert:<br><code>${pruefwert(st._hashCode)}</code></p>` : ''}
        <div class="knopfreihe"><button class="knopf hell" data-act="lk-aus">Lehrkraft-Zugang beenden</button><button class="knopf hell" data-act="alles-zu">Alle Freischaltungen zurücknehmen</button></div></div>` : ''}
      <p class="klein">Version ${esc(D.version)}</p>`;
  }

  /* ================================================================ Rahmen */
  function zeichnen(behalteFokus) {
    if (!st.kuerzel) { $app.innerHTML = vAnmeldung(); return; }
    const teile = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent), [a, b, c, d] = teile;
    let inhalt, aktiv = a || 'start';
    if (a === 'post') inhalt = vPost(b);
    else if (a === 'kunde') inhalt = vKunde(c, d);
    else if (a === 'antrag') inhalt = vAntrag(c);
    else if (a === 'bank') inhalt = vBank(b);
    else if (a === 'rechner') { inhalt = vRechner(kunde(), true); aktiv = 'antrag'; }
    else if (a === 'konto') { inhalt = vKonto(); aktiv = ''; }
    else { inhalt = vStart(); aktiv = 'start'; }
    const u = ungelesen();
    const nav = [['start', '#/', 'Arbeitsplatz', 'start'], ['post', '#/post', 'Posteingang', 'post'], ['kunde', '#/kunde/sophie', 'Kundin', 'kunde'], ['antrag', '#/antrag/sophie', 'Kreditantrag', 'antrag'], ['bank', '#/bank', 'Unsere Bank', 'bank']];
    const fokus = behalteFokus && document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.k : null;
    const pos = fokus ? document.activeElement.selectionStart : null;
    $app.innerHTML = `<div class="rahmen">
      <nav class="nav" aria-label="Hauptnavigation"><div class="logo"><img src="assets/logo-weiss.png" alt="Schlossbank Aschaffenburg"></div>
        ${nav.map(([id, href, t, ic]) => `<a href="${href}" class="${aktiv === id ? 'aktiv' : ''}">${icon(ic)}<span>${t}</span>${id === 'post' && u ? `<span class="zahl">${u}</span>` : ''}</a>`).join('')}
        <div class="nav-fuss">${esc(D.bank.slogan)}<br>Fiktives Modellunternehmen für den Unterricht</div></nav>
      <header class="kopf"><img src="assets/logo.png" alt="Schlossbank Aschaffenburg"><div class="system"><b>${esc(D.bank.system)}</b>Kreditberatung Privatkunden</div>
        <a class="wer" href="#/konto" style="text-decoration:none" aria-label="Mein Gerät"><span>${st.lehrkraft ? 'Lehrkraft' : 'angemeldet'}</span><span class="kuerzel">${esc(st.kuerzel)}</span></a></header>
      <main class="inhalt">${meldung ? `<div class="hinweis ${meldung.ok ? 'ok' : 'fehler'}" style="margin-bottom:14px" role="status"><div>${esc(meldung.text)}</div></div>` : ''}${inhalt}
        <div class="fuss">${esc(D.bank.hinweis)}</div></main></div>`;
    meldung = null;
    if (fokus) { const e = $app.querySelector(`[data-k="${fokus}"]`); if (e) { e.focus(); try { e.setSelectionRange(pos, pos); } catch (x) { /* select */ } } }
  }
  const neu = oben => { zeichnen(); if (oben) window.scrollTo(0, 0); };
  const zumErgebnis = () => { const e = document.getElementById('ergebnis'); if (e) e.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  /* -------------------------------------------------------------- Ereignisse */
  function setze(pfad, wert) { const t = pfad.split('.'); let o = st; while (t.length > 1) { const k = t.shift(); if (typeof o[k] !== 'object' || o[k] === null) o[k] = {}; o = o[k]; } o[t[0]] = wert; }
  $app.addEventListener('input', e => {
    const el = e.target, k = el.dataset && el.dataset.k; if (!k) return;
    setze(k, el.dataset.bool ? !!el.value : el.value);
    if (k.startsWith('sa.')) st.saGeprueft = false;
    if (k.startsWith('hh.w.') && !el.dataset.live) st.hh.erg = null;
    if (k.startsWith('re.')) st.re.erg = null;
    sichern();
    if (el.dataset.live === 'hh') hhLive();
    if (el.dataset.neu) zeichnen(true);
  });
  $app.addEventListener('submit', e => {
    const f = e.target.dataset.form; if (!f) return; e.preventDefault();
    const fd = new FormData(e.target);
    if (f === 'anmelden') { st.kuerzel = String(fd.get('kuerzel')).trim().toUpperCase().slice(0, 4); sichern(); neu(true); }
    if (f === 'code') { meldung = codeEinloesen(fd.get('code')); neu(true); }
    if (f === 'notiz') { st.notizen.push({ datum: new Date().toLocaleDateString('de-DE'), text: String(fd.get('text')).trim() }); sichern(); neu(); }
  });
  $app.addEventListener('toggle', e => { if (e.target.matches && e.target.matches('details.tp')) { (location.hash.includes('antrag') ? st.re : st.sp).tpAuf = e.target.open; sichern(); } }, true);
  $app.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const a = el.dataset.act, k = kunde();
    if (a === 'hh-modus') { st.hh.modus = el.dataset.m; sichern(); neu(); }
    else if (a === 're-modus') { st.re.modus = el.dataset.m; sichern(); neu(); }
    else if (a === 'hh-pruefen') { hhPruefen(); sichern(); neu(); zumErgebnis(); }
    else if (a === 'hh-leer') { if (confirm('Alle Eingaben der Haushaltsrechnung leeren?')) { st.hh = Object.assign(LEER().hh, { modus: st.hh.modus }); sichern(); neu(); } }
    else if (a === 'sa-pruefen') { st.saGeprueft = true; sichern(); neu(); zumErgebnis(); }
    else if (a === 're-pruefen') {
      const kk = D.konditionen.kredit, rk = kk.risikoklassen.find(x => x.rk === st.re.rk) || kk.risikoklassen[1];
      const tp = tilgungsplan(zahl(st.re.betrag), rund(rk.sollzins - (st.re.auto ? kk.autoAbschlag : 0)), zahl(st.re.laufzeit));
      const ok = Math.abs(zahl(st.re.rate) - tp.rate) <= 0.02; if (!ok) st.re.versuche = (st.re.versuche || 0) + 1;
      st.re.erg = { ok }; sichern(); neu(); zumErgebnis();
    }
    else if (a === 'notiz-weg') { if (confirm('Diesen Vermerk löschen?')) { st.notizen.splice(+el.dataset.i, 1); sichern(); neu(); } }
    else if (a === 'abmelden') { st.kuerzel = ''; sichern(); location.hash = '#/'; neu(true); }
    else if (a === 'reset') { if (confirm('Wirklich alle Eingaben und Freischaltungen auf diesem Gerät löschen?')) { st = LEER(); sichern(); location.hash = '#/'; neu(true); } }
    else if (a === 'lk-aus') { st.lehrkraft = false; sichern(); neu(); }
    else if (a === 'alles-zu') { st.frei = {}; st.lehrkraft = false; sichern(); neu(); }
    else if (a === 'druck-hh') hhDruck();
    else if (a === 'druck-dok') drucken(st._druckDok.titel, `${k.vorname} ${k.name} · Kundennr. ${k.kundennr}`, st._druckDok.html);
    else if (a === 'druck-antwort') {
      const n = D.nachrichten.find(x => x.id === el.dataset.id);
      drucken('Antwort an ' + n.von, `Betreff: ${n.betreff} · über das Postfach im SchlossBanking`, `<h2>Nachricht der Kundin vom ${datum(n.datum)}</h2>${n.text.map(p => `<p>${esc(p)}</p>`).join('')}` + notizBlock(st.antwort[n.id], 'Meine Antwort'));
    }
    else if (a === 'druck-akte') drucken('Kundenakte: Vermerke', `${k.vorname} ${k.name} · Kundennr. ${k.kundennr}`,
      `<table><tr><th>Datum</th><th>Kanal</th><th>Vermerk</th></tr>${st.notizen.slice().reverse().map(n => `<tr><td>${esc(n.datum)}</td><td>Kreditberatung (${esc(st.kuerzel)})</td><td style="white-space:pre-wrap">${esc(n.text)}</td></tr>`).join('')}
        ${k.kontakte.map(c => `<tr><td>${datum(c.datum)}</td><td>${esc(c.kanal)} · ${esc(c.wer)}</td><td>${esc(c.text)}</td></tr>`).join('')}</table>`);
    else if (a === 'druck-sa') { const p = saPruefung(k); drucken('Selbstauskunft: Erfassung im System', `${k.vorname} ${k.name} · Kundennr. ${k.kundennr} · Formular PK-07`, saTabelle(st.sa) + '<h2>Systemprüfung</h2>' + meldungenHtml(p.m.concat(p.ab)) + notizBlock(st.saNotiz)); }
    else if (a === 'druck-tp') {
      const sp = !!el.dataset.sp, s = sp ? st.sp : st.re, kk = D.konditionen.kredit, rk = kk.risikoklassen.find(x => x.rk === s.rk) || kk.risikoklassen[1];
      const zins = rund(rk.sollzins - (s.auto ? kk.autoAbschlag : 0)), tp = tilgungsplan(zahl(s.betrag), zins, zahl(s.laufzeit));
      drucken('Tilgungsplan', sp ? 'Kreditrechner (Spielwiese)' : `${k.vorname} ${k.name} · Kundennr. ${k.kundennr}`,
        paare([['Kreditbetrag', eur(zahl(s.betrag))], ['Laufzeit', zahl(s.laufzeit) + ' Monate'], ['Gebundener Sollzins', proz(zins) + ' p. a. (Risikoklasse ' + rk.rk + (s.auto ? ', SchlossKredit Auto' : '') + ')'], ['Effektiver Jahreszins', proz(tp.eff)], ['Monatsrate', eur(tp.rate)], ['Zinsen gesamt', eur(tp.zinsSumme)], ['Gesamtbetrag', eur(tp.gesamt)]]) +
        '<h2>Tilgungsplan</h2>' + tpTabelle(tp) + (sp ? '' : notizBlock(s.notiz)));
    }
  });
  window.addEventListener('hashchange', () => neu(true));
  window.addEventListener('afterprint', () => { document.getElementById('druck').innerHTML = ''; });

  zeichnen();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => { /* ohne Offline-Betrieb weiter */ });
})();
