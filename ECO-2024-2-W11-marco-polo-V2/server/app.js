const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express(); // Creates HTTP server
app.use(express.json()); // utility to process JSON in requests
app.use(cors()); // utility to allow clients to make requests from other hosts or ips

const clientApp1Path = path.resolve(__dirname, "../game");
const clientApp2Path = path.resolve(__dirname, "../results-screen");
app.use(
  "/node_modules",
  express.static(path.join(__dirname, "../node_modules"))
);

// Serve Client App 1
app.use("/game", express.static(clientApp1Path));

// Serve Client App 2
app.use("/results", express.static(clientApp2Path));

// Catch-all route for Client App 1
app.get("/game/*", (req, res) => {
  res.sendFile(path.join(clientApp1Path, "index.html"));
});

// Catch-all route for Client App 2
app.get("/results/*", (req, res) => {
  res.sendFile(path.join(clientApp2Path, "index.html"));
});

const playersRouter = require("./routes/players");

app.use("/", playersRouter);

module.exports = app;
