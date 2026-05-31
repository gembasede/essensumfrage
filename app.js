// CONFIG wird bereits global über config.js geladen und steht direkt zur Verfügung

// Globaler Zustand der App
let state = {
  currentStep: 0,
  answers: {
    favorite_dishes: [],
    vegetables_love: [],
    vegetables_hate: [],
    carbs_preferences: [],
    meat_preference: '',
    cuisine_preferences: [],
    meal_types: [],
    snack_style: '',
    custom_feedback: '',
    summary: ''
  },
  supabase: null
};

// ==========================================================================
// SUPABASE CLIENT INITIALISIERUNG
// ==========================================================================
function initSupabase() {
  if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_URL !== 'DEINE_SUPABASE_URL' &&
      CONFIG.SUPABASE_ANON_KEY && CONFIG.SUPABASE_ANON_KEY !== 'DEIN_SUPABASE_ANON_KEY') {
    try {
      state.supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
      console.log("Supabase erfolgreich initialisiert!");
    } catch (e) {
      console.error("Fehler bei der Supabase-Initialisierung:", e);
    }
  } else {
    console.warn("Supabase ist nicht konfiguriert. Daten werden lokal verarbeitet.");
  }
}

// ==========================================================================
// CHATBOT FRAGEN-DEFINITIONEN
// ==========================================================================
const QUESTIONS = [
  {
    // Schritt 0
    text: `Hi! Schön, dass du da bist. 😊 Wir wollen unsere Essens- und Einkaufsplanung ab jetzt komplett automatisieren, damit wir sonntags immer direkt coole Vorschläge bekommen und unter der Woche weniger Stress haben.<br><br>Ein paar Eckdaten (wie deine geliebten Nudeln mit Tomatensoße oder dass Lachs für dich ausfällt) habe ich schon eingespeichert.<br><br>Ich würde dir gerne ein paar kurze Fragen stellen, um das Ganze perfekt zu machen. Bereit?<br><br><strong>Frage 1: Was isst du neben Pasta noch richtig gerne? (z.B. Aufläufe, Suppen, Pfannengerichte...)</strong>`,
    type: 'multi-select',
    chips: ['Aufläufe 🍲', 'Suppen & Eintöpfe 🥣', 'Ofengemüse 🥦', 'Pfannengerichte 🍳', 'Salate 🥗', 'Kartoffelgerichte 🥔'],
    field: 'favorite_dishes'
  },
  {
    // Schritt 1
    text: `Super, ist notiert! 📝<br><br><strong>Frage 2a: Wie sieht es beim Gemüse aus? Was liebst du total?</strong> (Wähle deine Favoriten aus und klicke auf Weiter)`,
    type: 'multi-select-next',
    chips: ['Tomaten 🍅', 'Zucchini 🥒', 'Brokkoli 🥦', 'Paprika 🫑', 'Karotten 🥕', 'Spinat 🍃', 'Avocado 🥑', 'Blumenkohl 🥦'],
    field: 'vegetables_love'
  },
  {
    // Schritt 2
    text: `Alles klar. 🌱<br><br><strong>Frage 2b: Und welches Gemüse sollte ich auf gar keinen Fall auf den Plan setzen? ❌</strong> (Wähle deine No-Gos aus und klicke auf Weiter)`,
    type: 'multi-select-next',
    chips: ['Rosenkohl 🥬', 'Pilze 🍄', 'Sellerie 🌿', 'Fenchel 🧅', 'Auberginen 🍆', 'Oliven 🫒', 'Keines / Ich mag alles! 👍'],
    field: 'vegetables_hate'
  },
  {
    // Schritt 3
    text: `Nudeln und Kartoffeln haben wir ja schon auf dem Schirm. 🥔🍝<br><br><strong>Frage 3: Wie sieht es mit anderen Beilagen aus? Worauf hast du da Lust?</strong>`,
    type: 'multi-select',
    chips: ['Reis-Gerichte 🌾', 'Couscous & Bulgur 🥣', 'Süßkartoffeln 🍠', 'Wraps / Tortillas 🫓', 'Eher Low-Carb (mehr Salat/Gemüse) 🥗'],
    field: 'carbs_preferences'
  },
  {
    // Schritt 4
    text: `Da wir tendenziell eher weniger Fleisch essen wollen: 🌱<br><br><strong>Frage 4: Wenn es doch mal Fleisch gibt, was ist dir da am liebsten?</strong>`,
    type: 'single-select',
    chips: ['Eher Geflügel (Hähnchen/Pute) 🍗', 'Rinderhackfleisch 🥩', 'Komplett vegetarisch (kein Fleisch) 🌱', 'Ganz was anderes (siehe Text)']
    // Freitext geht auch, Feld wird in app.js gehandhabt
  },
  {
    // Schritt 5
    text: `Perfekt. 🗺️<br><br><strong>Frage 5: Wenn du an deine Lieblingsgerichte denkst: In welche Länderküche zieht es dich am häufigsten?</strong>`,
    type: 'multi-select',
    chips: ['Italienisch (Pizza/Pasta) 🇮🇹', 'Asiatisch (Currys/Wok) 🥢', 'Mexikanisch (Tacos/Wraps) 🇲🇽', 'Griechisch / Mediterran 🇬🇷', 'Hausmannskost 🇩🇪', 'Egal, Hauptsache lecker! 😋'],
    field: 'cuisine_preferences'
  },
  {
    // Schritt 6
    text: `Fast geschafft! 🚀<br><br><strong>Frage 6: Sollen wir uns sonntags nur Ideen für das warme Mittag-/Abendessen holen, oder hättest du auch gerne mal Inspiration für ein gesundes Frühstück oder ein paar schnelle Snacks?</strong>`,
    type: 'multi-select',
    chips: ['Nur warmes Mittag-/Abendessen 🍽️', 'Auch gesundes Frühstück 🥞', 'Schnelle Snacks für zwischendurch 🍎'],
    field: 'meal_types'
  },
  {
    // Schritt 7
    text: `Und die letzte Frage: 🤔<br><br><strong>Frage 7: Bist du morgens und zwischendurch eher Team Süß (z.B. Müsli, Porridge, Obst) oder Team Herzhaft (z.B. Avocado-Toast, Rührei, Hummus)?</strong>`,
    type: 'single-select',
    chips: ['Absolut Team Süß 🥞', 'Lieber herzhaft 🧀', 'Bunte Mischung aus beidem 🍉', 'Kein Frühstück/Snacks ☕']
  }
];

// ==========================================================================
// CHAT LOGIK & RENDERER
// ==========================================================================

const messagesContainer = document.getElementById('chat-messages');
const quickRepliesContainer = document.getElementById('quick-replies-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// Initialisierung bei Seitenaufruf
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
  
  // Überprüfen, ob Admin-Modus aktiv sein soll
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('admin')) {
    showAdminDashboard();
  } else {
    startChatbot();
  }
  
  lucide.createIcons();
});

// Startet den Chatbot und stellt die erste Frage
function startChatbot() {
  addBotTypingIndicator();
  setTimeout(() => {
    removeBotTypingIndicator();
    addBotMessage(QUESTIONS[0].text);
    renderChips(QUESTIONS[0]);
  }, 1200);
}

// Fügt eine Nachricht des Bots hinzu
function addBotMessage(text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message bot';
  
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  msgDiv.innerHTML = `
    <div class="bubble">${text}</div>
    <span class="message-time">${time}</span>
  `;
  
  messagesContainer.appendChild(msgDiv);
  scrollToBottom();
}

// Fügt eine Nachricht des Nutzers hinzu
function addUserMessage(text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message user';
  
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  msgDiv.innerHTML = `
    <div class="bubble">${text}</div>
    <span class="message-time">${time}</span>
  `;
  
  messagesContainer.appendChild(msgDiv);
  scrollToBottom();
}

// Fügt die Tipp-Animation hinzu
function addBotTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot typing-msg';
  typingDiv.id = 'bot-typing-indicator';
  typingDiv.innerHTML = `
    <div class="bubble typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  messagesContainer.appendChild(typingDiv);
  scrollToBottom();
}

// Entfernt die Tipp-Animation
function removeBotTypingIndicator() {
  const indicator = document.getElementById('bot-typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

// Scrollt den Chat nach unten
function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Render der Chips im Quick-Reply-Bereich
function renderChips(question) {
  quickRepliesContainer.innerHTML = '';
  
  if (!question.chips || question.chips.length === 0) return;
  
  const selectedValues = new Set();
  
  question.chips.forEach(chipText => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = chipText;
    
    chip.addEventListener('click', () => {
      if (question.type === 'single-select') {
        // Einfachauswahl: Sofort absenden
        addUserMessage(chipText);
        saveAnswer(question, chipText);
        nextStep();
      } else {
        // Mehrfachauswahl: Markieren / Entmarkieren
        if (selectedValues.has(chipText)) {
          selectedValues.delete(chipText);
          chip.classList.remove('selected');
        } else {
          selectedValues.add(chipText);
          chip.classList.add('selected');
        }
      }
    });
    
    quickRepliesContainer.appendChild(chip);
  });
  
  // Wenn es eine Mehrfachauswahl ist, brauchen wir einen "Weiter"-Button
  if (question.type === 'multi-select' || question.type === 'multi-select-next') {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'chip selected';
    nextBtn.style.backgroundColor = 'var(--secondary)';
    nextBtn.style.borderColor = 'var(--secondary)';
    nextBtn.innerHTML = 'Weiter <i data-lucide="arrow-right" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-left:4px;"></i>';
    
    nextBtn.addEventListener('click', () => {
      const selectedArray = Array.from(selectedValues);
      if (selectedArray.length === 0) {
        addUserMessage("Keine Angabe / Weiter");
        saveAnswer(question, []);
      } else {
        addUserMessage(selectedArray.join(', '));
        saveAnswer(question, selectedArray);
      }
      nextStep();
    });
    
    quickRepliesContainer.appendChild(nextBtn);
    lucide.createIcons();
  }
}

// Speichert die Antwort im globalen Zustand
function saveAnswer(question, value) {
  const currentQ = QUESTIONS[state.currentStep];
  
  if (state.currentStep === 0) {
    state.answers.favorite_dishes = Array.isArray(value) ? value : [value];
  } else if (state.currentStep === 1) {
    state.answers.vegetables_love = value;
  } else if (state.currentStep === 2) {
    state.answers.vegetables_hate = value;
  } else if (state.currentStep === 3) {
    state.answers.carbs_preferences = value;
  } else if (state.currentStep === 4) {
    state.answers.meat_preference = value;
  } else if (state.currentStep === 5) {
    state.answers.cuisine_preferences = value;
  } else if (state.currentStep === 6) {
    state.answers.meal_types = value;
  } else if (state.currentStep === 7) {
    state.answers.snack_style = value;
  }
}

// Verarbeitet den nächsten Schritt
function nextStep() {
  state.currentStep++;
  
  // Eingabefeld leeren
  chatInput.value = '';
  quickRepliesContainer.innerHTML = '';
  
  if (state.currentStep < QUESTIONS.length) {
    addBotTypingIndicator();
    setTimeout(() => {
      removeBotTypingIndicator();
      const nextQ = QUESTIONS[state.currentStep];
      addBotMessage(nextQ.text);
      renderChips(nextQ);
    }, 1200);
  } else {
    // Ende des Chats -> Zusammenfassung und Speichern
    finishChat();
  }
}

// Freitext absenden über Eingabefeld oder Sende-Button
function handleUserInput() {
  const text = chatInput.value.trim();
  if (!text) return;
  
  addUserMessage(text);
  
  // Antwort speichern
  const question = QUESTIONS[state.currentStep];
  saveAnswer(question, text);
  
  nextStep();
}

sendBtn.addEventListener('click', handleUserInput);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleUserInput();
  }
});

// ==========================================================================
// ABSCHLUSS, ZUSAMMENFASSUNG & EXPORT
// ==========================================================================
async function finishChat() {
  addBotTypingIndicator();
  
  // Erstelle Zusammenfassungs-Text
  const summaryText = buildSummaryText();
  state.answers.summary = summaryText;
  
  // In Supabase speichern
  const savedSuccessfully = await saveToSupabase();
  
  setTimeout(() => {
    removeBotTypingIndicator();
    
    let botResponse = `Vielen Dank! Ich habe alles abgespeichert. 😊`;
    if (savedSuccessfully) {
      botResponse += ` Deine Antworten wurden direkt in unsere Datenbank übertragen.`;
    } else {
      botResponse += ` (Da die Datenbank offline war, kannst du die Antworten über die Buttons unten an ${CONFIG.PARTNER_NAME} senden).`;
    }
    
    addBotMessage(botResponse);
    
    // Summary Card rendern
    renderSummaryCard(summaryText);
  }, 1500);
}

// Baut die strukturierte Zusammenfassung
function buildSummaryText() {
  const ans = state.answers;
  
  return `🍕 MEINE ESSENSPRÄFERENZEN:
• Lieblingsgerichte: ${ans.favorite_dishes.length > 0 ? ans.favorite_dishes.join(', ') : 'Keine Angabe'}
• Gemüse-Favoriten: ${ans.vegetables_love.length > 0 ? ans.vegetables_love.join(', ') : 'Keine Angabe'}
• Gemüse-Hate List: ${ans.vegetables_hate.length > 0 ? ans.vegetables_hate.join(', ') : 'Keine Angabe'}
• Beilagen-Favoriten: ${ans.carbs_preferences.length > 0 ? ans.carbs_preferences.join(', ') : 'Keine Angabe'}
• Fleisch-Vorliebe: ${ans.meat_preference || 'Keine Angabe'}
• Länderküchen: ${ans.cuisine_preferences.length > 0 ? ans.cuisine_preferences.join(', ') : 'Keine Angabe'}
• Planungs-Umfang: ${ans.meal_types.length > 0 ? ans.meal_types.join(', ') : 'Keine Angabe'}
• Frühstück & Snacks: ${ans.snack_style || 'Keine Angabe'}`;
}

// Rendert die grafische Zusammenfassung mit Exportbuttons im Chatverlauf
function renderSummaryCard(text) {
  const ans = state.answers;
  const cardDiv = document.createElement('div');
  cardDiv.className = 'summary-card';
  
  cardDiv.innerHTML = `
    <h3>Zusammenfassung deiner Wünsche</h3>
    <ul>
      <li><strong>Lieblingsgerichte:</strong> ${ans.favorite_dishes.join(', ') || 'Keine Angabe'}</li>
      <li><strong>Gemüse-Vorlieben:</strong> 😍 ${ans.vegetables_love.join(', ') || 'Keine Angabe'}</li>
      <li><strong>Gemüse-No-Gos:</strong> ❌ ${ans.vegetables_hate.join(', ') || 'Keine Angabe'}</li>
      <li><strong>Beilagen:</strong> ${ans.carbs_preferences.join(', ') || 'Keine Angabe'}</li>
      <li><strong>Fleisch:</strong> ${ans.meat_preference || 'Keine Angabe'}</li>
      <li><strong>Länderküchen:</strong> ${ans.cuisine_preferences.join(', ') || 'Keine Angabe'}</li>
      <li><strong>Umfang & Frühstücksstil:</strong> ${ans.meal_types.join(', ')} (${ans.snack_style || 'Keine Angabe'})</li>
    </ul>
    
    <div class="action-buttons-group">
      <button id="whatsapp-send-btn" class="action-btn whatsapp">
        <i data-lucide="message-square"></i> Per WhatsApp senden
      </button>
      <button id="copy-clipboard-btn" class="action-btn copy">
        <i data-lucide="copy"></i> In Zwischenablage kopieren
      </button>
    </div>
  `;
  
  messagesContainer.appendChild(cardDiv);
  scrollToBottom();
  lucide.createIcons();
  
  // WhatsApp Link
  document.getElementById('whatsapp-send-btn').addEventListener('click', () => {
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `whatsapp://send?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  });
  
  // In Zwischenablage kopieren
  document.getElementById('copy-clipboard-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Erfolgreich in die Zwischenablage kopiert! 🎉');
    }).catch(err => {
      console.error('Fehler beim Kopieren:', err);
    });
  });
}

// Speichert in Supabase
async function saveToSupabase() {
  if (!state.supabase) return false;
  
  try {
    const { data, error } = await state.supabase
      .from('food_preferences')
      .insert([
        {
          partner_name: CONFIG.PARTNER_NAME,
          favorite_dishes: state.answers.favorite_dishes,
          vegetables_love: state.answers.vegetables_love,
          vegetables_hate: state.answers.vegetables_hate,
          carbs_preferences: state.answers.carbs_preferences,
          meat_preference: state.answers.meat_preference,
          cuisine_preferences: state.answers.cuisine_preferences,
          meal_types: state.answers.meal_types,
          snack_style: state.answers.snack_style,
          summary: state.answers.summary
        }
      ]);
      
    if (error) {
      console.error("Supabase Save Error:", error);
      return false;
    }
    
    return true;
  } catch (e) {
    console.error("Fehler beim Speichern in Supabase:", e);
    return false;
  }
}

// ==========================================================================
// ADMIN DASHBOARD FUNKTIONEN
// ==========================================================================

const chatContainer = document.getElementById('chat-container');
const adminContainer = document.getElementById('admin-container');
const adminLoginBox = document.getElementById('admin-login-box');
const adminDataBox = document.getElementById('admin-data-box');
const adminPasswordInput = document.getElementById('admin-password');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginError = document.getElementById('login-error');
const refreshDataBtn = document.getElementById('refresh-data-btn');
const preferencesTableBody = document.getElementById('preferences-table-body');
const noDataMsg = document.getElementById('no-data-msg');

function showAdminDashboard() {
  chatContainer.classList.add('hidden');
  adminContainer.classList.remove('hidden');
  
  // Login Event Handler
  loginBtn.addEventListener('click', handleAdminLogin);
  adminPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAdminLogin();
  });
  
  logoutBtn.addEventListener('click', () => {
    // Einfach Seite neu laden ohne Admin-Flag oder Dashboard ausblenden
    window.location.search = '';
  });
  
  refreshDataBtn.addEventListener('click', fetchAdminData);
}

function handleAdminLogin() {
  const enteredPass = adminPasswordInput.value;
  
  if (enteredPass === CONFIG.ADMIN_PASSWORD) {
    loginError.classList.add('hidden');
    adminLoginBox.classList.add('hidden');
    adminDataBox.classList.remove('hidden');
    
    fetchAdminData();
  } else {
    loginError.classList.remove('hidden');
  }
}

async function fetchAdminData() {
  preferencesTableBody.innerHTML = '<tr><td colspan="10" style="text-align:center;">Lade Daten aus Supabase...</td></tr>';
  
  if (!state.supabase) {
    preferencesTableBody.innerHTML = '<tr><td colspan="10" style="text-align:center; color:#ef4444;">Supabase-Verbindung nicht konfiguriert oder fehlgeschlagen! Bitte config.js prüfen.</td></tr>';
    return;
  }
  
  try {
    const { data, error } = await state.supabase
      .from('food_preferences')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    renderAdminTable(data);
  } catch (err) {
    console.error("Fehler beim Laden der Admin-Daten:", err);
    preferencesTableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; color:#ef4444;">Fehler beim Laden: ${err.message}</td></tr>`;
  }
}

function renderAdminTable(data) {
  preferencesTableBody.innerHTML = '';
  
  if (!data || data.length === 0) {
    noDataMsg.classList.remove('hidden');
    return;
  }
  
  noDataMsg.classList.add('hidden');
  
  data.forEach(item => {
    const tr = document.createElement('tr');
    
    const formattedDate = new Date(item.created_at).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    tr.innerHTML = `
      <td>${formattedDate}</td>
      <td><strong>${item.partner_name || 'Unbekannt'}</strong></td>
      <td>${item.favorite_dishes ? item.favorite_dishes.join(', ') : '-'}</td>
      <td>
        <span style="color:var(--secondary); font-weight:600;">😍 ${item.vegetables_love ? item.vegetables_love.join(', ') : '-'}</span><br>
        <span style="color:var(--primary); font-weight:600;">❌ ${item.vegetables_hate ? item.vegetables_hate.join(', ') : '-'}</span>
      </td>
      <td>${item.carbs_preferences ? item.carbs_preferences.join(', ') : '-'}</td>
      <td>${item.meat_preference || '-'}</td>
      <td>${item.cuisine_preferences ? item.cuisine_preferences.join(', ') : '-'}</td>
      <td>${item.meal_types ? item.meal_types.join(', ') : '-'} (${item.snack_style || '-'})</td>
      <td class="table-summary">${item.summary || '-'}</td>
      <td>
        <button class="delete-btn" data-id="${item.id}">
          <i data-lucide="trash-2" style="width:14px;height:14px;"></i> Löschen
        </button>
      </td>
    `;
    
    preferencesTableBody.appendChild(tr);
  });
  
  // Lösch-Buttons Event-Listener
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (confirm('Möchtest du diesen Eintrag wirklich aus Supabase löschen?')) {
        await deleteEntry(id);
      }
    });
  });
  
  lucide.createIcons();
}

async function deleteEntry(id) {
  if (!state.supabase) return;
  
  try {
    const { error } = await state.supabase
      .from('food_preferences')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    // Nach erfolgreichem Löschen Daten neu laden
    fetchAdminData();
  } catch (err) {
    console.error("Fehler beim Löschen des Eintrags:", err);
    alert('Fehler beim Löschen des Eintrags: ' + err.message);
  }
}
