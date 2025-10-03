const btnAlumno = document.getElementById('btnAlumno');
  const btnDocente = document.getElementById('btnDocente');
  const camposAlumno = document.getElementById('camposAlumno');
  const camposDocente = document.getElementById('camposDocente');


  btnAlumno.addEventListener('click', () => {
    btnAlumno.classList.add('activo');
    btnDocente.classList.remove('activo');
    camposAlumno.style.display = 'block';
    camposDocente.style.display = 'none';
  });


  btnDocente.addEventListener('click', () => {
    btnDocente.classList.add('activo');
    btnAlumno.classList.remove('activo');
    camposAlumno.style.display = 'none';
    camposDocente.style.display = 'block';
  });
