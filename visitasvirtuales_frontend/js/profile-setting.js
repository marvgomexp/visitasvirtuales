// Editar foto de perfil
const uploadInput = document.getElementById('upload-photo');
const profileImg = document.getElementById('profile-img');

uploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Comprobamos tipo de archivo
  if (!file.type.startsWith('image/')) {
    alert('Por favor, selecciona una imagen válida.');
    return;
  }

  // Previsualización instantánea
  const reader = new FileReader();
  reader.onload = () => {
    profileImg.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// Simulación de datos del servidor 
const user = {
  id: 18,
  fullName: 'Nombre Apellido',
  email: 'abc0000@alu.medac.es',
  location: 'Madrid, España',
  phone: '+34 612 345 678',
  bio: 'No se ha agregado una biografía.',
};

// Configuración de los campos 
const FIELDS = [
  { key: 'fullName', label: 'Nombre completo', type: 'text', placeholder: 'Tu nombre completo' },
  { key: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'abc0000@alu.medac.es' },
  { key: 'location', label: 'Ubicación', type: 'text', placeholder: 'Ciudad, País' },
  { key: 'phone', label: 'Teléfono', type: 'tel', placeholder: '+34 6..' },
  { key: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Información sobre ti' },
];

// Elementos base 
const root = document.getElementById('editable-fields');
const template = document.getElementById('editable-field-template');

// Inicialización 
function init() {
  renderFields(user);
}
init();

// Renderizado 
function renderFields(data) {
  root.innerHTML = '';
  FIELDS.forEach(field => {
    const frag = template.content.cloneNode(true);
    const node = frag.querySelector('.editable-field');
    node.dataset.key = field.key;
    frag.querySelector('label').textContent = field.label;
    frag.querySelector('.value').textContent = data[field.key] || '';

    // Botones
    const editBtn = frag.querySelector('.edit-icon');
    const saveBtn = frag.querySelector('.save');
    const cancelBtn = frag.querySelector('.cancel');

    editBtn.addEventListener('click', () => enterEdit(node, field, data[field.key] || ''));
    saveBtn.addEventListener('click', () => onSave(node, field));
    cancelBtn.addEventListener('click', () => exitEdit(node, field, false));

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