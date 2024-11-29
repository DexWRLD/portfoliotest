class Terminal {
    constructor(element) {
        this.element = element;
        this.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";
        this.queue = [];
    }

    type(text, delay = 50) {
        return new Promise((resolve) => {
            let index = 0;
            const interval = setInterval(() => {
                if (index < text.length) {
                    this.element.innerHTML += text.charAt(index);
                    index++;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, delay);
        });
    }

    async scramble(text, duration = 1000) {
        const finalText = text;
        const steps = 10;
        const stepDuration = duration / steps;

        for (let i = 0; i < steps; i++) {
            let scrambled = '';
            for (let j = 0; j < finalText.length; j++) {
                if (i === steps - 1) {
                    scrambled += finalText[j];
                } else if (Math.random() < (i / steps)) {
                    scrambled += finalText[j];
                } else {
                    scrambled += this.chars[Math.floor(Math.random() * this.chars.length)];
                }
            }
            this.element.textContent = scrambled;
            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }
}

// Update the initializeAudio function
function initializeAudio() {
    const bgMusic = document.getElementById('bgMusic');
    const toggleButton = document.getElementById('toggleMusic');
    const volumeIcon = toggleButton.querySelector('i');
    
    // Start with lower volume and load the audio
    bgMusic.volume = 0.3;
    bgMusic.load(); // Ensure audio is loaded
    volumeIcon.className = 'fas fa-volume-up';
    
    // Force play with user interaction simulation
    document.body.addEventListener('click', function playAudio() {
        bgMusic.play()
            .then(() => {
                console.log("Audio started successfully");
                document.body.removeEventListener('click', playAudio);
            })
            .catch(error => console.log("Audio play failed:", error));
    }, { once: true });
    
    // Immediate play attempt
    setTimeout(() => {
        bgMusic.play()
            .then(() => console.log("Audio autoplay successful"))
            .catch(error => {
                console.log("Waiting for user interaction to play audio");
            });
    }, 2000);
    
    // Toggle music button
    toggleButton.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            volumeIcon.className = 'fas fa-volume-up';
        } else {
            bgMusic.pause();
            volumeIcon.className = 'fas fa-volume-mute';
        }
    });
}

// Add at the top of the file, after the Terminal class
let loadingAnimation;

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', async () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingTerminal = new Terminal(document.querySelector('.terminal-text'));
    const typingElements = document.querySelectorAll('.typing-text');
    
    // Initialize loading animation
    loadingAnimation = new LoadingAnimation(loadingScreen);
    
    // Handle window resize
    window.addEventListener('resize', () => loadingAnimation.resize(), false);
    
    // Loading sequence
    await loadingTerminal.type('> INITIALIZING SYSTEMS...\n');
    await loadingTerminal.type('> LOADING SECURITY PROTOCOLS...\n');
    await loadingTerminal.type('> ESTABLISHING SECURE CONNECTION...\n');
    await loadingTerminal.type('> ACCESS GRANTED\n');
    
    // Remove loading screen
    loadingScreen.style.opacity = '0';
    
    // Initialize audio after the loading screen starts fading
    initializeAudio();
    
    // Complete the loading sequence
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 1500);

    // Show about text with better formatting
    typingElements.forEach(element => {
        element.innerHTML = `
<div class="terminal-section">
    <div class="terminal-header-text">[PROFILE::START]</div>
    <div class="terminal-paragraph">
        I am a passionate cybersecurity enthusiast, driven by a deep fascination with digital security and internet protection. 
        My journey into cybersecurity began through watching hacking series, which sparked my interest in understanding and 
        defending digital infrastructures.
    </div>
</div>

<div class="terminal-section">
    <div class="terminal-header-text">[CURRENT_FOCUS]</div>
    <ul class="terminal-list">
        <li>Pursuing CompTIA certifications</li>
        <li>Actively practicing on Hack The Box and Over The Wire</li>
        <li>Exploring Cloud Security and DevOps integration</li>
    </ul>
</div>

<div class="terminal-section">
    <div class="terminal-header-text">[TECHNICAL_ARSENAL]</div>
    <ul class="terminal-list">
        <li>Languages: Python, HTML, CSS, C# (Basic)</li>
        <li>Environment: Docker, DevOps Tools</li>
        <li>Cloud: Infrastructure Security</li>
        <li>Security Tools: Fundamental Knowledge</li>
    </ul>
</div>

<div class="terminal-section">
    <div class="terminal-header-text">[AREAS_OF_INTEREST]</div>
    <ul class="terminal-list">
        <li>Cloud Infrastructure Security</li>
        <li>DevOps Security Integration</li>
        <li>Network Protection Systems</li>
        <li>Security Automation</li>
    </ul>
</div>

<div class="terminal-section">
    <div class="terminal-header-text">[CURRENT_TRAJECTORY]</div>
    <div class="terminal-paragraph">
        Focusing on building a strong foundation in cloud security and DevOps practices, while developing practical skills 
        through hands-on platforms. Aiming to bridge the gap between development and security in modern cloud environments.
    </div>
</div>

<div class="terminal-section">
    <div class="terminal-header-text">[STATUS::ACTIVE]</div>
    <div class="terminal-paragraph">
        Currently expanding knowledge base and practical experience through various platforms and certifications.
    </div>
</div>

<div class="terminal-header-text">[END_TRANSMISSION]</div>`;
    });
}); 