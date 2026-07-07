"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const VERT = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

// Aetheric Horizon plasma mesh — deep navy base, animated red + blue glows,
// scanlines, and subtle mouse interaction. Ported from the reference shader.
const FRAG = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {
  vec2 uv = v_texCoord;
  vec2 mouse = u_mouse / u_resolution;

  // MegaGroup deep-space navy base
  vec3 color = vec3(0.04, 0.07, 0.15);

  // Animated red glow (primary)
  float d1 = length(uv - vec2(0.2 + 0.1 * sin(u_time * 0.5), 0.3 + 0.1 * cos(u_time * 0.7)));
  color += vec3(0.86, 0.15, 0.15) * (0.15 / (d1 + 0.4)) * 0.5;

  // Animated blue glow (secondary)
  float d2 = length(uv - vec2(0.8 + 0.1 * cos(u_time * 0.6), 0.7 + 0.1 * sin(u_time * 0.4)));
  color += vec3(0.11, 0.31, 0.85) * (0.15 / (d2 + 0.4)) * 0.5;

  // Subtle gold mouse interaction (tertiary)
  float dMouse = length(uv - mouse);
  color += vec3(1.0, 0.73, 0.37) * (0.05 / (dMouse + 0.2)) * 0.3;

  // Scanlines for futuristic feel
  float scanline = sin(uv.y * 800.0) * 0.02;
  color -= scanline;

  gl_FragColor = vec4(color, 1.0);
}`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export function ShaderBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const syncSize = () => {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = 1.0 - (e.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    let raf = 0;
    let visible = true;
    const render = (t: number) => {
      if (typeof ResizeObserver === "undefined") syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uTime, t * 0.001);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = visible ? requestAnimationFrame(render) : 0;
    };
    raf = requestAnimationFrame(render);

    // This canvas sits behind the hero content and would otherwise keep
    // drawing every frame forever, even after scrolling far past it. Pause
    // the loop once it's well out of view and resume it on the way back —
    // one less perpetual render loop competing for frame budget site-wide.
    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !raf) raf = requestAnimationFrame(render);
        },
        { rootMargin: "200px 0px" },
      );
      io.observe(canvas);
    }

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      ro.disconnect();
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [reduced]);

  if (reduced) {
    return <div className={`hero-fallback-gradient ${className ?? ""}`} aria-hidden />;
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-hidden
    />
  );
}
