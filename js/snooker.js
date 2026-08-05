/* ==========================================================================
   2D 8-Ball Snooker Physics Engine & Skill Unlocker
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('snookerCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const skillsSunkCountEl = document.getElementById('skillsSunkCount');
    const resetBtn = document.getElementById('resetSnookerBtn');
    const toast = document.getElementById('snookerToast');
    const toastSkillTitle = document.getElementById('toastSkillTitle');
    const unlockedSkillsList = document.getElementById('unlockedSkillsList');

    // Canvas dimensions & Table bounds
    const width = canvas.width;
    const height = canvas.height;
    const padding = 26; // Cushion thickness
    const tableLeft = padding;
    const tableRight = width - padding;
    const tableTop = padding;
    const tableBottom = height - padding;
    const ballRadius = 11;

    // 6 Pocket Positions (Corners & Middle)
    const pocketRadius = 20;
    const pockets = [
        { x: tableLeft + 5, y: tableTop + 5 },
        { x: width / 2, y: tableTop + 2 },
        { x: tableRight - 5, y: tableTop + 5 },
        { x: tableLeft + 5, y: tableBottom - 5 },
        { x: width / 2, y: tableBottom - 2 },
        { x: tableRight - 5, y: tableBottom - 5 }
    ];

    // Skill Balls Configuration (10 Skills)
    const skillConfig = [
        { name: "Python & AI/ML", color: "#ef4444", cardId: "skill-card-1" },
        { name: "Computer Vision & OpenCV", color: "#3b82f6", cardId: "skill-card-2" },
        { name: "Machine Learning & Analytics", color: "#10b981", cardId: "skill-card-3" },
        { name: "Verilog / VHDL & Digital VLSI", color: "#eab308", cardId: "skill-card-4" },
        { name: "Cadence Virtuoso & HSPICE", color: "#a855f7", cardId: "skill-card-5" },
        { name: "Embedded C / C++ Firmware", color: "#f97316", cardId: "skill-card-6" },
        { name: "PCB Design & Hardware Tools", color: "#ec4899", cardId: "skill-card-7" },
        { name: "SQL (MySQL) & Databases", color: "#06b6d4", cardId: "skill-card-8" },
        { name: "Data Structures & Algorithms", color: "#6366f1", cardId: "skill-card-9" },
        { name: "Git & Dev Tools", color: "#059669", cardId: "skill-card-10" }
    ];

    let cueBall = { x: 220, y: height / 2, vx: 0, vy: 0, isCue: true };
    let skillBalls = [];
    let sunkSkills = [];
    let isAiming = false;
    let dragStart = { x: 0, y: 0 };
    let dragCurrent = { x: 0, y: 0 };

    // Initialize Game Racking
    function initGame() {
        cueBall = { x: 220, y: height / 2, vx: 0, vy: 0, isCue: true };
        skillBalls = [];
        sunkSkills = [];
        skillsSunkCountEl.textContent = "0";
        unlockedSkillsList.innerHTML = '<span class="empty-hint">Pot a ball into any of the 6 pockets to reveal a skill!</span>';
        
        if (toast) toast.classList.add('hidden');

        // Rack 10 balls in a triangle on the right side
        const rackX = width - 240;
        const rackY = height / 2;
        const r = ballRadius * 2 + 2;

        let index = 0;
        const rows = 4;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col <= row; col++) {
                if (index >= skillConfig.length) break;
                const x = rackX + row * (r * 0.866);
                const y = rackY + (col - row / 2) * r;
                const conf = skillConfig[index];
                
                skillBalls.push({
                    x: x,
                    y: y,
                    vx: 0,
                    vy: 0,
                    color: conf.color,
                    name: conf.name,
                    cardId: conf.cardId,
                    sunk: false,
                    isCue: false
                });
                index++;
            }
        }
    }
    initGame();

    if (resetBtn) {
        resetBtn.addEventListener('click', initGame);
    }

    // Canvas Mouse & Touch Event Handlers
    function getCanvasCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    function isMoving() {
        if (Math.hypot(cueBall.vx, cueBall.vy) > 0.1) return true;
        return skillBalls.some(b => !b.sunk && Math.hypot(b.vx, b.vy) > 0.1);
    }

    function onPointerDown(e) {
        if (isMoving()) return;
        const coords = getCanvasCoords(e);
        const dist = Math.hypot(coords.x - cueBall.x, coords.y - cueBall.y);
        
        if (dist < 40) { // Clicked near cue ball
            isAiming = true;
            dragStart = { x: cueBall.x, y: cueBall.y };
            dragCurrent = coords;
        }
    }

    function onPointerMove(e) {
        if (!isAiming) return;
        dragCurrent = getCanvasCoords(e);
    }

    function onPointerUp() {
        if (!isAiming) return;
        isAiming = false;

        const dx = dragStart.x - dragCurrent.x;
        const dy = dragStart.y - dragCurrent.y;
        const power = Math.min(Math.hypot(dx, dy) * 0.18, 16);

        if (power > 0.5) {
            const angle = Math.atan2(dy, dx);
            cueBall.vx = Math.cos(angle) * power;
            cueBall.vy = Math.sin(angle) * power;
        }
    }

    canvas.addEventListener('mousedown', onPointerDown);
    canvas.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); onPointerDown(e); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); onPointerMove(e); }, { passive: false });
    window.addEventListener('touchend', onPointerUp);

    // Physics Engine Update Loop
    function updatePhysics() {
        const allBalls = [cueBall, ...skillBalls.filter(b => !b.sunk)];

        allBalls.forEach(ball => {
            // Apply Movement & Friction
            ball.x += ball.vx;
            ball.y += ball.vy;
            ball.vx *= 0.984;
            ball.vy *= 0.984;

            if (Math.abs(ball.vx) < 0.04) ball.vx = 0;
            if (Math.abs(ball.vy) < 0.04) ball.vy = 0;

            // Wall Collisions
            if (ball.x - ballRadius < tableLeft) {
                ball.x = tableLeft + ballRadius;
                ball.vx *= -0.85;
            }
            if (ball.x + ballRadius > tableRight) {
                ball.x = tableRight - ballRadius;
                ball.vx *= -0.85;
            }
            if (ball.y - ballRadius < tableTop) {
                ball.y = tableTop + ballRadius;
                ball.vy *= -0.85;
            }
            if (ball.y + ballRadius > tableBottom) {
                ball.y = tableBottom - ballRadius;
                ball.vy *= -0.85;
            }

            // Pocket Collisions
            pockets.forEach(p => {
                const distToPocket = Math.hypot(ball.x - p.x, ball.y - p.y);
                if (distToPocket < pocketRadius) {
                    if (ball.isCue) {
                        // Scratch! Reset cue ball
                        ball.x = 220;
                        ball.y = height / 2;
                        ball.vx = 0;
                        ball.vy = 0;
                    } else if (!ball.sunk) {
                        // Skill Ball Sunk!
                        ball.sunk = true;
                        ball.vx = 0;
                        ball.vy = 0;
                        triggerSkillUnlock(ball);
                    }
                }
            });
        });

        // Ball-to-Ball Elastic Collisions
        for (let i = 0; i < allBalls.length; i++) {
            for (let j = i + 1; j < allBalls.length; j++) {
                const b1 = allBalls[i];
                const b2 = allBalls[j];

                const dx = b2.x - b1.x;
                const dy = b2.y - b1.y;
                const dist = Math.hypot(dx, dy);
                const minDist = ballRadius * 2;

                if (dist < minDist && dist > 0) {
                    const nx = dx / dist;
                    const ny = dy / dist;

                    // Separate overlapping balls
                    const overlap = minDist - dist;
                    b1.x -= nx * (overlap / 2);
                    b1.y -= ny * (overlap / 2);
                    b2.x += nx * (overlap / 2);
                    b2.y += ny * (overlap / 2);

                    // Elastic Velocity Exchange
                    const kx = b1.vx - b2.vx;
                    const ky = b1.vy - b2.vy;
                    const p = 2 * (nx * kx + ny * ky) / 2;

                    b1.vx -= p * nx;
                    b1.vy -= p * ny;
                    b2.vx += p * nx;
                    b2.vy += p * ny;
                }
            }
        }
    }

    // Trigger Skill Unlock Toast & Card Highlight
    function triggerSkillUnlock(ball) {
        if (sunkSkills.includes(ball.name)) return;
        sunkSkills.push(ball.name);

        skillsSunkCountEl.textContent = sunkSkills.length;

        // Show Toast
        if (toast && toastSkillTitle) {
            toastSkillTitle.textContent = ball.name;
            toast.classList.remove('hidden');
            toast.classList.add('pop-anim');
            setTimeout(() => toast.classList.remove('pop-anim'), 600);
        }

        // Add Tag to Unlocked Skills List
        if (unlockedSkillsList.querySelector('.empty-hint')) {
            unlockedSkillsList.innerHTML = '';
        }

        const tag = document.createElement('span');
        tag.className = 'unlocked-badge';
        tag.style.borderColor = ball.color;
        tag.innerHTML = `<i class="fa-solid fa-check" style="color:${ball.color}"></i> ${ball.name}`;
        unlockedSkillsList.appendChild(tag);

        // Highlight Corresponding Skill Card in #skills section
        const card = document.getElementById(ball.cardId);
        if (card) {
            card.classList.add('skill-highlight');
            setTimeout(() => card.classList.remove('skill-highlight'), 3000);
        }
    }

    // Draw Function
    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Draw Wooden Table Border
        ctx.fillStyle = '#291305';
        ctx.fillRect(0, 0, width, height);

        // Draw Green Felt Surface
        ctx.fillStyle = '#15803d';
        ctx.fillRect(padding, padding, width - padding * 2, height - padding * 2);

        // Draw Inner Table Cushion Border Line
        ctx.strokeStyle = '#166534';
        ctx.lineWidth = 3;
        ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);

        // Draw Baulk Line & D-Arc
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(220, padding);
        ctx.lineTo(220, height - padding);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(220, height / 2, 50, Math.PI * 0.5, Math.PI * 1.5);
        ctx.stroke();

        // Draw 6 Pockets
        pockets.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, pocketRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#090d16';
            ctx.fill();
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Draw Aiming Vector Line & Cue Stick
        if (isAiming) {
            const dx = dragStart.x - dragCurrent.x;
            const dy = dragStart.y - dragCurrent.y;
            const angle = Math.atan2(dy, dx);
            const dist = Math.min(Math.hypot(dx, dy), 120);

            // Directional Aim Line
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.beginPath();
            ctx.moveTo(cueBall.x, cueBall.y);
            ctx.lineTo(cueBall.x + Math.cos(angle) * 200, cueBall.y + Math.sin(angle) * 200);
            ctx.stroke();
            ctx.setLineDash([]);

            // Cue Stick Behind Ball
            const cueLength = 160;
            const cueStartX = cueBall.x - Math.cos(angle) * (ballRadius + 8 + dist * 0.3);
            const cueStartY = cueBall.y - Math.sin(angle) * (ballRadius + 8 + dist * 0.3);
            const cueEndX = cueStartX - Math.cos(angle) * cueLength;
            const cueEndY = cueStartY - Math.sin(angle) * cueLength;

            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(cueStartX, cueStartY);
            ctx.lineTo(cueEndX, cueEndY);
            ctx.stroke();
        }

        // Draw Skill Balls
        skillBalls.forEach(ball => {
            if (ball.sunk) return;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = ball.color;
            ctx.fill();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Ball Shine/Reflection Highlight
            ctx.beginPath();
            ctx.arc(ball.x - 3, ball.y - 3, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fill();
        });

        // Draw Cue Ball
        ctx.beginPath();
        ctx.arc(cueBall.x, cueBall.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cueBall.x - 3, cueBall.y - 3, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
    }

    // Main Game Loop
    function gameLoop() {
        updatePhysics();
        draw();
        requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
});
