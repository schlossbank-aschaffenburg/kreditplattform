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
    re: { modus: 'selbst', versuche: 0, erg: null, notiz: '' }, sp: {},
    antrag: {}, unterlagen: {}, ak: {}, votum: {}, tr: {}, ta: {}, kk: {}, kq: {}
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
    let s = String(v).replace(/[€%\s]/g, '');
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
    training: '<path d="M12 4l9 5-9 5-9-5z"/><path d="M7 11.5V16c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5v-4.5"/>',
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
    const ein = (D.einstiege || []).find(x => x.hash === h);
    if (ein) {
      ein.frei.forEach(x => { st.frei[x] = true; });
      einstiegSetzen(ein.stand); sichern();
      return { ok: true, text: `${ein.titel}. Die Schritte bis dahin sind mit dem Musterstand gefüllt, Ihre abgeschlossenen Stationen bleiben erhalten.` };
    }
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

  /* ---------------------------------------------------- Antrag als Prozess */
  const STATIONEN = [
    { id: 'selbstauskunft', kurz: 'Selbstauskunft', t: 'Selbstauskunft erfassen', u: 'Angaben der Kundin ins System übernehmen und prüfen', frei: 'selbstauskunft' },
    { id: 'auskunftei', kurz: 'Auskunftei', t: 'Auskunftei abfragen', u: 'Auskunft einholen und selbst auswerten', frei: 'auskunftei' },
    { id: 'haushalt', kurz: 'Haushaltsrechnung', t: 'Haushaltsrechnung', u: 'Kundenangaben prüfen, Bankansatz festlegen, frei verfügbares Einkommen ermitteln', frei: 'haushalt' },
    { id: 'scoring', kurz: 'Scoring', t: 'Scoring und Risikoklasse', u: 'folgt im Laufe der Kreditprüfung', folgt: true },
    { id: 'rechner', kurz: 'Kreditrechner', t: 'Kreditrechner und Tilgungsplan', u: 'Rate, Laufzeit und Gesamtkosten berechnen', frei: 'rechner' },
    { id: 'votum', kurz: 'Votum', t: 'Kreditentscheidung (Votum)', u: 'Ergebnisse zusammenführen, entscheiden und begründen', frei: 'votum' }
  ];
  const saFertig = () => !!st.saGeprueft && !saPruefung(kunde()).m.some(x => x[0] === 'fehler');
  const stationFertig = id => id === 'selbstauskunft' ? saFertig() : id === 'auskunftei' ? !!st.ak.abgerufen : id === 'haushalt' ? !!st.hh.fertig
    : id === 'rechner' ? !!st.re.ueb : id === 'votum' ? !!st.votum.abgegeben : false;
  const stationVor = id => STATIONEN.slice(0, STATIONEN.findIndex(s => s.id === id)).filter(x => !x.folgt).pop();
  const stationNach = id => STATIONEN.slice(STATIONEN.findIndex(s => s.id === id) + 1).find(x => !x.folgt);
  // Zustand einer Station: 'folgt' | 'fertig' | 'offen' | 'code' (Freischaltcode fehlt) | 'vorher' (Station davor noch offen)
  function stationStand(id) {
    const s = STATIONEN.find(x => x.id === id);
    if (s.folgt) return 'folgt';
    if (stationFertig(id)) return 'fertig';
    if (st.lehrkraft) return 'offen';
    if (!st.frei[s.frei]) return 'code';
    const vor = stationVor(id);
    return vor && !stationFertig(vor.id) ? 'vorher' : 'offen';
  }
  const unterlagenOffen = () => D.unterlagen.filter(([id]) => !st.unterlagen[id]).map(([, t]) => t);
  function antragStatus() {
    const v = st.votum;
    if (!st.antrag.angelegt) return ['Kreditanfrage offen', 'gelb'];
    if (v.abgegeben) {
      if (v.entscheidung === 'ablehnen') return ['Ablehnung', 'rot'];
      if (v.entscheidung === 'zurueck') return ['Zurück an Kundin: Unterlagen fehlen', 'gelb'];
      if (v.zweit) return ['Manuelle Prüfung: Zweitvotum', 'gelb'];
      return [v.entscheidung === 'auflagen' ? 'Zusage mit Auflagen' : 'Zusage', 'gruen'];
    }
    return unterlagenOffen().length ? ['Unterlagen fehlen', 'gelb'] : ['In Prüfung', ''];
  }
  const statusMarke = () => { const [t, f] = antragStatus(); return `<span class="marke ${f}">${esc(t)}</span>`; };
  const weiter = id => {
    if (!stationFertig(id)) return '';
    const n = stationNach(id);
    return `<div class="hinweis ok" style="margin-bottom:14px"><div><b>✓ Station abgeschlossen.</b> ${n ? `<a href="#/antrag/sophie/${n.id}">Weiter zu „${esc(n.kurz)}“</a>` : '<a href="#/antrag/sophie">Zur Antragsübersicht</a>'}</div></div>`;
  };
  function reWerte(s) {
    const kk = D.konditionen.kredit, rk = kk.risikoklassen.find(x => x.rk === s.rk) || kk.risikoklassen[1];
    return { betrag: zahl(s.betrag), lz: zahl(s.laufzeit), rk: rk.rk, auto: !!s.auto, zins: rund(rk.sollzins - (s.auto ? kk.autoAbschlag : 0)) };
  }
  const uebernahme = () => { const w = reWerte(st.re); return Object.assign(w, { rate: tilgungsplan(w.betrag, w.zins, w.lz).rate }); };
  // Stunden-Einstieg: füllt die genannten Schritte mit dem Musterstand (Abgeschlossenes bleibt unverändert)
  function einstiegSetzen(schritte) {
    const k = kunde();
    schritte.forEach(s => {
      if (s === 'antrag' && !st.antrag.angelegt) st.antrag = { kunde: true, produkt: 'kredit', angelegt: true };
      if (s === 'selbstauskunft' && !saFertig()) { st.sa = Object.assign({}, k.selbstauskunft); st.saGeprueft = true; }
      if (s === 'auskunftei') { st.ak.hinweis = true; st.ak.abgerufen = true; }
      if (s === 'haushalt' && !st.hh.fertig) {
        const w = { rate: st.hh.w.rate || '' }; k.haushalt.zeilen.forEach(z => { w[z.id] = String(z.soll); });
        st.hh.w = w; const r = hhRechnen(k); w.sumEin = String(r.ein); w.sumAus = String(r.aus); w.frei = String(r.frei); hhPruefen();
      }
      if (s === 'rechner' && !st.re.ueb) { Object.assign(st.re, k.musterstand.rechner); st.re.ueb = uebernahme(); }
    });
  }

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
          <li><a class="zeile" href="#/antrag/sophie"><span class="kuerzel">${icon('antrag')}</span><span class="mitte"><b>${st.antrag.angelegt ? 'Kreditantrag ' + esc(D.antragsnummer) : 'Neuen Kreditantrag anlegen'}</b><span>${st.antrag.angelegt ? 'Antrag bearbeiten' : 'Kundin aufrufen, Produkt wählen, Antrag anlegen'}</span></span>${st.antrag.angelegt ? statusMarke() : `<span class="pfeil">${icon('pfeil')}</span>`}</a></li>
        </ul>${st.antrag.angelegt ? `<div class="schnell"><span class="klein">Schnellzugang:</span>${STATIONEN.filter(s => !s.folgt).map(s => { const z = stationStand(s.id); return `<a href="#/antrag/sophie/${s.id}" class="${z}">${z === 'fertig' ? '✓ ' : ''}${esc(s.kurz)}</a>`; }).join('')}</div>` : ''}</div>
        <div class="karte eng"><h2 style="padding:16px 16px 4px">Posteingang</h2><ul class="liste">${post.map(postZeile).join('')}</ul></div>
      </div>
      <div class="raster zwei">
        <div class="karte eng"><h2 style="padding:16px 16px 4px">Meine Kundinnen und Kunden</h2><ul class="liste">
          <li><a class="zeile" href="#/kunde/sophie"><span class="kuerzel kunde">${k.kuerzel}</span><span class="mitte"><b>${esc(k.vorname)} ${esc(k.name)}</b><span>Kundennr. ${esc(k.kundennr)}</span></span>${statusMarke()}</a></li>
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
        ${statusMarke()}</div></div>
      <nav class="reiter">${KUNDE_REITER.map(([id, t]) => `<a href="#/kunde/sophie${id ? '/' + id : ''}" class="${(tab || '') === id ? 'aktiv' : ''}">${t}</a>`).join('')}</nav>`;
    let inhalt = '';
    if (!tab) {
      const tg = k.produkte.find(p => p.id === 'tagesgeld').saldo;
      inhalt = `<div class="raster drei"><div class="karte"><h2>Hinweise und Prüfaufträge</h2>${k.hinweise.filter(h => istFrei(h.frei) && h.art !== 'impuls').map(h => `<div class="hinweis ${h.art}"><div>${esc(h.text)}</div></div>`).join('')}
            <h2 style="margin:16px 0 8px">Vertriebsimpulse</h2>${k.hinweise.filter(h => istFrei(h.frei) && h.art === 'impuls').map(h => `<div class="hinweis ${h.art}"><div>${esc(h.text)}</div></div>`).join('')}</div>
          <div class="karte"><h2>Finanzstatus</h2><div class="kacheln">
            <div class="kachel"><b>${eur(saldo)}</b><span>Girokonto</span></div><div class="kachel"><b>${eur(tg)}</b><span>Tagesgeld</span></div>
            <div class="kachel"><b>${eur(saldo + tg)}</b><span>Guthaben gesamt</span></div><div class="kachel"><b>0,00 €</b><span>Kredite bei uns</span></div></div>
            <p class="klein" style="margin:10px 0 0">Stand ${datum(D.heute)}. Dispositionsrahmen 2.000,00 €, aktuell nicht genutzt.</p></div></div>
        <div class="karte"><h2>Anliegen</h2><p>${esc(k.anliegen)}</p>
          <div class="knopfreihe"><a class="knopf" href="#/antrag/sophie">${st.antrag.angelegt ? 'Kreditantrag bearbeiten' : 'Kreditantrag anlegen'}</a><a class="knopf hell" href="#/post/anfrage">Nachricht der Kundin</a></div></div>`;
    } else if (tab === 'stammdaten') {
      inhalt = `<div class="raster zwei">${k.stammdaten.map(([t, l]) => `<div class="karte"><h2>${esc(t)}</h2>${paare(l)}</div>`).join('')}</div>
        <p class="klein">Stammdaten können nur vom Kreditservice Markt geändert werden. Halten Sie Abweichungen als Vermerk in der Kundenakte fest.</p>`;
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
      inhalt = !istFrei('auskunftei') ? sperre('Auskunftei anfragen', 'Die Auskunftei-Abfrage ist für Sie noch nicht freigeschaltet. Sie darf erst gestellt werden, wenn ein Kreditantrag vorliegt.')
        : !st.ak.abgerufen ? `<div class="karte sperre">${icon('antrag')}<h2>Noch keine Auskunft abgerufen</h2><p class="klein">Eine Auskunft wird im Kreditantrag in der Station „Auskunftei“ abgerufen und erscheint danach hier.</p>
            <div class="knopfreihe" style="justify-content:center"><a class="knopf" href="#/antrag/sophie/auskunftei">Zum Kreditantrag</a></div></div>`
        : auskunftHtml(k);
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
  const auskunftHtml = k => {
    const a = k.auskunftei;
    return `<div class="papier"><h2>Auskunft über ${esc(k.vorname)} ${esc(k.name)}</h2>
      <p class="klein">Auskunftei (Muster) · Abfrage vom ${datum(a.abfrage)} · Anlass: ${esc(a.grund)} · Im echten Bankbetrieb liefert diese Auskunft die SCHUFA.</p>
      <div class="kacheln" style="margin:12px 0"><div class="kachel"><b>${esc(a.scorewert)}</b><span>Scorewert · ${esc(a.skala)}</span></div></div>
      <h3 style="margin:14px 0 6px">Gespeicherte Verträge</h3>
      <div class="tabelle-wrap"><table><tr><th>Art</th><th>Vertragspartner</th><th>seit</th><th>Angaben</th><th>Zahlungsverhalten</th></tr>${a.eintraege.map(e => `<tr>${e.map(x => `<td>${esc(x || '–')}</td>`).join('')}</tr>`).join('')}</table></div>
      <h3 style="margin:14px 0 6px">Anfragen der letzten 12 Monate</h3>
      <div class="tabelle-wrap"><table><tr><th>Datum</th><th>Anfragende Stelle</th><th>Art</th></tr>${a.anfragen.map(e => `<tr>${e.map(x => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</table></div></div>`;
  };

  function vAntragNeu(k) {
    const an = st.antrag, f = (an.suche || '').trim().toLowerCase();
    const passt = t => !f || t.toLowerCase().replace(/\s/g, '').includes(f.replace(/\s/g, ''));
    const sophiePasst = passt(k.vorname + k.name + k.kundennr), prod = D.produkte.find(p => p.id === an.produkt);
    return titel('Neuer Kreditantrag', 'Schritt für Schritt: Kundin aufrufen, Produkt wählen, Antrag anlegen') + `
      <div class="karte"><h2><span class="schritt ${an.kunde ? 'fertig' : ''}">${an.kunde ? '✓' : '1'}</span> Kundin oder Kunde aufrufen</h2>
        ${an.kunde ? `<div class="zeile" style="padding:6px 0"><span class="kuerzel kunde">${k.kuerzel}</span><span class="mitte"><b>${esc(k.vorname)} ${esc(k.name)}</b><span>Kundennr. ${esc(k.kundennr)}</span></span><button class="knopf hell klein-k" data-act="antrag-kunde" data-weg="1">Ändern</button></div>` : `
        <label class="feld"><span>Suche nach Name oder Kundennummer</span><input type="search" data-k="antrag.suche" data-neu="1" value="${esc(an.suche || '')}" placeholder="z. B. Keller oder 1005 3186" autocomplete="off"></label>
        <ul class="liste" style="margin-top:8px">${sophiePasst ? `<li><button class="zeile wahlzeile" data-act="antrag-kunde"><span class="kuerzel kunde">${k.kuerzel}</span><span class="mitte"><b>${esc(k.vorname)} ${esc(k.name)}</b><span>Kundennr. ${esc(k.kundennr)} · Filiale ${esc(k.filiale)}</span></span><span class="pfeil">${icon('pfeil')}</span></button></li>` : ''}
          ${D.weitereKunden.filter(w => passt(w.name + w.kundennr)).map(w => `<li><div class="zeile aus"><span class="kuerzel kunde">${icon('schloss')}</span><span class="mitte"><b>${esc(w.name)}</b><span>Kundennr. ${esc(w.kundennr)} · Ihnen nicht zugewiesen</span></span></div></li>`).join('')}
          ${!sophiePasst && !D.weitereKunden.some(w => passt(w.name + w.kundennr)) ? '<li><div class="leer">Keine Kundin und kein Kunde gefunden.</div></li>' : ''}</ul>`}</div>
      <div class="karte ${an.kunde ? '' : 'blass'}"><h2><span class="schritt ${prod ? 'fertig' : ''}">${prod ? '✓' : '2'}</span> Produkt wählen</h2>
        ${!an.kunde ? '<p class="klein" style="margin:0">Rufen Sie zuerst die Kundin oder den Kunden auf.</p>' : `<div class="produkte">${D.produkte.map(p => `<button class="produkt ${p.gesperrt ? 'zu' : ''} ${an.produkt === p.id ? 'aktiv' : ''}" data-act="antrag-produkt" data-id="${p.id}">
          <b>${p.gesperrt ? '🔒 ' : ''}${esc(p.name)}</b><span>${esc(p.art)}</span><span class="klein">${esc(p.gesperrt || p.text)}</span></button>`).join('')}</div>`}</div>
      <div class="karte ${prod ? '' : 'blass'}"><h2><span class="schritt">3</span> Antrag anlegen</h2>
        ${prod ? `<p>${esc(prod.name)} (${esc(prod.art)}) für ${esc(k.anrede)} ${esc(k.vorname)} ${esc(k.name)}.</p><p class="klein">Mit dem Anlegen öffnet sich die Antragsmaske. Die Stationen werden nacheinander aktiv.</p>
          <div class="knopfreihe"><button class="knopf" data-act="antrag-anlegen">Kreditantrag anlegen</button></div>` : '<p class="klein" style="margin:0">Wählen Sie zuerst ein Produkt.</p>'}</div>`;
  }

  function vAntrag(station) {
    const k = kunde();
    if (!st.antrag.angelegt) return vAntragNeu(k);
    const s = STATIONEN.find(x => x.id === station && !x.folgt);
    if (s) {
      const z = stationStand(s.id), vor = stationVor(s.id);
      if (z === 'code') return stationKopf(s.id, s.t) + sperre(s.t);
      if (z === 'vorher') return stationKopf(s.id, s.t) + `<div class="karte sperre">${icon('schloss')}<h2>${esc(s.t)}</h2>
        <p class="klein">Diese Station wird aktiv, sobald die Station „${esc(vor.kurz)}“ abgeschlossen ist.</p>
        <div class="knopfreihe" style="justify-content:center"><a class="knopf" href="#/antrag/sophie/${vor.id}">Zur Station „${esc(vor.kurz)}“</a></div></div>`;
      if (s.id === 'selbstauskunft') return vSelbstauskunft(k);
      if (s.id === 'auskunftei') return vAuskunft(k);
      if (s.id === 'haushalt') return vHaushalt(k);
      if (s.id === 'rechner') return vRechner(k, false);
      if (s.id === 'votum') return vVotum(k);
    }
    const prod = D.produkte.find(p => p.id === st.antrag.produkt) || D.produkte[0];
    const TEXT = { fertig: ['abgeschlossen', 'gruen'], offen: ['in Bearbeitung', 'gelb'], code: ['gesperrt', ''], vorher: ['wartet auf Station davor', ''], folgt: ['folgt', ''] };
    return titel('Kreditantrag ' + D.antragsnummer, `${esc(k.vorname)} ${esc(k.name)} · Kundennr. ${esc(k.kundennr)} · ${esc(prod.name)} (${esc(prod.art)})`, statusMarke()) + antragReiter('') +
      `<div class="karte eng"><ul class="liste">${STATIONEN.map((x, i) => {
        const z = stationStand(x.id), zu = z === 'code' || z === 'vorher' || z === 'folgt';
        return `<li><a class="station ${zu ? 'zu' : ''}" ${x.folgt ? '' : `href="#/antrag/sophie/${x.id}"`}><span class="nr ${z === 'fertig' ? 'fertig' : ''}">${z === 'fertig' ? '✓' : zu ? icon('schloss') : i + 1}</span><span class="mitte" style="flex:1"><b>${esc(x.t)}</b><br><span class="klein">${esc(x.u)}</span></span><span class="marke ${TEXT[z][1]}">${TEXT[z][0]}</span></a></li>`;
      }).join('')}</ul></div>
      <div class="karte"><h2>Unterlagen</h2><p class="klein">Haken Sie ab, was Ihnen vorliegt und was Sie geprüft haben.</p>
        ${D.unterlagen.map(([id, t]) => `<label class="haken-zeile"><input type="checkbox" data-k="unterlagen.${id}" data-neu="1" ${st.unterlagen[id] ? 'checked' : ''}><span>${esc(t)}</span></label>`).join('')}</div>
      <p class="klein">Eine Station wird aktiv, wenn Ihre Lehrkraft sie freigeschaltet hat und die Station davor abgeschlossen ist. Jede Station können Sie drucken oder als PDF sichern.</p>
      <div class="knopfreihe"><button class="knopf hell klein-k" data-act="antrag-neu">Antrag verwerfen und neu anlegen</button></div>`;
  }
  const antragReiter = aktiv => `<nav class="reiter">${[{ id: '', kurz: 'Übersicht' }].concat(STATIONEN).map(s => {
    const z = s.id ? stationStand(s.id) : '', zu = z === 'code' || z === 'vorher' || z === 'folgt';
    return `<a ${s.folgt ? '' : `href="#/antrag/sophie${s.id ? '/' + s.id : ''}"`} class="${aktiv === s.id ? 'aktiv' : ''} ${zu ? 'zu' : ''}">${z === 'fertig' ? '<span class="haken">✓</span> ' : zu ? '🔒 ' : ''}${esc(s.kurz)}</a>`;
  }).join('')}</nav>`;
  const stationKopf = (id, t, u) => titel(t, u, statusMarke()) + antragReiter(id);

  function vAuskunft(k) {
    const a = st.ak;
    if (!a.abgerufen) return stationKopf('auskunftei', 'Auskunftei abfragen', `${esc(k.vorname)} ${esc(k.name)} · Auskunftei (Muster)`) + `
      <div class="karte"><h2>Auskunft einholen</h2>
        <p>Vor der Kreditentscheidung holt die Bank eine Auskunft über die Kundin ein. Die Kundin muss vorher darüber informiert sein.</p>
        <label class="haken-zeile"><input type="checkbox" data-k="ak.hinweis" ${a.hinweis ? 'checked' : ''}><span>Frau Keller hat den Hinweis zur Datenübermittlung an die Auskunftei mit dem Kreditantrag erhalten.</span></label>
        <div class="knopfreihe"><button class="knopf" data-act="ak-abrufen">Auskunft jetzt abrufen</button></div></div>`;
    return stationKopf('auskunftei', 'Auskunftei abfragen', `${esc(k.vorname)} ${esc(k.name)} · Auskunftei (Muster)`) + weiter('auskunftei') + auskunftHtml(k) + `
      <div class="karte" style="margin-top:14px"><h2>Meine Auswertung</h2>
        <p class="klein">Die Auskunft enthält nur Einträge und einen Scorewert. Die Bewertung ist Ihre Aufgabe.</p>
        <textarea data-k="ak.notiz" placeholder="Was sagen die Einträge und der Scorewert über die Kundin aus? Was erfahre ich aus der Auskunft nicht?">${esc(a.notiz || '')}</textarea>
        <div class="knopfreihe"><button class="knopf hell" data-act="druck-ak">${icon('druck')} Drucken / als PDF</button></div></div>`;
  }

  /* ---------------------------------------------------------------- Votum */
  const VOTUM = [['zustimmen', 'Zustimmen'], ['auflagen', 'Zustimmen mit Auflagen'], ['ablehnen', 'Ablehnen'], ['zurueck', 'Zurück an die Kundin (Unterlagen oder Angaben fehlen)']];
  function votumDaten(k) {
    const u = st.re.ueb, hr = hhRechnen(k), offen = unterlagenOffen();
    return [
      ['Kreditwunsch', u ? `${eur(u.betrag)} · ${u.lz} Monate · Sollzins ${proz(u.zins)} p. a.` : 'noch offen'],
      ['Monatsrate', u ? eur(u.rate) : 'noch offen'],
      ['Frei verfügbares Einkommen', st.hh.fertig ? eur(hr.frei) : 'noch offen'],
      ['Überschuss nach neuer Rate', u && st.hh.fertig ? eur(hr.frei - u.rate) : 'noch offen'],
      ['Auskunftei', st.ak.abgerufen ? `abgerufen am ${datum(k.auskunftei.abfrage)}, Scorewert ${k.auskunftei.scorewert}` : 'noch nicht abgerufen'],
      ['Risikoklasse', u ? `${u.rk} (vorläufig, wie im Kreditrechner gewählt)` : 'noch offen'],
      ['Unterlagen', offen.length ? 'es fehlen: ' + offen.join(', ') : 'vollständig']
    ];
  }
  function votumPruefung(k) {
    const v = st.votum, m = [], u = st.re.ueb, hr = hhRechnen(k), ja = v.entscheidung === 'zustimmen' || v.entscheidung === 'auflagen';
    const offen = STATIONEN.filter(s => !s.folgt && s.id !== 'votum' && !stationFertig(s.id));
    if (offen.length) m.push(['fehler', 'Eine Entscheidung ist erst möglich, wenn alle Prüfungen abgeschlossen sind. Offen: ' + offen.map(s => s.kurz).join(', ') + '.']);
    if (!v.entscheidung) m.push(['fehler', 'Bitte wählen Sie eine Entscheidung.']);
    if ((v.persoenlich || '').trim().length < 15 || (v.wirtschaftlich || '').trim().length < 15) m.push(['fehler', 'Bitte begründen Sie Ihr Votum zur persönlichen und zur wirtschaftlichen (materiellen) Kreditwürdigkeit.']);
    if ((v.entscheidung === 'auflagen' || v.entscheidung === 'zurueck') && !(v.auflagen || '').trim()) m.push(['fehler', v.entscheidung === 'auflagen' ? 'Bitte nennen Sie die Auflagen.' : 'Bitte nennen Sie, was die Kundin nachreichen muss.']);
    if (ja && unterlagenOffen().length) m.push(['fehler', 'Eine Zusage ohne vollständige Unterlagen ist nicht möglich. Haken Sie die Unterlagen in der Antragsübersicht ab oder geben Sie den Antrag an die Kundin zurück.']);
    if (ja && u && st.hh.fertig && u.rate > hr.frei) m.push(['fehler', `Die Rate (${eur(u.rate)}) übersteigt das frei verfügbare Einkommen (${eur(hr.frei)}). Eine Zusage ist so nicht möglich.`]);
    const komp = u ? systemmeldungen(u.betrag, u.lz, u.rk) : [];
    return { m, komp, zweit: ja && komp.some(x => x[0] !== 'ok') };
  }
  function votumErgebnis(v) {
    if (v.entscheidung === 'ablehnen') return ['fehler', 'Ihr Votum ist gespeichert: Der Antrag ist abgelehnt. Informieren Sie die Kundin. Beruht die Ablehnung auf der Auskunft, muss sie das erfahren.'];
    if (v.entscheidung === 'zurueck') return ['warn', 'Ihr Votum ist gespeichert: Der Antrag ruht, bis die fehlenden Unterlagen oder Angaben vorliegen.'];
    if (v.zweit) return ['warn', 'Ihr Votum ist gespeichert. Ihre Kompetenz reicht für diesen Antrag nicht aus: Er geht zur manuellen Prüfung und zum Zweitvotum an das Kreditmanagement (Sabine Roth).'];
    return ['ok', `Ihr Votum ist gespeichert. Der Kredit liegt in Ihrer Kompetenz: Die Finanzierungszusage${v.entscheidung === 'auflagen' ? ' mit Auflagen' : ''} kann an die Kundin gehen.`];
  }
  function vVotum(k) {
    const v = st.votum, zu = v.abgegeben ? 'disabled' : '';
    const meld = v.abgegeben ? meldungenHtml([votumErgebnis(v)]) : (v.meld ? meldungenHtml(v.meld) : '');
    return stationKopf('votum', 'Kreditentscheidung (Votum)', `${esc(k.vorname)} ${esc(k.name)} · Kreditantrag ${esc(D.antragsnummer)}`) + `
      <div class="karte"><h2>Ergebnisse Ihrer Prüfung</h2>${paare(votumDaten(k))}
        ${st.re.ueb ? `<div style="margin-top:12px">${meldungenHtml(systemmeldungen(st.re.ueb.betrag, st.re.ueb.lz, st.re.ueb.rk))}</div>` : ''}</div>
      <div class="karte"><h2>Mein Votum</h2>
        <label class="feld"><span>Persönliche Kreditwürdigkeit: Was spricht dafür, was dagegen?</span><textarea data-k="votum.persoenlich" ${zu} placeholder="Beruf, Arbeitgeber, Auskunft, Kontoführung …">${esc(v.persoenlich || '')}</textarea></label>
        <label class="feld" style="margin-top:10px"><span>Wirtschaftliche (materielle) Kreditwürdigkeit: Ist die Rate dauerhaft tragbar?</span><textarea data-k="votum.wirtschaftlich" ${zu} placeholder="Einkommen, Ausgaben, frei verfügbares Einkommen, Rate …">${esc(v.wirtschaftlich || '')}</textarea></label>
        <div class="abschnitt">Entscheidung</div>
        ${VOTUM.map(([id, t]) => `<label class="haken-zeile"><input type="radio" name="entscheidung" data-k="votum.entscheidung" data-neu="1" value="${id}" ${v.entscheidung === id ? 'checked' : ''} ${zu}><span>${esc(t)}</span></label>`).join('')}
        ${v.entscheidung === 'auflagen' || v.entscheidung === 'zurueck' ? `<label class="feld" style="margin-top:10px"><span>${v.entscheidung === 'auflagen' ? 'Auflagen' : 'Was muss die Kundin nachreichen oder klären?'}</span><textarea data-k="votum.auflagen" ${zu} style="min-height:80px">${esc(v.auflagen || '')}</textarea></label>` : ''}
        <div id="ergebnis" style="margin-top:14px">${meld}</div>
        <div class="knopfreihe">${v.abgegeben ? '<button class="knopf hell" data-act="votum-zurueck">Votum zurücknehmen und ändern</button>' : '<button class="knopf" data-act="votum-abgeben">Votum abgeben</button>'}
          <button class="knopf hell" data-act="druck-votum">${icon('druck')} Drucken / als PDF</button></div></div>`;
  }

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
    return stationKopf('selbstauskunft', 'Selbstauskunft erfassen', 'Formular PK-07 · Übernehmen Sie die Angaben der Kundin aus ihrer Selbstauskunft.') + weiter('selbstauskunft') +
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
    const h = st.hh, kd = x => (x.sa || []).reduce((s, f) => s + zahl0(st.sa[f]), 0),
      kdText = x => (x.sa || []).some(f => String(st.sa[f] || '').trim()) ? eur(kd(x)) : '–',
      kdSum = g => z.filter(x => x.gruppe === g).reduce((s, x) => s + kd(x), 0),
      kdS = { sumEin: () => kdSum('ein'), sumAus: () => kdSum('aus'), frei: () => kdSum('ein') - kdSum('aus') }, tool = h.modus === 'tool' && istFrei('haushalt-tool'), z = k.haushalt.zeilen, r = hhRechnen(k), erg = tool ? null : h.erg;
    const zeile = x => {
      const ok = erg && erg.z[x.id], stufe = h.versuche[x.id] || 0;
      return `<tr><td>${esc(x.label)}</td><td class="r kd">${kdText(x)}</td><td class="eingabe"><input class="eur" inputmode="decimal" data-k="hh.w.${x.id}" ${tool ? 'data-live="hh"' : ''} value="${esc(h.w[x.id] || '')}" placeholder="0,00" aria-label="${esc(x.label)}"></td>
        ${tool ? '' : `<td class="urteil ${erg ? (ok ? 'ok' : 'falsch') : ''}">${erg ? (ok ? '✓' : '✗') : ''}</td>`}</tr>` +
        (erg && !ok ? `<tr class="tipp"><td colspan="4"><b>${stufe > 1 ? 'Lösungsweg' : 'Denkanstoß'}:</b> ${esc(stufe > 1 ? x.t2 : x.t1)}</td></tr>` : '');
    };
    const summe = (id, label, wert) => tool
      ? `<tr class="summe"><td>${label}</td><td class="r kd">${eur(kdS[id]())}</td><td class="r" id="hh-${id}">${eur(wert)}</td></tr>`
      : `<tr class="summe"><td>${label}</td><td class="r kd">${eur(kdS[id]())}</td><td class="eingabe"><input class="eur" inputmode="decimal" data-k="hh.w.${id}" value="${esc(h.w[id] || '')}" placeholder="selbst rechnen" aria-label="${label}"></td><td class="urteil ${erg ? (erg.s[id] ? 'ok' : 'falsch') : ''}">${erg ? (erg.s[id] ? '✓' : '✗') : ''}</td></tr>`;
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
    return stationKopf('haushalt', 'Haushaltsrechnung', `${esc(k.vorname)} ${esc(k.name)} · monatliche Beträge in €`) + weiter('haushalt') +
      `<div class="karte"><div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between">
          <div class="umschalter" role="group" aria-label="Modus"><button class="${tool ? '' : 'aktiv'}" data-act="hh-modus" data-m="selbst">Selbst rechnen</button><button class="${tool ? 'aktiv' : ''}" data-act="hh-modus" data-m="tool" ${istFrei('haushalt-tool') ? '' : 'disabled title="noch nicht freigeschaltet"'}>Beratertool${istFrei('haushalt-tool') ? '' : ' 🔒'}</button></div>
          <a class="knopf hell klein-k" href="#/bank/richtlinie">Richtlinie Haushaltsrechnung</a></div>
        <p class="klein" style="margin:10px 0 0">${tool ? 'Das Beratertool rechnet für Sie. Probieren Sie aus, wie sich Änderungen auswirken.' : 'Links steht, was die Kundin in der Selbstauskunft angegeben hat. Rechts tragen Sie ein, was die Bank ansetzt: geprüft mit Gehaltsabrechnungen, Kontoumsätzen und Richtlinie. Rechnen Sie die Summen selbst aus. Das System kontrolliert nur.'}</p></div>
      <div class="karte eng"><div class="tabelle-wrap"><table class="rechen">
        <tr><th>Position</th><th class="r">Kunden&shy;angabe</th><th class="r">Bank&shy;ansatz in €</th>${tool ? '' : '<th></th>'}</tr>
        <tr class="gruppe"><td colspan="4">Einnahmen</td></tr>${z.filter(x => x.gruppe === 'ein').map(zeile).join('')}${summe('sumEin', 'Summe Einnahmen', r.ein)}
        <tr class="gruppe"><td colspan="4">Ausgaben</td></tr>${z.filter(x => x.gruppe === 'aus').map(zeile).join('')}${summe('sumAus', 'Summe Ausgaben', r.aus)}
        ${summe('frei', 'Frei verfügbares Einkommen', r.frei)}</table></div></div>
      <div class="knopfreihe" style="margin:0 0 14px">${tool ? (h.fertig ? '' : '<button class="knopf" data-act="hh-abschluss">Haushaltsrechnung abschließen</button>') : '<button class="knopf" data-act="hh-pruefen">Eingaben prüfen</button>'}</div>${fazit}${toolFazit}
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
    h.erg = erg; h.fertig = erg.fertig;
  }
  function hhDruck() {
    const k = kunde(), h = st.hh, z = k.haushalt.zeilen, r = hhRechnen(k), tool = h.modus === 'tool' && istFrei('haushalt-tool');
    const kd = x => (x.sa || []).reduce((a, f) => a + zahl0(st.sa[f]), 0), kdSum = g => z.filter(x => x.gruppe === g).reduce((a, x) => a + kd(x), 0);
    const kdS = { sumEin: kdSum('ein'), sumAus: kdSum('aus'), frei: kdSum('ein') - kdSum('aus') };
    const zl = x => `<tr><td>${esc(x.label)}</td><td class="r">${(x.sa || []).some(f => String(st.sa[f] || '').trim()) ? eur(kd(x)) : '–'}</td><td class="r">${(h.w[x.id] || '').trim() ? eur(zahl0(h.w[x.id])) : '–'}</td></tr>`;
    const s = (id, l, wert) => `<tr class="summe"><td>${l}</td><td class="r">${eur(kdS[id])}</td><td class="r">${tool ? eur(wert) : ((h.w[id] || '').trim() ? eur(zahl0(h.w[id])) : '')}</td></tr>`;
    const rate = zahl(h.w.rate);
    drucken('Haushaltsrechnung', `${k.vorname} ${k.name} · Kundennr. ${k.kundennr} · Modus: ${tool ? 'Beratertool' : 'Selbst rechnen'}${h.erg && h.erg.fertig && !tool ? ' · vom System geprüft: alle Positionen richtig' : ''}`,
      `<table><tr><th>Position</th><th class="r">Kundenangabe</th><th class="r">Bankansatz</th></tr><tr class="gruppe"><td colspan="3"><b>Einnahmen</b></td></tr>${z.filter(x => x.gruppe === 'ein').map(zl).join('')}${s('sumEin', 'Summe Einnahmen', r.ein)}
        <tr class="gruppe"><td colspan="3"><b>Ausgaben</b></td></tr>${z.filter(x => x.gruppe === 'aus').map(zl).join('')}${s('sumAus', 'Summe Ausgaben', r.aus)}${s('frei', 'Frei verfügbares Einkommen', r.frei)}
        ${tool && !isNaN(rate) ? `<tr><td>Geplante Kreditrate</td><td></td><td class="r">${eur(rate)}</td></tr><tr class="summe"><td>Überschuss nach neuer Rate</td><td></td><td class="r">${eur(r.frei - rate)}</td></tr>` : ''}</table>` + notizBlock(h.notiz));
  }

  /* ----------------------------------------------------------- Kreditrechner */
  function vRechner(k, spielwiese) {
    const kk = D.konditionen.kredit;
    if (spielwiese && !istFrei('rechner-tool')) return titel('Kreditrechner', 'Spielwiese zum freien Ausprobieren') + sperre('Kreditrechner (Spielwiese)');
    const s = spielwiese ? st.sp : st.re;
    if (s.betrag == null) { s.betrag = spielwiese ? '10000' : (st.sa.kreditbetrag || '12500'); s.laufzeit = spielwiese ? '60' : (st.sa.laufzeit || '48'); s.rk = 'B'; s.auto = !spielwiese; }
    const tool = spielwiese || (s.modus === 'tool' && istFrei('rechner-tool'));
    const betrag = zahl(s.betrag), lz = zahl(s.laufzeit), rk = kk.risikoklassen.find(x => x.rk === s.rk) || kk.risikoklassen[1];
    const zins = rund(rk.sollzins - (s.auto ? kk.autoAbschlag : 0)), gueltig = betrag > 0 && lz >= 1 && lz <= 600 && lz % 1 === 0;
    const tp = gueltig ? tilgungsplan(betrag, zins, lz) : null;
    const hr = hhRechnen(kunde()), freiBekannt = !spielwiese && hr.frei > 0 && istFrei('haushalt');
    let ergebnis = '';
    const uebKnopf = spielwiese ? '' : (s.ueb ? `<div class="hinweis ok" style="margin-top:12px"><div><b>In den Antrag übernommen:</b> ${eur(s.ueb.betrag)} · ${s.ueb.lz} Monate · Rate ${eur(s.ueb.rate)}</div></div>`
      : '<button class="knopf" data-act="re-ueb">In den Antrag übernehmen</button>');
    if (tp && tool) {
      ergebnis = `<div class="karte"><h2>Ergebnis</h2><div class="kacheln vier"><div class="kachel"><b>${eur(tp.rate)}</b><span>Monatsrate</span></div><div class="kachel"><b>${eur(tp.zinsSumme)}</b><span>Zinsen gesamt</span></div>
          <div class="kachel"><b>${eur(tp.gesamt)}</b><span>Gesamtbetrag</span></div><div class="kachel"><b>${proz(tp.eff)}</b><span>effektiver Jahreszins</span></div></div>
          ${freiBekannt ? `<div style="margin-top:12px">${hhAmpel(hr.frei, tp.rate)}</div>` : ''}
          <details class="tp" style="margin-top:10px" ${s.tpAuf ? 'open' : ''}><summary>Tilgungsplan anzeigen (${tp.zeilen.length} Raten)</summary><div class="tabelle-wrap">${tpTabelle(tp)}</div></details>
          ${s.ueb && !spielwiese ? uebKnopf : ''}<div class="knopfreihe">${s.ueb || spielwiese ? '' : uebKnopf}<button class="knopf hell" data-act="druck-tp" data-sp="${spielwiese ? 1 : ''}">${icon('druck')} Tilgungsplan drucken / als PDF</button></div></div>`;
    } else if (tp) {
      const e = s.erg;
      ergebnis = `<div class="karte"><h2>Ihre Berechnung</h2><p class="klein">Berechnen Sie die Monatsrate (Annuität) auf Ihrem Arbeitsblatt und tragen Sie sie ein. Das System kontrolliert nur.</p>
        <label class="feld" style="max-width:260px"><span>Monatsrate in €</span><input class="eur" inputmode="decimal" data-k="re.rate" value="${esc(s.rate || '')}" placeholder="0,00"></label>
        <div class="knopfreihe"><button class="knopf" data-act="re-pruefen">Rate prüfen</button></div>
        ${e ? `<div style="margin-top:12px" id="ergebnis">${e.ok ? `<div class="hinweis ok"><div><b>Richtig:</b> Die Monatsrate beträgt ${eur(tp.rate)}.</div></div>${s.ueb ? uebKnopf : `<div class="knopfreihe">${uebKnopf}</div>`}` :
          `<div class="hinweis warn"><div><b>${s.versuche > 1 ? 'Lösungsweg' : 'Denkanstoß'}:</b> ${s.versuche > 1
            ? `Monatszins i = ${proz(zins)} : 12 = ${proz(zins / 12, 4)}. Rate = Kreditbetrag × i : (1 − (1 + i)<sup>−${lz}</sup>). Setzen Sie ${eur(betrag)} ein.`
            : 'Die Rate bleibt über die Laufzeit gleich. Rechnen Sie mit dem Monatszins (Jahreszins geteilt durch 12) und der Laufzeit in Monaten.'}</div></div>`}</div>` : ''}</div>`;
    }
    const kopf = spielwiese ? titel('Kreditrechner', 'Spielwiese zum freien Ausprobieren, ohne Kundenbezug') : stationKopf('rechner', 'Kreditrechner und Tilgungsplan', `${esc(k.vorname)} ${esc(k.name)} · SchlossKredit`) + weiter('rechner');
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
  const BANK_REITER = [['', 'Profil'], ['team', 'Team und Kompetenzen'], ['konditionen', 'Konditionen'], ['handbuch', 'Beraterhandbuch'], ['glossar', 'Glossar']];
  const rkTabelle = () => `<div class="tabelle-wrap"><table><tr><th>Risikoklasse</th><th>Bonität</th><th class="r">Sollzins p. a.</th><th class="r">eff. Jahreszins</th></tr>${D.konditionen.kredit.risikoklassen.map(r => `<tr><td><b>${r.rk}</b></td><td>${esc(r.text)}</td><td class="r">${proz(r.sollzins)}</td><td class="r">${proz((Math.pow(1 + r.sollzins / 1200, 12) - 1) * 100)}</td></tr>`).join('')}</table></div>`;
  const kompTabelle = () => `<div class="tabelle-wrap"><table><tr><th>Kreditbetrag</th><th>Risikoklasse</th><th>Entscheidung</th></tr>${D.kompetenz.tabelle.map(z => `<tr>${z.map(x => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</table></div>`;
  const hbKapitel = k => k.abschnitte.map(a => `<h3 class="hb">${esc(a.t)}</h3>${(a.p || []).map(x => `<p>${esc(x)}</p>`).join('')}${a.liste ? `<ul class="hb">${a.liste.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    ${a.tabelle === 'richtlinie' ? `<ol class="hb">${D.richtlinie.punkte.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : a.tabelle === 'kompetenz' ? kompTabelle() : a.tabelle === 'konditionen' ? rkTabelle() : ''}`).join('');
  function vHandbuch(kap, immer) {
    const k = D.handbuch.find(x => x.id === kap && (immer || offenAb(x.ab)));
    if (k) return `<a class="zurueck" href="#/bank/handbuch">‹ Beraterhandbuch</a><div class="karte"><h2>${D.handbuch.indexOf(k) + 1} ${esc(k.titel)}</h2>${hbKapitel(k)}
      <div class="knopfreihe"><button class="knopf hell" data-act="druck-hb" data-id="${k.id}">${icon('druck')} Drucken / als PDF</button>${T.themen.some(t => t.id === k.id && offenAb(t.ab)) ? `<a class="knopf hell" href="#/training/${k.id}">Dazu üben</a>` : ''}</div></div>`;
    return `<div class="karte eng"><ul class="liste">${D.handbuch.map((x, i) => offenAb(x.ab)
      ? `<li><a class="station" href="#/bank/handbuch/${x.id}"><span class="nr">${i + 1}</span><span class="mitte" style="flex:1"><b>${esc(x.titel)}</b><br><span class="klein">${x.abschnitte.map(a => esc(a.t)).join(' · ')}</span></span><span class="pfeil">${icon('pfeil')}</span></a></li>`
      : `<li><a class="station zu"><span class="nr">${icon('schloss')}</span><span class="mitte" style="flex:1"><b>${esc(x.titel)}</b><br><span class="klein">erscheint am ${datum(x.ab)}</span></span></a></li>`).join('')}</ul></div>
      <p class="klein">Das Beraterhandbuch wächst mit Ihrer Arbeit: Neue Kapitel erscheinen automatisch.</p>`;
  }
  function vBank(tab, arg) {
    const immer = tab === 'richtlinie'; // Die Richtlinie ist aus der Haushaltsrechnung immer erreichbar
    if (immer) { tab = 'handbuch'; arg = 'haushalt'; }
    const b = D.bank, kk = D.konditionen;
    let inhalt = '';
    if (!tab) inhalt = `<div class="karte">${b.profil.map(p => `<p>${esc(p)}</p>`).join('')}<div class="kacheln vier" style="margin-top:6px">${b.zahlen.map(([z, l]) => `<div class="kachel"><b>${esc(z)}</b><span>${esc(l)}</span></div>`).join('')}</div></div>
      <div class="raster zwei"><div class="karte"><h2>Auf einen Blick</h2>${paare(b.steckbrief)}</div><div class="karte"><h2>Vorstand</h2>${paare(b.vorstand)}</div></div>
      <div class="karte"><h2>Leitbild: ${esc(b.slogan)}</h2><div class="raster zwei" style="margin:0">${b.werte.map(([w, t]) => `<div><b>${esc(w)}</b><br><span class="klein">${esc(t)}</span></div>`).join('')}</div></div>`;
    else if (tab === 'team') inhalt = `<div class="karte"><h2>Kompetenzregelung Ratenkredit</h2>${kompTabelle()}
        <p class="klein" style="margin:10px 0 0">Das System prüft diese Grenzen automatisch und meldet, wenn Ihre Kompetenz überschritten ist.</p></div>
      <div class="karte"><h2>Ablauf Ratenkredit</h2><ol style="margin:0;padding-left:22px">${b.ablauf.map(a => `<li>${esc(a)}</li>`).join('')}</ol></div>
      <div class="karte eng"><h2 style="padding:16px 16px 4px">Ansprechpartner im Kreditgeschäft</h2><ul class="liste">${b.ansprechpartner.map(([n, f, a]) => `<li><div class="zeile" style="align-items:flex-start"><span class="mitte"><b>${esc(n)}</b><span style="white-space:normal">${esc(f)} · ${esc(a)}</span></span></div></li>`).join('')}</ul></div>`;
    else if (tab === 'konditionen') inhalt = `<div class="karte"><h2>Konten, Überziehung und Sparen</h2><p class="klein">Stand ${esc(kk.stand)}</p><div class="tabelle-wrap"><table><tr><th>Produkt</th><th>Konditionen</th></tr>${kk.konten.map(z => `<tr><td>${esc(z[0])}</td><td>${esc(z[1])}</td></tr>`).join('')}</table></div></div>
      <div class="karte"><h2>SchlossKredit (Ratenkredit)</h2><p class="klein">${eur(kk.kredit.minBetrag)} bis ${eur(kk.kredit.maxBetrag)}, ${kk.kredit.minLaufzeit} bis ${kk.kredit.maxLaufzeit} Monate, gebundener Sollzins, kostenlose Sondertilgungen</p>
        <div class="tabelle-wrap"><table><tr><th>Risikoklasse</th><th>Bonität</th><th class="r">Sollzins p. a.</th><th class="r">eff. Jahreszins</th></tr>${kk.kredit.risikoklassen.map(r => `<tr><td><b>${r.rk}</b></td><td>${esc(r.text)}</td><td class="r">${proz(r.sollzins)}</td><td class="r">${proz((Math.pow(1 + r.sollzins / 1200, 12) - 1) * 100)}</td></tr>`).join('')}</table></div>
        <p style="margin:12px 0 6px"><b>SchlossKredit Auto:</b> ${proz(kk.kredit.autoAbschlag, 1)}-Punkte günstiger bei Sicherungsübereignung des Fahrzeugs.</p><p class="klein" style="margin:0">${esc(kk.kredit.beispiel)} Die Restschuldversicherung ist freiwillig und keine Voraussetzung für den Kredit.</p></div>`;
    else if (tab === 'handbuch') inhalt = vHandbuch(arg, immer);
    else if (tab === 'glossar') inhalt = `<div class="karte"><div class="knopfreihe" style="margin:0 0 14px"><a class="knopf" href="#/training/karten">Begriffe üben</a></div>${D.glossar.map(([w, t]) => `<p><b>${esc(w)}</b><br>${esc(t)}</p>`).join('')}</div>`;
    return titel('Unsere Bank', esc(b.name)) + `<nav class="reiter">${BANK_REITER.map(([id, t]) => `<a href="#/bank${id ? '/' + id : ''}" class="${(tab || '') === id ? 'aktiv' : ''}">${t}</a>`).join('')}</nav>` + inhalt;
  }

  /* ---------------------------------------------------------------- Training */
  const T = window.SB_TRAINING || { themen: [] };
  const heuteISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  function offenAb(ab) { return st.lehrkraft || !ab || heuteISO() >= ab; }
  const themaOffen = id => { const t = T.themen.find(x => x.id === id); return !t || offenAb(t.ab); };
  const aufgId = (t, i) => t.id + '.' + i;
  const geloest = t => t.aufgaben.filter((a, i) => st.tr[aufgId(t, i)] === 'ok').length;
  // Nummer einer Aufgabe: „2.3“ oder „2.A Teil 1“ für die Abschlussaufgabe
  function aufgNr(t, i) {
    const n = T.themen.indexOf(t) + 1, a = t.aufgaben[i];
    return a.abschluss ? `${n}.A Teil ${t.aufgaben.slice(0, i + 1).filter(x => x.abschluss).length}` : `${n}.${t.aufgaben.slice(0, i + 1).filter(x => !x.abschluss).length}`;
  }
  const TYP = { wahl: 'Auswahl', zahl: 'Rechnen', offen: 'Freie Antwort' };
  const balken = (x, n) => `<div class="balken" role="img" aria-label="${x} von ${n} gelöst"><span style="width:${n ? Math.round(x / n * 100) : 0}%"></span></div>`;

  function vTraining(a, b) {
    if (a === 'karten') return vKarten();
    const t = T.themen.find(x => x.id === a);
    if (t && !offenAb(t.ab)) return `<a class="zurueck" href="#/training">‹ Training</a><div class="karte sperre">${icon('schloss')}<h2>${esc(t.titel)}</h2><p class="klein">Dieses Thema öffnet sich am ${datum(t.ab)}.</p></div>`;
    if (t && b && t.aufgaben[+b - 1]) return vAufgabe(t, +b - 1);
    if (t) {
      const zeile = (x, i) => `<li><a class="station" href="#/training/${t.id}/${i + 1}"><span class="nr ${st.tr[aufgId(t, i)] === 'ok' ? 'fertig' : ''}">${st.tr[aufgId(t, i)] === 'ok' ? '✓' : esc(aufgNr(t, i).split(' ')[0].split('.')[1])}</span>
        <span class="mitte" style="flex:1"><b>Aufgabe ${esc(aufgNr(t, i))}</b><br><span class="klein">${TYP[x.typ]} · ${esc(x.frage.replace(/^Teil \d: /, ''))}</span></span><span class="pfeil">${icon('pfeil')}</span></a></li>`;
      const idx = t.aufgaben.map((x, i) => i);
      return `<a class="zurueck" href="#/training">‹ Training</a>` + titel(`${T.themen.indexOf(t) + 1} ${t.titel}`, `${geloest(t)} von ${t.aufgaben.length} Aufgaben gelöst`) +
        `<div class="karte eng"><ul class="liste">${idx.filter(i => !t.aufgaben[i].abschluss).map(i => zeile(t.aufgaben[i], i)).join('')}</ul></div>
        <div class="karte eng"><h2 style="padding:16px 16px 4px">Abschlussaufgabe</h2><p class="klein" style="padding:0 16px">Ein zusammenhängender Fall zum ganzen Thema.</p><ul class="liste">${idx.filter(i => t.aufgaben[i].abschluss).map(i => zeile(t.aufgaben[i], i)).join('')}</ul></div>
        <div class="knopfreihe">${D.handbuch.some(h => h.id === t.id && offenAb(h.ab)) ? `<a class="knopf hell" href="#/bank/handbuch/${t.id}">Im Beraterhandbuch nachlesen</a>` : ''}<button class="knopf hell" data-act="tr-reset" data-id="${t.id}">Thema von vorn beginnen</button></div>`;
    }
    const karten = D.glossar.filter(g => !g[2] || themaOffen(g[2]));
    return titel('Training', 'Üben ohne Zeitdruck, unabhängig vom Fall Keller') + `
      <div class="karte"><p>Hier üben Sie mit anderen Kundinnen und Kunden, was Sie in der Kreditberatung brauchen. Die Aufgaben sind freiwillig. Zu jeder Aufgabe gibt es zwei Hilfen und eine Musterlösung. Ihr Fortschritt bleibt nur auf diesem Gerät.</p>
        <div class="knopfreihe"><button class="knopf" data-act="tr-zufall">Zufällige Aufgabe</button><a class="knopf hell" href="#/training/karten">Begriffe üben${karten.length ? ` (${karten.length} Karteikarten)` : ''}</a></div></div>
      <div class="karte eng"><ul class="liste">${T.themen.map((x, i) => offenAb(x.ab)
        ? `<li><a class="station" href="#/training/${x.id}"><span class="nr ${geloest(x) === x.aufgaben.length ? 'fertig' : ''}">${geloest(x) === x.aufgaben.length ? '✓' : i + 1}</span><span class="mitte" style="flex:1"><b>${esc(x.titel)}</b><br><span class="klein">${geloest(x)} von ${x.aufgaben.length} Aufgaben gelöst</span>${balken(geloest(x), x.aufgaben.length)}</span><span class="pfeil">${icon('pfeil')}</span></a></li>`
        : `<li><a class="station zu"><span class="nr">${icon('schloss')}</span><span class="mitte" style="flex:1"><b>${esc(x.titel)}</b><br><span class="klein">öffnet sich am ${datum(x.ab)}</span></span></a></li>`).join('')}</ul></div>`;
  }

  function vAufgabe(t, i) {
    const a = t.aufgaben[i], id = aufgId(t, i);
    if (st.ta.id !== id) st.ta = { id, stufe: 0 };
    const v = st.ta, ok = st.tr[id] === 'ok', n = t.aufgaben.length;
    let eingabe;
    if (a.typ === 'wahl') eingabe = a.wahl.map((w, j) => `<label class="haken-zeile"><input type="radio" name="wahl" data-k="ta.wahl" value="${j + 1}" ${String(v.wahl) === String(j + 1) ? 'checked' : ''}><span><b>${j + 1}</b>&nbsp; ${esc(w)}</span></label>`).join('');
    else if (a.typ === 'zahl') eingabe = `<label class="feld" style="max-width:260px"><span>Ihr Ergebnis in ${a.einheit}</span><input class="eur" inputmode="decimal" data-k="ta.wert" value="${esc(v.wert || '')}" placeholder="${a.einheit === '%' ? '0,00' : '0,00'}" autocomplete="off"></label>`;
    else eingabe = `<textarea data-k="ta.text" placeholder="Notieren Sie Ihre Antwort, bevor Sie die Musterlösung ansehen.">${esc(v.text || '')}</textarea>`;
    const hilfen = (v.stufe >= 1 ? `<div class="hinweis warn"><div><b>Denkanstoß:</b> ${esc(a.hilfe[0])}</div></div>` : '') + (v.stufe >= 2 ? `<div class="hinweis warn"><div><b>Lösungsweg:</b> ${esc(a.hilfe[1])}</div></div>` : '') +
      (v.stufe >= 3 ? `<div class="hinweis"><div><b>Musterlösung:</b> ${esc(a.loesung)}</div></div>` : '');
    const urteil = v.erg === true ? `<div class="hinweis ok"><div><b>Richtig.</b> ${esc(a.loesung)}</div></div>` : v.erg === false ? '<div class="hinweis fehler"><div>Das stimmt noch nicht. Versuchen Sie es noch einmal oder holen Sie sich eine Hilfe.</div></div>' : '';
    const HILFE = ['Hilfe 1: Denkanstoß', 'Hilfe 2: Lösungsweg', 'Musterlösung zeigen'];
    return `<a class="zurueck" href="#/training/${t.id}">‹ ${esc(t.titel)}</a>` + titel(`Aufgabe ${aufgNr(t, i)}`, `${esc(t.titel)} · ${TYP[a.typ]}`, ok ? '<span class="marke gruen">✓ gelöst</span>' : '') + `
      <div class="karte"><h2>Situation</h2><p style="margin:0">${esc(a.fall)}</p>${t.hausregeln ? `<p class="klein" style="margin:10px 0 0">${esc(T.hausregeln)}</p>` : ''}</div>
      <div class="karte"><h2>${esc(a.frage)}</h2>${eingabe}
        <div class="knopfreihe">${a.typ === 'offen' ? '' : '<button class="knopf" data-act="tr-pruefen">Antwort prüfen</button>'}${v.stufe < 3 && v.erg !== true ? `<button class="knopf hell" data-act="tr-hilfe">${HILFE[v.stufe]}</button>` : ''}</div>
        <div id="ergebnis" style="margin-top:14px">${urteil}${v.erg === true ? '' : hilfen}</div>
        ${a.typ === 'offen' && v.stufe >= 3 ? `<p style="margin:14px 0 0"><b>Vergleichen Sie mit Ihrer Antwort:</b></p><div class="knopfreihe" style="margin-top:8px"><button class="knopf ${ok ? '' : 'hell'}" data-act="tr-selbst" data-ok="1">Das hatte ich im Kern</button><button class="knopf hell" data-act="tr-selbst">Noch nicht, später noch einmal</button></div>` : ''}</div>
      <div class="knopfreihe" style="justify-content:space-between">${i > 0 ? `<a class="knopf hell" href="#/training/${t.id}/${i}">‹ Vorige</a>` : '<span></span>'}${i < n - 1 ? `<a class="knopf ${ok ? '' : 'hell'}" href="#/training/${t.id}/${i + 2}">Nächste ›</a>` : `<a class="knopf ${ok ? '' : 'hell'}" href="#/training/${t.id}">Zur Übersicht</a>`}</div>`;
  }

  /* -------------------------------------------------------------- Karteikarten */
  function vKarten() {
    const karten = D.glossar.filter(g => !g[2] || themaOffen(g[2])), q = st.kq, offen = karten.filter(g => st.kk[g[0]] !== 'ok');
    const kopf = `<a class="zurueck" href="#/training">‹ Training</a>` + titel('Begriffe üben', `${karten.length - offen.length} von ${karten.length} Begriffen gewusst`) +
      `<div class="umschalter" role="group" aria-label="Richtung" style="margin-bottom:14px"><button class="${q.rueck ? '' : 'aktiv'}" data-act="kk-richtung">Begriff → Erklärung</button><button class="${q.rueck ? 'aktiv' : ''}" data-act="kk-richtung" data-r="1">Erklärung → Begriff</button></div>${balken(karten.length - offen.length, karten.length)}`;
    const erstes = T.themen.map(t => t.ab).sort()[0];
    if (!karten.length) return `<a class="zurueck" href="#/training">‹ Training</a>` + titel('Begriffe üben') + `<div class="karte sperre">${icon('schloss')}<h2>Noch keine Karteikarten</h2><p class="klein">Die ersten Begriffe erscheinen am ${datum(erstes)}, sobald das erste Thema geöffnet ist.</p></div>`;
    if (!offen.length) return kopf + `<div class="karte sperre" style="margin-top:14px"><h2>Alle ${karten.length} Begriffe gewusst</h2><p class="klein">Neue Begriffe kommen dazu, sobald ein neues Thema geöffnet ist.</p><div class="knopfreihe" style="justify-content:center"><button class="knopf" data-act="kk-neu">Noch einmal von vorn</button><a class="knopf hell" href="#/bank/glossar">Zum Glossar</a></div></div>`;
    let k = offen.find(g => g[0] === q.i); if (!k) { k = offen[0]; q.i = k[0]; q.auf = false; }
    const vorn = q.rueck ? k[1] : k[0], hinten = q.rueck ? k[0] : k[1];
    return kopf + `<button class="lernkarte ${q.auf ? 'auf' : ''}" data-act="kk-dreh" style="margin-top:14px"><span class="klein">${q.rueck ? 'Welcher Begriff ist gemeint?' : 'Was bedeutet dieser Begriff?'}</span><b class="${q.rueck ? 'lang' : ''}">${esc(vorn)}</b>
        ${q.auf ? `<span class="rueck ${q.rueck ? 'kurz' : ''}">${esc(hinten)}</span>` : '<span class="klein">Antippen zum Umdrehen</span>'}</button>
      ${q.auf ? '<div class="knopfreihe" style="justify-content:center"><button class="knopf" data-act="kk-ok">Wusste ich</button><button class="knopf hell" data-act="kk-nochmal">Nochmal</button></div>' : ''}
      <p class="klein" style="text-align:center;margin-top:14px">Noch ${offen.length} ${offen.length === 1 ? 'Karte' : 'Karten'} im Stapel. „Nochmal“ legt die Karte ans Ende.</p>`;
  }

  /* -------------------------------------------------- Lehrkraft, Einstellungen */
  function vKonto() {
    return titel('Mein Gerät', `Angemeldet als ${esc(st.kuerzel)}`) + `
      <div class="karte"><h2>Freigeschaltete Funktionen</h2>${D.freischaltungen.map(f => `<div class="zeile" style="padding:8px 0;min-height:0"><span class="mitte"><b>${esc(f.titel)}</b></span>${f.frei.every(x => istFrei(x)) ? '<span class="marke gruen">offen</span>' : '<span class="marke">gesperrt</span>'}</div>`).join('')}
        <form class="codezeile" style="margin-left:0" data-form="code"><input name="code" autocomplete="off" autocapitalize="characters" placeholder="Freischaltcode" aria-label="Freischaltcode"><button class="knopf">Öffnen</button></form></div>
      <div class="karte"><h2>Datenschutz</h2><p class="klein">Diese Plattform überträgt keine Daten. Alles, was Sie eingeben, bleibt im Browser dieses Geräts und kann von niemandem eingesehen werden, auch nicht von Ihrer Lehrkraft. Sichern Sie Ihre Ergebnisse deshalb über „Drucken / als PDF“. Geben Sie keine echten Namen oder Kundendaten ein.</p>
        <div class="knopfreihe"><button class="knopf hell" data-act="abmelden">Kürzel ändern</button></div></div>
      <div class="karte"><h2>Arbeitsstand sichern</h2><p class="klein">Ihr Arbeitsstand liegt nur auf diesem Gerät. Mit einer Sicherungsdatei bewahren Sie ihn auf oder nehmen ihn auf ein anderes Gerät mit. Die Datei enthält Ihre Eingaben und Freischaltungen.</p>
        <p class="klein">Tipp für iPad und iPhone: Legen Sie die Plattform über „Teilen“ und „Zum Home-Bildschirm“ ab. Sonst kann Safari die Eingaben löschen, wenn die Seite einige Tage nicht geöffnet wird.</p>
        <div class="knopfreihe"><button class="knopf" data-act="datei-speichern">Sicherungsdatei speichern</button><label class="knopf hell">Sicherungsdatei laden<input type="file" accept=".json,application/json" data-datei="1" hidden></label></div></div>
      <div class="karte"><h2>Gerät freigeben</h2><p class="klein">Für Geräte, die nach Ihnen andere nutzen: Das Abmelden löscht Kürzel, Eingaben und Freischaltungen auf diesem Gerät. Sichern Sie vorher Ihre Ergebnisse als PDF oder als Sicherungsdatei.</p>
        <div class="knopfreihe"><button class="knopf hell" data-act="reset">Abmelden und Gerät freigeben</button></div></div>
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
    else if (a === 'bank') inhalt = vBank(b, c);
    else if (a === 'training') inhalt = vTraining(b, c);
    else if (a === 'rechner') { inhalt = vRechner(kunde(), true); aktiv = 'antrag'; }
    else if (a === 'konto') { inhalt = vKonto(); aktiv = ''; }
    else { inhalt = vStart(); aktiv = 'start'; }
    const u = ungelesen();
    const nav = [['start', '#/', 'Arbeitsplatz', 'start'], ['post', '#/post', 'Posteingang', 'post'], ['kunde', '#/kunde/sophie', 'Kundin', 'kunde'], ['antrag', '#/antrag/sophie', 'Kreditantrag', 'antrag'], ['bank', '#/bank', 'Unsere Bank', 'bank'], ['training', '#/training', 'Training', 'training']];
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
    setze(k, el.type === 'checkbox' ? el.checked : el.dataset.bool ? !!el.value : el.value);
    if (k.startsWith('sa.')) st.saGeprueft = false;
    if (k.startsWith('hh.w.') && !el.dataset.live) st.hh.erg = null;
    if (k.startsWith('hh.w.') && k !== 'hh.w.rate') st.hh.fertig = false;
    if (k.startsWith('re.') && k !== 're.notiz') st.re.erg = null;
    if (k.startsWith('re.') && k !== 're.notiz' && k !== 're.rate') st.re.ueb = null;
    if (k.startsWith('votum.')) st.votum.meld = null;
    if (k === 'ta.wahl' || k === 'ta.wert') st.ta.erg = null;
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
  $app.addEventListener('change', e => {
    const el = e.target; if (!el.dataset || !el.dataset.datei || !el.files[0]) return;
    const leser = new FileReader();
    leser.onload = () => {
      try {
        const d = JSON.parse(leser.result);
        if (d.app !== 'schlossbank-kreditplattform' || !d.stand) throw new Error('fremd');
        if (confirm('Sicherungsdatei laden? Der jetzige Arbeitsstand auf diesem Gerät wird ersetzt.')) {
          const lk = st.lehrkraft; st = Object.assign(LEER(), d.stand, { lehrkraft: lk }); sichern();
          meldung = { ok: true, text: `Arbeitsstand geladen (Kürzel ${st.kuerzel}, gesichert am ${new Date(d.gesichert).toLocaleDateString('de-DE')}).` };
        }
      } catch (x) { meldung = { ok: false, text: 'Diese Datei ist keine Sicherungsdatei der Kreditplattform.' }; }
      neu(true);
    };
    leser.readAsText(el.files[0]);
  });
  function dateiSpeichern() {
    const kopie = JSON.parse(JSON.stringify(st)); kopie.lehrkraft = false;
    Object.keys(kopie).filter(x => x[0] === '_').forEach(x => delete kopie[x]);
    const text = JSON.stringify({ app: 'schlossbank-kreditplattform', version: D.version, gesichert: new Date().toISOString(), stand: kopie });
    const name = `Kreditplattform_${st.kuerzel}_${new Date().toISOString().slice(0, 10)}.json`;
    let datei; try { datei = new File([text], name, { type: 'application/json' }); } catch (x) { datei = null; }
    // Auf iPad und iPhone über das Teilen-Menü (z. B. „In Dateien sichern“), sonst als Download
    if (datei && navigator.maxTouchPoints > 1 && navigator.canShare && navigator.canShare({ files: [datei] })) { navigator.share({ files: [datei], title: name }).catch(() => { /* abgebrochen */ }); return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' })); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  }
  $app.addEventListener('toggle', e => { if (e.target.matches && e.target.matches('details.tp')) { (location.hash.includes('antrag') ? st.re : st.sp).tpAuf = e.target.open; sichern(); } }, true);
  $app.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const a = el.dataset.act, k = kunde();
    if (a === 'hh-modus') { st.hh.modus = el.dataset.m; sichern(); neu(); }
    else if (a === 're-modus') { st.re.modus = el.dataset.m; sichern(); neu(); }
    else if (a === 'hh-pruefen') { hhPruefen(); sichern(); neu(); zumErgebnis(); }
    else if (a === 'hh-leer') { if (confirm('Alle Eingaben der Haushaltsrechnung leeren?')) { st.hh = Object.assign(LEER().hh, { modus: st.hh.modus }); sichern(); neu(); } }
    else if (a === 'hh-abschluss') {
      const z = k.haushalt.zeilen, n = z.filter(x => Math.abs(zahl0(st.hh.w[x.id]) - x.soll) < 0.005).length;
      st.hh.fertig = n === z.length; sichern();
      meldung = st.hh.fertig ? { ok: true, text: 'Haushaltsrechnung abgeschlossen: Alle Positionen stimmen mit Unterlagen und Richtlinie überein.' }
        : { ok: false, text: `${z.length - n} von ${z.length} Positionen weichen noch von den Unterlagen oder der Richtlinie ab. Prüfen Sie den Bankansatz.` };
      neu(true);
    }
    else if (a === 'antrag-kunde') { st.antrag.kunde = !el.dataset.weg; if (el.dataset.weg) st.antrag.produkt = ''; sichern(); neu(); }
    else if (a === 'antrag-produkt') {
      const p = D.produkte.find(x => x.id === el.dataset.id);
      if (p.gesperrt) { meldung = { ok: false, text: `Systemmeldung: ${p.name} kann von Ihnen nicht angelegt werden. ${p.gesperrt}.` }; neu(true); }
      else { st.antrag.produkt = p.id; sichern(); neu(); }
    }
    else if (a === 'antrag-anlegen') { st.antrag.angelegt = true; sichern(); meldung = { ok: true, text: `Kreditantrag ${D.antragsnummer} ist angelegt.` }; neu(true); }
    else if (a === 'antrag-neu') { if (confirm('Antrag verwerfen? Ihre Eingaben in den Stationen bleiben erhalten.')) { st.antrag = {}; sichern(); neu(true); } }
    else if (a === 'ak-abrufen') {
      if (!st.ak.hinweis) meldung = { ok: false, text: 'Systemmeldung: Ohne Information der Kundin darf keine Auskunft abgerufen werden. Bestätigen Sie zuerst den Hinweis.' };
      else { st.ak.abgerufen = true; sichern(); }
      neu(true);
    }
    else if (a === 're-ueb') { st.re.ueb = uebernahme(); sichern(); neu(); }
    else if (a === 'votum-abgeben') {
      const p = votumPruefung(k);
      if (p.m.length) st.votum.meld = p.m; else { st.votum.meld = null; st.votum.abgegeben = true; st.votum.zweit = p.zweit; st.votum.datum = new Date().toLocaleDateString('de-DE'); }
      sichern(); neu(); zumErgebnis();
    }
    else if (a === 'votum-zurueck') { st.votum.abgegeben = false; sichern(); neu(); }
    else if (a === 'datei-speichern') dateiSpeichern();
    else if (a === 'tr-pruefen' || a === 'tr-hilfe' || a === 'tr-selbst') {
      const [tid, i] = st.ta.id.split('.'), auf = T.themen.find(x => x.id === tid).aufgaben[+i], v = st.ta;
      if (a === 'tr-hilfe') v.stufe = Math.min(3, (v.stufe || 0) + 1);
      else if (a === 'tr-selbst') { if (el.dataset.ok) st.tr[v.id] = 'ok'; else delete st.tr[v.id]; }
      else {
        v.erg = auf.typ === 'wahl' ? +v.wahl === auf.richtig : Math.abs(zahl(v.wert) - auf.soll) <= (auf.tol || 0.05) + 1e-9;
        if (v.erg) st.tr[v.id] = 'ok';
      }
      sichern(); neu(); if (a !== 'tr-selbst') zumErgebnis();
    }
    else if (a === 'tr-zufall') {
      const pool = []; T.themen.filter(t => offenAb(t.ab)).forEach(t => t.aufgaben.forEach((x, i) => { if (st.tr[aufgId(t, i)] !== 'ok' && !x.abschluss) pool.push(`#/training/${t.id}/${i + 1}`); }));
      if (pool.length) location.hash = pool[Math.floor(Math.random() * pool.length)];
      else { meldung = { ok: true, text: 'Sie haben alle Aufgaben der geöffneten Themen gelöst. Offen sind höchstens noch Abschlussaufgaben.' }; neu(true); }
    }
    else if (a === 'tr-reset') { if (confirm('Fortschritt in diesem Thema löschen und von vorn beginnen?')) { Object.keys(st.tr).filter(x => x.startsWith(el.dataset.id + '.')).forEach(x => delete st.tr[x]); sichern(); neu(); } }
    else if (a === 'kk-dreh') { st.kq.auf = !st.kq.auf; sichern(); neu(); }
    else if (a === 'kk-richtung') { st.kq.rueck = !!el.dataset.r; st.kq.auf = false; sichern(); neu(); }
    else if (a === 'kk-neu') { st.kk = {}; st.kq.i = null; sichern(); neu(); }
    else if (a === 'kk-ok' || a === 'kk-nochmal') {
      const karten = D.glossar.filter(g => !g[2] || themaOffen(g[2])), pos = karten.findIndex(g => g[0] === st.kq.i);
      if (a === 'kk-ok') st.kk[st.kq.i] = 'ok';
      const rest = karten.slice(pos + 1).concat(karten.slice(0, pos + 1)).filter(g => st.kk[g[0]] !== 'ok');
      st.kq.i = rest.length ? rest[0][0] : null; st.kq.auf = false; sichern(); neu();
    }
    else if (a === 'druck-hb') { const h = D.handbuch.find(x => x.id === el.dataset.id); drucken(`${D.handbuch.indexOf(h) + 1} ${h.titel}`, 'Beraterhandbuch der Kreditberatung Privatkunden', hbKapitel(h)); }
    else if (a === 'druck-ak') drucken('Auskunft der Auskunftei (Muster)', `${k.vorname} ${k.name} · Kundennr. ${k.kundennr}`, auskunftHtml(k) + notizBlock(st.ak.notiz, 'Meine Auswertung'));
    else if (a === 'druck-votum') {
      const v = st.votum, e = VOTUM.find(x => x[0] === v.entscheidung);
      drucken('Kreditentscheidung (Votum)', `${k.vorname} ${k.name} · Kundennr. ${k.kundennr} · Kreditantrag ${D.antragsnummer}`,
        '<h2>Ergebnisse der Prüfung</h2>' + paare(votumDaten(k)) + notizBlock(v.persoenlich, 'Persönliche Kreditwürdigkeit') + notizBlock(v.wirtschaftlich, 'Wirtschaftliche (materielle) Kreditwürdigkeit') +
        `<h2>Entscheidung</h2><p><b>${e ? esc(e[1]) : '☐ zustimmen &nbsp; ☐ zustimmen mit Auflagen &nbsp; ☐ ablehnen &nbsp; ☐ zurück an die Kundin'}</b>${v.abgegeben ? ` · Votum abgegeben am ${esc(v.datum)}` : ' · Entwurf, noch nicht abgegeben'}</p>` +
        (v.auflagen ? notizBlock(v.auflagen, v.entscheidung === 'zurueck' ? 'Nachzureichen' : 'Auflagen') : '') + (v.abgegeben ? meldungenHtml([votumErgebnis(v)]) : ''));
    }
    else if (a === 'sa-pruefen') { st.saGeprueft = true; sichern(); neu(); zumErgebnis(); }
    else if (a === 're-pruefen') {
      const kk = D.konditionen.kredit, rk = kk.risikoklassen.find(x => x.rk === st.re.rk) || kk.risikoklassen[1];
      const tp = tilgungsplan(zahl(st.re.betrag), rund(rk.sollzins - (st.re.auto ? kk.autoAbschlag : 0)), zahl(st.re.laufzeit));
      const ok = Math.abs(zahl(st.re.rate) - tp.rate) <= 0.02; if (!ok) st.re.versuche = (st.re.versuche || 0) + 1;
      st.re.erg = { ok }; sichern(); neu(); zumErgebnis();
    }
    else if (a === 'notiz-weg') { if (confirm('Diesen Vermerk löschen?')) { st.notizen.splice(+el.dataset.i, 1); sichern(); neu(); } }
    else if (a === 'abmelden') { st.kuerzel = ''; sichern(); location.hash = '#/'; neu(true); }
    else if (a === 'reset') { if (confirm('Abmelden und Gerät freigeben? Alle Eingaben und Freischaltungen auf diesem Gerät werden gelöscht.')) { st = LEER(); sichern(); location.hash = '#/'; neu(true); } }
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
