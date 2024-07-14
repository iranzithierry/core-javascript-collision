const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

const CONFIG = {
    elementTypes: ['rock', 'paper', 'scissors'],
    numElements: 60,
    elementRadius: 12,
    minSpeed: 0.5,
    maxSpeed: 0.8,
    // maxSpeed: 2.0,
    elementColors: {
        rock: '#000',
        paper: '#000FFF',
        scissors: '#F00'
    },
    borderRadius: 5
};

document.addEventListener("DOMContentLoaded", () => {
    canvas.width = canvas.parentElement.offsetWidth;
})
canvas.height = window.screen.height * 0.7;

class Element {
    constructor(type, x, y, dx, dy) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = CONFIG.elementRadius;
        this.image = new Image();
        this.image.src = this.getLabel();
    }

    draw() {
        ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }

    getColor() {
        return CONFIG.elementColors[this.type];
    }

    getLabel() {
        switch (this.type) {
            case 'rock':
                return 'assets/rock.png';
            case 'paper':
                return 'assets/paper.png';
            case 'scissors':
                return 'assets/scissors.png';
            default:
                return '';
        }
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
    }

    collidesWith(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius * 2;
    }

    transform(other) {
        if (this.type === 'rock' && other.type === 'scissors') {
            other.type = this.type; // Transform scissors to rock
            other.image.src = this.image.src
        }
        else if (this.type === 'paper' && other.type === 'rock') {
            other.type = this.type; // Transform rock to paper
            other.image.src = this.image.src
        }
        else if (this.type === 'scissors' && other.type === 'paper') {
            other.type = this.type; // Transform paper to scissors
            other.image.src = this.image.src
        }
        this.bumpEachOther(other)

    }
    bumpEachOther(other) {
        const angle = Math.atan2(other.y - this.y, other.x - this.x)

        const thisSpeed = this.getSpeed(this)
        const otherSpeed = this.getSpeed(other)

        this.dx = -Math.cos(angle) * thisSpeed
        other.dx = Math.cos(angle) * otherSpeed

        this.dy = -Math.sin(angle) * thisSpeed
        other.dy = Math.sin(angle) * otherSpeed
    }
    getSpeed(el) {
        return Math.sqrt(el.dx * el.dx + el.dy * el.dy)
    }
}
let elements = [];
function createElements() {
    elements = [];
    CONFIG.elementTypes.map(e => {
        for (let i = 0; i < CONFIG.numElements / CONFIG.elementTypes.length; i++) {
            const x = Math.random() * canvas.width*3;
            const y = Math.random() * canvas.height;
            const dx = (Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed) + CONFIG.minSpeed) * (Math.random() < 0.5 ? 1 : -1);
            const dy = (Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed) + CONFIG.minSpeed) * (Math.random() < 0.5 ? 1 : -1);
            elements.push(new Element(e, x, y, dx, dy));
        }
    })
}


let animationFrameId;
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let element of elements) {
        element.update();
        element.draw();
    }

    for (let i = 0; i < elements.length; i++) {
        for (let j = i + 1; j < elements.length; j++) {
            if (elements[i].collidesWith(elements[j])) {
                elements[i].transform(elements[j]);
                elements[j].transform(elements[i]); 
            }
        }
    }

    const remainingTypes = new Set(elements.map(e => e.type));
    updateStats(remainingTypes);

    if (remainingTypes.size > 1) {
        animationFrameId = requestAnimationFrame(animate);
    } else {
        cancelAnimationFrame(animationFrameId); 
        elements.forEach(element => element.draw());
        setTimeout(() => {
            alert(`Simulation complete. ${[...remainingTypes][0]} Won !!`);
        }, 100);
    }
}

function updateStats(remainingTypes) {
    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML = `Winning: <b>${[...remainingTypes][0]}</b>`;
}

function resetSimulation() {
    cancelAnimationFrame(animationFrameId);
    createElements();
    animate();
}

document.getElementById('resetButton').addEventListener('click', resetSimulation);

createElements();
animate();
