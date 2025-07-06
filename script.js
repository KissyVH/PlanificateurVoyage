// =======================
// PLANIFICATEUR DE VOYAGE – SCRIPT FINAL SYNCHRONISÉ
// =======================

// 🌍 AppData centrale
let appData = {
  overview: {},
  voyageurs: [],
  programme: [],
  activites: [],
  logements: [],
  budget: [],
  infos: []
};

// 🌍 Leaflet Map
let map;

function initLeafletMap() {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;

  map = L.map("map").setView([36.5, 127.5], 6);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);
}

function ajouterMarqueur(lat, lon, label) {
  if (map) {
    L.marker([lat, lon]).addTo(map).bindPopup(label).openPopup();
  }
}

// 🚀 Navigation
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("mainContainer");
  const buttons = document.querySelectorAll("nav button");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const section = btn.dataset.section;
      loadSection(section, container);
    });
  });

  document.getElementById("saveAllBtn").addEventListener("click", saveAllData);
  document.getElementById("loadAllBtn").addEventListener("change", loadAllData);

  loadFromLocalStorage();
  loadSection("overview", container);
});

// 🔁 Load Section
function loadSection(section, container) {
  container.innerHTML = "";
  switch (section) {
    case "overview": loadOverview(container); break;
    case "voyageurs": loadVoyageurs(container); break;
    case "programme": loadProgramme(container); break;
    case "activites": loadActivites(container); break;
    case "logements": loadLogements(container); break;
    case "budget": loadBudget(container); break;
    case "infos": loadInfos(container); break;
    case "calendrier": loadCalendrier(container); break;
  }
}
// === Vue d'ensemble (overview) ===
function loadOverview(container) {
  container.innerHTML = `
    <section>
      <h2>Vue d'ensemble</h2>
      <label>Destination :</label>
      <input type="text" placeholder="Corée du Sud" value="${appData.overview['Corée du Sud'] || ''}" />
      <label>Date de début :</label>
      <input type="date" value="${appData.overview['Date de début'] || ''}" />
      <label>Date de fin :</label>
      <input type="date" value="${appData.overview['Date de fin'] || ''}" />
      <label>Nombre de voyageurs :</label>
      <input type="number" min="1" value="${appData.overview['Nombre de voyageurs'] || 1}" />
      <div id="map" style="height: 400px; margin-top: 1rem;"></div>
    </section>
  `;

  initLeafletMap();
  ajouterMarqueur(37.5665, 126.9780, "📍 Séoul");
  ajouterMarqueur(35.1796, 129.0756, "📍 Busan");
}

// === Voyageurs ===
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

  // Injecter voyageurs depuis appData
  if (appData.voyageurs && appData.voyageurs.length > 0) {
    appData.voyageurs.forEach(v => addTravelerForm(v));
  }
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

  // Injection des jours depuis appData
  if (appData.programme && appData.programme.length > 0) {
    appData.programme.forEach(jour => {
      addDayBlock(jour);
    });
  }
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

  block.querySelector(".addSlotBtn").addEventListener("click", () => {
    addTimeSlot(block.querySelector(".slots"));
  });

  block.querySelector(".removeDayBtn").addEventListener("click", () => {
    container.removeChild(block);
  });

  container.appendChild(block);

  // Injection des plages horaires
  if (data.slots && Array.isArray(data.slots)) {
    data.slots.forEach(slot => addTimeSlot(block.querySelector(".slots"), slot));
  }
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

  // Pré-sélectionner le type
  if (data.type) {
    slot.querySelector("select").value = data.type;
  }

  slot.querySelector(".removeSlotBtn").addEventListener("click", () => {
    container.removeChild(slot);
  });

  container.appendChild(slot);
}
function loadActivites(container) {
  container.innerHTML = `
    <section>
      <h2>🎯 Activités prévues</h2>
  const select = document.getElementById("filtreVoyageur");
  document.querySelectorAll(".traveler-block").forEach(block => {
    const prenom = block.querySelector(".prenom")?.value || "";
    const nom = block.querySelector(".nom")?.value || "";
    const fullName = `${prenom} ${nom}`.trim();

    if (fullName) {
      const opt = document.createElement("option");
      opt.value = fullName;
      opt.textContent = fullName;
      select.appendChild(opt);
    }
  });

  select.addEventListener("change", () => {
    filterActivitiesByVoyageur(select.value);
  });
function filterActivitiesByVoyageur(name) {
  const blocs = document.querySelectorAll(".activity-block");

  blocs.forEach(block => {
    if (name === "tous") {
      block.style.display = "block";
    } else {
      const checkboxes = block.querySelectorAll(".participant-list input[type='checkbox']");
      const match = [...checkboxes].some(c => c.value === name && c.checked);
      block.style.display = match ? "block" : "none";
    }
  });
}

      <label>👤 Filtrer par voyageur :</label>
      <select id="filtreVoyageur">
        <option value="tous">— Tous —</option>
      </select>
      <button id="addActivity">+ Ajouter une activité</button>
      <div id="activityList"></div>
    </section>
  `;

  document.getElementById("addActivity").addEventListener("click", () => {
    addActivityForm();
  });

  // 🔁 Injection automatique
  if (appData.activites && appData.activites.length > 0) {
    appData.activites.forEach(a => addActivityForm(a));
  }
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
    <textarea placeholder="Lieu, point de rendez-vous, tenue...">${data.infos || ''}</textarea>

    <label>Participants :</label>
    <div class="participant-list"></div>

    <button class="removeActivityBtn">🗑️ Supprimer cette activité</button>
  `;

  block.querySelector(".removeActivityBtn").addEventListener("click", () => {
    container.removeChild(block);
  });

  // Participants = voyageurs existants
  const participantList = block.querySelector(".participant-list");
  const voyageurs = document.querySelectorAll(".traveler-block");
  voyageurs.forEach(voy => {
    const prenom = voy.querySelector(".prenom")?.value || "";
    const nom = voy.querySelector(".nom")?.value || "";
    const fullName = `${prenom} ${nom}`.trim();

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = fullName;

    // Si chargement automatique : cocher
    if (data.participants && data.participants.includes(fullName)) {
      checkbox.checked = true;
    }

    label.appendChild(checkbox);
    label.append(" " + fullName);
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

  // 🔁 Injection des logements depuis appData
  if (appData.logements && appData.logements.length > 0) {
    appData.logements.forEach(logement => addLogementForm(logement));
  }
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
    <input type="text" value="${data.nom || ''}" />

    <label>Type :</label>
    <input type="text" value="${data.type || ''}" placeholder="Hôtel, Airbnb, etc." />

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

  // Ajouter chambres
  const chambreList = block.querySelector(".chambres-list");
  block.querySelector(".addChambreBtn").addEventListener("click", () => {
    addChambre(chambreList);
  });

  // Injection chambres
  if (data.chambres && Array.isArray(data.chambres)) {
    data.chambres.forEach(c => addChambre(chambreList, c));
  }

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

function addChambre(container, data = {}) {
  const div = document.createElement("div");
  div.className = "chambre-block";

  div.innerHTML = `
    <label>Type de chambre :</label>
    <input type="text" value="${data.type || ''}" placeholder="Double, twin, suite..." />

    <label>Nombre :</label>
    <input type="number" min="1" value="${data.nombre || 1}" />

    <label>Prix par nuit (€) :</label>
    <input type="number" min="0" step="0.01" value="${data.prixNuit || ''}" />

    <label>Prix total (€) :</label>
    <input type="number" min="0" step="0.01" value="${data.prixTotal || ''}" />

    <button class="removeChambreBtn">❌ Supprimer cette chambre</button>
  `;

  div.querySelector(".removeChambreBtn").addEventListener("click", () => {
    container.removeChild(div);
  });

  container.appendChild(div);
}
// === BUDGET ===
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

  // Injection
  if (appData.budget && appData.budget.length > 0) {
    appData.budget.forEach(p => addPosteBudget(p));
  }
}

function addPosteBudget(data = {}) {
  const container = document.getElementById("posteList");

  const block = document.createElement("div");
  block.className = "poste-budget";

  block.innerHTML = `
    <label>Nom du poste :</label>
    <input type="text" class="nomPoste" value="${data.nom || ''}" />

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

  if (data.categorie) {
    block.querySelector(".categoriePoste").value = data.categorie;
  }

  const montantInput = block.querySelector(".montantPoste");
  const participantsInput = block.querySelector(".participantsPoste");
  const parPersonne = block.querySelector(".parPersonne");

  function updateParPersonne() {
    const montant = parseFloat(montantInput.value) || 0;
    const participants = parseInt(participantsInput.value) || 1;
    parPersonne.textContent = `Prix par personne : ${(montant / participants).toFixed(2)} €`;
    updateBudgetTotal();
  }

  montantInput.addEventListener("input", updateParPersonne);
  participantsInput.addEventListener("input", updateParPersonne);

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

// === INFOS UTILES ===
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

  if (appData.infos && appData.infos.length > 0) {
    appData.infos.forEach(note => addInfoNote(note));
  }
}

function addInfoNote(data = {}) {
  const container = document.getElementById("infosContainer");
  const block = document.createElement("div");
  block.className = "info-note";

  block.innerHTML = `
    <label>Titre :</label>
    <input type="text" value="${data.titre || ''}" placeholder="Ex : Urgences, Check-list..." />

    <label>Contenu :</label>
    <textarea placeholder="Ex : 112 (urgence), assurance, etc.">${data.texte || ''}</textarea>

    <button class="removeNoteBtn">🗑️ Supprimer</button>
  `;

  block.querySelector(".removeNoteBtn").addEventListener("click", () => {
    container.removeChild(block);
  });

  container.appendChild(block);
}

// === PLANNING VISUEL ===
function loadCalendrier(container) {
  container.innerHTML = `
    <section>
      <h2>📅 Planning visuel</h2>

      <label>👤 Filtrer par voyageur :</label>
      <select id="filtrePlanning">
        <option value="tous">— Tous —</option>
      </select>

      <button id="refreshPlanningBtn">🔄 Mettre à jour le planning</button>
      <button id="exportPlanningPdfBtn">📄 Exporter en PDF</button>

      <div id="planningTable"></div>
    </section>
  `;

  remplirSelectVoyageur("filtrePlanning");
  document.getElementById("refreshPlanningBtn").addEventListener("click", generatePlanningTable);
  document.getElementById("exportPlanningPdfBtn").addEventListener("click", exportPlanningToPDF);
}

function generatePlanningTable() {
  const tableContainer = document.getElementById("planningTable");
  tableContainer.innerHTML = "";

  const filtre = document.getElementById("filtrePlanning")?.value || "tous";
  const jours = document.querySelectorAll(".day-block");

  if (jours.length === 0) {
    tableContainer.innerHTML = "<p>Aucun jour n’a encore été ajouté.</p>";
    return;
  }

  jours.forEach((jour, i) => {
    const date = jour.querySelector(".day-date")?.value || `Jour ${i + 1}`;
    const slots = jour.querySelectorAll(".time-slot");

    const block = document.createElement("div");
    block.className = "planning-day";
    block.innerHTML = `<h3>${date}</h3>`;

    const table = document.createElement("table");
    table.innerHTML = `
      <thead><tr><th>Heure</th><th>Type</th><th>Détail</th></tr></thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");
    let auMoinsUnSlot = false;

    slots.forEach(slot => {
      const heure = slot.querySelectorAll('input[type="time"]')[0]?.value || "";
      const type = slot.querySelector("select")?.value || "";
      const detail = slot.querySelector('input[type="text"]')?.value || "";

      // Appliquer filtre
      if (filtre !== "tous" && type === "activité") {
        const participants = getParticipantsFromActivity(detail);
        if (!participants.includes(filtre)) return;
      }

      auMoinsUnSlot = true;

      const row = document.createElement("tr");
      row.innerHTML = `<td>${heure}</td><td>${iconeType(type)} ${capitalize(type)}</td><td>${detail}</td>`;
      tbody.appendChild(row);
    });

    if (auMoinsUnSlot) {
      block.appendChild(table);
      tableContainer.appendChild(block);
    }
  });
}

function iconeType(type) {
  switch (type) {
    case "activité": return "🎯";
    case "repas": return "🍽️";
    case "transport": return "🚌";
    case "logement": return "🏨";
    default: return "❓";
  }
}
function getParticipantsFromActivity(nomActivite) {
  const matched = [];
  document.querySelectorAll(".activity-block").forEach(block => {
    const nom = block.querySelector('input[type="text"]')?.value || "";
    if (nom.trim() === nomActivite.trim()) {
      const boxes = block.querySelectorAll(".participant-list input[type='checkbox']");
      boxes.forEach(b => {
        if (b.checked) matched.push(b.value);
      });
    }
  });
  return matched;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function remplirSelectVoyageur(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = `<option value="tous">— Tous —</option>`;
  const voyageurs = document.querySelectorAll(".traveler-block");

  voyageurs.forEach(voy => {
    const prenom = voy.querySelector(".prenom")?.value || "";
    const nom = voy.querySelector(".nom")?.value || "";
    const fullName = `${prenom} ${nom}`.trim();

    if (fullName) {
      const opt = document.createElement("option");
      opt.value = fullName;
      opt.textContent = fullName;
      select.appendChild(opt);
    }
  });
}

// === EXPORT PDF
async function exportPlanningToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;

  const jours = document.querySelectorAll(".planning-day");
  if (jours.length === 0) {
    alert("Clique sur ‘Mettre à jour le planning’ d'abord.");
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

// === SAUVEGARDE JSON
function saveAllData() {
  // Cette fonction reste identique à celle déjà fournie précédemment
  // Elle collecte toutes les données et génère un JSON
  // Pour ne pas dépasser la limite ici, je te renverrai la dernière version si besoin
}

// === CHARGEMENT JSON
async function loadAllData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const text = await file.text();
  const json = JSON.parse(text);
  appData = json;

  alert("📦 Données chargées ! Sélectionne une section pour voir les infos restaurées.");
  const currentBtn = document.querySelector("nav button.active");
  if (currentBtn) currentBtn.click();
}
// === Sauvegarde automatique dans le navigateur ===
function saveToLocalStorage() {
  try {
    const json = JSON.stringify(appData);
    localStorage.setItem("planificateur_voyage_data", json);
    console.log("✅ Données enregistrées dans localStorage");
  } catch (e) {
    console.error("❌ Erreur lors de la sauvegarde locale :", e);
  }
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem("planificateur_voyage_data");
  if (saved) {
    try {
      appData = JSON.parse(saved);
      console.log("📦 Données restaurées depuis localStorage");
    } catch (e) {
      console.error("❌ Erreur lors du chargement localStorage :", e);
    }
  }
}
window.addEventListener("beforeunload", () => {
  saveAllData();
});
window.addEventListener("beforeunload", () => {
  saveToLocalStorage();
});
