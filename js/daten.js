/* ==========================================================================
   SCHLOSSBANK KREDITPLATTFORM – DATEN
   --------------------------------------------------------------------------
   In dieser Datei stehen alle Inhalte: Bank, Konditionen, Kundin, Umsätze,
   Nachrichten und Freischaltungen. Wer Zahlen oder Texte ändern möchte,
   ändert sie HIER. Der Programmcode (app.js) muss dafür nicht angefasst werden.

   Regeln beim Bearbeiten:
   - Beträge ohne Tausenderpunkt und mit Punkt als Komma schreiben: 2250.00
   - Datum immer als 'JJJJ-MM-TT' schreiben: '2026-11-10'
   - Texte stehen in 'einfachen' oder `schrägen` Anführungszeichen.
   - Alle Personen, Firmen und Zahlen sind frei erfunden.
   ========================================================================== */

window.SB = {

  version: '1.0.0',
  heute: '2026-11-11',            // „Systemdatum“ der Bank (Stand der Daten)

  /* ---------------------------------------------------------------- BANK */
  bank: {
    name: 'Schlossbank Aschaffenburg AG',
    system: 'SchlossBanking · Kernbanksystem',
    slogan: 'Klar beraten. Modern finanziert.',
    hinweis: 'Schlossbank Aschaffenburg AG – fiktives Modellunternehmen für den Unterricht',
    team: 'Team Konsumentenkredit · Kreditberatung Privatkunden',
    profil: [
      'Die Schlossbank Aschaffenburg AG ist die größte private Regionalbank am Bayerischen Untermain. Aus einer kleinen Spar- und Darlehenskasse von Handwerkern und Kaufleuten ist eine Vollbank geworden.',
      'Unsere Entscheidungen fallen in Aschaffenburg, nicht in einer fernen Konzernzentrale. Ratenkredite sagen wir in der Regel innerhalb von 24 Stunden zu.'
    ],
    zahlen: [
      ['6,2 Mrd. €', 'Bilanzsumme'],
      ['268.000', 'Kundinnen und Kunden'],
      ['26', 'Beratungsfilialen'],
      ['648', 'Mitarbeitende']
    ],
    steckbrief: [
      ['Gründung', '1898 als „Spar- und Darlehenskasse am Schloss“, seit 1972 Aktiengesellschaft'],
      ['Sitz', 'Am Schlossgarten 12, 63739 Aschaffenburg'],
      ['Geschäftsgebiet', 'Stadt und Landkreis Aschaffenburg, Landkreis Miltenberg, westlicher Main-Kinzig-Kreis'],
      ['Standorte', '26 Beratungsfilialen in 4 Regionen, 14 SB-Standorte, digitales Beratungscenter'],
      ['Konsumentenkredite', '338 Mio. € Bestand, 13.600 neu zugesagte Ratenkredite im Jahr 2025'],
      ['Aufsicht', 'BaFin und Deutsche Bundesbank']
    ],
    vorstand: [
      ['Dr. Katharina Wendel', 'Vorstandsvorsitzende'],
      ['Markus Feldner', 'Vorstand Privatkunden'],
      ['Stefan Albrecht', 'Vorstand Firmenkunden'],
      ['Dr. Thomas Reinhardt', 'Vorstand Marktfolge und Betrieb']
    ],
    ansprechpartner: [
      ['Jonas Hartmann', 'Leiter Kreditberatung Privatkunden', 'Ihr Vorgesetzter. Entscheidet Kredite oberhalb Ihrer Kompetenz mit.'],
      ['Sie und 11 Kolleginnen und Kollegen', 'Team Konsumentenkredit', 'Beratung, Kreditprüfung, Kreditentscheidung im Rahmen der Kompetenz, Angebote und Verträge.'],
      ['Melanie Sauer', 'Leiterin Kreditservice Markt', 'Termine, Vollständigkeit der Unterlagen, Rückfragen.'],
      ['Sabine Roth', 'Leiterin Kreditmanagement Privatkunden', 'Zweitvotum, Kreditrichtlinien, Qualitätssicherung.'],
      ['Erik Lindner', 'Leiter Kreditsachbearbeitung', 'Auskunftei-Abfragen, Vertragsprüfung, Auszahlung.'],
      ['Jan Schuster', 'Leiter Sicherheitenverwaltung', 'Sicherungsübereignungen, Abtretungen, Bürgschaften.'],
      ['Tobias Brenner', 'Leiter Intensivbetreuung', 'Rückstände, Mahnungen, Kündigung, Verwertung.']
    ],
    werte: [
      ['Ehrlichkeit', 'Wir sagen, was ein Produkt kostet und was es nicht kann.'],
      ['Verlässlichkeit', 'Was wir zusagen, halten wir ein: Termine, Rückrufe, Kreditzusagen.'],
      ['Klarheit', 'Wir erklären Bankgeschäfte verständlich und machen Kosten und Risiken transparent.'],
      ['Verantwortung', 'Gegenüber Kunden, Mitarbeitenden, Aktionären und der Region.'],
      ['Menschlichkeit', 'Hinter jeder Kontonummer steht ein Mensch, auch in schwierigen Lebenslagen.'],
      ['Zusammenhalt', 'Wir arbeiten über Filialen, Bereiche und Hierarchien hinweg als ein Team.'],
      ['Heimatverbundenheit', 'Das Geld unserer Kunden fließt als Kredit zurück in die Region.'],
      ['Nachhaltigkeit', 'Wir wirtschaften so, dass auch kommende Generationen gut am Untermain leben.']
    ],
    ablauf: [
      'Kreditanfrage über Filiale, App oder Beratungscenter',
      'Beratungsgespräch mit Bedarfsanalyse',
      'Selbstauskunft, Kreditantrag und Unterlagen',
      'Kreditprüfung: Auskunftei, Haushaltsrechnung, Scoring',
      'Kreditentscheidung nach Kompetenzregelung',
      'Vorvertragliche Informationen und Angebot',
      'Kreditvertrag, Widerrufsbelehrung, Sicherheiten',
      'Auszahlung und Kreditüberwachung'
    ]
  },

  /* ------------------------------------------------------- KREDITFAHRPLAN */
  fahrplan: ['Kreditantrag', 'Kreditprüfung', 'Kreditangebot', 'Vertragsabschluss', 'Auszahlung und Überwachung', 'Beendigung'],

  /* ---------------------------------------------------------- KONDITIONEN */
  konditionen: {
    stand: 'Oktober 2026',
    konten: [
      ['SchlossKonto Junge Leute', '0 € bis zum 27. Geburtstag für Schüler, Auszubildende und Studierende'],
      ['SchlossKonto Online', '2,90 € im Monat, 0 € ab 700 € Geldeingang im Monat'],
      ['SchlossKonto Komfort', '8,90 € im Monat, inklusive Mastercard Standard und aller Buchungen'],
      ['Dispositionskredit', 'Sollzins 10,90 % p. a., variabel'],
      ['Geduldete Überziehung', 'Sollzins 14,90 % p. a., variabel'],
      ['SchlossTagesgeld', '1,50 % p. a., variabel']
    ],
    dispoZins: 10.90,
    ueberziehungZins: 14.90,
    // SchlossKredit (Ratenkredit)
    kredit: {
      minBetrag: 1000, maxBetrag: 75000, minLaufzeit: 12, maxLaufzeit: 96,
      autoAbschlag: 0.5,   // Prozentpunkte günstiger bei Sicherungsübereignung des Fahrzeugs
      // gebundener Sollzins p. a. je Risikoklasse (der Effektivzins wird daraus berechnet)
      risikoklassen: [
        { rk: 'A', sollzins: 4.40,  text: 'sehr gute Bonität' },
        { rk: 'B', sollzins: 6.69,  text: 'gute Bonität' },
        { rk: 'C', sollzins: 8.49,  text: 'befriedigende Bonität' },
        { rk: 'D', sollzins: 10.29, text: 'ausreichende Bonität' },
        { rk: 'E', sollzins: 11.38, text: 'erhöhtes Risiko' }
      ],
      beispiel: 'Repräsentatives Beispiel: Nettodarlehensbetrag 10.000 €, Laufzeit 60 Monate, gebundener Sollzins 7,24 % p. a., effektiver Jahreszins 7,49 %, Rate 199,15 €, Gesamtbetrag 11.948,78 €.'
    }
  },

  /* ---------------------------------------------------- KOMPETENZREGELUNG */
  kompetenz: {
    beraterBetrag: 15000,          // bis hier entscheidet die Kreditberatung allein …
    beraterRk: ['A', 'B', 'C'],    // … in diesen Risikoklassen
    zweiVotenBetrag: 75000,
    tabelle: [
      ['bis 15.000 €', 'A bis C', 'Sie allein (ein Votum)'],
      ['bis 75.000 €', 'A bis D', 'Sie und das Kreditmanagement (zwei Voten)'],
      ['alle Beträge', 'E', 'zusätzlich Bereichsleitung Kreditmanagement'],
      ['über 250.000 € Gesamtengagement', 'alle', 'zusätzlich Vorstand Marktfolge']
    ]
  },

  /* ------------------------------------------- RICHTLINIE HAUSHALTSRECHNUNG */
  richtlinie: {
    pauschaleErste: 800, pauschaleWeitere: 300, pauschaleKind: 250, kfzPauschale: 230,
    punkte: [
      'Angesetzt wird nur Einkommen, das regelmäßig und nachgewiesen ist. Schwankende Zuschläge (Schicht, Überstunden) bleiben außer Ansatz.',
      'Für die Lebenshaltung gilt eine Pauschale von 800 € für die erste erwachsene Person, 300 € für jede weitere erwachsene Person im Antrag und 250 € je Kind. Sie deckt Lebensmittel, Kleidung, Freizeit, Streaming, Nahverkehr und Ähnliches ab.',
      'Wohnkosten: Angesetzt wird der Anteil an der Warmmiete, den die Kundin oder der Kunde tatsächlich selbst trägt.',
      'Wird ein Fahrzeug finanziert und liegen noch keine tatsächlichen Kosten vor, gilt für einen Kleinwagen eine Kfz-Pauschale von 230 € im Monat (Versicherung, Steuer, Kraftstoff, Wartung).',
      'Laufende Raten zählen als Ausgabe, auch Ratenkäufe und „Später bezahlen“. Maßgeblich sind die Kontoumsätze, nicht nur die Selbstauskunft.',
      'Sparraten sind keine Ausgaben. Sie können jederzeit gestoppt werden.',
      'Frei verfügbares Einkommen = Einnahmen minus Ausgaben. Die neue Kreditrate muss daraus tragbar sein.'
    ]
  },

  /* -------------------------------------------------------------- GLOSSAR */
  glossar: [
    ['Kreditfähigkeit', 'Die rechtliche Fähigkeit, einen Kreditvertrag wirksam abzuschließen. Voll geschäftsfähig ist, wer 18 Jahre alt ist.'],
    ['Persönliche Kreditwürdigkeit', 'Die Frage, ob die Kundin oder der Kunde zurückzahlen will: Beruf, Arbeitgeber, bisheriges Zahlungsverhalten.'],
    ['Wirtschaftliche (materielle) Kreditwürdigkeit', 'Die Frage, ob die Kundin oder der Kunde zurückzahlen kann: Einkommen, Ausgaben, bestehende Kredite, Vermögen.'],
    ['Selbstauskunft', 'Formular, in dem Kundinnen und Kunden ihre persönlichen und wirtschaftlichen Verhältnisse angeben. Die Bank prüft die Angaben mit Nachweisen.'],
    ['Haushaltsrechnung', 'Gegenüberstellung der regelmäßigen Einnahmen und Ausgaben. Ergebnis ist das frei verfügbare Einkommen.'],
    ['Frei verfügbares Einkommen', 'Der Betrag, der nach allen regelmäßigen Ausgaben im Monat übrig bleibt.'],
    ['Dispositionskredit', 'Eingeräumte Überziehungsmöglichkeit auf dem Girokonto bis zu einem vereinbarten Rahmen.'],
    ['Geduldete Überziehung', 'Überziehung über den Dispositionsrahmen hinaus oder ohne Rahmen. Sie ist teurer als der Dispositionskredit.'],
    ['Votum', 'Die begründete Entscheidung für oder gegen einen Kredit. Je nach Betrag und Risikoklasse sind ein oder zwei Voten nötig.'],
    ['Kompetenz', 'Die Grenze, bis zu der eine Mitarbeiterin oder ein Mitarbeiter allein über Kredite entscheiden darf.']
  ],

  /* -------------------------------------------------------- FREISCHALTUNGEN
     Jede Freischaltung hat einen Code. Hier steht nicht der Code selbst,
     sondern nur sein Prüfwert (hash), damit niemand die Codes nachlesen kann.
     Neue Prüfwerte erzeugt man in der App unter „Lehrkraft“.
     „frei“ nennt die Funktionen, die der Code öffnet.                       */
  freischaltungen: [
    { id: 'termin',    titel: 'Beratungstermin und Selbstauskunft', hash: 'b77ee32889572822e3edea6593d0b45930637fd5d67e86d35adab5cbfde0d0fb',
      frei: ['selbstauskunft', 'dokumente', 'umsaetze', 'post-termin'] },
    { id: 'auskunft',  titel: 'Auskunftei-Abfrage', hash: '802e354678a19fd6bd5f5fe77f8b5c3a2d20cccb5b15ecd56237944400590280',
      frei: ['auskunftei', 'post-auskunft'], fahrplan: 2 },
    { id: 'haushalt',  titel: 'Haushaltsrechnung (selbst rechnen)', hash: '37e3e2ab6ce330cbcae7b4c574e3de0c1677e1c469877fafb648413a204f519b',
      frei: ['haushalt'], fahrplan: 2 },
    { id: 'haushalt2', titel: 'Haushaltsrechnung (Beratertool und Systemabgleich)', hash: '309502d6a248de98f07a259d28906c712ffc5af118eaf02f104125103884e2af',
      frei: ['haushalt', 'haushalt-tool', 'abgleich'], fahrplan: 2 },
    { id: 'rechner',   titel: 'Kreditrechner (selbst rechnen)', hash: 'f5c5817b24b73671206954137cf2c59e8c88bb0de837f0a9374dad5de93047fd',
      frei: ['rechner'], fahrplan: 3 },
    { id: 'rechner2',  titel: 'Kreditrechner (Beratertool, Tilgungsplan, Spielwiese)', hash: '3f95047bc434c7d5ae20db1491d7452097f3e1eaa4238141927bdf02755b4022',
      frei: ['rechner', 'rechner-tool'], fahrplan: 3 }
  ],
  lehrkraftHash: '4bd5360ed5b01b0d0eecef612e8aefe0cdb3b8709ca9750b8da6713c0efdb188',

  /* ------------------------------------------------------------ POSTEINGANG
     „frei“: Nachricht erscheint erst nach dieser Freischaltung
     (ohne „frei“ ist sie von Anfang an da).                                 */
  nachrichten: [
    {
      id: 'willkommen', von: 'Jonas Hartmann', rolle: 'Leiter Kreditberatung Privatkunden', kuerzel: 'JH',
      datum: '2026-11-11', zeit: '07:45', betreff: 'Willkommen im Team Kreditberatung',
      text: [
        'Guten Morgen,',
        'herzlich willkommen im Team Konsumentenkredit. Ab heute landen die Kreditanfragen aus den Filialen, der App und dem Beratungscenter bei Ihnen.',
        'Sie beraten, prüfen und entscheiden. Bis 15.000 € entscheiden Sie in den Risikoklassen A bis C allein. Alles darüber geht mit einem Zweitvotum an das Kreditmanagement. Die Regeln finden Sie unter „Unsere Bank“.',
        'Im Postfach liegt schon die erste Anfrage: Frau Keller aus Alzenau möchte ein Auto finanzieren. Bitte kümmern Sie sich darum.',
        'Auf gute Zusammenarbeit',
        'Jonas Hartmann'
      ]
    },
    {
      id: 'anfrage', von: 'Sophie Keller', rolle: 'Kundin · Postfach SchlossBanking', kuerzel: 'SK', kunde: 'sophie',
      datum: '2026-11-10', zeit: '21:47', betreff: 'Autokredit – geht das?', antwortbar: true,
      text: [
        'Hallo liebes Team der Schlossbank,',
        'ich bin seit meiner Ausbildung bei Ihnen Kundin. Ab dem 1. Mai wechsle ich im Kahlgrund-Klinikum Alzenau auf eine Station mit festen Nachtdiensten. Nachts fährt dort kein Bus mehr, deshalb brauche ich bis dahin unbedingt ein Auto.',
        'Ich denke an einen gebrauchten Kleinwagen, so um die 14.000 bis 15.000 €. Ein bisschen was habe ich angespart, aber natürlich nicht alles.',
        'Bevor ich mich bei Autohändlern umschaue, möchte ich wissen: Würden Sie mir das finanzieren – und wie viel kann ich mir leisten? Was brauchen Sie dafür alles von mir?',
        'Kann ich einfach mal vorbeikommen? Wegen meiner Schichten passt es mir unter der Woche am besten nachmittags ab 15:30 Uhr.',
        'Viele Grüße',
        'Sophie Keller'
      ]
    },
    {
      id: 'termin', frei: 'post-termin', von: 'Melanie Sauer', rolle: 'Kreditservice Markt', kuerzel: 'MS',
      datum: '2026-11-23', zeit: '10:12', betreff: 'Termin Keller am 25.11. bestätigt',
      text: [
        'Hallo,',
        'der Termin mit Frau Keller steht: Mittwoch, 25.11.2026, 16:00 Uhr, Hauptstelle, Beratungsraum 2.',
        'Ich habe die Station „Selbstauskunft“ im Kreditantrag für Sie geöffnet. Sobald Frau Keller ihre Unterlagen hochlädt, finden Sie sie in der Kundenübersicht unter „Dokumente“.',
        'Viele Grüße',
        'Melanie Sauer'
      ]
    },
    {
      id: 'unterlagen', frei: 'post-termin', von: 'Sophie Keller', rolle: 'Kundin · Postfach SchlossBanking', kuerzel: 'SK', kunde: 'sophie',
      datum: '2026-11-24', zeit: '19:20', betreff: 'Unterlagen für morgen',
      text: [
        'Hallo,',
        'vielen Dank für die schnelle Antwort! Ich habe die Selbstauskunft ausgefüllt und zusammen mit meinen letzten drei Gehaltsabrechnungen hochgeladen. Den Mietvertrag und meinen Ausweis bringe ich morgen mit.',
        'Bei manchen Feldern war ich mir nicht sicher. Die Wohnung teile ich mir mit meinem Freund Paul, wir zahlen die Miete je zur Hälfte. Verheiratet sind wir nicht.',
        'Bis morgen um 16 Uhr!',
        'Sophie Keller'
      ]
    },
    {
      id: 'sprachnachricht', frei: 'post-auskunft', von: 'Sophie Keller', rolle: 'Kundin · Sprachnachricht (Abschrift)', kuerzel: 'SK', kunde: 'sophie',
      datum: '2026-12-01', zeit: '18:05', betreff: 'Sprachnachricht: Steht mein Dispo da drin?',
      text: [
        '„Hallo, hier ist Sophie Keller. Eine kurze Frage, die mir nicht aus dem Kopf geht: Sie holen ja jetzt diese Auskunft über mich ein.',
        'Steht da eigentlich drin, dass ich im September nach dem Urlaub ein paar Tage im Dispo war? Und sieht man da auch, wenn ich mal etwas auf Raten oder mit ‚später bezahlen‘ gekauft habe?',
        'Ich möchte nur wissen, ob das ein Problem für den Kredit ist. Rufen Sie mich gern zurück. Danke!“'
      ]
    }
  ],

  /* ---------------------------------------------------------------- KUNDEN */
  kunden: {
    sophie: {
      id: 'sophie', kuerzel: 'SK', anrede: 'Frau', vorname: 'Sophie', name: 'Keller',
      kundennr: '1005 3186', kundeSeit: '09/2019', filiale: 'Alzenau', betreuung: 'Carla Seidel (Filiale Alzenau)',
      status: 'Kreditanfrage offen', anliegen: 'Autofinanzierung, gebrauchter Kleinwagen, ca. 14.000 bis 15.000 €',
      fahrplanStand: 1,

      stammdaten: [
        ['Person', [
          ['Name', 'Sophie Keller'], ['Geburtsdatum', '14.03.2000 (26 Jahre)'], ['Geburtsort', 'Aschaffenburg'],
          ['Staatsangehörigkeit', 'deutsch'], ['Familienstand', 'ledig'], ['Legitimation', 'Personalausweis, geprüft am 02.09.2019']
        ]],
        ['Kontakt', [
          ['Anschrift', 'Hanauer Straße 27, 63755 Alzenau'], ['wohnhaft seit', '06/2025'],
          ['Telefon', '0151 5550 1486'], ['E-Mail', 's.keller@postfach-beispiel.de'], ['Postfach SchlossBanking', 'aktiv']
        ]],
        ['Beruf', [
          ['Beruf', 'Pflegefachfrau'], ['Arbeitgeber', 'Kahlgrund-Klinikum Alzenau'],
          ['beschäftigt seit', '09/2019 (Ausbildung), 09/2022 (Festanstellung)'], ['Stand der Angaben', '09/2022']
        ]]
      ],

      produkte: [
        { id: 'giro', name: 'SchlossKonto Online', art: 'Girokonto (Gehaltskonto)', iban: 'DE12 7955 0000 0010 0531 86',
          details: [['Dispositionskredit', '2.000,00 € (seit 09/2022)'], ['Sollzins Dispo', '10,90 % p. a.'], ['Kontoführung', '0,00 € (Geldeingang über 700 €)']] },
        { id: 'tagesgeld', name: 'SchlossTagesgeld', art: 'Tagesgeldkonto', iban: 'DE56 7955 0000 0030 0531 86', saldo: 3400.00,
          details: [['Zins', '1,50 % p. a.'], ['Sparrate', '100,00 € monatlich per Dauerauftrag']] },
        { id: 'karte', name: 'SchlossCard', art: 'Debitkarte', details: [['Status', 'aktiv'], ['Tageslimit', '1.000,00 €']] }
      ],

      // Hinweisbox in der Kundenübersicht. „frei“: Hinweis erscheint erst nach dieser Freischaltung.
      hinweise: [
        { art: 'info',    text: 'Offene Kreditanfrage vom 10.11.2026 über das Postfach (Autofinanzierung).' },
        { art: 'luecke',  text: 'Datenlücke: Einkommens- und Arbeitgeberangaben zuletzt 09/2022 aktualisiert.' },
        { art: 'luecke',  text: 'Datenlücke: Personen im Haushalt nicht erfasst (Adressänderung 06/2025).' },
        { art: 'signal',  frei: 'umsaetze', text: 'Signal: Dispositionskredit im September 2026 an 7 Tagen genutzt (höchster Sollstand 204,13 €).' },
        { art: 'signal',  frei: 'umsaetze', text: 'Signal: regelmäßige Lastschriften eines Zahlungsdienstes („Später bezahlen“), 2 laufende Ratenpläne.' },
        { art: 'impuls',  text: 'Vertriebsimpuls: keine Absicherung der Arbeitskraft (Berufsunfähigkeit) bekannt.' },
        { art: 'impuls',  text: 'Vertriebsimpuls: bei Autokauf Kfz-Versicherung über Partner anbieten.' }
      ],

      // Kundenakte: Kontakthistorie (neueste zuerst)
      kontakte: [
        { datum: '2026-11-10', kanal: 'Postfach', wer: 'Kundin', text: 'Kreditanfrage Autofinanzierung, Wunsch nach Beratungstermin (werktags ab 15:30 Uhr).' },
        { datum: '2025-06-16', kanal: 'App', wer: 'Kundin', text: 'Adressänderung: Umzug nach Alzenau, Hanauer Straße 27.' },
        { datum: '2024-03-08', kanal: 'Filiale Alzenau', wer: 'C. Seidel', text: 'SchlossTagesgeld eröffnet, Dauerauftrag 100 € monatlich. Kundin möchte Rücklagen aufbauen.' },
        { datum: '2022-09-12', kanal: 'Filiale Alzenau', wer: 'C. Seidel', text: 'Ausbildung abgeschlossen, unbefristete Übernahme als Pflegefachfrau. Umstellung auf SchlossKonto Online, Dispositionskredit 2.000 € eingeräumt. Absicherung Berufsunfähigkeit angesprochen, Kundin möchte später darauf zurückkommen.' },
        { datum: '2019-09-02', kanal: 'Filiale Alzenau', wer: 'C. Seidel', text: 'Kontoeröffnung SchlossKonto Junge Leute zum Ausbildungsbeginn. Legitimation per Personalausweis.' }
      ],

      // Dokumente in der digitalen Akte. typ: 'selbstauskunft' | 'gehalt' | 'text'
      dokumente: [
        { id: 'sa', frei: 'dokumente', titel: 'Selbstauskunft PK-07 (eingereicht)', datum: '2026-11-24', typ: 'selbstauskunft' },
        { id: 'g10', frei: 'dokumente', titel: 'Gehaltsabrechnung Oktober 2026', datum: '2026-11-24', typ: 'gehalt',
          monat: 'Oktober 2026', brutto: 3540.00, netto: 2250.00, zuschlag: 220.00 },
        { id: 'g09', frei: 'dokumente', titel: 'Gehaltsabrechnung September 2026', datum: '2026-11-24', typ: 'gehalt',
          monat: 'September 2026', brutto: 3540.00, netto: 2250.00, zuschlag: 310.00 },
        { id: 'g08', frei: 'dokumente', titel: 'Gehaltsabrechnung August 2026', datum: '2026-11-24', typ: 'gehalt',
          monat: 'August 2026', brutto: 3540.00, netto: 2250.00, zuschlag: 180.00 },
        { id: 'legi', titel: 'Legitimationsprüfung Personalausweis', datum: '2019-09-02', typ: 'text',
          text: ['Personalausweis im Original vorgelegt und geprüft. Identität bestätigt.', 'Filiale Alzenau, C. Seidel'] }
      ],

      /* Sophies eigene Angaben in der Selbstauskunft – so, wie sie das Formular ausgefüllt hat.
         Achtung: Die Angaben sind absichtlich nicht ganz richtig und nicht vollständig.
         (Gehalt inklusive Zulagen angegeben, Handyvertrag und „Später bezahlen“ vergessen.)   */
      selbstauskunft: {
        name: 'Keller', vorname: 'Sophie', geburtsname: '', geburtsdatum: '14.03.2000', geburtsort: 'Aschaffenburg',
        staat: 'deutsch', strasse: 'Hanauer Straße 27', ort: '63755 Alzenau', wohnhaftSeit: '06/2025',
        telefon: '0151 5550 1486', email: 's.keller@postfach-beispiel.de', kundennr: '1005 3186',
        familienstand: 'ledig', gueterstand: '', personen: '2', kinder: '0',
        beruf: 'Pflegefachfrau', beschSeit: '09/2019', arbeitgeber: 'Kahlgrund-Klinikum Alzenau', arbeitsverh: 'unbefristet',
        gehalt: '2500', zulagen: '', kindergeld: '', sonstEin: '',
        wohnen: 'Miete', miete: '480', versicherungen: '40', kfz: '200', telefonKosten: '14', sonstAus: '30',
        raten: '', bnpl: '', sparen: '100', unterhalt: '',
        verb: 'keine',
        vermGiro: '3400', vermWp: '', vermSonst: '',
        zweck: 'Gebrauchtwagen (Kleinwagen)', kaufpreis: '14900', eigenkapital: '2400', kreditbetrag: '12500',
        wunschrate: '300', laufzeit: '48'
      },

      /* Girokonto: Umsätze. Betrag negativ = Belastung, positiv = Gutschrift.
         Der Kontostand wird automatisch aus „saldoStart“ berechnet.         */
      saldoStart: 1436.52, saldoStartDatum: '2026-07-31',
      umsaetze: [
        ['2026-08-03', 'Dauerauftrag', 'Wohnbau Kahlgrund GmbH', 'Miete 08/2026 Hanauer Str. 27, Whg. 4', -960.00],
        ['2026-08-03', 'Dauerauftrag', 'Sophie Keller, SchlossTagesgeld', 'Sparen', -100.00],
        ['2026-08-03', 'Lastschrift', 'TeleMain Mobilfunk GmbH', 'Mobilfunkvertrag Allnet L, Kd-Nr. 5521870', -45.00],
        ['2026-08-03', 'Lastschrift', 'Verkehrsgemeinschaft Untermain', 'Deutschlandticket 08/2026', -63.00],
        ['2026-08-04', 'Gutschrift', 'Paul Neumann', 'Miete Anteil August', 480.00],
        ['2026-08-05', 'Lastschrift', 'Untermain Versicherung AG', 'Privathaftpflicht und Hausrat 08/2026', -40.00],
        ['2026-08-05', 'Lastschrift', 'FitPoint Alzenau', 'Mitgliedsbeitrag', -29.90],
        ['2026-08-07', 'Kartenzahlung', 'Supermarkt Alzenau', 'Einkauf', -68.42],
        ['2026-08-10', 'Lastschrift', 'StreamBox', 'Abo monatlich', -13.99],
        ['2026-08-12', 'Geldautomat', 'Schlossbank Alzenau', 'Bargeldauszahlung', -150.00],
        ['2026-08-14', 'Kartenzahlung', 'Drogerie am Markt', 'Einkauf', -31.75],
        ['2026-08-17', 'Lastschrift', 'SpäterZahlen GmbH', 'Ratenplan 88213 Rate 2/6 Möbelhaus', -34.90],
        ['2026-08-17', 'Lastschrift', 'SpäterZahlen GmbH', 'Ratenplan 90455 Rate 1/6 Modeversand', -25.10],
        ['2026-08-18', 'Kartenzahlung', 'Supermarkt Alzenau', 'Einkauf', -74.10],
        ['2026-08-21', 'Kartenzahlung', 'Gasthaus Zur Linde', 'Restaurant', -46.50],
        ['2026-08-24', 'Kartenzahlung', 'Supermarkt Alzenau', 'Einkauf', -59.80],
        ['2026-08-26', 'Geldautomat', 'Schlossbank Alzenau', 'Bargeldauszahlung', -100.00],
        ['2026-08-28', 'Gehalt', 'Kahlgrund-Klinikum Alzenau', 'Lohn/Gehalt 08/2026 · netto 2.250,00 + Zuschläge Schichtdienst 180,00', 2430.00],
        ['2026-08-31', 'Kartenzahlung', 'Modehaus Stern', 'Einkauf', -89.95],

        ['2026-09-01', 'Dauerauftrag', 'Wohnbau Kahlgrund GmbH', 'Miete 09/2026 Hanauer Str. 27, Whg. 4', -960.00],
        ['2026-09-01', 'Dauerauftrag', 'Sophie Keller, SchlossTagesgeld', 'Sparen', -100.00],
        ['2026-09-01', 'Lastschrift', 'TeleMain Mobilfunk GmbH', 'Mobilfunkvertrag Allnet L, Kd-Nr. 5521870', -45.00],
        ['2026-09-01', 'Lastschrift', 'Verkehrsgemeinschaft Untermain', 'Deutschlandticket 09/2026', -63.00],
        ['2026-09-02', 'Gutschrift', 'Paul Neumann', 'Miete Anteil September', 480.00],
        ['2026-09-04', 'Lastschrift', 'Untermain Versicherung AG', 'Privathaftpflicht und Hausrat 09/2026', -40.00],
        ['2026-09-04', 'Lastschrift', 'FitPoint Alzenau', 'Mitgliedsbeitrag', -29.90],
        ['2026-09-04', 'Überweisung', 'Nordsee Ferienhaus Vermietung', 'Ferienwohnung 12.–19.09., Restzahlung', -890.00],
        ['2026-09-07', 'Kartenzahlung', 'Supermarkt Alzenau', 'Einkauf', -71.30],
        ['2026-09-10', 'Lastschrift', 'StreamBox', 'Abo monatlich', -13.99],
        ['2026-09-11', 'Geldautomat', 'Schlossbank Alzenau', 'Bargeldauszahlung', -400.00],
        ['2026-09-14', 'Kartenzahlung', 'Fischrestaurant Hafenblick', 'Restaurant', -58.40],
        ['2026-09-15', 'Lastschrift', 'SpäterZahlen GmbH', 'Ratenplan 88213 Rate 3/6 Möbelhaus', -34.90],
        ['2026-09-15', 'Lastschrift', 'SpäterZahlen GmbH', 'Ratenplan 90455 Rate 2/6 Modeversand', -25.10],
        ['2026-09-16', 'Kartenzahlung', 'Inselfähre', 'Fahrkarten', -92.70],
        ['2026-09-18', 'Kartenzahlung', 'Strandladen', 'Einkauf', -64.20],
        ['2026-09-21', 'Kartenzahlung', 'Supermarkt Alzenau', 'Einkauf', -82.15],
        ['2026-09-23', 'Kartenzahlung', 'Drogerie am Markt', 'Einkauf', -27.60],
        ['2026-09-25', 'Geldautomat', 'Schlossbank Alzenau', 'Bargeldauszahlung', -100.00],
        ['2026-09-28', 'Gehalt', 'Kahlgrund-Klinikum Alzenau', 'Lohn/Gehalt 09/2026 · netto 2.250,00 + Zuschläge Schichtdienst 310,00', 2560.00],
        ['2026-09-30', 'Abschluss', 'Schlossbank Aschaffenburg AG', 'Abschluss 3. Quartal · Sollzinsen Dispositionskredit', -0.29],

        ['2026-10-01', 'Dauerauftrag', 'Wohnbau Kahlgrund GmbH', 'Miete 10/2026 Hanauer Str. 27, Whg. 4', -960.00],
        ['2026-10-01', 'Dauerauftrag', 'Sophie Keller, SchlossTagesgeld', 'Sparen', -100.00],
        ['2026-10-01', 'Lastschrift', 'TeleMain Mobilfunk GmbH', 'Mobilfunkvertrag Allnet L, Kd-Nr. 5521870', -45.00],
        ['2026-10-01', 'Lastschrift', 'Verkehrsgemeinschaft Untermain', 'Deutschlandticket 10/2026', -63.00],
        ['2026-10-02', 'Gutschrift', 'Paul Neumann', 'Miete Anteil Oktober', 480.00],
        ['2026-10-05', 'Lastschrift', 'Untermain Versicherung AG', 'Privathaftpflicht und Hausrat 10/2026', -40.00],
        ['2026-10-05', 'Lastschrift', 'FitPoint Alzenau', 'Mitgliedsbeitrag', -29.90],
        ['2026-10-06', 'Kartenzahlung', 'Supermarkt Alzenau', 'Einkauf', -66.90],
        ['2026-10-12', 'Lastschrift', 'StreamBox', 'Abo monatlich', -13.99],
        ['2026-10-13', 'Geldautomat', 'Schlossbank Alzenau', 'Bargeldauszahlung', -150.00],
        ['2026-10-15', 'Lastschrift', 'SpäterZahlen GmbH', 'Ratenplan 88213 Rate 4/6 Möbelhaus', -34.90],
        ['2026-10-15', 'Lastschrift', 'SpäterZahlen GmbH', 'Ratenplan 90455 Rate 3/6 Modeversand', -25.10],
        ['2026-10-16', 'Kartenzahlung', 'Supermarkt Alzenau', 'Einkauf', -77.45],
        ['2026-10-20', 'Kartenzahlung', 'Buchhandlung am Schloss', 'Einkauf', -24.00],
        ['2026-10-23', 'Kartenzahlung', 'Supermarkt Alzenau', 'Einkauf', -58.30],
        ['2026-10-26', 'Geldautomat', 'Schlossbank Alzenau', 'Bargeldauszahlung', -100.00],
        ['2026-10-28', 'Gehalt', 'Kahlgrund-Klinikum Alzenau', 'Lohn/Gehalt 10/2026 · netto 2.250,00 + Zuschläge Schichtdienst 220,00', 2470.00],
        ['2026-10-30', 'Kartenzahlung', 'Gasthaus Zur Linde', 'Restaurant', -38.50],

        ['2026-11-02', 'Dauerauftrag', 'Wohnbau Kahlgrund GmbH', 'Miete 11/2026 Hanauer Str. 27, Whg. 4', -960.00],
        ['2026-11-02', 'Dauerauftrag', 'Sophie Keller, SchlossTagesgeld', 'Sparen', -100.00],
        ['2026-11-02', 'Lastschrift', 'TeleMain Mobilfunk GmbH', 'Mobilfunkvertrag Allnet L, Kd-Nr. 5521870', -45.00],
        ['2026-11-02', 'Lastschrift', 'Verkehrsgemeinschaft Untermain', 'Deutschlandticket 11/2026', -63.00],
        ['2026-11-03', 'Gutschrift', 'Paul Neumann', 'Miete Anteil November', 480.00],
        ['2026-11-05', 'Lastschrift', 'Untermain Versicherung AG', 'Privathaftpflicht und Hausrat 11/2026', -40.00],
        ['2026-11-05', 'Lastschrift', 'FitPoint Alzenau', 'Mitgliedsbeitrag', -29.90],
        ['2026-11-06', 'Kartenzahlung', 'Supermarkt Alzenau', 'Einkauf', -72.80],
        ['2026-11-10', 'Lastschrift', 'StreamBox', 'Abo monatlich', -13.99]
      ],

      /* Systemabgleich: vergleicht die erfasste Selbstauskunft mit den Daten der Bank.
         op: 'groesser' | 'kleiner' (leeres Feld zählt als 0). {x} = erfasster Wert.            */
      abgleich: [
        { feld: 'gehalt', op: 'groesser', wert: 2250, text: 'Einkommen: erfasst sind {x}. Die Gehaltseingänge zeigen 2.250,00 € festes Nettogehalt plus schwankende Zuschläge (180 bis 310 €).' },
        { feld: 'telefonKosten', op: 'kleiner', wert: 45, text: 'Telefon: erfasst sind {x}. Die Lastschrift TeleMain Mobilfunk über 45,00 € monatlich ist darin nicht enthalten.' },
        { feld: 'bnpl', op: 'kleiner', wert: 60, text: 'Ratenkäufe, „Später bezahlen“: erfasst sind {x}. Das Konto zeigt zwei laufende Ratenpläne der SpäterZahlen GmbH (zusammen 60,00 € monatlich).' },
        { feld: 'kfz', op: 'kleiner', wert: 230, text: 'Kfz-Kosten: erfasst sind {x}. Die Richtlinie sieht für einen Kleinwagen eine Pauschale von 230,00 € vor.' }
      ],

      // Auskunftei (Muster). Im echten Bankbetrieb wäre das die SCHUFA.
      auskunftei: {
        abfrage: '2026-12-01', wert: '94,8 %', einstufung: 'gut – geringes bis überschaubares Risiko',
        eintraege: [
          ['Girokonto', 'Schlossbank Aschaffenburg AG', 'seit 09/2019', 'Dispositionsrahmen 2.000 €, vertragsgemäß'],
          ['Debitkarte', 'Schlossbank Aschaffenburg AG', 'seit 09/2019', 'vertragsgemäß'],
          ['Mobilfunkvertrag', 'TeleMain Mobilfunk GmbH', 'seit 03/2021', 'vertragsgemäß'],
          ['Ratenzahlungskonto', 'SpäterZahlen GmbH', 'seit 05/2025', 'Rahmen 1.500 €, 2 laufende Ratenpläne, vertragsgemäß'],
          ['Rechnungskauf / Ratenkauf', 'KaufJetzt Pay AG', 'seit 02/2026', 'Rahmen 750 €, derzeit nicht genutzt']
        ],
        negativ: 'Keine Negativmerkmale gespeichert.',
        anfragen: 'Keine Kreditanfragen anderer Banken in den letzten 12 Monaten.',
        nichtEnthalten: 'Nicht gespeichert sind: Einkommen, Kontostände, einzelne Kontoumsätze und die Nutzung des Dispositionskredits innerhalb des Rahmens.'
      },

      /* Haushaltsrechnung: erwartete Werte für die Kontrolle im Modus „Selbst rechnen“.
         soll = richtiger Betrag, t1 = erster Hinweis (Denkanstoß), t2 = zweiter Hinweis (Lösungsweg). */
      haushalt: {
        zeilen: [
          { id: 'gehalt', gruppe: 'ein', label: 'Nettogehalt (regelmäßig, nachgewiesen)', soll: 2250,
            t1: 'Vergleichen Sie Selbstauskunft, Gehaltsabrechnungen und Gehaltseingänge. Welcher Betrag kommt jeden Monat sicher?',
            t2: 'Angesetzt wird das feste Nettogehalt laut Gehaltsabrechnung: 2.250,00 €. In der Selbstauskunft hat Frau Keller die Zuschläge mit eingerechnet.' },
          { id: 'zulagen', gruppe: 'ein', label: 'Zulagen, Nebeneinkünfte (dauerhaft gesichert)', soll: 0,
            t1: 'Sind die Schichtzuschläge jeden Monat gleich hoch? Was sagt die Richtlinie dazu?',
            t2: 'Die Zuschläge schwanken (180 €, 310 €, 220 €). Nach der Richtlinie bleiben sie außer Ansatz: 0,00 €.' },
          { id: 'sonstEin', gruppe: 'ein', label: 'Sonstige Einnahmen (Kindergeld, Unterhalt …)', soll: 0,
            t1: 'Ist die monatliche Gutschrift von Paul Neumann ein Einkommen von Frau Keller?',
            t2: 'Pauls 480 € sind sein Anteil an der Miete, kein Einkommen. Berücksichtigt wird das bei der Miete: 0,00 €.' },
          { id: 'miete', gruppe: 'aus', label: 'Warmmiete (eigener Anteil)', soll: 480,
            t1: 'Wie viel von den 960 € trägt Frau Keller am Ende selbst? Schauen Sie auf die Gutschriften.',
            t2: 'Dauerauftrag 960 € abzüglich Pauls Anteil 480 € ergibt den eigenen Anteil: 480,00 €.' },
          { id: 'pauschale', gruppe: 'aus', label: 'Lebenshaltung (Pauschale laut Richtlinie)', soll: 800,
            t1: 'Die Pauschale steht in der Richtlinie Haushaltsrechnung unter „Unsere Bank“. Wie viele Personen stehen im Antrag?',
            t2: 'Antragstellerin ist nur Frau Keller: Pauschale für die erste erwachsene Person 800,00 €.' },
          { id: 'versicherung', gruppe: 'aus', label: 'Versicherungen', soll: 40,
            t1: 'Suchen Sie in den Umsätzen nach Versicherungsbeiträgen.',
            t2: 'Privathaftpflicht und Hausrat bei der Untermain Versicherung AG: 40,00 € im Monat.' },
          { id: 'telefon', gruppe: 'aus', label: 'Telefon, Mobilfunk, Internet', soll: 45,
            t1: 'Stimmt die Angabe in der Selbstauskunft mit den Lastschriften überein?',
            t2: 'In der Selbstauskunft fehlt der Mobilfunkvertrag: 45,00 € im Monat. Streaming ist mit der Pauschale abgedeckt.' },
          { id: 'kfz', gruppe: 'aus', label: 'Kfz-Kosten (künftiges Auto)', soll: 230,
            t1: 'Frau Keller hat noch kein Auto. Was sieht die Richtlinie vor, wenn tatsächliche Kosten fehlen?',
            t2: 'Kfz-Pauschale für einen Kleinwagen laut Richtlinie: 230,00 € (statt der geschätzten 200 €).' },
          { id: 'raten', gruppe: 'aus', label: 'Raten für bestehende Kredite, Leasing', soll: 0,
            t1: 'Gibt es in den Unterlagen einen Bankkredit oder Leasingvertrag?',
            t2: 'Es bestehen keine Kredite oder Leasingverträge: 0,00 €.' },
          { id: 'bnpl', gruppe: 'aus', label: 'Ratenkäufe, „Später bezahlen“', soll: 60,
            t1: 'Die Selbstauskunft nennt hier nichts. Was zeigen die Kontoumsätze Mitte des Monats?',
            t2: 'Zwei laufende Ratenpläne bei der SpäterZahlen GmbH: 34,90 € + 25,10 € = 60,00 € im Monat.' },
          { id: 'unterhalt', gruppe: 'aus', label: 'Unterhaltszahlungen', soll: 0,
            t1: 'Hat Frau Keller unterhaltsberechtigte Kinder?', t2: 'Keine Unterhaltspflichten: 0,00 €.' },
          { id: 'sonstAus', gruppe: 'aus', label: 'Sonstige regelmäßige Ausgaben', soll: 0,
            t1: 'Fitnessstudio, Streaming, Deutschlandticket, Sparrate: Was davon zählt nach der Richtlinie zusätzlich?',
            t2: 'Freizeit, Streaming und Nahverkehr deckt die Pauschale ab, die Sparrate ist keine Ausgabe: 0,00 €.' }
        ]
      }
    }
  },

  // Weitere Kunden (noch nicht zugewiesen, erscheinen ausgegraut)
  weitereKunden: [
    { name: 'Noah Weber', kundennr: '1009 2264', info: 'Auszubildender Kfz-Mechatroniker' },
    { name: 'Marco und Jana Schreiber', kundennr: '1006 5518', info: 'Gemeinschaftskonto, Autokredit' }
  ]
};
