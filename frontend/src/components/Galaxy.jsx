import React, { useEffect, useRef } from 'react';

const Galaxy = ({
    mouseRepulsion = true,
    mouseInteraction = true,
    density = 1.5,
    glowIntensity = 0.5,
    saturation = 0.8,
    hueShift = 240
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let mouseX = 0;
        let mouseY = 0;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 10000 * density);

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 0.5,
                    hue: Math.random() * 60 + hueShift, // Blue/Purple range
                    alpha: Math.random() * 0.5 + 0.1
                });
            }
        };

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Trail effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                // Simple Physics
                p.x += p.vx;
                p.y += p.vy;

                // Mouse Interaction
                if (mouseInteraction) {
                    const dx = mouseX - p.x;
                    const dy = mouseY - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        const force = (150 - dist) / 150;
                        const angle = Math.atan2(dy, dx);
                        const moveX = Math.cos(angle) * force * (mouseRepulsion ? -1 : 1);
                        const moveY = Math.sin(angle) * force * (mouseRepulsion ? -1 : 1);

                        p.vx += moveX * 0.1;
                        p.vy += moveY * 0.1;
                    }
                }

                // Wrap around screen
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Render
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, ${saturation * 100}%, 70%, ${p.alpha + glowIntensity * 0.2})`;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);

        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [density, glowIntensity, hueShift, mouseInteraction, mouseRepulsion, saturation]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full absolute inset-0 z-0 pointer-events-auto"
            style={{ background: 'transparent' }}
        />
    );
};

export default Galaxy;
