document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. MOBILE MENU NAVIGATION
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksWrapper = document.querySelector('.nav-links-wrapper');
    const navLinksList = document.querySelectorAll('.nav-link');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            mobileToggle.classList.toggle('active');
            navLinksWrapper.classList.toggle('active');
        });
    }

    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinksWrapper.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        });
    });

    /* ==========================================================================
       2. TYPING EFFECT (HERO SECTION)
       ========================================================================== */
    const typingTextElement = document.getElementById('typing-text');
    const words = ["B.Tech ECE Student", "Embedded Systems Enthusiast", "Future Engineer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // faster delete speed
        } else {
            typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // normal typing speed
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // pause before next word
        }

        setTimeout(type, typeSpeed);
    }

    if (typingTextElement) {
        setTimeout(type, 1000);
    }

    /* ==========================================================================
       3. INTERACTIVE PARTICLE BACKGROUND (CANVAS)
       ========================================================================== */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const maxParticles = window.innerWidth < 768 ? 40 : 80;
    const connectionDistance = 120;
    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', () => {
        resizeCanvas();
        particles = [];
        initParticles();
    });
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.speedY = Math.random() * 0.6 - 0.3;
            this.baseX = this.x;
            this.baseY = this.y;
        }

        update() {
            // Move particle
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off boundaries
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Mouse interaction (subtle magnetic pull)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= dx * force * 0.03;
                    this.y -= dy * force * 0.03;
                }
            }
        }

        draw() {
            ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Render network grid layout behind
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    let opacity = (1 - (distance / connectionDistance)) * 0.15;
                    ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    /* ==========================================================================
       4. SCROLL REVEAL & SKILLS PROGRESS ANIMATIONS
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const skillsSection = document.getElementById('skills');
    const progressFills = document.querySelectorAll('.progress-bar-fill');
    let skillsAnimated = false;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => revealObserver.observe(element));

    // Special observer to animate progress bars once skills enter the viewport
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsAnimated) {
                progressFills.forEach(fill => {
                    const percentage = fill.getAttribute('data-progress');
                    fill.style.width = percentage;
                });
                skillsAnimated = true;
            }
        });
    }, { threshold: 0.2 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    /* ==========================================================================
       5. FEATURED PROJECT: AUTOMATIC RAILWAY GATE SYSTEM SIMULATOR
       ========================================================================== */
    const gateArm = document.getElementById('gate-arm-1');
    const gateArmStripes = document.getElementById('gate-arm-1-stripes');
    const redLed = document.getElementById('red-led');
    const ledGlow = document.getElementById('led-glow');
    const lcdText = document.getElementById('lcd-status-text');

    let simState = 'OPEN'; // States: OPEN, TRAIN_INCOMING, CLOSED, TRAIN_PASSING

    function setSimulatorState(state) {
        simState = state;

        switch (state) {
            case 'OPEN':
                // Rotate gate arm back to vertical position (open)
                gateArm.setAttribute('transform', 'rotate(-70, 120, 140)');
                gateArmStripes.setAttribute('transform', 'rotate(-70, 120, 140)');
                redLed.setAttribute('fill', '#10b981'); // Green LED
                ledGlow.setAttribute('opacity', '0'); // No glow
                lcdText.textContent = '> GATE OPEN';
                lcdText.setAttribute('fill', '#34d399');
                break;

            case 'TRAIN_INCOMING':
                // Red led begins flashing, alarm LCD warning
                lcdText.textContent = '>> WARNING!!';
                lcdText.setAttribute('fill', '#f87171');
                
                // LED flashing interval
                let flashCount = 0;
                const flasher = setInterval(() => {
                    if (simState !== 'TRAIN_INCOMING') {
                        clearInterval(flasher);
                        return;
                    }
                    const isOn = flashCount % 2 === 0;
                    redLed.setAttribute('fill', isOn ? '#ef4444' : '#1e293b');
                    ledGlow.setAttribute('opacity', isOn ? '0.6' : '0');
                    flashCount++;
                }, 300);
                break;

            case 'CLOSED':
                // Gate rotates to horizontal position (closed)
                gateArm.setAttribute('transform', 'rotate(0, 120, 140)');
                gateArmStripes.setAttribute('transform', 'rotate(0, 120, 140)');
                redLed.setAttribute('fill', '#ef4444'); // Solid red
                ledGlow.setAttribute('opacity', '0.8');
                lcdText.textContent = '>> GATE CLOSED';
                lcdText.setAttribute('fill', '#f87171');
                break;

            case 'TRAIN_PASSING':
                lcdText.textContent = '>> TRAIN PASS';
                lcdText.setAttribute('fill', '#fbbf24');
                break;
        }
    }

    // Initialize Simulator State
    if (gateArm) {
        setSimulatorState('OPEN');

        // Continuous Loop simulation
        setInterval(() => {
            setTimeout(() => setSimulatorState('TRAIN_INCOMING'), 0);
            setTimeout(() => setSimulatorState('CLOSED'), 2000);
            setTimeout(() => setSimulatorState('TRAIN_PASSING'), 4500);
            setTimeout(() => setSimulatorState('OPEN'), 7500);
        }, 10000);
    }

    /* ==========================================================================
       6. INTERACTIVE RESUME ACTIONS & WEB PRINT
       ========================================================================== */
    const btnPrintResume = document.getElementById('btn-print-resume');
    const btnDownloadResume = document.getElementById('btn-download-resume');
    const resumePanel = document.getElementById('resume-interactive-panel');
    const btnCloseResume = document.getElementById('btn-close-resume');
    const toast = document.getElementById('alert-toast');
    const toastMessage = document.getElementById('toast-message');

    function showToast(message, type = 'success') {
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3500);
    }

    if (btnPrintResume) {
        btnPrintResume.addEventListener('click', () => {
            resumePanel.classList.toggle('hidden');
            if (!resumePanel.classList.contains('hidden')) {
                resumePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                showToast("Interactive Resume Preview Opened!");
            }
        });
    }

    if (btnCloseResume) {
        btnCloseResume.addEventListener('click', () => {
            resumePanel.classList.add('hidden');
            document.getElementById('resume').scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (btnDownloadResume) {
        btnDownloadResume.addEventListener('click', () => {
            showToast("Opening Print Interface to Save Resume as PDF!");
            setTimeout(() => {
                window.print();
            }, 1000);
        });
    }

    /* ==========================================================================
       7. CONTACT FORM SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const nameVal = document.getElementById('name').value;
            
            // Trigger glowing success toast
            showToast(`Thank you, ${nameVal}! Message sent successfully.`);
            
            // Reset fields
            contactForm.reset();
        });
    }
});
