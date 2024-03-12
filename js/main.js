

// Vertex shader
const vShadeCode = `
precision mediump float;

attribute vec3 a_position;

void main() {
    gl_Position = vec4(a_position, 1.0);
}
`;

const fShadeCode = `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;

    void main()
    {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

        // Time varying pixel color
        vec3 col = -uv.xyx;

        // Output to screen
        gl_FragColor = vec4(col, 1.0);
    }
`;

main();

function main() {
    const canvas = document.querySelector("#shdrContainer canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const gl = canvas.getContext('webgl');

    if (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const shaderProgram = createShaderProgram(gl);

        if (shaderProgram) {
            const vertices = [
                -1,  1,
                -1, -1,
                 1, -1,
                -1,  1,
                 1, -1,
                 1, 1,
            ];

            const vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

            const posLocation = gl.getAttribLocation(shaderProgram, "a_position");
            gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(posLocation);

            const startTime = Date.now();
            const render = () => {
                const currentTime = (Date.now() - startTime) / 1000;

                // Establecer el tiempo uniforme para el shader
                const timeUniformLocation = gl.getUniformLocation(shaderProgram, "u_time");
                const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
                gl.uniform1f(timeUniformLocation, currentTime);
                gl.uniform2f(resolutionUniformLocation, canvas.clientWidth, canvas.clientHeight);
                canvas.width = canvas.clientWidth
                canvas.height = canvas.clientHeight;

                console.log([canvas.clientWidth, canvas.clientHeight]);

                // Limpiar el canvas y renderizar
                gl.drawArrays(gl.TRIANGLES, 0, 6);

                requestAnimationFrame(render);
            };
            render();
        }
    }
}

function createShader(gl, type, code) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    } else {
        console.error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);

        return null;
    }
}

function createShaderProgram(gl) {
    // Crear shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vShadeCode);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fShadeCode);

    if (vertexShader && fragmentShader) {
        // Crear programa de shader
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            gl.useProgram(shaderProgram);

            return shaderProgram;
        }
        else {
            console.error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
            return null;
        }
    } else {
        return null;
    }
}
