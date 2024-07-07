const globalSocketIo = (socket, db, io) => {
    socket.on('startSimulation', () => {
        
      });
      
    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
    });

}

module.exports = globalSocketIo;