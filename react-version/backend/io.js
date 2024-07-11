const CONFIG = {
  elementTypes: ['rock', 'paper', 'scissors'],
  numElements: 60,
  elementRadius: 12,
  minSpeed: 0.5,
  maxSpeed: 0.5,
  borderRadius: 5
};

const initializeElements = (canvasWidth, canvasHeight) => {
  let elements = [];
  CONFIG.elementTypes.forEach(type => {
      for (let i = 0; i < CONFIG.numElements / CONFIG.elementTypes.length; i++) {
          const x = Math.random() * canvasWidth;
          const y = Math.random() * canvasHeight;
          const dx = (Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed) + CONFIG.minSpeed) * (Math.random() < 0.5 ? 1 : -1);
          const dy = (Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed) + CONFIG.minSpeed) * (Math.random() < 0.5 ? 1 : -1);
          elements.push({ type, x, y, dx, dy });
      }
  });
  return elements;
};
const globalSocketIo = (socket, io) => {
  socket.on('startSimulation', ({ width, height }) => {
      const elements = initializeElements(width, height);
      socket.emit('simulationStarted', { elements: elements });
  });

  socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id);
  });
};
module.exports = globalSocketIo;
