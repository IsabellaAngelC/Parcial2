const db = require("../db")

const getPlayers = async (req, res) => {
  try {
    res.status(200).json(db.players)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getPlayers }
