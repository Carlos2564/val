document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos del DOM
    const startBtn = document.getElementById('start-btn');
    const overlay = document.getElementById('intro-overlay');
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const heartWrapper = document.getElementById('heart-trigger');
    
    // Variable estado música
    let isMusicPlaying = false;

    // --- 1. INICIAR EXPERIENCIA ---
    startBtn.addEventListener('click', () => {
        // Desvanecer overlay
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 1000);

        // QUITAR PAUSA DE ANIMACIONES CSS
        document.body.classList.remove('container-paused');

        // INTENTAR REPRODUCIR MÚSICA
        if (music) {
            music.volume = 1.0;
            music.play().then(() => {
                isMusicPlaying = true;
            }).catch(e => console.log("Error autoplay:", e));
        }

        // Iniciar scripts visuales
        initButterflies();
        initTypedText();
        initFireflies(); // Luciérnagas de fondo

        // Animación de entrada de la tarjeta
        gsap.from(".glass-panel", {
            duration: 2,
            y: 100,
            opacity: 0,
            ease: "power4.out"
        });
    });

    // --- 2. BOTÓN DE MÚSICA ---
    musicBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            music.pause();
            isMusicPlaying = false;
            musicBtn.textContent = "🔇";
        } else {
            music.play();
            isMusicPlaying = true;
            musicBtn.textContent = "🎵";
        }
    });

    // --- 3. EFECTO EXPLOSIÓN DE CORAZÓN ---
    heartWrapper.addEventListener('click', function() {
        // Animación de latido fuerte con GSAP
        gsap.fromTo(this, 
            { scale: 0.8 }, 
            { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" }
        );

        // Confetti
        var end = Date.now() + (15 * 100);
        
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff0a54', '#ff477e', '#ffffff'],
            shapes: ['heart']
        });

        // Ráfagas laterales
        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff0a54', '#ffffff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff0a54', '#ffffff']
            });
    
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    });

    // --- 4. VANILLA TILT (Efecto 3D Tarjeta) ---
    VanillaTilt.init(document.querySelector("#tilt-card"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        gyroscope: true,
    });

    // --- 5. TYPED.JS (Texto escribiéndose) ---
    function initTypedText() {
        new Typed('#typed-text', {
            strings: [
                "Haces que cada día sea especial...",
                "Eres mi paz y mi lugar seguro.",
                "Me encanta compartir la vida contigo.",
                "Gracias por tanto amor. ❤️"
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }

    // --- 6. MARIPOSAS FLOTANTES (GSAP) ---
    function initButterflies() {
        const garden = document.getElementById('butterfly-garden');
        const numButterflies = 10; // Cantidad de mariposas

        for (let i = 0; i < numButterflies; i++) {
            const b = document.createElement('img');
            b.src = 'mariposa.png'; // Archivo local
            b.classList.add('butterfly');
            garden.appendChild(b);

            // Posición aleatoria inicial
            gsap.set(b, {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0
            });

            // Animación de entrada
            gsap.to(b, { scale: Math.random() * 0.5 + 0.3, duration: 1 });

            // Movimiento continuo
            animateButterfly(b);
        }
    }

    function animateButterfly(element) {
        const newX = Math.random() * window.innerWidth;
        const newY = Math.random() * window.innerHeight;
        const duration = Math.random() * 10 + 10; // Entre 10 y 20 segundos

        // Calcular rotación según dirección
        const currentX = gsap.getProperty(element, "x");
        const rotation = newX > currentX ? 15 : -15;

        gsap.to(element, {
            x: newX,
            y: newY,
            rotation: rotation,
            duration: duration,
            ease: "sine.inOut",
            onComplete: () => animateButterfly(element)
        });
    }

    // --- 7. FONDO DE LUCIÉRNAGAS (CANVAS) ---
    function initFireflies() {
        const canvas = document.getElementById('starfield');
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random();
                this.fade = Math.random() * 0.02 + 0.005;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += this.fade;
                if (this.opacity > 1 || this.opacity < 0) this.fade = -this.fade;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
            }
            draw() {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 100; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    }
});