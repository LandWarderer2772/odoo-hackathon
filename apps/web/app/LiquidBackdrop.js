"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const fragmentShader = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = x0.x > x0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec2 mouse = u_mouse / u_resolution;
  if (length(u_mouse) < 1.0) mouse = vec2(0.5, 0.5);
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = st;
  p.x *= aspect;
  vec2 m = mouse;
  m.x *= aspect;
  float t = u_time * 0.18;
  float n1 = snoise(p * 1.2 + vec2(t * 0.4, t * 0.3));
  float n2 = snoise(p * 2.0 - vec2(t * 0.25, -t * 0.35) + vec2(n1 * 0.5));
  float n3 = snoise(p * 3.5 + vec2(n2 * 0.4, t * 0.2));
  float mouseWave = (1.0 - smoothstep(0.0, 0.6, length(p - m))) * 0.35;
  vec3 cBg = vec3(0.957, 0.976, 0.996);
  vec3 cPrimary = vec3(0.114, 0.380, 0.906);
  vec3 cCyan = vec3(0.220, 0.714, 1.0);
  vec3 cWhite = vec3(1.0);
  float blob1 = smoothstep(-0.3, 0.7, n1 + mouseWave);
  float blob2 = smoothstep(-0.4, 0.8, n2);
  float blob3 = smoothstep(-0.2, 0.6, n3);
  vec3 col = mix(cBg, cCyan, blob1 * 0.32);
  col = mix(col, cPrimary, blob2 * 0.28);
  col = mix(col, cWhite, blob3 * 0.45);
  float rim = pow(1.0 - length(st - 0.5) * 0.8, 1.5);
  col += cCyan * 0.08 * rim;
  gl_FragColor = vec4(col, 1.0);
}`;

export default function LiquidBackdrop({ enabled }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: false, antialias: false });
    if (!canvas || !gl) return undefined;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertex = compile(gl.VERTEX_SHADER, vertexShader);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return undefined;
    }

    const program = gl.createProgram();
    if (!program) return undefined;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return undefined;
    }

    const buffer = gl.createBuffer();
    if (!buffer) {
      gl.deleteProgram(program);
      return undefined;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const timeUniform = gl.getUniformLocation(program, "u_time");
    const resolutionUniform = gl.getUniformLocation(program, "u_resolution");
    const mouseUniform = gl.getUniformLocation(program, "u_mouse");
    const mouse = { x: 0, y: 0 };
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const width = Math.max(1, Math.floor(window.innerWidth * pixelRatio));
      const height = Math.max(1, Math.floor(window.innerHeight * pixelRatio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };
    const moveMouse = (event) => {
      mouse.x = event.clientX * pixelRatio;
      mouse.y = (window.innerHeight - event.clientY) * pixelRatio;
    };
    const draw = (time) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (timeUniform) gl.uniform1f(timeUniform, time * 0.001);
      if (resolutionUniform) gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
      if (mouseUniform) gl.uniform2f(mouseUniform, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", moveMouse, { passive: true });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    observer?.observe(canvas);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frameId = 0;
    const render = (time) => {
      draw(time);
      if (!reducedMotion) frameId = window.requestAnimationFrame(render);
    };
    render(0);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", moveMouse);
      observer?.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [enabled]);

  return <canvas ref={canvasRef} className="shader-backdrop" aria-hidden="true" />;
}
