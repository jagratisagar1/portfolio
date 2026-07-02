document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Preloader
    // ==========================================================================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 500);
    });

    // Fallback if load event doesn't trigger quickly
    setTimeout(() => {
        if (!preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
        }
    }, 2500);

    // ==========================================================================
    // Custom Cursor
    // ==========================================================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const hoverTargets = document.querySelectorAll('.hover-target, a, button, input, textarea, .filter-btn');

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant position for the dot
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth movement for the outline circle using interpolation
    function animateCursor() {
        const speed = 0.15; // Interpolation factor
        outlineX += (mouseX - outlineX) * speed;
        outlineY += (mouseY - outlineY) * speed;

        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover scale effects
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('grow');
            cursorDot.classList.add('dot-hide');
        });
        target.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('grow');
            cursorDot.classList.remove('dot-hide');
        });
    });

    // ==========================================================================
    // Interactive Particle Background (Canvas)
    // ==========================================================================
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 65;
    let connectionDistance = 110;
    let mouse = { x: null, y: null, radius: 150 };

    // Handle canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Adjust configuration based on viewport width
        if (window.innerWidth < 768) {
            connectionDistance = 80;
        } else {
            connectionDistance = 110;
        }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse position over canvas
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle constructor
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            // Keep particles inside canvas borders
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            this.x += this.vx;
            this.y += this.vy;

            // Interactive mouse repulsion
            if (mouse.x !== null && mouse.y !== null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    // Move particle slightly away
                    this.x += (dx / dist) * force * 1.5;
                    this.y += (dy / dist) * force * 1.5;
                }
            }
        }

        draw() {
            // Fetch current accent color for drawing
            const currentTheme = document.documentElement.getAttribute('data-theme');
            ctx.fillStyle = currentTheme === 'dark' ? 'rgba(0, 240, 255, 0.45)' : 'rgba(0, 168, 204, 0.45)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles array
    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    // Redraw particles connections
    function drawLines() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const lineColor = currentTheme === 'dark' ? 'rgba(0, 240, 255, ' : 'rgba(0, 168, 204, ';

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    // Alpha is stronger when particles are closer
                    let alpha = (1 - (dist / connectionDistance)) * 0.18;
                    ctx.strokeStyle = lineColor + alpha + ')';
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Canvas animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        drawLines();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Re-initialize particles on significant size change to prevent sparse layout
    window.addEventListener('resize', () => {
        initParticles();
    });


    // ==========================================================================
    // Navigation Scroll Styling & Mobile Menu
    // ==========================================================================
    const header = document.querySelector('.header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky navigation background reveal on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Hamburger Mobile drawer trigger
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scrolling when menu is active
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close menu when navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Style helper for Mobile Drawer Menu layout compatibility
    const styleElem = document.createElement('style');
    styleElem.innerHTML = `
        @media (max-width: 768px) {
            .nav {
                position: fixed;
                top: var(--header-height);
                left: 100%;
                width: 100%;
                height: calc(100vh - var(--header-height));
                background-color: var(--bg-primary);
                transition: var(--transition-normal);
                z-index: 99;
                display: flex;
                flex-direction: column;
                padding: 40px;
                border-top: 1px solid var(--glass-border);
            }
            .nav.active {
                left: 0;
            }
            .nav-list {
                flex-direction: column;
                align-items: center;
                gap: 40px;
                margin-top: 50px;
            }
            .nav-link {
                font-size: 1.5rem;
            }
            .mobile-toggle {
                display: flex;
            }
        }
    `;
    document.head.appendChild(styleElem);


    // ==========================================================================
    // Active Section Menu Link Highlight
    // ==========================================================================
    const sections = document.querySelectorAll('section');

    function highlightNavSection() {
        let scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120; // offset header height
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.remove('active');
            }
        });
    }
    window.addEventListener('scroll', highlightNavSection);


    // ==========================================================================
    // Scroll Reveal (Fade-in Elements)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is in full view
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });


    // ==========================================================================
    // Dark & Light Mode Toggle
    // ==========================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Retrieve previous selection, if any
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        let currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }


    // ==========================================================================
    // Projects Filtering
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active style from other buttons, append to target
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Hide with transition, then display:none
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('fade-out');
                    // CSS transition hook
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    // Delay display:none to allow transform animation to play
                    setTimeout(() => {
                        card.classList.add('fade-out');
                    }, 350);
                }
            });
        });
    });


    // ==========================================================================
    // Contact Form Submission & Success Modal
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formSuccessModal = document.getElementById('form-success');
    const successDismissBtn = document.getElementById('btn-success-close');
    const submitBtn = contactForm.querySelector('.btn-submit');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        const submitOrigHTML = submitBtn.innerHTML;
        // Display animated loading state
        submitBtn.innerHTML = 'Sending Message <i class="fa-solid fa-circle-notch fa-spin"></i>';
        submitBtn.setAttribute('disabled', 'true');

        // Route to FormSubmit AJAX API to test email delivery
        const submitUrl = 'https://formsubmit.co/ajax/jagrati892@gmail.com';

        fetch(submitUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                _subject: "Portfolio Contact: " + subject,
                message: message
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success === 'false' || data.success === false) {
                throw new Error(data.message || 'FormSubmit submission failed');
            }
            // Set success UI
            document.querySelector('#form-success .success-icon').innerHTML = '<i class="fa-solid fa-circle-check"></i>';
            document.querySelector('#form-success h3').innerText = 'Message Sent Successfully!';
            document.querySelector('#form-success p').innerText = "Thank you for reaching out. I'll get back to you shortly.";

            // Reset button and show popup
            submitBtn.innerHTML = submitOrigHTML;
            submitBtn.removeAttribute('disabled');
            formSuccessModal.classList.add('active');
            contactForm.reset();
        })
        .catch(error => {
            console.error('Error sending message:', error);
            
            // Generate fallback mailto URL
            const mailtoUrl = `mailto:jagrati892@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;

            // Set error UI with direct click handler to prevent browser blockage
            document.querySelector('#form-success .success-icon').innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color: var(--accent-pink);"></i>';
            document.querySelector('#form-success h3').innerText = 'Message Delivery Failed';
            document.querySelector('#form-success p').innerHTML = `We couldn't send the message. ${error.message || ''}<br><a href="${mailtoUrl}" class="hover-target text-cyan" style="text-decoration: underline; font-weight: 600;">Click here to send via email client</a>.`;

            submitBtn.innerHTML = submitOrigHTML;
            submitBtn.removeAttribute('disabled');
            formSuccessModal.classList.add('active');
        });
    });

    successDismissBtn.addEventListener('click', () => {
        formSuccessModal.classList.remove('active');
    });
});
