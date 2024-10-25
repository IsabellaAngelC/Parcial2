const { gameEvents } = require("./gameEvents")

const handleEvents = (socket, io) => {
  gameEvents(socket, io)
}

module.exports = { handleEvents }
