
   // Pantalla de prueba

    function start() {
        let loading = document.getElementById('logo-cargando');

        setTimeout(() => {
            loading.style.display ='none';
        },3000)

        let canvas = document.getElementById("glcanvas");
        const gl = initWebGL(canvas);

        if (!gl) return;

        // Ajustar el viewport al tamaño del canvas
        gl.viewport(0, 0, canvas.width, canvas.height);

        // Establecer el color de limpieza: negro opaco
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT); // Limpiar pantalla

    }

   
   function initWebGL(canvas) {
        var gl = null;

        try {
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        } catch (e) { }

        // Aviso si no hay contexto GL
        if (!gl) {
            alert("No soportado por el navegador. Haz click aquí para redireccionar");
            gl = null;
        }

        return gl;
    }

    