import "./polygon-item";
import "./ruler";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: block;
      position: relative;
      border: 1px solid #ddd;
      border-radius: 4px;
      height: 500px;
      overflow: hidden;
      background-color: #fff;
    }
    
    h2 {
      margin-top: 0;
      color: #333;
      padding: 10px;
      background-color: rgba(255, 255, 255, 0.8);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
    }
    
    .workspace-content {
      position: absolute;
      transform-origin: 0 0;
      will-change: transform;
    }
    
    .ruler-x {
      position: absolute;
      top: 0;
      left: 40px;
      right: 0;
      height: 40px;
      z-index: 5;
    }
    
    .ruler-y {
      position: absolute;
      top: 40px;
      left: 0;
      bottom: 0;
      width: 40px;
      z-index: 5;
    }
    
    .polygons-container {
      position: absolute;
      top: 40px;
      left: 40px;
      right: 0;
      bottom: 0;
      overflow: hidden;
      cursor: grab;
    }

    .polygons-container.grabbing {
      cursor: grabbing;
    }

    .drop-indicator {
      position: absolute;
      pointer-events: none;
      border: 2px dashed #4CAF50;
      background-color: rgba(76, 175, 80, 0.1);
      z-index: 100;
      display: none;
    }
  </style>
  
  <h2>Workspace</h2>
  <div class="ruler-x">
    <ruler-x></ruler-x>
  </div>
  <div class="ruler-y">
    <ruler-y></ruler-y>
  </div>
  <div class="polygons-container" id="container">
    <div class="workspace-content" id="content"></div>
    <div class="drop-indicator" id="drop-indicator"></div>
  </div>
`;

class WorkspaceArea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.container = this.shadowRoot.getElementById("container");
    this.content = this.shadowRoot.getElementById("content");
    this.dropIndicator = this.shadowRoot.getElementById("drop-indicator");
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;

    this.rulerX = this.shadowRoot.querySelector("ruler-x");
    this.rulerY = this.shadowRoot.querySelector("ruler-y");
  }

  connectedCallback() {
    this.setupEventListeners();
    this.updateTransform();
    this.updateRulers();
  }

  setupEventListeners() {
    this.container.addEventListener("wheel", this.handleWheel.bind(this));
    this.container.addEventListener("mousedown", this.handleMouseDown.bind(this));
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.addEventListener("mouseup", this.handleMouseUp.bind(this));

    this.addEventListener("dragenter", this.handleDragEnter.bind(this));
    this.addEventListener("dragover", this.handleDragOver.bind(this));
    this.addEventListener("dragleave", this.handleDragLeave.bind(this));
    this.addEventListener("drop", this.handleDrop.bind(this));
  }

  handleDragEnter(e) {
    e.preventDefault();
    this.dropIndicator.style.display = "block";
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    
    // Update drop indicator position and size
    const size = 100 / this.scale;
    const rect = this.container.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.translateX) / this.scale;
    const y = (e.clientY - rect.top - this.translateY) / this.scale;
    
    this.dropIndicator.style.left = `${x - size/2}px`;
    this.dropIndicator.style.top = `${y - size/2}px`;
    this.dropIndicator.style.width = `${size}px`;
    this.dropIndicator.style.height = `${size}px`;
  }

  handleDragLeave(e) {
    e.preventDefault();
    this.dropIndicator.style.display = "none";
  }

  handleWheel(e) {
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.min(Math.max(0.1, this.scale + delta), 3);

    const mouseX = e.clientX - this.container.getBoundingClientRect().left;
    const mouseY = e.clientY - this.container.getBoundingClientRect().top;

    this.translateX -= (mouseX - this.translateX) * (newScale / this.scale - 1);
    this.translateY -= (mouseY - this.translateY) * (newScale / this.scale - 1);

    this.scale = newScale;
    this.updateTransform();
    this.updateRulers();
  }

  handleMouseDown(e) {
    if (e.button === 0 && e.ctrlKey === false) {
      this.isDragging = true;
      this.startX = e.clientX - this.translateX;
      this.startY = e.clientY - this.translateY;
      this.container.classList.add("grabbing");
      e.preventDefault();
    }
  }

  handleMouseMove(e) {
    if (this.isDragging) {
      this.translateX = e.clientX - this.startX;
      this.translateY = e.clientY - this.startY;
      this.updateTransform();
      this.updateRulers();
    }
  }

  handleMouseUp() {
    this.isDragging = false;
    this.container.classList.remove("grabbing");
  }

  handleDrop(e) {
    e.preventDefault();
    this.dropIndicator.style.display = "none";

    const data = e.dataTransfer.getData("text/plain");
    if (data) {
      try {
        const polygonData = JSON.parse(data);

        const rect = this.container.getBoundingClientRect();
        const x = (e.clientX - rect.left - this.translateX) / this.scale;
        const y = (e.clientY - rect.top - this.translateY) / this.scale;

        const polygon = document.createElement("polygon-item");
        polygon.setAttribute("points", polygonData.points);

        if (polygonData.color) {
          polygon.setAttribute("color", polygonData.color);
        }

        polygon.style.position = "absolute";
        polygon.style.left = `${x}px`;
        polygon.style.top = `${y}px`;
        polygon.style.width = `${100 / this.scale}px`;
        polygon.style.height = `${100 / this.scale}px`;

        this.content.appendChild(polygon);
      } catch (error) {
        console.error("Error processing dropped polygon:", error);
      }
    }
  }

  updateTransform() {
    this.content.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }

  updateRulers() {
    this.rulerX.setAttribute("scale", this.scale.toString());
    this.rulerX.setAttribute("offset", this.translateX.toString());

    this.rulerY.setAttribute("scale", this.scale.toString());
    this.rulerY.setAttribute("offset", this.translateY.toString());
  }

  getPolygonsData() {
    return Array.from(this.content.querySelectorAll("polygon-item")).map(
      (polygon) => ({
        points: polygon.getAttribute("points"),
        color: polygon.getAttribute("color"),
        left: polygon.style.left,
        top: polygon.style.top,
        buffer: false,
      })
    );
  }

  setPolygonsData(polygons) {
    this.content.innerHTML = "";

    polygons.forEach((polyData) => {
      if (!polyData.buffer) {
        const polygon = document.createElement("polygon-item");
        polygon.setAttribute("points", polyData.points);

        if (polyData.color) {
          polygon.setAttribute("color", polyData.color);
        }

        polygon.style.position = "absolute";
        polygon.style.left = polyData.left;
        polygon.style.top = polyData.top;
        polygon.style.width = `${100 / this.scale}px`;
        polygon.style.height = `${100 / this.scale}px`;

        this.content.appendChild(polygon);
      }
    });
  }

  getWorkspaceState() {
    return {
      scale: this.scale,
      translateX: this.translateX,
      translateY: this.translateY,
    };
  }

  setWorkspaceState(state) {
    this.scale = state.scale || 1;
    this.translateX = state.translateX || 0;
    this.translateY = state.translateY || 0;
    this.updateTransform();
    this.updateRulers();
  }

  clear() {
    this.content.innerHTML = "";
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.updateTransform();
    this.updateRulers();
  }
}

customElements.define("workspace-area", WorkspaceArea);