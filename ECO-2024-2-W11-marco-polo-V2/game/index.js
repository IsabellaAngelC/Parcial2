const socket = io("http://localhost:5050", { path: "/real-time" })

let userName = ""
let myRole = ""

// ------------- SCREENS ----------------
const homeScreen = document.getElementById("home-welcome-screen")
const lobbyScreen = document.getElementById("lobby-screen")
const gameGround = document.getElementById("game-ground")
const gameOverScreen = document.getElementById("game-over")

homeScreen.style.display = "flex"
lobbyScreen.style.display = "none"
gameGround.style.display = "none"
gameOverScreen.style.display = "none"

// ------------- GENERAL ELEMENTS --------------------

const userNameDisplay = document.getElementById("nickname-display")
const gameUserNameDisplay = document.getElementById("game-nickname-display")

// ------------- WELCOME -SCREEN -------------

const nicknameInput = document.getElementById("nickname")
const joinButton = document.getElementById("join-button")

joinButton.addEventListener("click", joinGame)

async function joinGame() {
  userName = nicknameInput.value
  socket.emit("joinGame", { nickname: userName }) // Sends a string message to the server

  homeScreen.style.display = "none"
  userNameDisplay.innerHTML = userName
  lobbyScreen.style.display = "flex"
}

// ------------- LOBBY -SCREEN ---------------

const startButton = document.getElementById("start-button")
const usersCount = document.getElementById("users-count")

startButton.addEventListener("click", startGame)

async function startGame() {
  socket.emit("startGame") // Sends a string message to the server
}

// ------------- GAMESCREEN ----------------

let polos = []

const roleDisplay = document.getElementById("role-display")
const shoutbtn = document.getElementById("shout-button")
const shoutDisplay = document.getElementById("shout-display")
const container = document.getElementById("pool-players")

shoutbtn.style.display = "none"

shoutbtn.addEventListener("click", shoutBtn)

roleDisplay.style.display = "none"
shoutDisplay.style.display = "none"

async function shoutBtn() {
  if (myRole === "marco") {
    socket.emit("notifyMarco") // Sends a string message to the server
  }
  if (myRole === "polo" || myRole === "polo-especial") {
    socket.emit("notifyPolo") // Sends a string message to the server
  }
  shoutbtn.style.display = "none"
}

// Add event listener to the container for all buttons: this is called event delegation
container.addEventListener("click", function (event) {
  if (event.target.tagName === "BUTTON") {
    const key = event.target.dataset.key
    socket.emit("onSelectPolo", key)
  }
})

// ------------- GAME OVER ------------------

const gameOverText = document.getElementById("game-result")
const restartButton = document.getElementById("restart-button")

restartButton.addEventListener("click", restartGame)

async function restartGame() {
  socket.emit("startGame")
}

// ------------- SOCKET LISTENERS ----------------

socket.on("userJoined", (data) => {
  usersCount.innerHTML = data?.players.length || 0
  console.log(data)
})

socket.on("startGame", (data) => {
  polos = []
  container.innerHTML = "" // Clear previous data
  gameOverScreen.style.display = "none"
  shoutDisplay.style.display = "none"
  lobbyScreen.style.display = "none"
  gameGround.style.display = "flex"
  myRole = data

  roleDisplay.innerHTML = data
  roleDisplay.style.display = "block"
  gameUserNameDisplay.innerHTML = userName

  shoutbtn.innerHTML = `Gritar ${myRole}`

  if (myRole === "marco") {
    shoutbtn.style.display = "block"
  }
})

socket.on("notification", (data) => {
  console.log("Notification", data)
  if (myRole === "marco") {
    container.innerHTML = "<p>Haz click sobre el polo que quieres escoger:</p>" // Clear previous data
    polos.push(data)
    polos.forEach((elemt) => {
      const button = document.createElement("button")
      button.innerHTML = `Un jugador gritó: ${elemt.message}`
      button.setAttribute("data-key", elemt.userId)
      container.appendChild(button)
    })
  } else {
    shoutbtn.style.display = "block"
    shoutDisplay.innerHTML = `Marco ha gritado: ${data.message}`
    shoutDisplay.style.display = "block"
  }
})
function updatePointsDisplay(players) {
  const pointsContainer = document.getElementById("points-container")
  pointsContainer.innerHTML = ""
  players.forEach(player => {
    const playerPoints = document.createElement("div")
    playerPoints.textContent = `${player.nickname}: ${player.points} points`
    pointsContainer.appendChild(playerPoints)
  })
}

socket.on("notifyGameOver", (data) => {
  gameGround.style.display = "none"
  gameOverText.innerHTML = data.message
  gameOverScreen.style.display = "flex"
})
