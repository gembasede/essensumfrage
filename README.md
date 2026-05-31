# Essensplaner Chatbot 🍳

Ein interaktiver, moderner und unkomplizierter Chatbot, der die kulinarischen Vorlieben deiner Freundin abfragt, um die wöchentliche Essens- und Einkaufsplanung zu automatisieren.

Die Antworten werden direkt in einer **Supabase-Datenbank** gespeichert. Falls der Bot offline genutzt wird oder Supabase nicht konfiguriert ist, gibt es einen Backup-Weg, um die Antworten direkt per WhatsApp oder Zwischenablage an den Partner zu senden.

---

## 🚀 Features

- **Freundlicher Chat**: Ein interaktiver Dialog mit natürlicher Tipp-Verzögerung.
- **Schnelle Antwort-Chips**: Einfaches Antippen von Vorlieben direkt auf dem Smartphone.
- **Supabase-Anbindung**: Automatisches Speichern der Ergebnisse in deiner eigenen Cloud-Datenbank.
- **Admin-Dashboard**: Eine versteckte Ansicht in der App, um alle bisherigen Antworten deiner Freundin übersichtlich einzusehen.
- **Backup-Export**: Ergebnisse können am Ende kopiert oder direkt als WhatsApp-Nachricht gesendet werden.
- **Responsive Design**: Wunderschöne, mobil-optimierte Oberfläche im modernen Look.

---

## 🛠️ Einrichtung & Start

Die App benötigt keinen Server und kann direkt im Browser gestartet werden.

### 1. Lokal starten
Doppelklicke einfach auf die [index.html](file:///c:/Users/gorni/Desktop/essensfragenbot/index.html) oder nutze einen lokalen Server (z.B. VS Code Live Server).

### 2. Supabase-Datenbank verbinden (Optional)
Damit die Antworten in deiner Datenbank gespeichert werden:
1. Erstelle ein kostenloses Konto auf [supabase.com](https://supabase.com).
2. Erstelle ein neues Projekt.
3. Gehe im Supabase-Dashboard zum **SQL Editor** und führe das SQL-Skript aus der [config.js](file:///c:/Users/gorni/Desktop/essensfragenbot/config.js) aus, um die Tabelle anzulegen.
4. Trage deine `SUPABASE_URL` und deinen `SUPABASE_ANON_KEY` in der Datei [config.js](file:///c:/Users/gorni/Desktop/essensfragenbot/config.js) ein.

### 3. Admin-Dashboard öffnen
Um die gespeicherten Antworten zu sehen, öffne die App einfach mit dem URL-Parameter `?admin=true`, also zum Beispiel:
`c:/Users/gorni/Desktop/essensfragenbot/index.html?admin=true` oder `http://localhost:5500/?admin=true`

---

## 📁 Projektstruktur

- **`index.html`**: Das HTML5-Grundgerüst der Chat-Oberfläche und des Admin-Dashboards.
- **`style.css`**: Das Design, Farbschema (Erd- und Kräutertöne), Animationen und Mobile-First-Styles.
- **`config.js`**: Deine Supabase-Konfiguration sowie das SQL-Skript für deine Datenbank.
- **`app.js`**: Der eigentliche Chatbot-Ablauf, das Speichern in Supabase, das Auslesen im Admin-Dashboard sowie WhatsApp-Funktionen.
- **`CHANGELOG.md`**, **`AI_WORKLOG.md`**, **`TODO.md`**: Projekt-Dokumentation.
