// MENÚ DE CONFIGURACIÓN

document.addEventListener("DOMContentLoaded", () => {
  const btnGeneral = document.getElementById("btnGeneral");
  const btnNotif = document.getElementById("btnNotif");
  const btnPass = document.getElementById("btnPass");
  const profileSection = document.querySelector(".profile-section");
  const buttons = [btnGeneral, btnNotif, btnPass];

  // Contenidos de cada pestaña
  const contents = {
    general: `
      <div class="profile-card">
        <div class="profile-picture">
          <img id="profile-img" src="/visitasvirtuales_frontend/images/avatar-placeholder.jpg" alt="Foto de perfil">
          <label for="upload-photo" class="change-photo">
            <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 512 512">
              <path fill="#ffffff" d="M193.1 32c-18.7 0-36.2 9.4-46.6 24.9L120.5 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-56.5 0-26-39.1C355.1 41.4 337.6 32 318.9 32L193.1 32zm-6.7 51.6c1.5-2.2 4-3.6 6.7-3.6l125.7 0c2.7 0 5.2 1.3 6.7 3.6l33.2 49.8c4.5 6.7 11.9 10.7 20 10.7l69.3 0c8.8 0 16 7.2 16 16l0 256c0 8.8-7.2 16-16 16L64 432c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l69.3 0c8 0 15.5-4 20-10.7l33.2-49.8zM256 384a112 112 0 1 0 0-224 112 112 0 1 0 0 224zM192 272a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"/>
            </svg>
            <input type="file" id="upload-photo" accept="image/*" hidden>
          </label>
        </div>
        <h3 id="profile-name">Nombre Apellido</h3>
        <p class="nota">JPG, PNG o GIF (máx. X MB)</p>
      </div>

      <div class="profile-info">
        <h3>Configuración de perfil</h3>
        <p>Edita tu información personal y de contacto</p>

        <template id="editable-field-template">
          <div class="editable-field">
            <label></label>
            <div class="value"></div>
            <div class="edit-icon">✎</div>
            <div class="save-inline hidden">
              <button class="save">Guardar</button>
              <button class="cancel">Cancelar</button>
            </div>
            <div class="error hidden"></div>
          </div>
        </template>

        <div id="editable-fields"></div>
      </div>
    `,

    notifications: `
      <div class="profile-info full">
        <div id="confiNotif">
          <h2>Preferencias de Notificaciones</h2>
          <p class="subtitulo">Selecciona qué actualizaciones quieres recibir</p>

          <div class="noti-card">
            <div class="noti-info">
              <h3>Notificaciones por Email</h3>
              <p>Recibe actualizaciones importantes por correo electrónico</p>
            </div>
            <label class="switch">
              <input type="checkbox" checked>
              <span class="slider round"></span>
            </label>
          </div>

          <div class="noti-card">
            <div class="noti-info">
              <h3>Contenido nuevo</h3>
              <p>Recibe las actualizaciones de contenido de tus aulas</p>
            </div>
            <label class="switch">
              <input type="checkbox">
              <span class="slider round"></span>
            </label>
          </div>

          <hr>

          <div class="noti-card">
            <div class="noti-info">
              <h3>Comunicaciones de profesores</h3>
              <p>Recibe avisos sobre los comunicados de tu profesorado</p>
            </div>
            <label class="switch">
              <input type="checkbox" checked>
              <span class="slider round"></span>
            </label>
          </div>

          <div class="noti-card">
            <div class="noti-info">
              <h3>Newsletter Davante</h3>
              <p>Recibe noticias sobre el centro y consejos educativos</p>
            </div>
            <label class="switch">
              <input type="checkbox" checked>
              <span class="slider round"></span>
            </label>
          </div>

          <button class="btn-guardar">Guardar Preferencias</button>
        </div>
      </div>
    `,

    password: `
      <div class="profile-info full">
        <h3>Cambiar contraseña</h3>
        <p>Introduce tu contraseña actual y la nueva para actualizarla</p>
        <form id="change-password-form">
          <label>Contraseña actual:</label><br>
          <input type="password" id="current-password" required><br><br>
          <label>Nueva contraseña:</label><br>
          <input type="password" id="new-password" required><br><br>
          <label>Confirmar nueva contraseña:</label><br>
          <input type="password" id="confirm-password" required><br><br>
          <button type="submit" class="btn save">Actualizar contraseña</button>
        </form>
      </div>
    `
  };

  
  // Navegación entre pestañas

  function changeTab(tab) {
    if (tab.classList.contains("activo")) return;
    buttons.forEach(btn => btn.classList.remove("activo"));
    tab.classList.add("activo");

    profileSection.classList.add("fade");

    setTimeout(() => {
      if (tab === btnGeneral) {
        profileSection.innerHTML = contents.general;
        initGeneralTab();
      } else if (tab === btnNotif) {
        profileSection.innerHTML = contents.notifications;
      } else if (tab === btnPass) {
        profileSection.innerHTML = contents.password;
      }

      profileSection.classList.remove("fade");
    }, 200);
  }

  // Eventos al hacer clic
  btnGeneral.addEventListener("click", () => changeTab(btnGeneral));
  btnNotif.addEventListener("click", () => changeTab(btnNotif));
  btnPass.addEventListener("click", () => changeTab(btnPass));


  // Cargar pestaña general al inicio
 
  if (profileSection) {
    profileSection.innerHTML = contents.general;
    initGeneralTab();
    btnGeneral.classList.add("activo");
  } else {
    console.error("⚠️ No se encontró el contenedor .profile-section");
  }
});

// Función initGeneralTab()

function initGeneralTab() {
  const uploadInput = document.getElementById('upload-photo');
  const profileImg = document.getElementById('profile-img');
  if (!uploadInput || !profileImg) return;

  uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona una imagen válida.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => (profileImg.src = reader.result);
    reader.readAsDataURL(file);
  });

  const user = {
    id: 18,
    fullName: 'Nombre Apellido',
    email: 'abc0000@alu.medac.es',
    location: 'Madrid, España',
    phone: '+34 612 345 678',
    bio: 'No se ha agregado una biografía.',
  };

  const FIELDS = [
    { key: 'fullName', label: 'Nombre completo', type: 'text' },
    { key: 'email', label: 'Correo electrónico', type: 'email' },
    { key: 'location', label: 'Ubicación', type: 'text' },
    { key: 'phone', label: 'Teléfono', type: 'tel' },
    { key: 'bio', label: 'Bio', type: 'textarea' },
  ];

  const root = document.getElementById('editable-fields');
  const template = document.getElementById('editable-field-template');
  if (!root || !template) return;

  root.innerHTML = '';
  FIELDS.forEach(field => {
    const frag = template.content.cloneNode(true);
    const node = frag.querySelector('.editable-field');
    node.dataset.key = field.key;
    frag.querySelector('label').textContent = field.label;
    frag.querySelector('.value').textContent = user[field.key] || '';
    root.appendChild(frag);
  });
}

// Modo edición 
function enterEdit(node, field, currentValue) {
  const valueEl = node.querySelector('.value');
  const editBtn = node.querySelector('.edit-icon');
  const saveInline = node.querySelector('.save-inline');
  const errorEl = node.querySelector('.error');
  valueEl.innerHTML = '';
  errorEl.classList.add('hidden');

  let input;
  if (field.type === 'textarea') {
    input = document.createElement('textarea');
    input.rows = 3;
  } else {
    input = document.createElement('input');
    input.type = field.type;
  }
  input.className = 'input';
  input.value = currentValue;
  input.placeholder = field.placeholder || '';

  valueEl.appendChild(input);
  editBtn.classList.add('hidden');
  saveInline.classList.remove('hidden');

  input.focus();
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && field.type !== 'textarea') {
      e.preventDefault();
      onSave(node, field);
    } else if (e.key === 'Escape') {
      exitEdit(node, field, false);
    }
  });
}

// Validación 
function validateField(field, value) {
  if (field.key === 'email') {
    const re = /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/;
    if (!re.test(value)) return 'Introduce un correo válido.';
  }
  if (field.key === 'fullName' && value.trim().length < 2)
    return 'El nombre es demasiado corto.';
  return null;
}

// Guardar 
async function onSave(node, field) {
  const input = node.querySelector('.input');
  const errorEl = node.querySelector('.error');
  const newVal = input.value.trim();
  const validationError = validateField(field, newVal);

  if (validationError) {
    errorEl.textContent = validationError;
    errorEl.classList.remove('hidden');
    return;
  }

  const saveBtn = node.querySelector('.save');
  saveBtn.textContent = 'Guardando...';
  saveBtn.disabled = true;

  try {
    // Simulación de envío al servidor
    await new Promise(r => setTimeout(r, 600));
    user[field.key] = newVal;
    if (field.key === 'fullName') {
  const profileName = document.getElementById('profile-name');
  if (profileName) profileName.textContent = newVal;
}
    exitEdit(node, field, true, newVal);
    
  } catch (err) {
    errorEl.textContent = 'No se pudo guardar. Inténtalo de nuevo.';
    errorEl.classList.remove('hidden');
  } finally {
    saveBtn.textContent = 'Guardar';
    saveBtn.disabled = false;
  }
}

// Salir de modo edición
function exitEdit(node, field, saved, newVal) {
  const valueEl = node.querySelector('.value');
  const editBtn = node.querySelector('.edit-icon');
  const saveInline = node.querySelector('.save-inline');
  const errorEl = node.querySelector('.error');

  errorEl.classList.add('hidden');
  valueEl.innerHTML = saved ? newVal : user[field.key];
  editBtn.classList.remove('hidden');
  saveInline.classList.add('hidden');
}