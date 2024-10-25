const assignRoles = (players) => {
  if (!players || players.length < 2) {
    return players; // Return the original array if it's too short
  }

  let shuffled = players.sort(() => 0.5 - Math.random());
  shuffled[0].role = "marco";
  shuffled[1].role = "polo-especial";
  for (let i = 2; i < shuffled.length; i++) {
    shuffled[i].role = "polo";
  }
  return shuffled;
}

module.exports = { assignRoles };
