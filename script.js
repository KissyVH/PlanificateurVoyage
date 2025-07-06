let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 36.5, lng: 127.5 },
    zoom: 6,
  });
}

// Navigation entre les sections
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("mainContainer");
  const buttons = document.querySelectorAll("nav button");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const section = btn.dataset.section;
      loadSection(section, container);
    });
  });

  loadSection("overview", container); // Charge la première section par défaut
});
function loadVoyageurs(container) {
  container.innerHTML = `
    <section>
      <h2>👥 Voyageurs</h2>
      <button id="addTraveler">+ Ajouter un·e voyageur·se</button>
      <div id="travelerList"></div>
    </section>
  `;

  document.getElementById("addTraveler").addEventListener("click", () => {
    addTravelerForm();
  });
}

let travelerId = 0;

function addTravelerForm(data = {}) {
  const list = document.getElementById("travelerList");
  travelerId++;

  const div = document.createElement("div");
  div.className = "traveler-block";
  div.dataset.id = travelerId;

  div.innerHTML = `
    <hr />
    <label>Prénom :</label>
    <input type="text" class="prenom" value="${data.prenom || ''}" placeholder="Jean" />

    <label>Nom :</label>
    <input type="text" class="nom" value="${data.nom || ''}" placeholder="Dupont" />

    <label>Date d’arrivée :</label>
    <input type="date" class="arrivee" value="${data.arrivee || ''}" />

    <label>Date de retour :</label>
    <input type="date" class="depart" value="${data.depart || ''}" />

    <button class="removeTraveler">🗑️ Supprimer</button>
  `;

  div.querySelector(".removeTraveler").addEventListener("click", () => {
    list.removeChild(div);
  });

  list.appendChild(div);
}
function loadProgramme(container) {
  container.innerHTML = `
    <section>
      <h2>📆 Programme détaillé par jour</h2>
      <button id="addDayBlock">+ Ajouter un jour</button>
      <div id="dayBlocksContainer"></div>
    </section>
  `;

  document.getElementById("addDayBlock").addEventListener("click", () => {
    addDayBlock();
  });
}

let dayCounter = 0;

function addDayBlock(data = {}) {
  const container = document.getElementById("dayBlocksContainer");
  dayCounter++;

  const block = document.createElement("div");
  block.className = "day-block";

  block.innerHTML = `
    <h3>Jour ${dayCounter}</h3>
    <label>Date :</label>
    <input type="date" class="day-date" value="${data.date || ''}" />

    <div class="slots"></div>
    <button class="addSlotBtn">➕ Ajouter une plage horaire</button>
    <button class="removeDayBtn">🗑️ Supprimer ce jour</button>
  `;

  // Bouton pour ajouter une plage horaire
  const addSlotBtn = block.querySelector(".addSlotBtn");
  addSlotBtn.addEventListener("click", () => {
    addTimeSlot(block.querySelector(".slots"));
  });

  // Bouton pour supprimer le jour
  const removeBtn = block.querySelector(".removeDayBtn");
  removeBtn.addEventListener("click", () => {
    container.removeChild(block);
  });

  container.appendChild(block);
}

function addTimeSlot(container, data = {}) {
  const slot = document.createElement("div");
  slot.className = "time-slot";

  slot.innerHTML = `
    <label>Heure de début :</label>
    <input type="time" value="${data.start || ''}" />

    <label>Heure de fin :</label>
    <input type="time" value="${data.end || ''}" />

    <label>Type :</label>
    <select>
      <option value="activité">Activité</option>
      <option value="repas">Repas</option>
      <option value="transport">Transport</option>
      <option value="logement">Logement</option>
    </select>

    <label>Détails :</label>
    <input type="text" placeholder="Ex : Visite du temple Bulguksa" value="${data.detail || ''}" />

    <button class="removeSlotBtn">❌</button>
  `;

  slot.querySelector(".removeSlotBtn").addEventListener("click", () => {
    container.removeChild(slot);
  });

  container.appendChild(slot);
}
function loadActivites(container) {
  container.innerHTML = `
    <section>
      <h2>🎯 Activités prévues</h2>
      <button id="addActivity">+ Ajouter une activité</button>
      <div id="activityList"></div>
    </section>
  `;

  document.getElementById("addActivity").addEventListener("click", () => {
    addActivityForm();
  });
}

let activityCounter = 0;

function addActivityForm(data = {}) {
  const container = document.getElementById("activityList");
  activityCounter++;

  const block = document.createElement("div");
  block.className = "activity-block";

  block.innerHTML = `
    <hr />
    <h3>Activité ${activityCounter}</h3>

    <label>Nom / Description :</label>
    <input type="text" placeholder="Ex : Balade à Bukchon Hanok Village" value="${data.nom || ''}" />

    <label>Date :</label>
    <input type="date" value="${data.date || ''}" />

    <label>Heure :</label>
    <input type="time" value="${data.heure || ''}" />

    <label>Durée (heures) :</label>
    <input type="number" min="0" step="0.5" value="${data.duree || ''}" />

    <label>Prix (€) :</label>
    <input type="number" min="0" step="0.01" value="${data.prix || ''}" />

    <label>Infos utiles :</label>
    <textarea placeholder="Ex : Lieu, point de rendez-vous, tenue..." >${data.infos || ''}</textarea>

    <label>Participants :</label>
    <div class="participant-list">
      <!-- checkboxes générées dynamiquement -->
    </div>

    <button class="removeActivityBtn">🗑️ Supprimer cette activité</button>
  `;

  block.querySelector(".removeActivityBtn").addEventListener("click", () => {
    container.removeChild(block);
  });

  // Génère les participants depuis la liste des voyageurs
  const participantList = block.querySelector(".participant-list");
  const voyageurs = document.querySelectorAll(".traveler-block");
  voyageurs.forEach(voy => {
    const prenom = voy.querySelector(".prenom")?.value || "Prénom ?";
    const nom = voy.querySelector(".nom")?.value || "";
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = `${prenom} ${nom}`;
    label.appendChild(checkbox);
    label.append(" " + checkbox.value);
    participantList.appendChild(label);
  });

  container.appendChild(block);
}
function loadLogements(container) {
  container.innerHTML = `
    <section>
      <h2>🏨 Logements</h2>
      <button id="addLogementBtn">+ Ajouter un logement</button>
      <div id="logementList"></div>
    </section>
  `;

  document.getElementById("addLogementBtn").addEventListener("click", () => {
    addLogementForm();
  });
}

let logementCounter = 0;

function addLogementForm(data = {}) {
  const container = document.getElementById("logementList");
  logementCounter++;

  const block = document.createElement("div");
  block.className = "logement-block";

  block.innerHTML = `
    <hr />
    <h3>Logement ${logementCounter}</h3>

    <label>Nom :</label>
    <input type="text" placeholder="Ex : Hotel Skypark Myeongdong" value="${data.nom || ''}" />

    <label>Type :</label>
    <input type="text" placeholder="Hôtel, Airbnb, etc." value="${data.type || ''}" />

    <label>Date d'arrivée :</label>
    <input type="date" value="${data.arrivee || ''}" />

    <label>Date de départ :</label>
    <input type="date" value="${data.depart || ''}" />

    <label>Check-in :</label>
    <input type="time" value="${data.checkin || ''}" />

    <label>Check-out :</label>
    <input type="time" value="${data.checkout || ''}" />

    <div class="chambres-container">
      <h4>Chambres</h4>
      <button class="addChambreBtn">+ Ajouter une chambre</button>
      <div class="chambres-list"></div>
    </div>

    <div class="upload-section">
      <label>📎 Confirmation (PDF/JPG) :</label>
      <input type="file" class="fileInput" accept=".pdf,.jpg,.jpeg,.png" />
      <button class="downloadBtn" disabled>⬇️ Télécharger</button>
    </div>

    <button class="removeLogementBtn">🗑️ Supprimer ce logement</button>
  `;

  // Supprimer logement
  block.querySelector(".removeLogementBtn").addEventListener("click", () => {
    container.removeChild(block);
  });

  // Ajout de chambres
  block.querySelector(".addChambreBtn").addEventListener("click", () => {
    addChambre(block.querySelector(".chambres-list"));
  });

  // Gestion fichier
  const fileInput = block.querySelector(".fileInput");
  const downloadBtn = block.querySelector(".downloadBtn");

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const url = URL.createObjectURL(file);
      downloadBtn.disabled = false;
      downloadBtn.onclick = () => {
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
      };
    }
  });

  container.appendChild(block);
}

function addChambre(container) {
  const div = document.createElement("div");
  div.className = "chambre-block";
  div.innerHTML = `
    <label>Type de chambre :</label>
    <input type="text" placeholder="Double, twin, suite..." />

    <label>Nombre :</label>
    <input type="number" min="1" value="1" />

    <label>Prix par nuit (€) :</label>
    <input type="number" min="0" step="0.01" />

    <label>Prix total (€) :</label>
    <input type="number" min="0" step="0.01" />

    <button class="removeChambreBtn">❌ Supprimer cette chambre</button>
  `;

  div.querySelector(".removeChambreBtn").addEventListener("click", () => {
    container.removeChild(div);
  });

  container.appendChild(div);
}
function loadBudget(container) {
  container.innerHTML = `
    <section>
      <h2>💶 Budget</h2>
      <button id="addPosteBtn">+ Ajouter un poste</button>
      <div id="posteList"></div>

      <hr />
      <label>Taux de conversion (1 € = X KRW) :</label>
      <input type="number" id="conversionRate" step="0.01" value="1450" />

      <h3>Total :</h3>
      <p id="budgetTotal">–</p>
    </section>
  `;

  document.getElementById("addPosteBtn").addEventListener("click", () => {
    addPosteBudget();
  });

  document.getElementById("conversionRate").addEventListener("input", updateBudgetTotal);
}

let budgetPostes = [];

function addPosteBudget(data = {}) {
  const container = document.getElementById("posteList");

  const block = document.createElement("div");
  block.className = "poste-budget";

  block.innerHTML = `
    <label>Nom du poste :</label>
    <input type="text" class="nomPoste" value="${data.nom || ''}" placeholder="Ex : Transport Séoul → Busan" />

    <label>Catégorie :</label>
    <select class="categoriePoste">
      <option value="transport">Transport</option>
      <option value="logement">Logement</option>
      <option value="activités">Activités</option>
      <option value="repas">Repas</option>
      <option value="autre">Autre</option>
    </select>

    <label>Montant total (€) :</label>
    <input type="number" class="montantPoste" min="0" step="0.01" value="${data.montant || ''}" />

    <label>Nombre de participants :</label>
    <input type="number" class="participantsPoste" min="1" value="${data.participants || 1}" />

    <p class="parPersonne">Prix par personne : –</p>

    <button class="removePosteBtn">🗑️ Supprimer</button>
  `;

  // Mise à jour automatique
  const montantInput = block.querySelector(".montantPoste");
  const participantsInput = block.querySelector(".participantsPoste");
  const parPersonne = block.querySelector(".parPersonne");

  function updateParPersonne() {
    const montant = parseFloat(montantInput.value) || 0;
    const participants = parseInt(participantsInput.value) || 1;
    const total = (montant / participants).toFixed(2);
    parPersonne.textContent = `Prix par personne : ${total} €`;
    updateBudgetTotal();
  }

  montantInput.addEventListener("input", updateParPersonne);
  participantsInput.addEventListener("input", updateParPersonne);

  // Suppression du poste
  block.querySelector(".removePosteBtn").addEventListener("click", () => {
    container.removeChild(block);
    updateBudgetTotal();
  });

  container.appendChild(block);
  updateParPersonne();
}

function updateBudgetTotal() {
  const montantInputs = document.querySelectorAll(".montantPoste");
  let total = 0;

  montantInputs.forEach(input => {
    total += parseFloat(input.value) || 0;
  });

  const taux = parseFloat(document.getElementById("conversionRate").value) || 0;
  const totalConverted = (total * taux).toFixed(0);

  document.getElementById("budgetTotal").innerHTML = `
    <strong>${total.toFixed(2)} €</strong><br/>
    ~ ${totalConverted} KRW
  `;
}
function loadInfos(container) {
  container.innerHTML = `
    <section>
      <h2>🧰 Infos utiles</h2>
      <button id="addNoteBtn">+ Ajouter une info</button>
      <div id="infosContainer"></div>
    </section>
  `;

  document.getElementById("addNoteBtn").addEventListener("click", () => {
    addInfoNote();
  });
}

let noteCounter = 0;

function addInfoNote(data = {}) {
  const container = document.getElementById("infosContainer");
  noteCounter++;

  const block = document.createElement("div");
  block.className = "info-note";

  block.innerHTML = `
    <label>Titre :</label>
    <input type="text" value="${data.titre || ''}" placeholder="Ex : Numéros d'urgence, Check-list..." />

    <label>Contenu :</label>
    <textarea placeholder="Ex : 112 (urgence), assurance, etc.">${data.texte || ''}</textarea>

    <button class="removeNoteBtn">🗑️ Supprimer</button>
  `;

  block.querySelector(".removeNoteBtn").addEventListener("click", () => {
    container.removeChild(block);
  });

  container.appendChild(block);
}
function loadCalendrier(container) {
  container.innerHTML = `
    <section>
      <h2>📅 Planning visuel</h2>
      <button id="refreshPlanningBtn">🔄 Mettre à jour le planning</button>
      <div id="planningTable"></div>
    </section>
  `;

  document.getElementById("refreshPlanningBtn").addEventListener("click", generatePlanningTable);
}

function generatePlanningTable() {
  const tableContainer = document.getElementById("planningTable");
  tableContainer.innerHTML = "";

  const jours = document.querySelectorAll(".day-block");

  if (jours.length === 0) {
    tableContainer.innerHTML = "<p>Aucun jour n’a encore été ajouté dans le programme.</p>";
    return;
  }

  jours.forEach((jour, i) => {
    const date = jour.querySelector(".day-date").value || `Jour ${i + 1}`;
    const slots = jour.querySelectorAll(".time-slot");

    const block = document.createElement("div");
    block.className = "planning-day";

    block.innerHTML = `<h3>${date}</h3>`;

    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>Heure</th>
          <th>Type</th>
          <th>Détail</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    slots.forEach(slot => {
      const heureDebut = slot.querySelector('input[type="time"]')?.value || "";
      const type = slot.querySelector("select")?.value || "";
      const detail = slot.querySelector('input[type="text"]')?.value || "";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${heureDebut}</td>
        <td>${iconeType(type)} ${capitalize(type)}</td>
        <td>${detail}</td>
      `;
      tbody.appendChild(row);
    });

    block.appendChild(table);
    tableContainer.appendChild(block);
  });
}

// Icônes par type
function iconeType(type) {
  switch (type) {
    case "activité": return "🎯";
    case "repas": return "🍽️";
    case "transport": return "🚌";
    case "logement": return "🏨";
    default: return "❓";
  }
}

// Formatage
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
container.innerHTML = `
  <section>
    <h2>📅 Planning visuel</h2>
    <button id="refreshPlanningBtn">🔄 Mettre à jour le planning</button>
    <button id="exportPlanningPdfBtn">📄 Exporter en PDF</button>
    <div id="planningTable"></div>
  </section>
`;
document.getElementById("exportPlanningPdfBtn").addEventListener("click", exportPlanningToPDF);


function loadSection(section, container) {
  container.innerHTML = "";

  switch (section) {
    case "overview":
      loadOverview(container);
      break;
    case "voyageurs":
      loadVoyageurs(container);
      break;
    case "programme":
      loadProgramme(container);
      break;
    case "activites":
      loadActivites(container);
      break;
    case "logements":
      loadLogements(container);
      break;
    case "budget":
      loadBudget(container);
      break;
    case "infos":
      loadInfos(container);
      break;
    case "calendrier":
      loadCalendrier(container);
      break;
  }
}

// Exemple de fonction de section
function loadOverview(container) {
  container.innerHTML = `
    <section>
      <h2>Vue d'ensemble du voyage</h2>
      <label>Destination :</label>
      <input type="text" placeholder="Corée du Sud" />
      <label>Dates :</label>
      <input type="date" /> → <input type="date" />
      <label>Nombre de voyageurs :</label>
      <input type="number" min="1" value="1" />
    </section>
  `;
}
async function exportPlanningToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;

  const jours = document.querySelectorAll(".planning-day");

  if (jours.length === 0) {
    alert("Le planning est vide. Clique d’abord sur ‘Mettre à jour le planning’.");
    return;
  }

  jours.forEach((jour, index) => {
    const titre = jour.querySelector("h3")?.textContent || `Jour ${index + 1}`;
    doc.setFontSize(14);
    doc.text(titre, 10, y);
    y += 8;

    const rows = jour.querySelectorAll("tbody tr");

    rows.forEach(row => {
      const cols = row.querySelectorAll("td");
      const heure = cols[0]?.textContent || "";
      const type = cols[1]?.textContent || "";
      const detail = cols[2]?.textContent || "";

      doc.setFontSize(10);
      doc.text(`• ${heure} | ${type} | ${detail}`, 10, y);
      y += 6;

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });

    y += 10;
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save("planning-voyage.pdf");
}
document.addEventListener("DOMContentLoaded", () => {
  // ... déjà présent
  document.getElementById("saveAllBtn").addEventListener("click", saveAllData);
  document.getElementById("loadAllBtn").addEventListener("change", loadAllData);
});

function saveAllData() {
  const data = {};

  // Vue d'ensemble
  const overviewInputs = document.querySelectorAll('main input[type="text"], main input[type="date"], main input[type="number"]');
  overviewInputs.forEach(input => {
    data[input.placeholder || input.className || input.name || `champ_${Math.random()}`] = input.value;
  });

  // Voyageurs
  data.voyageurs = [];
  document.querySelectorAll(".traveler-block").forEach(block => {
    data.voyageurs.push({
      prenom: block.querySelector(".prenom")?.value || "",
      nom: block.querySelector(".nom")?.value || "",
      arrivee: block.querySelector(".arrivee")?.value || "",
      depart: block.querySelector(".depart")?.value || ""
    });
  });

  // Programme
  data.programme = [];
  document.querySelectorAll(".day-block").forEach(day => {
    const date = day.querySelector(".day-date")?.value;
    const slots = [];
    day.querySelectorAll(".time-slot").forEach(slot => {
      slots.push({
        start: slot.querySelector('input[type="time"]')?.value || "",
        end: slot.querySelectorAll('input[type="time"]')[1]?.value || "",
        type: slot.querySelector("select")?.value || "",
        detail: slot.querySelector('input[type="text"]')?.value || ""
      });
    });
    data.programme.push({ date, slots });
  });

  // Activités
  data.activites = [];
  document.querySelectorAll(".activity-block").forEach(block => {
    const checkboxes = block.querySelectorAll(".participant-list input[type='checkbox']");
    const participants = [];
    checkboxes.forEach(c => {
      if (c.checked) participants.push(c.value);
    });

    data.activites.push({
      nom: block.querySelector('input[type="text"]')?.value || "",
      date: block.querySelector('input[type="date"]')?.value || "",
      heure: block.querySelector('input[type="time"]')?.value || "",
      duree: block.querySelector('input[type="number"]')?.value || "",
      prix: block.querySelectorAll('input[type="number"]')[1]?.value || "",
      infos: block.querySelector("textarea")?.value || "",
      participants
    });
  });

  // Logements
  data.logements = [];
  document.querySelectorAll(".logement-block").forEach(block => {
    const chambres = [];
    block.querySelectorAll(".chambre-block").forEach(ch => {
      chambres.push({
        type: ch.querySelectorAll("input")[0]?.value || "",
        nombre: ch.querySelectorAll("input")[1]?.value || "",
        prixNuit: ch.querySelectorAll("input")[2]?.value || "",
        prixTotal: ch.querySelectorAll("input")[3]?.value || ""
      });
    });

    data.logements.push({
      nom: block.querySelectorAll("input")[0]?.value || "",
      type: block.querySelectorAll("input")[1]?.value || "",
      arrivee: block.querySelectorAll("input")[2]?.value || "",
      depart: block.querySelectorAll("input")[3]?.value || "",
      checkin: block.querySelectorAll("input")[4]?.value || "",
      checkout: block.querySelectorAll("input")[5]?.value || "",
      chambres
    });
  });

  // Budget
  data.budget = [];
  document.querySelectorAll(".poste-budget").forEach(block => {
    data.budget.push({
      nom: block.querySelector(".nomPoste")?.value || "",
      categorie: block.querySelector(".categoriePoste")?.value || "",
      montant: block.querySelector(".montantPoste")?.value || "",
      participants: block.querySelector(".participantsPoste")?.value || ""
    });
  });

  // Infos utiles
  data.infos = [];
  document.querySelectorAll(".info-note").forEach(note => {
    data.infos.push({
      titre: note.querySelector("input")?.value || "",
      texte: note.querySelector("textarea")?.value || ""
    });
  });

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "planificateur-voyage.json";
  a.click();
}

async function loadAllData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const text = await file.text();
  const data = JSON.parse(text);

  alert("📦 Chargement JSON détecté ! Pour réafficher les données, recharge manuellement chaque section.");
  console.log("🔍 Données chargées : ", data);
  // 📌 Pour la V1 : on charge, mais ne ré-injecte pas encore automatiquement dans l’interface
  // (nécessiterait refonte complète avec store centralisé)
}

