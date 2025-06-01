const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      cursor: move;
    }
    
    svg {
      width: 100%;
      height: 100%;
    }
    
    :host([draggable]) {
      cursor: grab;
    }
    
    :host([draggable]:active) {
      cursor: grabbing;
    }
  </style>
  
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon fill="var(--polygon-color, #4CAF50)" stroke="#333" stroke-width="1"></polygon>
  </svg>
`;

class PolygonItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.polygon = this.shadowRoot.querySelector("polygon");
  }

  connectedCallback() {
    this.updatePolygon();
    this.setupDragEvents();
  }

  static get observedAttributes() {
    return ["points", "color"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "points") {
      this.updatePolygon();
    } else if (name === "color") {
      this.style.setProperty("--polygon-color", newValue);
    }
  }

  updatePolygon() {
    if (this.hasAttribute("points")) {
      this.polygon.setAttribute("points", this.getAttribute("points"));
    }
  }

  setupDragEvents() {
    if (this.hasAttribute("draggable")) {
      this.setAttribute("draggable", "true");
      this.addEventListener("dragstart", this.handleDragStart.bind(this));
    }
  }

  handleDragStart(e) {
    // Set the drag image to the polygon itself
    const rect = this.getBoundingClientRect();
    e.dataTransfer.setDragImage(this, rect.width / 2, rect.height / 2);

    const data = JSON.stringify({
      points: this.getAttribute("points"),
      color: this.getAttribute("color"),
    });

    e.dataTransfer.setData("text/plain", data);
    e.dataTransfer.effectAllowed = "copy";
  }
}

customElements.define("polygon-item", PolygonItem);
