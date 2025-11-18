const API_URL = "http://localhost:8080/api/pdis";
const token = localStorage.getItem("jwtToken");
const JWT_TOKEN = token ? `Bearer ${token}` : "";

const btnCrear = document.getElementById("btnCrear");
const btnModificar = document.getElementById("btnModificar")
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

let centros = []; // Array para guardar los centros existentes
let pdIs = []; // Array para guardar PDIs existentes
let editingPdiId = null; // ID del PDI que estamos editando

// --------------------------------------------------
// 1. Seleccionar opcion de crear o modificar PDI
// --------------------------------------------------

btnModificar.addEventListener("click", ()=>{
btnModificar.classList.add('activo');
btnCrear.classList.remove('activo')
nombreInput.style.display='none';
pdiSelect.style.display='block';
labelPDI.setAttribute("for", "pdiSelect");
labelPDI.textContent = "Selecciona un PDI a modificar";
});

btnCrear.addEventListener("click", ()=>{
btnCrear.classList.add('activo');
btnModificar.classList.remove('activo')
nombreInput.style.display='block';
pdiSelect.style.display='none';
labelPDI.setAttribute("for", "nombrePDI");
labelPDI.textContent = "Nombre del nuevo PDI";
});

// --------------------------------------------------
// 2. Cargar PDIs existentes
// --------------------------------------------------
async function cargarPDIs() {
  try {
    const resp = await fetch(API_URL, {
      headers: { Authorization: JWT_TOKEN },
    });
    if (!resp.ok) throw new Error("Error al cargar PDIs");
    pdIs = await resp.json();
    pdiSelect.innerHTML = '<option value="">-- Crear nuevo PDI --</option>';
    pdIs.forEach((pdi) => {
      const option = document.createElement("option");
      option.value = pdi.idPdi;
      option.textContent = pdi.nombre;
      pdiSelect.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    mensajeElement.style.color = "red";
    mensajeElement.innerText = "No se pudieron cargar los PDIs existentes.";
  }
}

// --------------------------------------------------
// 3. Seleccionar PDI (editar o crear nuevo)
// --------------------------------------------------
pdiSelect.addEventListener("change", () => {
  const selectedId = pdiSelect.value;
  if (selectedId) {
    const pdi = pdIs.find((p) => p.idPdi == selectedId);
    nombreInput.value = pdi.nombre;
    contenidoInput.value = pdi.contenidoJson;
    editingPdiId = pdi.idPdi;
  } else {
    nombreInput.value = "";
    contenidoInput.value = "";
    editingPdiId = null;
  }
});

// --------------------------------------------------
// 4. Mostrar modal de confirmación
// --------------------------------------------------
btnEnviar.addEventListener("click", () => {
  const nombrePdi = nombreInput.value.trim();
  const contenidoJson = contenidoInput.value.trim();

  if (!nombrePdi || !contenidoJson) {
    mensajeElement.style.color = "red";
    mensajeElement.innerText = "Rellena todos los campos.";
    return;
  }

  confirmText.textContent = JSON.stringify(
    { nombre: nombrePdi, contenidoJson },
    null,
    2
  );
  confirmModal.style.display = "flex";
});

// --------------------------------------------------
// 5. Confirmar envío (POST o PUT)
// --------------------------------------------------
confirmBtn.addEventListener("click", async () => {
  const nombrePdi = nombreInput.value.trim();
  const contenidoJson = contenidoInput.value.trim();

  const pdiDTO = { nombre: nombrePdi, contenidoJson };
  const url = editingPdiId ? `${API_URL}/${editingPdiId}` : API_URL;
  const method = editingPdiId ? "PUT" : "POST";

  try {
    const respuesta = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: JWT_TOKEN,
      },
      body: JSON.stringify(pdiDTO),
    });

    if (respuesta.ok) {
      const pdiCreado = await respuesta.json();
      mensajeElement.style.color = "green";
      mensajeElement.innerHTML = editingPdiId
        ? `PDI actualizado con éxito.`
        : `PDI creado con éxito. ID asignado: <b>${pdiCreado.idPdi}</b>`;

      // Recargar lista de PDIs para incluir cambios
      await cargarPDIs();

      // Limpiar formulario si era nuevo
      if (!editingPdiId) {
        nombreInput.value = "";
        contenidoInput.value = "";
      }

      editingPdiId = null;
      pdiSelect.value = ""; // Selección por defecto
    } else {
      const errorData = await respuesta.json();
      mensajeElement.style.color = "red";
      mensajeElement.innerHTML = `Error ${respuesta.status}: ${
        errorData.message || "Error desconocido"
      }`;
    }
  } catch (error) {
    console.error("Error de red:", error);
    mensajeElement.style.color = "red";
    mensajeElement.innerText = "Error de conexión con el servidor.";
  } finally {
    confirmModal.style.display = "none";
  }
});

// --------------------------------------------------
// 6. Cancelar modal y cerrar al click fuera
// --------------------------------------------------
cancelBtn.addEventListener(
  "click",
  () => (confirmModal.style.display = "none")
);
confirmModal.addEventListener("click", (e) => {
  if (e.target === confirmModal) confirmModal.style.display = "none";
});

// --------------------------------------------------
// Inicializar
// --------------------------------------------------
cargarPDIs();
