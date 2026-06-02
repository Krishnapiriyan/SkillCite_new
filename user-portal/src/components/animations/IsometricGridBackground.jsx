// import React, { useEffect, useRef } from 'react';

// export default function IsometricGridBackground() {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     let animationFrameId;
//     let time = 0;

//     const resize = () => {
//       canvas.width = canvas.parentElement.clientWidth;
//       canvas.height = canvas.parentElement.clientHeight;
//     };

//     window.addEventListener('resize', resize);
//     resize();

//     // Mouse tracking - start off-screen
//     let mouse = { x: -1000, y: -1000 };
//     const handleMouseMove = (e) => {
//       const rect = canvas.getBoundingClientRect();
//       mouse.x = e.clientX - rect.left;
//       mouse.y = e.clientY - rect.top;
//     };
//     canvas.parentElement.addEventListener('mousemove', handleMouseMove);

//     // Scroll-aware performance mode
//     let isScrolling = false;
//     let scrollTimer;
//     const handleScroll = () => {
//       isScrolling = true;
//       clearTimeout(scrollTimer);
//       scrollTimer = setTimeout(() => { isScrolling = false; }, 150);
//     };
//     window.addEventListener('scroll', handleScroll, { passive: true });

//     // Scanning lines - scan horizontally in screen space
//     // const scanLines = [
//     //   { progress: 0, speed: 0.002, color: 'rgba(80, 160, 220, 0.28)' },
//     //   { progress: 0.5, speed: 0.0014, color: 'rgba(140, 100, 210, 0.22)' },
//     // ];

//     // Particle sparks
//     const sparks = [];
//     const spacing = 52; // Increased spacing slightly for better visual design and fewer nodes

//     const trySpawnSpark = () => {
//       if (Math.random() > 0.965 && sparks.length < 12) {
//         sparks.push({
//           x: Math.random() * canvas.width,
//           y: Math.random() * canvas.height,
//           life: 1,
//           decay: 0.015 + Math.random() * 0.015,
//           maxRadius: 3.5 + Math.random() * 3.5,
//         });
//       }
//     };

//     const animate = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // Background
//       ctx.fillStyle = '#F3F2F0';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       // Ambient mouse radial glow (skip when scrolling for performance)
//       if (!isScrolling && mouse.x > 0) {
//         const glowGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 300);
//         glowGrad.addColorStop(0, 'rgba(170, 195, 225, 0.16)');
//         glowGrad.addColorStop(1, 'rgba(170, 195, 225, 0)');
//         ctx.fillStyle = glowGrad;
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//       }

//       // === Draw isometric staggered grid ===
//       const cols = Math.ceil(canvas.width / spacing) + 3;
//       const rows = Math.ceil(canvas.height / (spacing * 0.58)) + 3;

//       const panX = (time * 0.22) % spacing;
//       const panY = (time * 0.12) % (spacing * 0.58);

//       for (let c = -2; c < cols; c++) {
//         for (let r = -2; r < rows; r++) {
//           // Shift every other row to create an isometric lattice look
//           const stagger = (r % 2 === 0) ? 0 : spacing / 2;
//           const x = c * spacing + stagger + panX;
//           const y = r * spacing * 0.58 + panY;

//           const dx = x - mouse.x;
//           const dy = y - mouse.y;
//           const dist = Math.sqrt(dx * dx + dy * dy);

//           let radius = 1.3;
//           let alpha = 0.18;

//           // Mouse proximity magnification
//           if (!isScrolling && dist < 160) {
//             const t = 1 - dist / 160;
//             radius += t * 2.6;
//             alpha += t * 0.55;
//           }

//           // Slow organic pulsing wave ripple
//           const wave = Math.sin(Math.sqrt((x - canvas.width / 2) ** 2 + (y - canvas.height / 2) ** 2) * 0.008 - time * 0.015);
//           alpha += wave * 0.05;

//           ctx.beginPath();
//           ctx.arc(x, y, Math.max(0.5, radius), 0, Math.PI * 2);
//           ctx.fillStyle = `rgba(90, 110, 140, ${Math.min(0.85, Math.max(0.03, alpha))})`;
//           ctx.fill();
//         }
//       }

//       // Draw scan lines horizontally
//       // scanLines.forEach(scan => {
//       // //   const scanX = scan.progress * canvas.width;
//       // //   const grad = ctx.createLinearGradient(scanX - 90, 0, scanX + 90, 0);
//       // //   grad.addColorStop(0, 'rgba(80, 160, 220, 0)');
//       // //   grad.addColorStop(0.5, scan.color);
//       //   grad.addColorStop(1, 'rgba(80, 160, 220, 0)');
//       //   ctx.fillStyle = grad;
//       //   ctx.fillRect(scanX - 90, 0, 180, canvas.height);

//       //   scan.progress += scan.speed;
//       //   if (scan.progress > 1) scan.progress = 0;
//       // });

//       // === Sparks (screen space) ===
//       trySpawnSpark();
//       for (let i = sparks.length - 1; i >= 0; i--) {
//         const s = sparks[i];

//         const sparkGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.maxRadius * s.life);
//         sparkGrad.addColorStop(0, `rgba(120, 180, 255, ${s.life * 0.8})`);
//         sparkGrad.addColorStop(1, `rgba(120, 180, 255, 0)`);
//         ctx.beginPath();
//         ctx.arc(s.x, s.y, s.maxRadius * s.life, 0, Math.PI * 2);
//         ctx.fillStyle = sparkGrad;
//         ctx.fill();

//         s.life -= s.decay;
//         if (s.life <= 0) sparks.splice(i, 1);
//       }

//       time += 1;
//       animationFrameId = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       window.removeEventListener('resize', resize);
//       canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('scroll', handleScroll);
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="absolute inset-0 w-full h-full z-0 pointer-events-none"
//       style={{ willChange: 'transform' }}
      
//     />
//   );
// }




import React, { useEffect, useRef } from 'react';

export default function IsometricGridBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Mouse tracking
    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    canvas.parentElement.addEventListener('mousemove', handleMouseMove);

    // Scroll optimization
    let isScrolling = false;
    let scrollTimer;

    const handleScroll = () => {
      isScrolling = true;

      clearTimeout(scrollTimer);

      scrollTimer = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    // Sparks
    const sparks = [];
    const spacing = 52;

    const trySpawnSpark = () => {
      if (Math.random() > 0.965 && sparks.length < 12) {
        sparks.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          life: 1,
          decay: 0.015 + Math.random() * 0.015,
          maxRadius: 3.5 + Math.random() * 3.5,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Premium olive-gray background
      ctx.fillStyle = 'rgb(195, 196, 185)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Mouse glow
      if (!isScrolling && mouse.x > 0) {
        const glowGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          300
        );

        glowGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
        glowGrad.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Grid
      const cols = Math.ceil(canvas.width / spacing) + 3;
      const rows = Math.ceil(canvas.height / (spacing * 0.58)) + 3;

      const panX = (time * 0.22) % spacing;
      const panY = (time * 0.12) % (spacing * 0.58);

      for (let c = -2; c < cols; c++) {
        for (let r = -2; r < rows; r++) {
          const stagger = r % 2 === 0 ? 0 : spacing / 2;

          const x = c * spacing + stagger + panX;
          const y = r * spacing * 0.58 + panY;

          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let radius = 1.3;
          let alpha = 0.18;

          if (!isScrolling && dist < 160) {
            const t = 1 - dist / 160;

            radius += t * 2.6;
            alpha += t * 0.55;
          }

          const wave = Math.sin(
            Math.sqrt(
              (x - canvas.width / 2) ** 2 +
              (y - canvas.height / 2) ** 2
            ) *
              0.008 -
              time * 0.015
          );

          alpha += wave * 0.05;

          ctx.beginPath();
          ctx.arc(
            x,
            y,
            Math.max(0.5, radius),
            0,
            Math.PI * 2
          );

          // Dark premium dots
          ctx.fillStyle = `rgba(
            55,
            60,
            70,
            ${Math.min(0.85, Math.max(0.03, alpha))}
          )`;

          ctx.fill();
        }
      }

      // Sparks
      trySpawnSpark();

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];

        const sparkGrad = ctx.createRadialGradient(
          s.x,
          s.y,
          0,
          s.x,
          s.y,
          s.maxRadius * s.life
        );

        sparkGrad.addColorStop(
          0,
          `rgba(255,255,255,${s.life * 0.6})`
        );

        sparkGrad.addColorStop(
          1,
          'rgba(255,255,255,0)'
        );

        ctx.beginPath();
        ctx.arc(
          s.x,
          s.y,
          s.maxRadius * s.life,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = sparkGrad;
        ctx.fill();

        s.life -= s.decay;

        if (s.life <= 0) {
          sparks.splice(i, 1);
        }
      }

      time += 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);

      canvas.parentElement?.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      style={{
        willChange: 'transform',
      }}
    />
  );
}