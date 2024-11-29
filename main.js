let scene, camera, renderer;
let clock = new THREE.Clock();
let dataStreams = [];
let scrollProgress = 0;
let mainModel;
let hologramShader;
let scanlineEffect;
let binaryParticles = [];
let firewallGrid;
let threatNodes = [];

function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.0015);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('webgl-container').appendChild(renderer.domElement);

    // Add ambient and directional lights
    const ambientLight = new THREE.AmbientLight(0xff6b35, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xff6b35, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Add point lights for dramatic effect
    const pointLight1 = new THREE.PointLight(0xff6b35, 1, 100);
    pointLight1.position.set(0, 20, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff6b35, 1, 100);
    pointLight2.position.set(20, 0, 20);
    scene.add(pointLight2);

    // Create firewall grid
    createFirewallGrid();

    // Create binary rain particles
    createBinaryParticles();

    // Create threat nodes
    createThreatNodes();

    // Load main cybersecurity model
    loadMainModel();

    // Add scroll listener
    window.addEventListener('scroll', () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = window.scrollY / maxScroll;
    });

    // Set initial camera position
    camera.position.set(0, 10, 50);

    window.addEventListener('resize', onWindowResize, false);
}

function createFirewallGrid() {
    const geometry = new THREE.PlaneGeometry(200, 200, 20, 20);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff6b35,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    firewallGrid = new THREE.Mesh(geometry, material);
    firewallGrid.rotation.x = -Math.PI / 2;
    firewallGrid.position.y = -30;
    scene.add(firewallGrid);
}

function createBinaryParticles() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for(let i = 0; i < particleCount; i++) {
        positions[i * 3] = Math.random() * 200 - 100;
        positions[i * 3 + 1] = Math.random() * 200 - 100;
        positions[i * 3 + 2] = Math.random() * 200 - 100;
        speeds[i] = 0.1 + Math.random() * 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
        color: 0xff6b35,
        size: 0.5,
        transparent: true,
        opacity: 0.6
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    binaryParticles.push({ mesh: particles, speeds: speeds });
}

function createThreatNodes() {
    const nodeCount = 10;
    for(let i = 0; i < nodeCount; i++) {
        const geometry = new THREE.SphereGeometry(1, 8, 8);
        const material = new THREE.MeshPhongMaterial({
            color: 0xff6b35,
            wireframe: true,
            transparent: true,
            opacity: 0.7
        });
        const node = new THREE.Mesh(geometry, material);
        
        node.position.set(
            Math.random() * 100 - 50,
            Math.random() * 100 - 50,
            Math.random() * 100 - 50
        );
        
        node.userData = {
            speed: 0.01 + Math.random() * 0.02,
            offset: Math.random() * Math.PI * 2
        };
        
        scene.add(node);
        threatNodes.push(node);
    }
}

function loadMainModel() {
    const loader = new THREE.GLTFLoader();
    loader.load(
        'models/cyber_skull.glb',
        function (gltf) {
            mainModel = gltf.scene;
            
            mainModel.traverse((node) => {
                if (node.isMesh) {
                    node.material.emissive = new THREE.Color(0xff6b35);
                    node.material.emissiveIntensity = 0.5;
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            
            mainModel.scale.set(10, 10, 10);
            mainModel.position.set(0, -40, 0);
            scene.add(mainModel);
        },
        undefined,
        function (error) {
            console.error('An error happened:', error);
        }
    );
}

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Animate camera
    const cameraRadius = 50 - scrollProgress * 20;
    const cameraAngle = time * 0.1 + scrollProgress * Math.PI;
    camera.position.x = Math.sin(cameraAngle) * cameraRadius;
    camera.position.z = Math.cos(cameraAngle) * cameraRadius;
    camera.position.y = 20 + Math.sin(time * 0.5) * 5;
    camera.lookAt(0, 0, 0);

    // Animate firewall grid
    if (firewallGrid) {
        firewallGrid.material.opacity = 0.3 + Math.sin(time) * 0.1;
        firewallGrid.position.y = -30 + Math.sin(time * 0.5) * 2;
    }

    // Animate binary particles
    binaryParticles.forEach(particleSystem => {
        const positions = particleSystem.mesh.geometry.attributes.position.array;
        for(let i = 0; i < positions.length; i += 3) {
            positions[i + 1] -= particleSystem.speeds[i/3];
            if (positions[i + 1] < -100) {
                positions[i + 1] = 100;
            }
        }
        particleSystem.mesh.geometry.attributes.position.needsUpdate = true;
    });

    // Animate threat nodes
    threatNodes.forEach(node => {
        node.rotation.x += node.userData.speed;
        node.rotation.y += node.userData.speed * 0.5;
        
        const radius = 20 + Math.sin(time + node.userData.offset) * 5;
        const angle = time * node.userData.speed + node.userData.offset;
        
        node.position.x = Math.sin(angle) * radius;
        node.position.z = Math.cos(angle) * radius;
        node.position.y = Math.sin(time + node.userData.offset) * 10;
        
        node.material.opacity = 0.4 + Math.sin(time + node.userData.offset) * 0.3;
    });

    // Animate main model
    if (mainModel) {
        mainModel.rotation.y = time * 0.1;
        mainModel.position.y = -40 + Math.sin(time * 0.5) * 2;
        
        mainModel.traverse((node) => {
            if (node.isMesh) {
                node.material.emissiveIntensity = 0.5 + Math.sin(time) * 0.2;
            }
        });
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate(); 