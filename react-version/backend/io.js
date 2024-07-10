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

let elements = [];
let canvasWidth = 800;
let canvasHeight = 600;

const initializeElements = () => {
  elements = [];
  CONFIG.elementTypes.forEach(type => {
      for (let i = 0; i < CONFIG.numElements / CONFIG.elementTypes.length; i++) {
          const x = Math.random() * canvasWidth;
          const y = Math.random() * canvasHeight;
          const dx = (Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed) + CONFIG.minSpeed) * (Math.random() < 0.5 ? 1 : -1);
          const dy = (Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed) + CONFIG.minSpeed) * (Math.random() < 0.5 ? 1 : -1);
          elements.push({ type, x, y, dx, dy });
      }
  });
};

const updateElements = () => {
  elements.forEach(element => {
      element.x += element.dx;
      element.y += element.dy;

      if (element.x + CONFIG.elementRadius > canvasWidth || element.x - CONFIG.elementRadius < 0) {
          element.dx = -element.dx;
      }
      if (element.y + CONFIG.elementRadius > canvasHeight || element.y - CONFIG.elementRadius < 0) {
          element.dy = -element.dy;
      }
  });
  for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
          const dx = elements[i].x - elements[j].x;
          const dy = elements[i].y - elements[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < CONFIG.elementRadius * 2) {
              transform(elements[i], elements[j]);
          }
      }
  }

  const remainingTypes = new Set(elements.map(e => e.type));
  return remainingTypes.size <= 1;
};

const transform = (element1, element2) => {
  if (element1.type === 'rock' && element2.type === 'scissors') {
      element2.type = 'rock';
  } else if (element1.type === 'paper' && element2.type === 'rock') {
      element2.type = 'paper';
  } else if (element1.type === 'scissors' && element2.type === 'paper') {
      element2.type = 'scissors';
  } else if (element2.type === 'rock' && element1.type === 'scissors') {
      element1.type = 'rock';
  } else if (element2.type === 'paper' && element1.type === 'rock') {
      element1.type = 'paper';
  } else if (element2.type === 'scissors' && element1.type === 'paper') {
      element1.type = 'scissors';
  }
};

const globalSocketIo = (socket, io) => {
  socket.on('startSimulation', ({ width, height }) => {
      canvasWidth = width;
      canvasHeight = height;
      socket.emit('simulationStarted', { elements });
  });

  socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id);
  });

  setInterval(() => {
      const simulationComplete = updateElements();
      io.emit('updateSimulation', { elements });

      if (simulationComplete) {
          setTimeout(() => {
              initializeElements();
              io.emit('simulationStarted', { elements });
          }, 5000);
      }
  }, 100);
};

initializeElements();

module.exports = globalSocketIo;
