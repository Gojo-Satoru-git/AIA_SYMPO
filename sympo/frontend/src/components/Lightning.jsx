import React, { useRef, useEffect } from 'react';

const LightningStrike = ({ trigger, xOffset = 0, onComplete }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { alpha: true });
    if (!gl) return;

    const vs = `
      attribute vec2 pos;
      void main() { gl_Position = vec4(pos, 0.0, 1.0); }
    `;

    const fs = `
      precision mediump float;
      uniform vec2 res;
      uniform float time;
      uniform float opacity;
      uniform float xOff;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p);
        float a = hash(i); float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      float fbm(vec2 p) {
        float v = 0.0; float amt = 0.5;
        for (int i = 0; i < 5; i++) { v += amt * noise(p); p *= 2.0; amt *= 0.5; }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / res.xy;
        uv = uv * 2.0 - 1.0;
        uv.x *= res.x / res.y;
        
        bool isMobile = res.x < 600.0;
        float thickness = isMobile ? 0.005 : 0.012;
        float noiseScale = isMobile ? 1.0 : 1.5;
        
        float n = fbm(uv * noiseScale + time * 25.0);
        float spread = isMobile ? 0.8 : 1.2; 
        float dist = abs(uv.x - (xOff * (res.x/res.y)) + (n - 0.5) * spread);
        
        float finalBeam = thickness / dist;
        if(isMobile) { finalBeam = pow(finalBeam, 1.2); }

        vec3 color = vec3(0.85, 0.02, 0.02); // Stranger Things Deep Red
        float beam = finalBeam * opacity;
        gl_FragColor = vec4(color * beam, beam * opacity);
      }
    `;

    const program = gl.createProgram();
    const addShader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      gl.attachShader(program, s);
    };
    addShader(gl.VERTEX_SHADER, vs);
    addShader(gl.FRAGMENT_SHADER, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pLoc = gl.getAttribLocation(program, 'pos');
    gl.enableVertexAttribArray(pLoc);
    gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0);

    const utime = gl.getUniformLocation(program, 'time');
    const ures = gl.getUniformLocation(program, 'res');
    const uop = gl.getUniformLocation(program, 'opacity');
    const ux = gl.getUniformLocation(program, 'xOff');

    let start = performance.now();
    const render = (now) => {
      const p = (now - start) / 600;
      if (p >= 1) {
        onComplete?.();
        return;
      }

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(ures, canvas.width, canvas.height);
      gl.uniform1f(utime, p * 5.0);
      gl.uniform1f(uop, 1.0 - p);
      gl.uniform1f(ux, xOffset);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }, [trigger, xOffset]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 9999, mixBlendMode: 'screen' }}
    />
  );
};

export default LightningStrike;
