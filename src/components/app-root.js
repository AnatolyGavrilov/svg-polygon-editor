import "./buffer-zone";
import "./workspace";
import "./ruler";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
} from "../utils/helpers";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: Arial, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .controls {
      display: flex;
      gap: 10px;
    }
    
    button {
      padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:hover {
      background-color: #45a049;
    }
    
    button.reset {
      background-color: #f44336;
    }
    
    button.reset:hover {
      background-color: #d32f2f;
    }
  </style>
  
  <div class="header">
    <h1>SVG Polygon Editor</h1>
    <div class="controls">
      <button id="create-btn">Create</button>
      <button id="save-btn">Save</button>
      <button id="reset-btn" class="reset">Reset</button>
    </div>
  </div>
  
  <buffer-zone></buffer-zone>
  <workspace-area></workspace-area>
`;

class AppRoot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.createBtn = this.shadowRoot.getElementById("create-btn");
    this.saveBtn = this.shadowRoot.getElementById("save-btn");
    this.resetBtn = this.shadowRoot.getElementById("reset-btn");
  }

  connectedCallback() {
    this.createBtn.addEventListener("click", () => this.createPolygons());
    this.saveBtn.addEventListener("click", () => this.saveState());
    this.resetBtn.addEventListener("click", () => this.resetState());
    this.loadState();
  }

  createPolygons() {
    const bufferZone = this.shadowRoot.querySelector("buffer-zone");
    bufferZone.generateRandomPolygons();
  }

  saveState() {
    const bufferZone = this.shadowRoot.querySelector("buffer-zone");
    const workspace = this.shadowRoot.querySelector("workspace-area");

    saveToLocalStorage({
      bufferPolygons: bufferZone.getPolygonsData(),
      workspacePolygons: workspace.getPolygonsData(),
      workspaceState: workspace.getWorkspaceState(),
    });

    alert("State saved to localStorage!");
  }

  loadState() {
    const savedState = loadFromLocalStorage();
    if (savedState) {
      const bufferZone = this.shadowRoot.querySelector("buffer-zone");
      const workspace = this.shadowRoot.querySelector("workspace-area");

      bufferZone.setPolygonsData(savedState.bufferPolygons || []);
      workspace.setPolygonsData(savedState.workspacePolygons || []);
      workspace.setWorkspaceState(savedState.workspaceState || {});
    }
  }

  resetState() {
    if (confirm("Are you sure you want to reset all data?")) {
      clearLocalStorage();
      const bufferZone = this.shadowRoot.querySelector("buffer-zone");
      const workspace = this.shadowRoot.querySelector("workspace-area");

      bufferZone.clear();
      workspace.clear();
    }
  }
}

customElements.define("app-root", AppRoot);
