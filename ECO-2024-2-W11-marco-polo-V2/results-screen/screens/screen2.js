import { router, socket } from "../routes.js";

export default function renderScreen2() {
  const app = document.getElementById("app");
  app.innerHTML = `
        <h1>Screen 2</h1>
        <p>Welcome to Screen 2</p>
    `;
}
