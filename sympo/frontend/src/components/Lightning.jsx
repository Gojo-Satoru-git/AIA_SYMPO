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
    // const fs = `
    //   precision mediump float;
    //   uniform vec2 res;
    //   uniform float time;
    //   uniform float opacity;
    //   uniform float xOff;

    //   float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    //   float noise(vec2 p) {
    //     vec2 i = floor(p); vec2 f = fract(p);
    //     float a = hash(i); float b = hash(i + vec2(1.0, 0.0));
    //     float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
    //     vec2 u = f * f * (3.0 - 2.0 * f);
    //     return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    //   }

    //   // Separate FBM to force high jaggedness on mobile only
    //   float mobileFbm(vec2 p) {
    //     float v = 0.0;
    //     float amt = 0.5;
    //     for (int i = 0; i < 8; i++) {
    //       v += amt * noise(p);
    //       p *= 4.5; // High multiplier makes it non-linear and jagged
    //       amt *= 0.5;
    //     }
    //     return v;
    //   }

    //   float desktopFbm(vec2 p) {
    //     float v = 0.0;
    //     float amt = 0.5;
    //     for (int i = 0; i < 5; i++) {
    //       v += amt * noise(p);
    //       p *= 2.0;
    //       amt *= 0.5;
    //     }
    //     return v;
    //   }

    //   void main() {
    //     vec2 uv = gl_FragCoord.xy / res.xy;
    //     float aspect = res.x / res.y;
    //     bool isMobile = res.x < 768.0;

    //     float x;
    //     float n;
    //     float drift;

    //     if (isMobile) {
    //         // 1. POSITION: Forced centering for mobile as requested
    //         x = (uv.x * 2.0 - 1.0);

    //         // 2. JAGGEDNESS: High vertical scale (15.0) and high amplitude (1.2)
    //         // This prevents the line from appearing straight
    //         n = mobileFbm(vec2(uv.y * 15.0, time * 25.0));
    //         drift = (n - 0.5) * 1.2;
    //     } else {
    //         // 3. DESKTOP: Original logic preserved
    //         x = (uv.x * 2.0 - 1.0) * aspect - (xOff * aspect);
    //         n = desktopFbm(vec2(uv.y * 2.5, time * 20.0));
    //         drift = (n - 0.5) * 0.5;
    //     }

    //     float dist = abs(x + drift);

    //     // Core and Glow Visibility
    //     float coreWidth = isMobile ? 0.008 : 0.005;
    //     float glowWidth = isMobile ? 0.02 : 0.015;

    //     float core = coreWidth / dist;
    //     float glow = glowWidth / pow(dist, 0.8);

    //     // Stranger Things Deep Red
    //     vec3 color = vec3(0.9, 0.02, 0.02);
    //     float alpha = (core + glow) * opacity;

    //     gl_FragColor = vec4(color * alpha, clamp(alpha, 0.0, 1.0));
    //   }
    // `;

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

      float fbm(vec2 p, bool isMobile) {
        float v = 0.0;
        float amt = 0.5;
        // Desktop is smoother (5), Mobile is jagged (8)
        int iterations = isMobile ? 8 : 5;
        for (int i = 0; i < 10; i++) {
          if(i >= iterations) break;
          v += amt * noise(p);
          p *= isMobile ? 4.5 : 2.0;
          amt *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / res.xy;
        float aspect = res.x / res.y;
        bool isMobile = res.x < 768.0;

        // 1. STABLE POSITIONING
        float x;
        if (isMobile) {
            // Force center for mobile
            x = (uv.x * 2.0 - 1.0);
        } else {
            // Standard aspect-aware positioning for desktop
            x = (uv.x * 2.0 - 1.0) * aspect - (xOff * aspect);
        }

        // 2. JAGGEDNESS
        // p.y * frequency, plus a time offset to make it flicker
        float frequency = isMobile ? 12.0 : 2.5;
        float n = fbm(vec2(uv.y * frequency, time * 20.0), isMobile);

        // Amplitude: How wide the zig-zags are
        float amplitude = isMobile ? 0.7 : 0.5;
        float drift = (n - 0.5) * amplitude;

        float dist = abs(x + drift);

        // 3. VISIBILITY GUARANTEE
        // Ensure core and glow are thick enough to see on all screens
        float thicknessScale = isMobile ? 1.5 : 1.0;
        float core = (0.01 * thicknessScale) / dist;
        float glow = (0.03 * thicknessScale) / pow(dist, 0.7);

        // Stranger Things Red
        vec3 color = vec3(0.9, 0.02, 0.02);
        float alpha = (core + glow) * opacity;

        // Final output: Clamp alpha but keep it high enough to see
        gl_FragColor = vec4(color * alpha, clamp(alpha, 0.0, 1.0));
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
