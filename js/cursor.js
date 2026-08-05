/* ==========================================================================
   Custom Glowing Physics Cursor Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Instant dot positioning
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    // Smooth Lerp animation loop for the outer ring
    function renderCursor() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover state triggers
    const hoverElements = 'a, button, .glass-panel, .project-card, .cert-card, .skill-card, .domain-btn, .filter-btn';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverElements)) {
            document.body.classList.add('cursor-hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverElements)) {
            document.body.classList.remove('cursor-hover');
        }
    });
});
