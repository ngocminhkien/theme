'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseRadius: number;
  color: string;
}

export function Interactive3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse with smooth interpolation (lerp)
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      targetMouseX = width / 2;
      targetMouseY = height / 2;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particle field settings
    const PARTICLE_COUNT = Math.min(65, Math.floor(width / 26));
    const particles: Particle[] = [];
    const colors = [
      'rgba(99, 102, 241, ', // Indigo
      'rgba(6, 182, 212, ',  // Cyan
      'rgba(245, 158, 11, ', // Amber
      'rgba(168, 85, 247, ', // Purple
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.4,
        y: (Math.random() - 0.5) * height * 1.4,
        z: Math.random() * 800 + 150,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        vz: (Math.random() - 0.5) * 0.35,
        baseRadius: Math.random() * 2.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // 3D Perspective projection parameter
    const fov = 450;
    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth mouse damping (ease-out)
      mouseX += (targetMouseX - mouseX) * 0.045;
      mouseY += (targetMouseY - mouseY) * 0.045;

      // Camera tilt offset based on mouse relative to center
      const cameraOffsetX = (mouseX - width / 2) * 0.25;
      const cameraOffsetY = (mouseY - height / 2) * 0.25;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw 3D Perspective Cyber Floor Grid
      ctx.save();
      const horizonY = height * 0.65;
      const vanishingX = width / 2 + cameraOffsetX * 0.3;
      const gridLines = 14;
      const fanningLines = 18;

      // Perspective horizontal lines receding to horizon
      for (let i = 1; i <= gridLines; i++) {
        const p = Math.pow(i / gridLines, 2.2);
        const y = horizonY + p * (height - horizonY);
        const alpha = Math.min(0.18, p * 0.25);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Perspective vertical fan lines spreading from vanishing point
      for (let j = -fanningLines / 2; j <= fanningLines / 2; j++) {
        const bottomX = width / 2 + j * (width / fanningLines) * 2.2;
        ctx.beginPath();
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // 2. Render 3D Wireframe Floating Geometries
      const draw3DShape = (
        centerX: number,
        centerY: number,
        centerZ: number,
        vertices: number[][],
        edges: [number, number][],
        rotX: number,
        rotY: number,
        rotZ: number,
        color: string
      ) => {
        const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
        const cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);

        const transformed: { x: number; y: number; z: number }[] = [];

        for (const [vx, vy, vz] of vertices) {
          // Rotate Y
          const x1 = vx * cosY - vz * sinY;
          const z1 = vx * sinY + vz * cosY;
          // Rotate X
          const y2 = vy * cosX - z1 * sinX;
          const z2 = vy * sinX + z1 * cosX;
          // Rotate Z
          const x3 = x1 * cosZ - y2 * sinZ;
          const y3 = x1 * sinZ + y2 * cosZ;

          const worldX = centerX + x3 - cameraOffsetX;
          const worldY = centerY + y3 - cameraOffsetY;
          const worldZ = centerZ + z2;

          const scale = fov / (fov + Math.max(worldZ, 100));
          const sx = width / 2 + worldX * scale;
          const sy = height / 2 + worldY * scale;

          transformed.push({ x: sx, y: sy, z: worldZ });
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (const [i1, i2] of edges) {
          const p1 = transformed[i1];
          const p2 = transformed[i2];
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
        ctx.stroke();

        // Glowing vertices
        for (const p of transformed) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      };

      // 3D Cube (top-left)
      const cubeSize = 58;
      const cubeVerts = [
        [-cubeSize, -cubeSize, -cubeSize],
        [cubeSize, -cubeSize, -cubeSize],
        [cubeSize, cubeSize, -cubeSize],
        [-cubeSize, cubeSize, -cubeSize],
        [-cubeSize, -cubeSize, cubeSize],
        [cubeSize, -cubeSize, cubeSize],
        [cubeSize, cubeSize, cubeSize],
        [-cubeSize, cubeSize, cubeSize],
      ];
      const cubeEdges: [number, number][] = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ];
      draw3DShape(
        -width * 0.35,
        -height * 0.2 + Math.sin(time * 0.8) * 20,
        340,
        cubeVerts,
        cubeEdges,
        time * 0.4 + cameraOffsetY * 0.003,
        time * 0.5 + cameraOffsetX * 0.003,
        time * 0.2,
        'rgba(99, 102, 241, 0.35)'
      );

      // 3D Octahedron (top-right)
      const octSize = 70;
      const octVerts = [
        [0, -octSize, 0],
        [0, octSize, 0],
        [-octSize, 0, 0],
        [octSize, 0, 0],
        [0, 0, -octSize],
        [0, 0, octSize],
      ];
      const octEdges: [number, number][] = [
        [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 4], [4, 3], [3, 5], [5, 2],
      ];
      draw3DShape(
        width * 0.36,
        -height * 0.14 + Math.cos(time * 0.7) * 22,
        320,
        octVerts,
        octEdges,
        time * 0.35 + cameraOffsetY * 0.003,
        -time * 0.45 - cameraOffsetX * 0.003,
        time * 0.15,
        'rgba(245, 158, 11, 0.35)'
      );

      // 3. Project & Render 3D Floating Particles
      const projected: { sx: number; sy: number; size: number; alpha: number; color: string; z: number }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Autonomous gentle 3D drift
        p.x += p.vx + Math.sin(time + i) * 0.18;
        p.y += p.vy + Math.cos(time + i * 0.7) * 0.18;
        p.z += p.vz;

        // Boundary wrapping in 3D box
        const boundX = width * 0.75;
        const boundY = height * 0.75;
        if (p.x < -boundX) p.x = boundX;
        if (p.x > boundX) p.x = -boundX;
        if (p.y < -boundY) p.y = boundY;
        if (p.y > boundY) p.y = -boundY;
        if (p.z < 150) p.z = 1000;
        if (p.z > 1050) p.z = 180;

        // Perspective projection with camera mouse tilt
        const effectiveX = p.x - cameraOffsetX;
        const effectiveY = p.y - cameraOffsetY;
        const scale = fov / (fov + p.z);
        const sx = width / 2 + effectiveX * scale;
        const sy = height / 2 + effectiveY * scale;

        // Interaction: Soft repelling force from mouse cursor
        const dx = sx - mouseX;
        const dy = sy - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          const force = (200 - dist) / 200;
          p.x += (dx / dist) * force * 2.2;
          p.y += (dy / dist) * force * 2.2;
        }

        const alpha = Math.min(0.7, Math.max(0.12, (1000 - p.z) / 900));
        const size = Math.max(0.9, p.baseRadius * scale * 2.0);

        projected.push({ sx, sy, size, alpha, color: p.color, z: p.z });
      }

      // Sort by depth (painters algorithm)
      projected.sort((a, b) => b.z - a.z);

      // Connect nearby particles with subtle glowing lines
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const distSq = (p1.sx - p2.sx) ** 2 + (p1.sy - p2.sy) ** 2;
          const maxDistSq = 145 * 145;

          if (distSq < maxDistSq) {
            const lineAlpha = (1 - Math.sqrt(distSq) / 145) * 0.16 * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      // Render glowing nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowColor = `${p.color}0.6)`;
        ctx.shadowBlur = p.size * 3;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none -z-10"
    >
      {/* 1. Interactive 3D Perspective Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 2. Soft Dynamic Ambient Light Orbs with CSS Float */}
      <div className="absolute top-10 left-1/4 w-[550px] h-[550px] bg-gradient-to-tr from-brand-600/20 via-cyan-500/15 to-transparent rounded-full blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute top-44 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-amber-500/15 via-rose-500/10 to-transparent rounded-full blur-3xl animate-float-reverse pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-[650px] h-[400px] bg-gradient-to-t from-emerald-500/12 via-indigo-600/10 to-transparent rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
    </div>
  );
}
