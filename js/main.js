/* ==========================================================================
   Hritam Shrivastava Portfolio - Main Interactive Logic (Matte White Theme)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Typewriter Effect for Hero Headline
    const phrases = [
        "AI & Machine Learning Systems",
        "VLSI & Embedded Systems",
        "Computer Vision & Data Science",
        "Biomedical Hardware Innovations"
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typewriterEl = document.getElementById('typewriter');

    function typeEffect() {
        if (!typewriterEl) return;

        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            typewriterEl.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typewriterEl.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIdx === currentPhrase.length) {
            speed = 2200; // Pause at full phrase
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            speed = 400;
        }

        setTimeout(typeEffect, speed);
    }
    typeEffect();

    // 2. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close menu on nav item click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                if (mobileToggle.querySelector('i')) {
                    mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
                }
            });
        });
    }

    // 3. Scroll Active Link Highlight
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

/* ==========================================================================
   Certificate Modal Handler & Data
   ========================================================================== */

const certificateData = {
    iitbhilai: {
        title: "Research Internship Certificate",
        issuer: "Indian Institute of Technology (IIT), Bhilai",
        date: "12/05/2026 to 30/06/2026",
        id: "Dept of ECE, IIT Bhilai • Mentor: Dr. Nitanshu Chauhan",
        issueDate: "June 2026",
        project: "Designing of FeRAM Array for MAC Operation",
        details: "Successfully completed a research internship in the Department of Electronics & Communication Engineering at IIT Bhilai. Designed and simulated FeRAM arrays with GAA transistors for in-memory computing MAC operations under Dr. Nitanshu Chauhan.",
        skills: ["FeRAM", "GAA Transistors", "MAC Operations", "HSPICE", "Verilog", "VLSI Research"]
    },
    sailbhilai: {
        title: "Industrial Project Internship Certificate",
        issuer: "Bhilai Steel Plant (SAIL) - Human Resources Development",
        date: "12/05/2025 to 07/06/2025",
        id: "Regn. No: P-25/5176 • Grade: Excellent",
        issueDate: "07/06/2025",
        project: "Patrolling Car Using Arduino",
        details: "Underwent project-based training at Bhilai Steel Plant (SAIL). Developed an Arduino-powered patrolling vehicle for localized safety monitoring in gas-prone industrial zones with an 'Excellent' performance evaluation.",
        skills: ["Arduino", "Embedded Microcontrollers", "Safety Monitoring", "Industrial Automation"]
    },
    maven: {
        title: "Embedded System Design Internship Certificate",
        issuer: "Maven Silicon (ACEIC Centre of Excellence)",
        date: "16-05-2025 to 04-07-2025",
        id: "MSUID: MS/B2BESDI/2025-26-189",
        issueDate: "13 Jul 2025",
        project: "Specialized Microcontroller & Firmware Design",
        details: "Successfully completed an intensive internship program in Embedded System Design covering ARM Cortex-M architecture, microcontroller peripherals, and C/C++ firmware design.",
        skills: ["Embedded C", "Hardware Design", "Sensors", "Microcontrollers", "System Architecture"]
    },
    emc: {
        title: "Electromagnetic Interference and Compatibility (EMI/EMC)",
        issuer: "School of Electronics Engineering (SENSE), VIT Vellore",
        date: "11th January 2026 – 08th March 2026",
        id: "Value-added Course Code: VAC2338",
        issueDate: "March 2026",
        project: "Basics and Standards of EMI/EMC",
        details: "Completed offline university value-added course covering electromagnetic shielding, compliance standards, high-frequency circuit noise reduction, and signal integrity for hardware design.",
        skills: ["EMI/EMC Standards", "Signal Integrity", "Hardware Noise Reduction", "PCB Shielding"]
    },
    hackathon: {
        title: "Certificate of Appreciation – Sensor & Biomedical Hackathon",
        issuer: "Industry-Academia Conclave (IAC) 2025, VIT Vellore",
        date: "2nd & 3rd September 2025",
        id: "SENSE School Official Recognition",
        issueDate: "September 2025",
        project: "Theme: Electronics Renaissance & Global Sustainability",
        details: "Recognized for active participation and project demonstration in biomedical sensor systems during the Industry-Academia Conclave 2025 under the theme 'Electronics Renaissance'.",
        skills: ["Biomedical Sensors", "Hackathon Innovation", "Prototype Demonstration"]
    },
    techonet: {
        title: "Python Programming Course Certificate",
        issuer: "Techonet Private Limited, Bhilai",
        date: "May 2023 – July 2023 (Ref Date: 10/08/2023)",
        id: "Ref. No: TECHONET/RT/DC/2023/08/21",
        issueDate: "10 Aug 2023",
        project: "Two-Month Intensive Python & Logic Building",
        details: "Completed a comprehensive 2-month training program in Python programming, covering object-oriented programming, data structures, file handling, and algorithmic problem solving.",
        skills: ["Python", "OOP", "Algorithm Design", "File I/O"]
    },
    sql: {
        title: "SQL Essential Training Certificate",
        issuer: "LinkedIn Learning",
        date: "Completed Jan 23, 2024",
        id: "Cert ID: 8b739b269a300bded3c0d463e50b9fcbefcec95f5fe923ae40a0652ab23cd0f6",
        issueDate: "Jan 23, 2024",
        project: "Relational Database Management & Queries",
        details: "Completed 4h 36m course covering SQL database querying, relational schemas, aggregation, joins, subqueries, and MySQL operations.",
        skills: ["SQL", "MySQL", "Relational Databases", "Data Querying"]
    },
    pm: {
        title: "Project Management Fundamentals",
        issuer: "LinkedIn Learning",
        date: "Completed Course",
        id: "LinkedIn Credential Verification",
        issueDate: "Verified",
        project: "Agile & Technical Project Execution",
        details: "Covered project lifecycle management, task scheduling, resource allocation, and cross-functional team communication in engineering projects.",
        skills: ["Project Management", "Agile", "Team Communication", "Workflow Optimization"]
    }
};

function openCertModal(certKey) {
    const data = certificateData[certKey];
    if (!data) return;

    document.getElementById('modalTitle').innerText = data.title;
    document.getElementById('modalIssuer').innerText = `${data.issuer} • ${data.date}`;
    
    const bodyEl = document.getElementById('modalBody');
    bodyEl.innerHTML = `
        <div style="background: var(--bg-secondary); padding: 14px; border-radius: 8px; margin-bottom: 14px; border: 1px solid var(--border-color);">
            <p style="margin-bottom: 6px;"><strong>Focus / Project:</strong> ${data.project}</p>
            <p style="margin-bottom: 6px; font-family: 'Fira Code', monospace; font-size: 0.8rem; color: var(--accent-blue);">${data.id}</p>
            <p style="font-size: 0.8rem; color: var(--text-muted);"><i class="fa-regular fa-calendar"></i> Issue Date: ${data.issueDate}</p>
        </div>
        <p style="margin-bottom: 14px;">${data.details}</p>
        <div>
            <strong style="display:block; margin-bottom: 6px; font-size: 0.85rem; font-family: 'Space Mono', monospace;">Key Competencies:</strong>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${data.skills.map(s => `<span style="background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); padding: 3px 10px; border-radius: 4px; font-size: 0.75rem; font-family: 'Fira Code', monospace;">${s}</span>`).join('')}
            </div>
        </div>
    `;

    const modal = document.getElementById('certModal');
    modal.classList.add('active');
}

function closeCertModal(e) {
    if (e.target.id === 'certModal') {
        closeCertModalForce();
    }
}

function closeCertModalForce() {
    const modal = document.getElementById('certModal');
    modal.classList.remove('active');
}
