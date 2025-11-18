// --------------------
// CONSTANTES Y ELEMENTOS DOM
// --------------------
const API_URL = "http://localhost:8080/api/pdis";
const CENTROS_URL = "http://localhost:8080/api/centros";
const token = localStorage.getItem("jwtToken");
const JWT_TOKEN = token ? `Bearer ${token}` : "";

const btnCrear = document.getElementById("btnCrear");
const btnModificar = document.getElementById("btnModificar");
const labelPDI = document.getElementById("labelPDI");
const centroSelect = document.getElementById("centroSelect");
const pdiSelect = document.getElementById("pdiSelect");
const nombreInput = document.getElementById("nombrePDI");
const contenidoInput = document.getElementById("contenidoJson");
const btnEnviar = document.getElementById("btnEnviar");
const confirmModal = document.getElementById("confirmModal");
const confirmText = document.getElementById("confirmText");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const mensajeElement = document.getElementById("mensaje");

let modo = "modificar"; // por defecto
let editingPdiId = null;

// Cache de PDIs por centro para no recargar innecesariamente
const pdIsPorCentro = {};

// --------------------
// UTILIDADES
// --------------------
function limpiarMensaje() {
  mensajeElement.innerText = "";
}

function limpiarFormulario() {
  nombreInput.value = "";
  contenidoInput.value = "";
  pdiSelect.innerHTML = '<option value="">-- Selecciona el PDI --</option>';
  editingPdiId = null;
}

// --------------------
// BOTONES CREAR / MODIFICAR
// --------------------
btnCrear.addEventListener("click", () => {
  modo = "crear";
  btnCrear.classList.add("activo");
  btnModificar.classList.remove("activo");

  nombreInput.style.display = "block";
  pdiSelect.style.display = "none";
  labelPDI.setAttribute("for", "nombrePDI");
  labelPDI.textContent = "Nombre del nuevo PDI";

  limpiarFormulario();
  limpiarMensaje();
});

btnModificar.addEventListener("click", () => {
  modo = "modificar";
  btnModificar.classList.add("activo");
  btnCrear.classList.remove("activo");

  nombreInput.style.display = "none";
  pdiSelect.style.display = "block";
  labelPDI.setAttribute("for", "pdiSelect");
  labelPDI.textContent = "Selecciona un PDI a modificar";

  limpiarFormulario();
  limpiarMensaje();
});

// --------------------
// CARGAR CENTROS
// --------------------
async function cargarCentros() {
  try {
    const resp = await fetch(CENTROS_URL, { headers: { Authorization: JWT_TOKEN } });
    if (!resp.ok) throw new Error("Error al cargar centros");
    const centros = await resp.json();

    centroSelect.innerHTML = '<option value="">-- Selecciona el centro --</option>';
    centros.forEach(c => {
      const option = document.createElement("option");
      option.value = c.idCentro;
      option.textContent = c.nombre;
      centroSelect.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    mensajeElement.style.color = "red";
    mensajeElement.innerText = "No se pudieron cargar los centros.";
  }
}

// --------------------
// CARGAR PDIs POR CENTRO (con cache)
// --------------------
async function cargarPDIsPorCentro(idCentro) {
  try {
    let pdIs = pdIsPorCentro[idCentro];

    // Si no están en cache, llamamos al backend
    if (!pdIs) {
      const resp = await fetch(`${API_URL}/centro/${idCentro}`, {
        headers: { Authorization: JWT_TOKEN }
      });
      if (!resp.ok) throw new Error("Error al cargar PDIs del centro");
      pdIs = await resp.json();
      pdIsPorCentro[idCentro] = pdIs; // guardamos en cache
    }

    // Limpiar y llenar select
    pdiSelect.innerHTML = '<option value="">-- Selecciona el PDI --</option>';
    pdIs.forEach(p => {
      const option = document.createElement("option");
      option.value = p.idPdi;
      option.textContent = p.nombre;
      option.dataset.contenido = p.contenidoJson || "";
      pdiSelect.appendChild(option);
    });

    limpiarFormulario();
  } catch (error) {
    console.error(error);
    mensajeElement.style.color = "red";
    mensajeElement.innerText = "No se pudieron cargar los PDIs del centro.";
  }
}

// --------------------
// EVENTO CAMBIO DE CENTRO
// --------------------
centroSelect.addEventListener("change", () => {
  if (modo !== "modificar") return;
  const idCentro = centroSelect.value;
  if (idCentro) {
    cargarPDIsPorCentro(idCentro);
  } else {
    limpiarFormulario();
  }
  limpiarMensaje();
});

// --------------------
// EVENTO SELECCIONAR PDI
// --------------------
pdiSelect.addEventListener("change", () => {
  const selectedId = pdiSelect.value;
  if (selectedId) {
    const option = pdiSelect.querySelector(`option[value="${selectedId}"]`);
    contenidoInput.value = option.dataset.contenido || "";
    editingPdiId = selectedId;
  } else {
    contenidoInput.value = "";
    editingPdiId = null;
  }
  limpiarMensaje();
});

// --------------------
// ENVÍO Y MODAL
// --------------------
btnEnviar.addEventListener("click", () => {
  const nombrePdi = nombreInput.value.trim();
  const contenidoJson = contenidoInput.value.trim();

  if ((modo === "crear" && !nombrePdi) || !contenidoJson) {
    mensajeElement.style.color = "red";
    mensajeElement.innerText = "Rellena todos los campos.";
    return;
  }

  confirmText.textContent = JSON.stringify({ nombre: nombrePdi, contenidoJson }, null, 2);
  confirmModal.style.display = "flex";
});

confirmBtn.addEventListener("click", async () => {
  const nombrePdi = nombreInput.value.trim();
  const contenidoJson = contenidoInput.value.trim();

  const pdiDTO = { nombre: nombrePdi, contenidoJson };
  const url = editingPdiId ? `${API_URL}/${editingPdiId}` : API_URL;
  const method = editingPdiId ? "PUT" : "POST";

  try {
    const resp = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: JWT_TOKEN },
      body: JSON.stringify(pdiDTO)
    });

    if (resp.ok) {
      const pdiCreado = await resp.json();
      mensajeElement.style.color = "green";
      mensajeElement.innerHTML = editingPdiId
        ? `PDI actualizado con éxito.`
        : `PDI creado con éxito. ID asignado: <b>${pdiCreado.idPdi}</b>`;

      // Recargar PDIs del centro actual si estamos en modificar
      if (modo === "modificar" && centroSelect.value) {
        pdIsPorCentro[centroSelect.value] = null; // limpiar cache
        await cargarPDIsPorCentro(centroSelect.value);
      }

      limpiarFormulario();
    } else {
      const errorData = await resp.json();
      mensajeElement.style.color = "red";
      mensajeElement.innerHTML = `Error ${resp.status}: ${errorData.message || "Error desconocido"}`;
    }
  } catch (error) {
    console.error(error);
    mensajeElement.style.color = "red";
    mensajeElement.innerText = "Error de conexión con el servidor.";
  } finally {
    confirmModal.style.display = "none";
  }
});

// Cancelar modal
cancelBtn.addEventListener("click", () => (confirmModal.style.display = "none"));
confirmModal.addEventListener("click", (e) => {
  if (e.target === confirmModal) confirmModal.style.display = "none";
});

// --------------------
// INICIALIZAR
// --------------------
cargarCentros();
