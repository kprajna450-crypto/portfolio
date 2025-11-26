import * as THREE from 'three';

/* =========================================
   1. THREE.JS "NEURAL NETWORK" BACKGROUND
   ========================================= */
const initThreeJS = () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for high-res screens
    container.appendChild(renderer.domElement);

    // Particles Data
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 150; // Number of nodes
    const posArray = new Float32Array(count * 3); // x, y, z

    // Random positioning
    for (let i = 0; i < count * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material for Dots
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0xffffff, // Pure white
        transparent: true,
        opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lines Material (Connections)
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0x444444, // Dark Grey lines
        transparent: true,
        opacity: 0.15
    });

    camera.position.z = 4;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Smooth Rotation
        particlesMesh.rotation.y += 0.5 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

        // Gentle constant float
        particlesMesh.rotation.z += 0.0005;

        renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

/* =========================================
   2. GSAP ADVANCED ANIMATIONS
   ========================================= */
const initAnimations = () => {
    gsap.registerPlugin(ScrollTrigger);

    // A. Hero Reveal Sequence (Staggered and smooth)
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.from('.hero-title', { y: 100, opacity: 0, duration: 1.5, skewY: 7 })
        .from('.subtitle', { y: 20, opacity: 0, duration: 1 }, "-=1")
        .from('.hero-desc', { x: -50, opacity: 0, duration: 1 }, "-=0.8")
        .fromTo('.btn-primary', 
            { scale: 0.8, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.8 }, 
            "-=0.8"
        )
        .from('.image-wrapper', {
            scale: 0.8,
            opacity: 0,
            rotation: 5,
            duration: 1.5,
            ease: "expo.out"
        }, "-=1.2");

    // B. Skills Horizontal Marquee with Advanced Scroll Control
    // Fade in the skills section header
    gsap.from('.skills-header .section-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: '.skills-section',
            start: "top 75%"
        }
    });

    gsap.from('.skills-header .skills-desc', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: '.skills-section',
            start: "top 75%"
        }
    });

    // Fade in each marquee row with stagger
    gsap.from('.skills-marquee', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: '.skills-marquee-wrapper',
            start: "top 80%"
        }
    });

    // Advanced Scroll-based marquee direction control
    let lastScrollY = window.scrollY;
    const marquees = document.querySelectorAll('.skills-marquee');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        
        marquees.forEach(marquee => {
            // Remove previous scroll direction class
            marquee.classList.remove('scroll-down', 'scroll-up');
            
            // Add current scroll direction class
            if (scrollDirection === 'down') {
                marquee.classList.add('scroll-down');
            } else {
                marquee.classList.add('scroll-up');
            }
        });

        lastScrollY = currentScrollY;
    });

    // C. Project Image Reveals (Scale Up & "Spotlight" Brightness)
    gsap.utils.toArray('.project-item').forEach(item => {
        const img = item.querySelector('.project-img');

        // Create a timeline that scrubs as the element moves through the viewport
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: "top bottom", // When top of element hits bottom of viewport
                end: "bottom top",   // When bottom of element hits top of viewport
                scrub: 1
            }
        });

        // 0% (Bottom) -> 50% (Center) -> 100% (Top)
        tl.fromTo(img, 
            { scale: 1.2, filter: "grayscale(100%) brightness(0.5)" }, // Start state
            { 
                scale: 1, 
                filter: "grayscale(0%) brightness(1)", 
                duration: 1, 
                ease: "power2.out" 
            } // Center state
        ).to(img, 
            { 
                scale: 1.2, 
                filter: "grayscale(100%) brightness(0.5)", 
                duration: 1, 
                ease: "power2.in" 
            } // End state
        );

        // Text Fade In (Simple reveal)
        gsap.from(item.querySelector('.project-info'), {
            y: 50,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: item,
                start: "top 80%"
            }
        });
    });

    // D. Contact Email Reveal
    gsap.from('.email-link', {
        y: 100,
        skewY: 10,
        opacity: 0,
        duration: 1.5,
        scrollTrigger: {
            trigger: '.contact-section',
            start: "top 70%"
        }
    });
};

/* =========================================
   3. OFF-CANVAS MENU LOGIC (Timeline)
   ========================================= */
const initMenu = () => {
    const menuBtn = document.querySelector('.menu-btn');
    const closeBtn = document.querySelector('.menu-close');
    const menu = document.querySelector('.off-canvas-menu');
    const links = document.querySelectorAll('.menu-link');

    // Create a paused timeline for the menu
    const menuTl = gsap.timeline({ paused: true });

    menuTl.to(menu, {
        y: '0%',
        duration: 0.8,
        ease: 'expo.inOut'
    });

    // Stagger links entry
    menuTl.fromTo(links, 
        { y: 100, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power4.out'
        }, 
        "-=0.4"
    );

    // Footer fade in
    menuTl.fromTo('.menu-footer', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.5 }, 
        "-=0.5"
    );

    // Open
    menuBtn.addEventListener('click', () => menuTl.play());

    // Close
    const closeMenu = () => menuTl.reverse();
    closeBtn.addEventListener('click', closeMenu);
    links.forEach(link => link.addEventListener('click', closeMenu));
};

/* =========================================
   4. CUSTOM MOUSE FOLLOWER (Optional Polishing)
   ========================================= */
// Note: If you want a truly minimal cursor, you can skip this. 
// But adding a slight delay to the native cursor or a custom dot adds "feel".
const initCursor = () => {
    // This is a simple logic to track mouse velocity for skew effects if needed
    let speed = 0;
    window.addEventListener('mousemove', (e) => {
        speed = Math.abs(e.movementX + e.movementY);
    });
};


// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initAnimations();
    initMenu();
    initCursor();
});