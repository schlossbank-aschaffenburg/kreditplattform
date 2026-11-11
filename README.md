# Schlossbank Kreditplattform

Web-App für den Unterricht im Lernfeld Kreditgeschäft (Bankkaufleute). Die Lernenden arbeiten als Kreditberaterinnen und Kreditberater der **Schlossbank Aschaffenburg AG** und begleiten eine Kundin durch den Kreditprozess.

Die Schlossbank Aschaffenburg AG ist ein frei erfundenes Modellunternehmen. Alle Personen, Firmen, Adressen und Zahlen sind fiktiv.

## Was die App kann

- **Mein Arbeitsplatz:** Aufgaben, Kreditfahrplan, Posteingang
- **Kundenübersicht (Beratersicht):** Stammdaten, Konten und Umsätze, Hinweise, Kundenakte mit eigenen Vermerken, Dokumente, Auskunftei
- **Kreditantrag:** Selbstauskunft erfassen, Haushaltsrechnung, Kreditrechner mit Tilgungsplan
- **Zwei Modi:** „Selbst rechnen“ (das System kontrolliert nur und gibt gestufte Hinweise) und „Beratertool“ (das System rechnet)
- **Freischalten:** Funktionen und Nachrichten werden Stunde für Stunde per Code geöffnet
- **Drucken / als PDF:** Jede Station lässt sich als Blatt sichern
- **Offline:** Nach dem ersten Öffnen läuft die App ohne Internet

## Datenschutz

Die App hat kein Login und keinen Server. Sie überträgt keine Daten und verwendet keine Dienste Dritter. Eingaben bleiben im Browser des jeweiligen Geräts.

## Aufbau

| Datei | Inhalt |
|---|---|
| `js/daten.js` | **Alle Inhalte:** Bank, Konditionen, Kundin, Umsätze, Nachrichten, Freischaltungen |
| `js/app.js` | Programm (muss für inhaltliche Änderungen nicht angefasst werden) |
| `css/app.css` | Gestaltung |
| `sw.js` | Offline-Betrieb |

## Inhalte ändern

Zahlen und Texte stehen in `js/daten.js` und sind dort kommentiert. Nach einer Änderung in `sw.js` die Versionsnummer erhöhen, damit alle Geräte die neue Fassung laden.

## Freischaltcodes

In `js/daten.js` stehen nur Prüfwerte, nicht die Codes selbst. Einen Prüfwert für einen neuen Code erzeugt man in der App: mit dem Lehrkraft-Code anmelden, dann oben rechts auf das Kürzel tippen und unter „Lehrkraft“ den neuen Code eingeben.
