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

  version: '1.2.0',
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

  /* -------------------------------------------------------------- GLOSSAR
     [Begriff, Erklärung, Thema]. Das Glossar ist auch die Quelle der Karteikarten
     im Training: Ein Begriff erscheint dort, sobald sein Thema geöffnet ist
     (Themen und Daten stehen in training.js; ohne Thema ist der Begriff sofort dabei). */
  glossar: [
    ['Kreditfähigkeit', 'Die rechtliche Fähigkeit, einen Kreditvertrag wirksam abzuschließen. Voll geschäftsfähig ist, wer 18 Jahre alt ist.', 'antrag'],
    ['Persönliche Kreditwürdigkeit', 'Die Frage, ob die Kundin oder der Kunde zurückzahlen will: Beruf, Arbeitgeber, bisheriges Zahlungsverhalten.', 'antrag'],
    ['Wirtschaftliche (materielle) Kreditwürdigkeit', 'Die Frage, ob die Kundin oder der Kunde zurückzahlen kann: Einkommen, Ausgaben, bestehende Kredite, Vermögen.', 'antrag'],
    ['Selbstauskunft', 'Formular, in dem Kundinnen und Kunden ihre persönlichen und wirtschaftlichen Verhältnisse angeben. Die Bank prüft die Angaben mit Nachweisen.', 'antrag'],
    ['Allgemein-Verbraucherdarlehen', 'Kredit an eine Privatperson, der nicht durch ein Grundpfandrecht gesichert ist und nicht dem Kauf einer Immobilie dient. Der Ratenkredit ist das wichtigste Beispiel.', 'antrag'],
    ['Nettodarlehensbetrag', 'Der Betrag, der an die Kundin oder den Kunden ausgezahlt wird.', 'antrag'],
    ['Auskunftei', 'Unternehmen, das Daten über Verträge und Zahlungsverhalten sammelt und an Vertragspartner weitergibt. Die bekannteste Auskunftei in Deutschland ist die SCHUFA.', 'auskunftei'],
    ['Positivmerkmal', 'Eintrag über einen Vertrag, der vertragsgemäß läuft oder beendet wurde, zum Beispiel ein Girokonto oder ein ordentlich zurückgezahlter Kredit.', 'auskunftei'],
    ['Negativmerkmal', 'Eintrag über nicht vertragsgemäßes Verhalten, zum Beispiel ein wegen Zahlungsverzugs gekündigter Kredit.', 'auskunftei'],
    ['Scorewert', 'Zahl, die ausdrückt, wie wahrscheinlich eine Person ihre Zahlungen erfüllt. Der SCHUFA-Score reicht von 100 bis 999 Punkten, ein höherer Wert ist besser.', 'auskunftei'],
    ['Datenkopie', 'Kostenlose Auskunft über die eigenen gespeicherten Daten nach Art. 15 DSGVO.', 'auskunftei'],
    ['„Später bezahlen“ (Buy now, pay later)', 'Kauf auf Rechnung oder in Raten über einen Zahlungsdienst. Gilt seit dem 20.11.2026 als Verbraucherkredit.', 'auskunftei'],
    ['Haushaltsrechnung', 'Gegenüberstellung der regelmäßigen Einnahmen und Ausgaben. Ergebnis ist das frei verfügbare Einkommen.', 'haushalt'],
    ['Frei verfügbares Einkommen', 'Der Betrag, der nach allen regelmäßigen Ausgaben im Monat übrig bleibt.', 'haushalt'],
    ['Lebenshaltungspauschale', 'Fester Betrag, den die Bank für Lebensmittel, Kleidung, Freizeit und Ähnliches ansetzt, statt einzelne Ausgaben zu erfragen.', 'haushalt'],
    ['Dispositionskredit', 'Eingeräumte Überziehungsmöglichkeit auf dem Girokonto bis zu einem vereinbarten Rahmen.', 'haushalt'],
    ['Geduldete Überziehung', 'Überziehung über den Dispositionsrahmen hinaus oder ohne Rahmen. Sie ist teurer als der Dispositionskredit.', 'haushalt'],
    ['Scoring', 'Verfahren, das aus Merkmalen einer Person und ihres Antrags eine Punktzahl bildet und daraus das Ausfallrisiko schätzt.', 'entscheidung'],
    ['Risikoklasse', 'Einstufung eines Kreditantrags nach seinem Ausfallrisiko, bei der Schlossbank von A bis E. Sie bestimmt den Zins.', 'entscheidung'],
    ['Votum', 'Die begründete Entscheidung für oder gegen einen Kredit. Je nach Betrag und Risikoklasse sind ein oder zwei Voten nötig.', 'entscheidung'],
    ['Zweitvotum', 'Zweite, unabhängige Entscheidung durch das Kreditmanagement, wenn die Kompetenz der Kreditberatung nicht ausreicht.', 'entscheidung'],
    ['Kompetenz', 'Die Grenze, bis zu der eine Mitarbeiterin oder ein Mitarbeiter allein über Kredite entscheiden darf.', 'entscheidung'],
    ['Annuität', 'Gleichbleibende Rate aus Zinsen und Tilgung. Der Zinsanteil sinkt mit jeder Rate, der Tilgungsanteil steigt.', 'annuitaet'],
    ['Tilgung', 'Der Teil der Rate, der die Schuld verringert.', 'annuitaet'],
    ['Sollzins', 'Der Zins, mit dem die Zinsen auf die Restschuld berechnet werden. „Gebunden“ heißt: Er bleibt über die Laufzeit gleich.', 'annuitaet'],
    ['Effektiver Jahreszins', 'Die jährlichen Gesamtkosten des Kredits in Prozent. Er berücksichtigt die monatliche Zahlung und weitere Kosten und macht Angebote vergleichbar.', 'annuitaet'],
    ['Gesamtbetrag', 'Summe aller Zahlungen: Nettodarlehensbetrag plus Zinsen und Kosten.', 'annuitaet']
  ],

  /* ------------------------------------------------------- BERATERHANDBUCH
     Das Handbuch wächst mit dem Unterricht: Ein Kapitel erscheint am Datum „ab“.
     Abschnitte: t = Überschrift, p = Absätze, liste = Aufzählung,
     tabelle = 'richtlinie' | 'kompetenz' | 'konditionen' (wird aus den Daten oben erzeugt). */
  handbuch: [
    { id: 'anfrage', titel: 'Kreditanfrage und Beratungstermin', ab: '2026-11-11', abschnitte: [
      { t: 'Ihre Rolle', p: ['Sie beraten Privatkundinnen und Privatkunden zu Ratenkrediten, prüfen den Antrag und entscheiden im Rahmen Ihrer Kompetenz. Sie arbeiten für die Kundin und für die Bank: Ein Kredit, den jemand nicht zurückzahlen kann, hilft keinem von beiden.'] },
      { t: 'Vor dem Termin', liste: ['Kundenübersicht lesen: Stammdaten, Konten, Kundenakte.', 'Prüfen, ob die Stammdaten noch stimmen. Abweichungen im Termin klären und in der Kundenakte vermerken.', 'Der Kundin mitteilen, welche Unterlagen sie mitbringen soll.'] },
      { t: 'Unterlagen für den Ratenkredit', liste: ['gültiger Personalausweis oder Reisepass', 'Selbstauskunft PK-07', 'Gehaltsabrechnungen der letzten drei Monate', 'Mietvertrag', 'bei Fahrzeugen: Kaufvertrag oder Angebot', 'bei fremdem Gehaltskonto: Kontoauszüge der letzten drei Monate'] }
    ] },
    { id: 'antrag', titel: 'Kreditantrag und Selbstauskunft', ab: '2026-11-25', abschnitte: [
      { t: 'Kreditfähigkeit', p: ['Kreditfähig ist, wer einen Kreditvertrag wirksam abschließen kann. Natürliche Personen müssen voll geschäftsfähig sein, also mindestens 18 Jahre alt. Sie prüfen das mit dem Ausweis.', 'Minderjährige bräuchten die Zustimmung der gesetzlichen Vertreter und die Genehmigung des Familiengerichts. Die Schlossbank vergibt deshalb keine Ratenkredite an Minderjährige.'] },
      { t: 'Kreditwürdigkeit', p: ['Persönliche Kreditwürdigkeit: Will die Person zurückzahlen? Wirtschaftliche (materielle) Kreditwürdigkeit: Kann die Person zurückzahlen?'] },
      { t: 'Selbstauskunft', p: ['Die Selbstauskunft ist die eigene Angabe der Kundin oder des Kunden. Übernehmen Sie die Angaben so ins System, wie sie gemacht wurden. Was die Bank am Ende ansetzt, entscheiden Sie später in der Haushaltsrechnung.'], liste: ['Angaben mit Nachweisen vergleichen.', 'Lücken und Widersprüche notieren und im Gespräch klären.', 'Bei Ehe oder eingetragener Lebenspartnerschaft Güterstand erfassen und Mitantrag prüfen.'] }
    ] },
    { id: 'auskunftei', titel: 'Auskunftei', ab: '2026-12-02', abschnitte: [
      { t: 'Wozu die Auskunft dient', p: ['Vor jeder Kreditentscheidung holt die Bank eine Auskunft ein. Sie zeigt, welche Verträge eine Person hat und ob sie bisher vertragsgemäß gezahlt hat. Die Kundin wird mit dem Kreditantrag über die Datenübermittlung informiert.'] },
      { t: 'Was gespeichert ist', liste: ['Name, Geburtsdatum, aktuelle und frühere Anschriften', 'Positivmerkmale: Girokonten, Kreditkarten, Kredite, Ratenzahlungskonten, Mobilfunkverträge, die vertragsgemäß laufen', 'Negativmerkmale: zum Beispiel gekündigte Kredite, unbestrittene offene Forderungen nach Mahnung, Einträge aus Schuldnerverzeichnissen', 'Anfragen von Unternehmen'] },
      { t: 'Was nicht gespeichert ist', liste: ['Einkommen, Vermögen, Kontostände', 'einzelne Kontoumsätze und die Nutzung des Dispositionskredits innerhalb des Rahmens', 'Beruf, Arbeitgeber, Familienstand'] },
      { t: 'Der Scorewert', p: ['Seit dem 17. März 2026 gibt es einen neuen SCHUFA-Score. Er reicht von 100 bis 999 Punkten, ein höherer Wert ist besser. Die SCHUFA teilt die Werte in fünf Klassen ein: hervorragend, gut, akzeptabel, ausreichend, ungenügend.', 'Der Score wird aus zwölf Kriterien berechnet. Dazu gehören Zahlungsstörungen, das Alter des ältesten Bankvertrags, der ältesten Kreditkarte und der aktuellen Adresse, Anfragen und neue Verträge der letzten zwölf Monate, neu aufgenommene Ratenkredite und ihre Restlaufzeit, ein Immobilienkredit und eine vorliegende Identitätsprüfung.', 'Der Scorewert ist ein Baustein. Er ersetzt nicht Ihre eigene Prüfung: Lesen Sie immer auch die einzelnen Einträge.'] },
      { t: 'Anfragen', p: ['Für einen Angebotsvergleich stellt die Bank eine „Anfrage Kreditkonditionen“. Andere Banken sehen sie nicht, sie wirkt sich nicht auf den Score aus. Eine „Anfrage Kredit“ ist für andere Banken sichtbar.'] },
      { t: 'Rechte der Kundinnen und Kunden', p: ['Jede Person kann kostenlos eine Datenkopie nach Art. 15 DSGVO anfordern und falsche Einträge berichtigen lassen. Lehnt die Bank einen Antrag wegen der Auskunft ab, informiert sie die Person darüber.'] },
      { t: '„Später bezahlen“', p: ['Ratenkäufe und „Später bezahlen“ über Zahlungsdienste gelten seit dem 20.11.2026 als Verbraucherkredite. Behandeln Sie sie in der Kreditprüfung wie jeden anderen Kredit.'] }
    ] },
    { id: 'haushalt', titel: 'Haushaltsrechnung', ab: '2026-12-09', abschnitte: [
      { t: 'Aufbau', p: ['Regelmäßige Einnahmen minus regelmäßige Ausgaben ergibt das frei verfügbare Einkommen. Daraus muss die neue Rate tragbar sein. In der Antragsmaske steht links die Kundenangabe, rechts tragen Sie den Bankansatz ein.'] },
      { t: 'Richtlinie Haushaltsrechnung', tabelle: 'richtlinie' },
      { t: 'Quellen für den Bankansatz', liste: ['Gehaltsabrechnungen: festes Nettogehalt, schwankende Zuschläge', 'Kontoumsätze: Miete, Lastschriften, Ratenkäufe', 'Auskunft: bestehende Kredite und Ratenpläne', 'Mietvertrag: Höhe der Miete, Mitmieter'] }
    ] },
    { id: 'entscheidung', titel: 'Scoring und Kreditentscheidung', ab: '2026-12-16', abschnitte: [
      { t: 'Vom Scoring zum Zins', p: ['Das bankinterne Scoring ordnet jeden Antrag einer Risikoklasse von A bis E zu. Je höher das Ausfallrisiko, desto höher der Zins.'], tabelle: 'konditionen' },
      { t: 'Kompetenzregelung', tabelle: 'kompetenz' },
      { t: 'Das Votum', p: ['Im Votum fassen Sie die Prüfung zusammen und entscheiden: zustimmen, zustimmen mit Auflagen, ablehnen oder zurück an die Kundin, wenn Unterlagen oder Angaben fehlen. Begründen Sie immer mit der persönlichen und der wirtschaftlichen Kreditwürdigkeit.'] },
      { t: 'Ablehnung', liste: ['klar und respektvoll mitteilen', 'sachlich begründen', 'über die Auskunft informieren, wenn sie der Grund ist', 'Wege aufzeigen: kleinerer Betrag, längere Laufzeit, Mitantrag'] }
    ] },
    { id: 'annuitaet', titel: 'Rate, Zinsen und Tilgung', ab: '2027-01-27', abschnitte: [
      { t: 'Annuität', p: ['Der SchlossKredit wird in gleichbleibenden Monatsraten zurückgezahlt. Jede Rate besteht aus Zinsen und Tilgung. Weil die Restschuld sinkt, wird der Zinsanteil kleiner und der Tilgungsanteil größer.'] },
      { t: 'Rechenweg', liste: ['Monatszins i = Sollzins : 12', 'Rate = Kreditbetrag × i : (1 − (1 + i) hoch −n), n = Laufzeit in Monaten', 'Zinsen eines Monats = Restschuld × i', 'Tilgung = Rate − Zinsen', 'Gesamtbetrag = Rate × n', 'Effektiver Jahreszins = (1 + i) hoch 12 − 1, wenn keine weiteren Kosten anfallen'] },
      { t: 'In Excel', liste: ['Rate: =RMZ(Zins/12; Laufzeit; −Kreditbetrag)', 'Zinsanteil einer Rate: =ZINSZ(Zins/12; Monat; Laufzeit; −Kreditbetrag)', 'Tilgungsanteil einer Rate: =KAPZ(Zins/12; Monat; Laufzeit; −Kreditbetrag)'] }
    ] }
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
      frei: ['rechner', 'rechner-tool'], fahrplan: 3 },
    { id: 'votum',     titel: 'Kreditentscheidung (Votum)', hash: '0afdc5e4b11e4861d7766876908578fe5c70f6ab57bec7cb169fde0521a31507',
      frei: ['votum'], fahrplan: 3 }
  ],

  /* ------------------------------------------------------- STUNDEN-EINSTIEGE
     Ein Einstiegscode bringt ein Gerät auf den Stand „bis hierhin erledigt“,
     damit ein Team nach Fehlen oder Gerätewechsel nicht alles neu eintippen muss.
     „stand“ nennt die Schritte, die mit dem Musterstand gefüllt werden
     (bereits abgeschlossene Stationen bleiben unverändert).
     „frei“ nennt die Funktionen, die dabei mit geöffnet werden.              */
  einstiege: [
    { titel: 'Einstieg: Selbstauskunft ist erfasst', hash: '097950117b9cafcfcb1d277897820223fbc5e103d3d907cacc0a022247f8fdaf',
      stand: ['antrag', 'selbstauskunft'], frei: ['selbstauskunft', 'dokumente', 'umsaetze', 'post-termin'] },
    { titel: 'Einstieg: Auskunft ist abgerufen', hash: '769da0be4bae711b1f6b96d3447aa05474b9d134faea4fe51dc3ba2120deab34',
      stand: ['antrag', 'selbstauskunft', 'auskunftei'], frei: ['selbstauskunft', 'dokumente', 'umsaetze', 'post-termin', 'auskunftei', 'post-auskunft'] },
    { titel: 'Einstieg: Haushaltsrechnung ist fertig', hash: 'e80c3db78dc6425897bd915d820a9668a21445f99c436c7692c781219410f19b',
      stand: ['antrag', 'selbstauskunft', 'auskunftei', 'haushalt'], frei: ['selbstauskunft', 'dokumente', 'umsaetze', 'post-termin', 'auskunftei', 'post-auskunft', 'haushalt'] },
    { titel: 'Einstieg: Kreditrechner ist fertig', hash: '05fe3916cf7e0d976882674d04c9df3bf11253dd72d06d8cec10b89b42f47276',
      stand: ['antrag', 'selbstauskunft', 'auskunftei', 'haushalt', 'rechner'], frei: ['selbstauskunft', 'dokumente', 'umsaetze', 'post-termin', 'auskunftei', 'post-auskunft', 'haushalt', 'rechner'] }
  ],

  /* ------------------------------------------------------------- PRODUKTE
     Auswahl beim Anlegen eines Kreditantrags. „gesperrt“: sichtbar, aber nicht wählbar. */
  produkte: [
    { id: 'kredit', name: 'SchlossKredit', art: 'Allgemein-Verbraucherdarlehen (Ratenkredit)',
      text: '1.000 € bis 75.000 €, 12 bis 96 Monate, gebundener Sollzins. Auch als SchlossKredit Auto.' },
    { id: 'bau', name: 'SchlossBaufinanzierung', art: 'Immobiliar-Verbraucherdarlehen', gesperrt: 'Nur für das Team Baufinanzierung' },
    { id: 'leasing', name: 'SchlossLeasing', art: 'Kfz-Leasing über Partner', gesperrt: 'Für Sie noch nicht freigegeben' }
  ],
  antragsnummer: 'KA-2026-004417',
  // Unterlagen, die für den Antrag vorliegen müssen (zum Abhaken im Kreditantrag)
  unterlagen: [
    ['sa', 'Selbstauskunft PK-07, unterschrieben'],
    ['gehalt', 'Gehaltsabrechnungen der letzten 3 Monate'],
    ['ausweis', 'Personalausweis im Original geprüft'],
    ['miete', 'Mietvertrag']
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
      id: 'recht', frei: 'post-auskunft', von: 'Dr. Miriam Vogt', rolle: 'Rechtsabteilung', kuerzel: 'MV',
      datum: '2026-11-20', zeit: '08:30', betreff: 'Neues Verbraucherkreditrecht gilt ab heute',
      text: [
        'Liebe Kolleginnen und Kollegen in der Kreditberatung,',
        'seit heute, 20.11.2026, gilt das neue Verbraucherkreditrecht. Es gilt für alle Verträge, die ab heute geschlossen werden.',
        'Für Ihre tägliche Arbeit besonders wichtig: „Später bezahlen“ und Ratenkäufe über Zahlungsdienste (Buy now, pay later) gelten jetzt als Verbraucherkredite. Das gilt auch für kleine Beträge und für zinsfreie Angebote.',
        'Behandeln Sie solche Ratenpläne in der Kreditprüfung deshalb wie jeden anderen bestehenden Kredit.',
        'Bei Fragen zum neuen Recht erreichen Sie uns unter der Durchwahl -340.',
        'Viele Grüße',
        'Dr. Miriam Vogt'
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
        ['Haushalt', [
          ['Wohnsituation', 'bei den Eltern'], ['Personen im Haushalt', '3'], ['unterhaltsberechtigte Kinder', '0'],
          ['Stand der Angaben', '09/2019']
        ]],
        ['Beruf und Einkommen', [
          ['Beruf', 'Auszubildende'], ['Arbeitgeber', 'Kreiskrankenhaus Alzenau'],
          ['Arbeitsverhältnis', 'befristet (Ausbildungsvertrag bis 08/2022)'], ['beschäftigt seit', '09/2019'],
          ['Nettoeinkommen', 'nicht erfasst'], ['Stand der Angaben', '09/2019']
        ]]
      ],

      produkte: [
        { id: 'giro', name: 'SchlossKonto Online', art: 'Girokonto (Gehaltskonto)', iban: 'DE12 7955 0000 0010 0531 86',
          details: [['Dispositionskredit', '2.000,00 € (seit 09/2022)'], ['Sollzins Dispo', '10,90 % p. a.'], ['Kontoführung', '0,00 € (Geldeingang über 700 €)']] },
        { id: 'tagesgeld', name: 'SchlossTagesgeld', art: 'Tagesgeldkonto', iban: 'DE56 7955 0000 0030 0531 86', saldo: 3400.00,
          details: [['Zins', '1,50 % p. a.'], ['Sparrate', '100,00 € monatlich per Dauerauftrag']] },
        { id: 'karte', name: 'SchlossCard', art: 'Debitkarte', details: [['Status', 'aktiv'], ['Tageslimit', '1.000,00 €']] }
      ],

      /* Hinweise in der Kundenübersicht. art: 'info' | 'pruef' (Prüfauftrag) | 'impuls' (Vertriebsimpuls).
         Prüfaufträge sagen nur, WAS zu prüfen ist. Das Ergebnis finden die Beraterinnen und Berater selbst.
         „frei“: Hinweis erscheint erst nach dieser Freischaltung.                                          */
      hinweise: [
        { art: 'info',    text: 'Offene Kreditanfrage vom 10.11.2026 über das Postfach (Autofinanzierung).' },
        { art: 'pruef',   text: 'Prüfauftrag: Stammdaten vor der Antragstellung auf Vollständigkeit und Aktualität prüfen.' },
        { art: 'pruef',   frei: 'umsaetze', text: 'Prüfauftrag: Kontoführung der letzten drei Monate prüfen.' },
        { art: 'pruef',   frei: 'dokumente', text: 'Prüfauftrag: Angaben der Selbstauskunft mit den Nachweisen abgleichen.' },
        { art: 'impuls',  text: 'Absicherung der Arbeitskraft (Berufsunfähigkeit) ansprechen.' },
        { art: 'impuls',  text: 'Bei Autokauf Kfz-Versicherung über Partner anbieten.' }
      ],

      // Kundenakte: Kontakthistorie (neueste zuerst)
      kontakte: [
        { datum: '2026-11-10', kanal: 'Postfach', wer: 'Kundin', text: 'Kreditanfrage Autofinanzierung, Wunsch nach Beratungstermin (werktags ab 15:30 Uhr).' },
        { datum: '2025-06-16', kanal: 'App', wer: 'Kundin', text: 'Adressänderung: Umzug nach Alzenau, Hanauer Straße 27.' },
        { datum: '2024-03-08', kanal: 'Filiale Alzenau', wer: 'C. Seidel', text: 'SchlossTagesgeld eröffnet, Dauerauftrag 100 € monatlich. Kundin möchte Rücklagen aufbauen.' },
        { datum: '2022-09-12', kanal: 'Filiale Alzenau', wer: 'C. Seidel', text: 'Ausbildung abgeschlossen, unbefristete Übernahme als Pflegefachfrau (Haus heißt jetzt Kahlgrund-Klinikum). Umstellung auf SchlossKonto Online, Dispositionskredit 2.000 € eingeräumt. Absicherung Berufsunfähigkeit angesprochen, Kundin möchte später darauf zurückkommen.' },
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

      /* Auskunftei (Muster). Im echten Bankbetrieb wäre das die SCHUFA.
         Die Auskunft zeigt nur Einträge und den Scorewert. Sie deutet nichts:
         Die Auswertung ist Aufgabe der Beraterinnen und Berater.                */
      auskunftei: {
        abfrage: '2026-12-01', grund: 'Kreditanfrage (Ratenkredit)',
        scorewert: 742, skala: 'Skala von 100 bis 999 Punkten',
        eintraege: [
          ['Girokonto', 'Schlossbank Aschaffenburg AG', '09/2019', 'Dispositionsrahmen 2.000 €', 'vertragsgemäß'],
          ['Debitkarte', 'Schlossbank Aschaffenburg AG', '09/2019', '', 'vertragsgemäß'],
          ['Mobilfunkvertrag', 'TeleMain Mobilfunk GmbH', '03/2021', '', 'vertragsgemäß'],
          ['Ratenzahlungskonto', 'SpäterZahlen GmbH', '05/2025', 'Rahmen 1.500 €, 2 laufende Ratenpläne', 'vertragsgemäß'],
          ['Rechnungskauf / Ratenkauf', 'KaufJetzt Pay AG', '02/2026', 'Rahmen 750 €, Saldo 0 €', 'vertragsgemäß']
        ],
        anfragen: [
          ['01.12.2026', 'Schlossbank Aschaffenburg AG', 'Anfrage Kreditkonditionen']
        ]
      },

      // Musterstand für die Stunden-Einstiege (siehe „einstiege“ oben)
      musterstand: { rechner: { betrag: '12500', laufzeit: '48', rk: 'B', auto: true } },

      /* Haushaltsrechnung: erwartete Werte für die Kontrolle im Modus „Selbst rechnen“.
         soll = richtiger Betrag (Bankansatz), t1 = erster Hinweis (Denkanstoß), t2 = zweiter Hinweis (Lösungsweg).
         sa = Felder der Selbstauskunft, die in der Spalte „Kundenangabe“ erscheinen.                    */
      haushalt: {
        zeilen: [
          { id: 'gehalt', sa: ['gehalt'], gruppe: 'ein', label: 'Nettogehalt (regelmäßig, nachgewiesen)', soll: 2250,
            t1: 'Vergleichen Sie Selbstauskunft, Gehaltsabrechnungen und Gehaltseingänge. Welcher Betrag kommt jeden Monat sicher?',
            t2: 'Angesetzt wird das feste Nettogehalt laut Gehaltsabrechnung: 2.250,00 €. In der Selbstauskunft hat Frau Keller die Zuschläge mit eingerechnet.' },
          { id: 'zulagen', sa: ['zulagen'], gruppe: 'ein', label: 'Zulagen, Nebeneinkünfte (dauerhaft gesichert)', soll: 0,
            t1: 'Sind die Schichtzuschläge jeden Monat gleich hoch? Was sagt die Richtlinie dazu?',
            t2: 'Die Zuschläge schwanken (180 €, 310 €, 220 €). Nach der Richtlinie bleiben sie außer Ansatz: 0,00 €.' },
          { id: 'sonstEin', sa: ['kindergeld', 'sonstEin'], gruppe: 'ein', label: 'Sonstige Einnahmen (Kindergeld, Unterhalt …)', soll: 0,
            t1: 'Ist die monatliche Gutschrift von Paul Neumann ein Einkommen von Frau Keller?',
            t2: 'Pauls 480 € sind sein Anteil an der Miete, kein Einkommen. Berücksichtigt wird das bei der Miete: 0,00 €.' },
          { id: 'miete', sa: ['miete'], gruppe: 'aus', label: 'Warmmiete (eigener Anteil)', soll: 480,
            t1: 'Wie viel von den 960 € trägt Frau Keller am Ende selbst? Schauen Sie auf die Gutschriften.',
            t2: 'Dauerauftrag 960 € abzüglich Pauls Anteil 480 € ergibt den eigenen Anteil: 480,00 €.' },
          { id: 'pauschale', sa: [], gruppe: 'aus', label: 'Lebenshaltung (Pauschale laut Richtlinie)', soll: 800,
            t1: 'Die Pauschale steht in der Richtlinie Haushaltsrechnung unter „Unsere Bank“. Wie viele Personen stehen im Antrag?',
            t2: 'Antragstellerin ist nur Frau Keller: Pauschale für die erste erwachsene Person 800,00 €.' },
          { id: 'versicherung', sa: ['versicherungen'], gruppe: 'aus', label: 'Versicherungen', soll: 40,
            t1: 'Suchen Sie in den Umsätzen nach Versicherungsbeiträgen.',
            t2: 'Privathaftpflicht und Hausrat bei der Untermain Versicherung AG: 40,00 € im Monat.' },
          { id: 'telefon', sa: ['telefonKosten'], gruppe: 'aus', label: 'Telefon, Mobilfunk, Internet', soll: 45,
            t1: 'Stimmt die Angabe in der Selbstauskunft mit den Lastschriften überein?',
            t2: 'In der Selbstauskunft fehlt der Mobilfunkvertrag: 45,00 € im Monat. Streaming ist mit der Pauschale abgedeckt.' },
          { id: 'kfz', sa: ['kfz'], gruppe: 'aus', label: 'Kfz-Kosten (künftiges Auto)', soll: 230,
            t1: 'Frau Keller hat noch kein Auto. Was sieht die Richtlinie vor, wenn tatsächliche Kosten fehlen?',
            t2: 'Kfz-Pauschale für einen Kleinwagen laut Richtlinie: 230,00 € (statt der geschätzten 200 €).' },
          { id: 'raten', sa: ['raten'], gruppe: 'aus', label: 'Raten für bestehende Kredite, Leasing', soll: 0,
            t1: 'Gibt es in den Unterlagen einen Bankkredit oder Leasingvertrag?',
            t2: 'Es bestehen keine Kredite oder Leasingverträge: 0,00 €.' },
          { id: 'bnpl', sa: ['bnpl'], gruppe: 'aus', label: 'Ratenkäufe, „Später bezahlen“', soll: 60,
            t1: 'Die Selbstauskunft nennt hier nichts. Was zeigen die Kontoumsätze Mitte des Monats?',
            t2: 'Zwei laufende Ratenpläne bei der SpäterZahlen GmbH: 34,90 € + 25,10 € = 60,00 € im Monat.' },
          { id: 'unterhalt', sa: ['unterhalt'], gruppe: 'aus', label: 'Unterhaltszahlungen', soll: 0,
            t1: 'Hat Frau Keller unterhaltsberechtigte Kinder?', t2: 'Keine Unterhaltspflichten: 0,00 €.' },
          { id: 'sparen', sa: ['sparen'], gruppe: 'aus', label: 'Spar- und Bausparverträge', soll: 0,
            t1: 'Ist eine Sparrate eine Ausgabe, die Frau Keller leisten muss? Lesen Sie in der Richtlinie nach.',
            t2: 'Sparraten sind nach der Richtlinie keine Ausgaben, sie können jederzeit gestoppt werden: 0,00 €.' },
          { id: 'sonstAus', sa: ['sonstAus'], gruppe: 'aus', label: 'Sonstige regelmäßige Ausgaben', soll: 0,
            t1: 'Fitnessstudio, Streaming, Deutschlandticket: Was davon zählt nach der Richtlinie zusätzlich?',
            t2: 'Freizeit, Streaming und Nahverkehr deckt die Pauschale ab: 0,00 €.' }
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
