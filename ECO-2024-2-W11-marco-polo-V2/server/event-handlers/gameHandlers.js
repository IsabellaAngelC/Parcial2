
const { assignRoles } = require("../utils/helpers")

const joinGameHandler = (socket, db, io) => {
  return (user) => {
    db.players.push({ id: socket.id, ...user, points: 0 })
    io.emit("userJoined", db)
  }
}

const startGameHandler = (socket, db, io) => {
  return () => {
    // Preserve existing points
    const existingPoints = db.players.reduce((acc, player) => {
      acc[player.id] = player.points
      return acc
    }, {})

    // Reassign roles but keep points
    db.players = assignRoles(db.players).map(player => ({
      ...player,
      points: existingPoints[player.id] || 0
    }))

    db.players.forEach((element) => {
      io.to(element.id).emit("startGame", element.role)
    })
  }
}

const notifyMarcoHandler = (socket, db, io) => {
  return () => {
    const rolesToNotify = db.players.filter(
      (user) => user.role === "polo" || user.role === "polo-especial"
    )

    rolesToNotify.forEach((element) => {
      io.to(element.id).emit("notification", {
        message: "Marco!!!",
        userId: socket.id,
      })
    })
  }
}

const notifyPoloHandler = (socket, db, io) => {
  return () => {
    const rolesToNotify = db.players.filter((user) => user.role === "marco")

    rolesToNotify.forEach((element) => {
      io.to(element.id).emit("notification", {
        message: "Polo!!",
        userId: socket.id,
      })
    })
  }
}

const onSelectPoloHandler = (socket, db, io) => {
  return (userID) => {
    const myUser = db.players.find((user) => user.id === socket.id) // Marco
    const poloSelected = db.players.find((user) => user.id === userID) // Polo o Polo Especial
    const poloEspecial = db.players.find((user) => user.role === "polo-especial")

    let message = ''
    let winner = null

    if (myUser.role === "marco") {
      if (poloSelected.role === "polo-especial") {
        // Marco atrapa a Polo Especial
        myUser.points += 50 // Marco suma +50 puntos
        poloSelected.points -= 10 // Polo Especial pierde -10 puntos
        message = `El marco ${myUser.nickname} atrapó al polo especial ${poloSelected.nickname}. Marco gana 50 puntos, Polo Especial pierde 10 puntos.`
      } else {
        // Marco no atrapa a Polo Especial
        myUser.points -= 10 // Marco pierde -10 puntos
        message = `El marco ${myUser.nickname} no atrapó al polo especial. Pierde 10 puntos.`
      }
    } else if (myUser.role === "polo-especial" && poloSelected.role !== "marco") {
      // Polo Especial no es atrapado por Marco
      myUser.points += 10 // Polo Especial suma +10 puntos
      message = `El polo especial ${myUser.nickname} no fue atrapado. Gana 10 puntos.`
    }

    // Verificar si alguien ha alcanzado 100 puntos
    const potentialWinners = [myUser, poloSelected, poloEspecial];
    winner = potentialWinners.find(player => player.points >= 100);

    if (winner) {
      const sortedPlayers = db.players
        .slice()
        .sort((a, b) => b.points - a.points)
        .map((player, index) => ({
          rank: index + 1,
          nickname: player.nickname,
          points: player.points
        }))

      message = `¡${winner.nickname} ha ganado el juego con ${winner.points} puntos! 🏆`
      io.emit("notifyGameOver", {
        message: message,
        ranking: sortedPlayers,
        updatedPlayers: db.players,
        winner: winner
      })
    } else {
      io.emit("notifyGameOver", {
        message: message,
        updatedPlayers: db.players,
        winner: null
      })
    }
  }
}

module.exports = {
  joinGameHandler,
  startGameHandler,
  notifyMarcoHandler,
  notifyPoloHandler,
  onSelectPoloHandler,
}
