function start() {
    const loading = document.getElementById('logo-cargando');

    setTimeout(() => {
        loading.style.display = 'none';
    }, 3000);

    const canvas = document.getElementById("glcanvas");
    const noWebGLMsg = document.getElementById('no-webgl-message');

    const gl = initWebGL(canvas);

    if (!gl) {
        // Mostrar mensaje y ocultar canvas
        noWebGLMsg.style.display = 'block';
        canvas.style.display = 'none';
        return;
    }

    // Si hay WebGL, mostrar canvas y ocultar mensaje
    canvas.style.display = 'block';
    noWebGLMsg.style.display = 'none';

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function initWebGL(canvas) {
    let gl = null;

    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) { }

    if (!gl) {
        return null;
    }

    return gl;
}