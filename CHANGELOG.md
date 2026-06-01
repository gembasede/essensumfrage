# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

## [Unreleased]

### Added
- **Chatbot-Zustandsmaschine**: Interaktiver Chatbot, der 7 gezielte Fragen zu Lieblingsgerichten, Gemüse (Vorlieben und No-Gos), Beilagen, Fleischpräferenzen, Länderküchen, Umfang und Snack-Stil stellt.
- **Schnellantwort-Chips**: Mobile-First-Buttons für schnelles Klicken direkt am Smartphone.
- **Supabase-Integration**: Direktes Speichern der Antworten in einer Supabase-Tabelle.
- **Admin-Dashboard**: Unter `?admin=true` erreichbares, passwortgeschütztes Dashboard, das Einträge auflistet und das Löschen ermöglicht.
- **Backup-Exporte**: WhatsApp-Direktversand und Clipboard-Kopierfunktion auf der Abschlusskarte.
- **Doppelklick-Kompatibilität**: Entfernung von ES-Modulen zur Vermeidung von CORS-Problemen bei lokalem Start.
- **Premium Design**: Warmes, einladendes Farbschema mit HSL-Erdfarben, sanften Einblend-Animationen und Schreib-Indikator.
- **Massive Antwort-Chips-Erweiterung**: Über 80 neue, vordefinierte Antwort-Optionen für alle Fragen, damit der Chatbot ohne Tippen bedient werden kann.
- **Intelligente Freitext-Chip-UX**: Bei Mehrfachauswahl-Fragen springt eine Freitexteingabe nicht mehr zum nächsten Schritt. Stattdessen wird die Eingabe als neuer, farbiger Chip erzeugt und automatisch markiert. Erst mit "Weiter" geht es zum nächsten Schritt.

### Fixed
- **Laufzeit-Syntaxfehler**: Die versehentlich in `app.js` wieder eingeführte doppelte Deklaration der Konstante `CONFIG` wurde erneut entfernt. Dies behebt das Problem, dass der Bot nicht lädt und die Eingabe komplett blockiert war.
