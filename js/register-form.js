// OPCIONES: ALUMNO O DOCENTE: 

// Elementos necesarios

  const btnAlumno = document.getElementById('btnAlumno');
  const btnDocente = document.getElementById('btnDocente');
  const camposAlumno = document.getElementById('camposAlumno');
  const camposDocente = document.getElementById('camposDocente');

// Al hacer clic en el botón Alumno
    btnAlumno.addEventListener('click', () => {
    btnAlumno.classList.add('activo');
    btnDocente.classList.remove('activo');
    camposAlumno.style.display = 'block';
    camposDocente.style.display = 'none';
  });

// Al hacer clic en el botón Docente
    btnDocente.addEventListener('click', () => {
    btnDocente.classList.add('activo');
    btnAlumno.classList.remove('activo');
    camposAlumno.style.display = 'none';
    camposDocente.style.display = 'block';
  });

  // Mostrar centros según la comunidad que se seleccione:

  // Objeto con comunidades y sus centros

  const centrosPorComunidad = {

     andalucia: ["Al Andalus", "Almenara", "Almería", "Arena", "Aventura", "Aurora", "Cádiz", "Córdoba", "El Ejido", "Fátima", "Flores", "Granada", "Hispanidad", "Huelva", "Jaén", "Jerez", "Málaga", "Malasaña", "Nevada", "Nova", "Nuevo Torneo", "Ortega y Gasset", "Pacífico", "Sevilla", "Sevilla Este", "Vandelvira", "Velázquez" ],
     aragon: ["El Olivar", "Formacciona", "Zaragoza"],
     asturias: ["Oviedo"],
     "castilla-la-mancha": ["Albacete"],
     cataluna: ["CampusNET", "Hospitalet", "Roger de Lluria"],
    murcia: ["Murcia", "Cartagena"],
    "comunidad-de-madrid": ["Albalá", "Alcorcón", "Fuenlabrada", "Mendivil", "Móstoles", "Pinto", "San Sebastián de los Reyes", "Vallecas"],
    "comunidad-valenciana": ["Alicante", "Castellón", "Elche", "Pastora", "Valencia"]
};

// Función para mostrar centros

    function cambiaCentros() {
        const comunidadSelect = document.getElementById("comunidad");
        const centroSelect = document.getElementById("centro");
        const comunidadSeleccionada = comunidadSelect.value


     // Limpiar centros anteriores

        centroSelect.innerHTML = '<option value="">Centro de estudios *</option>';

     // Si no hay comunidad seleccionada, no se hace nada

        if (!comunidadSeleccionada) return;

     // Obtener centros de la comunidad seleccionada
     
        const centros = centrosPorComunidad[comunidadSeleccionada];

    // Insertar los centros en el formulario

        centros.forEach(centro => {
            const option = document.createElement("option");
            option.value = centro.toLowerCase().replace(/\s+/g, "-");
            option.textContent = centro;
            centroSelect.appendChild(option);
            });
    };




