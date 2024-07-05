// Get the canvas element and its context
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

// Define element types
const ELEMENT_TYPES = ['rock', 'paper', 'scissors'];

// Element class representing each entity on the canvas
class Element {
    constructor(type, x, y, dx, dy) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.dx = dx; // Horizontal velocity
        this.dy = dy; // Vertical velocity
        this.radius = 10; // Radius of the element
    }

    // Draw the element on the canvas
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.getColor();
        ctx.fill();
        ctx.closePath();
    }

    // Get color based on type
    getColor() {
        switch (this.type) {
            case 'rock':
                return 'gray';
            case 'paper':
                return 'blue';
            case 'scissors':
                return 'red';
        }
    }

    // Update position of the element
    update() {
        this.x += this.dx;
        this.y += this.dy;

        // Bounce off walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
    }

    // Check collision with another element
    collidesWith(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + other.radius;
    }

    // Transform based on collision rules
    transform(other) {
        if ((this.type === 'rock' && other.type === 'scissors') ||
            (this.type === 'paper' && other.type === 'rock') ||
            (this.type === 'scissors' && other.type === 'paper')) {
            other.type = this.type; // Transform the other element to this type
        }
    }
}

// Create initial elements
let elements = [];
const NUM_ELEMENTS = 60;
for (let i = 0; i < NUM_ELEMENTS; i++) {
    const type = ELEMENT_TYPES[Math.floor(Math.random() * ELEMENT_TYPES.length)];
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const dx = (Math.random() - 0.5) * 2;
    const dy = (Math.random() - 0.5) * 2;
    elements.push(new Element(type, x, y, dx, dy));
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Update and draw each element
    for (let element of elements) {
        element.update();
        element.draw();
    }

    // Check for collisions and transform elements
    for (let i = 0; i < elements.length; i++) {
        for (let j = i + 1; j < elements.length; j++) {
            if (elements[i].collidesWith(elements[j])) {
                elements[i].transform(elements[j]);
            }
        }
    }

    // Check if only one type of element is left
    const remainingTypes = new Set(elements.map(e => e.type));
    if (remainingTypes.size > 1) {
        requestAnimationFrame(animate); // Continue animation if more than one type remains
    } else {
        console.log(`Simulation complete. All elements are ${[...remainingTypes][0]}`);
    }
}

// Start the animation
animate();
