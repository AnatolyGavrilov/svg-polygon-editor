import "./polygon-item";
import { generateRandomPolygon } from "../utils/helpers";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: block;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 20px;
      min-height: 150px;
      background-color: #f9f9f9;
    }
    
    h2 {
      margin-top: 0;
      color: #333;
    }
    
    .polygons-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  </style>
  
  <h2>Buffer Zone</h2>
  <div class="polygons-container" id="container"></div>
`;

class BufferZone extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.container = this.shadowRoot.getElementById("container");
  }

  generateRandomPolygons() {
    this.clear();

    const count = Math.floor(Math.random() * 16) + 5;
    for (let i = 0; i < count; i++) {
      const polygon = document.createElement("polygon-item");
      polygon.setAttribute("draggable", "true");
      polygon.setAttribute("buffer", "true");

      const vertices = Math.floor(Math.random() * 5) + 3;
      const points = generateRandomPolygon(vertices, 50, 50);
      polygon.setAttribute("points", points);

      polygon.style.width = "100px";
      polygon.style.height = "100px";

      this.container.appendChild(polygon);
    }
  }

  getPolygonsData() {
    return Array.from(this.container.querySelectorAll("polygon-item")).map(
      (polygon) => ({
        points: polygon.getAttribute("points"),
        color: polygon.getAttribute("color"),
        buffer: true,
      })
    );
  }

  setPolygonsData(polygons) {
    this.clear();

    polygons.forEach((polyData) => {
      if (polyData.buffer) {
        const polygon = document.createElement("polygon-item");
        polygon.setAttribute("draggable", "true");
        polygon.setAttribute("buffer", "true");
        polygon.setAttribute("points", polyData.points);

        if (polyData.color) {
          polygon.setAttribute("color", polyData.color);
        }

        polygon.style.width = "100px";
        polygon.style.height = "100px";

        this.container.appendChild(polygon);
      }
    });
  }

  clear() {
    this.container.innerHTML = "";
  }
}

customElements.define("buffer-zone", BufferZone);
