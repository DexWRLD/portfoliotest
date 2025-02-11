class LoadingAnimation {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.clock = new THREE.Clock();
        this.particles = [];
        this.rings = [];
        this.progress = 0;
        
        this.init();
        this.addProgressBar();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        
        // Create multiple loading rings
        for (let i = 0; i < 3; i++) {
            const radius = 2 + i * 0.5;
            const segments = 32;
            const ringGeometry = new THREE.RingGeometry(radius, radius + 0.1, segments);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xff6b35,
                wireframe: true,
                transparent: true,
                opacity: 0.5 - i * 0.1
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            this.scene.add(ring);
            this.rings.push(ring);
        }

        // Create central hexagon
        const hexGeometry = new THREE.CircleGeometry(1.5, 6);
        const hexMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6b35,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        this.hexagon = new THREE.Mesh(hexGeometry, hexMaterial);
        this.scene.add(this.hexagon);

        // Create particles in a spiral pattern
        const spiralCount = 200;
        const spiralGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(spiralCount * 3);

        for (let i = 0; i < spiralCount; i++) {
            const t = i / spiralCount;
            const angle = t * Math.PI * 10;
            const radius = t * 5;
            
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = Math.sin(angle) * radius;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
        }

        spiralGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const spiralMaterial = new THREE.PointsMaterial({
            color: 0xa7b6c2,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });

        this.spiral = new THREE.Points(spiralGeometry, spiralMaterial);
        this.scene.add(this.spiral);

        // Create floating data particles
        const particleCount = 100;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 3 + Math.random() * 2;
            
            particlePositions[i * 3] = Math.cos(angle) * radius;
            particlePositions[i * 3 + 1] = Math.sin(angle) * radius;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xff6b35,
            size: 0.15,
            transparent: true,
            opacity: 0.6
        });

        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);

        // Position camera
        this.camera.position.z = 10;

        // Start animation
        this.animate();

        // Start loading simulation
        this.simulateLoading();
    }

    animate = () => {
        if (this.container.style.opacity !== '0') {
            requestAnimationFrame(this.animate);
            
            const time = this.clock.getElapsedTime();
            
            // Rotate rings in alternating directions
            this.rings.forEach((ring, index) => {
                ring.rotation.z = time * (index % 2 ? -1 : 1);
                // Pulse effect on rings
                const scale = 1 + Math.sin(time * 2 + index) * 0.1;
                ring.scale.set(scale, scale, 1);
            });
            
            // Rotate hexagon
            this.hexagon.rotation.z = -time * 0.5;
            
            // Pulse effect on hexagon
            const hexScale = 1 + Math.sin(time * 3) * 0.2;
            this.hexagon.scale.set(hexScale, hexScale, 1);
            
            // Rotate spiral
            this.spiral.rotation.z = time * 0.3;
            
            // Animate particles
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                const angle = time + i;
                const distance = 3 + Math.sin(time * 2 + i) * 0.5;
                positions[i] = Math.cos(angle * 0.5) * distance;
                positions[i + 1] = Math.sin(angle * 0.5) * distance;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;

            // Camera movement
            this.camera.position.x = Math.sin(time * 0.5) * 0.5;
            this.camera.position.y = Math.cos(time * 0.5) * 0.5;

            this.renderer.render(this.scene, this.camera);
        }
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    addProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'loading-progress';
        progressContainer.innerHTML = `
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill">
                        <div class="progress-glitch"></div>
                    </div>
                </div>
                <div class="progress-text">0%</div>
                <div class="progress-status"></div>
            </div>
        `;
        this.container.appendChild(progressContainer);
    }

    updateProgress(value) {
        this.progress = value;
        const progressFill = this.container.querySelector('.progress-fill');
        const progressText = this.container.querySelector('.progress-text');
        const progressStatus = this.container.querySelector('.progress-status');
        
        progressFill.style.width = `${value}%`;
        progressText.textContent = `${Math.round(value)}%`;
        
        // Update loading status messages
        if (value < 25) {
            progressStatus.textContent = 'INITIALIZING SYSTEMS...';
        } else if (value < 50) {
            progressStatus.textContent = 'LOADING SECURITY PROTOCOLS...';
        } else if (value < 75) {
            progressStatus.textContent = 'ESTABLISHING SECURE CONNECTION...';
        } else if (value < 100) {
            progressStatus.textContent = 'FINALIZING SETUP...';
        } else {
            progressStatus.textContent = 'ACCESS GRANTED';
            progressStatus.style.color = 'var(--neon-orange)';
            
            // Add glitch effect when complete
            progressFill.style.animation = 'progressGlitch 0.3s linear 3';
            setTimeout(() => {
                this.container.style.opacity = '0';
                setTimeout(() => {
                    this.container.style.display = 'none';
                }, 1000);
            }, 500);
        }
    }

    // Add this method to simulate loading
    simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 3;
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
            }
            this.updateProgress(progress);
        }, 100);
    }
} 