import { toast } from 'sonner';
import { io } from 'socket.io-client';
import React, { useRef, useEffect, useState } from 'react';

const CONFIG = {
    elementTypes: ['rock', 'paper', 'scissors'],
    numElements: 60,
    elementRadius: 12,
    minSpeed: 0.5,
    maxSpeed: 0.5,
    elementColors: {
        rock: '#000',
        paper: '#000FFF',
        scissors: '#F00'
    },
    borderRadius: 5
};

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

    draw(ctx) {
        ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }

    getColor() {
        return CONFIG.elementColors[this.type];
    }

    getLabel() {
        switch (this.type) {
            case 'rock':
                return '/assets/rock.png';
            case 'paper':
                return '/assets/paper.png';
            case 'scissors':
                return '/assets/scissors.png';
            default:
                return '';
        }
    }

    update(canvas) {
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
    }
}

const Simulation = () => {
    const canvasRef = useRef(null);
    const [stats, setStats] = useState('Rock, Paper, Scissors');
    const [countdown, setCountdown] = useState(5);
    const elementsRef = useRef([]);
    const animationFrameIdRef = useRef(null);
    const socket = io("ws://localhost:5000");

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = window.innerHeight * 0.7;

        const createElements = async () => {
            socket.emit('startSimulation', { width: canvas.width, height: canvas.height });
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            elementsRef.current.forEach(element => {
                element.update(canvas);
                element.draw(ctx);
            });

            const remainingTypes = new Set(elementsRef.current.map(e => e.type));
            updateStats(remainingTypes);

            if (remainingTypes.size > 1) {
                animationFrameIdRef.current = requestAnimationFrame(animate);
            } else {
                cancelAnimationFrame(animationFrameIdRef.current);
                setTimeout(() => {
                    toast.success(`Simulation complete. ${[...remainingTypes][0]} Won !!`);
                }, 100);
            }
        };

        const updateStats = remainingTypes => {
            setStats(`Winning: ${[...remainingTypes][0]}`);
        };

        createElements();

        socket.on('updateSimulation', ({ elements }) => {
            elementsRef.current = elements.map(element => new Element(element.type, element.x, element.y, element.dx, element.dy));
            animate();
        });

        socket.on('simulationStarted', ({ elements }) => {
            elementsRef.current = elements.map(element => new Element(element.type, element.x, element.y, element.dx, element.dy));
            animate();
            setCountdown(5);
            const interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 5;
                    }
                    return prev - 1;
                });
            }, 1000);
        });

        return () => {
            cancelAnimationFrame(animationFrameIdRef.current);
        };
    }, []);

    return (
        <div className="w-full p-2 mx-auto">
            <div className="flex items-center w-full mb-4 space-x-2">
                <div className="p-2 bg-white rounded shadow">{stats.split(":")[0]}:<b className='capitalize'>{stats.split(":")[1]}</b></div>
                <div className="p-2 bg-white rounded shadow">Next reset in: {countdown} s</div>
            </div>
            <canvas ref={canvasRef} className="w-full h-full bg-white"></canvas>
        </div>
    );
};

export default Simulation;
