// Horizontal Ruler
const rulerXTemplate = document.createElement("template");
rulerXTemplate.innerHTML = `
  <style>
    :host {
      display: block;
      height: 100%;
      width: 100%;
      background-color: #f0f0f0;
      position: relative;
      overflow: hidden;
    }
    
    .ticks {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
    
    .tick {
      position: absolute;
      bottom: 0;
      width: 1px;
      background-color: #333;
    }
    
    .tick-label {
      position: absolute;
      bottom: 5px;
      transform: translateX(-50%);
      font-size: 10px;
      color: #333;
    }
    
    .major-tick {
      height: 15px;
    }
    
    .minor-tick {
      height: 8px;
    }
  </style>
  
  <div class="ticks" id="ticks"></div>
`;

class RulerX extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(rulerXTemplate.content.cloneNode(true));

    this.ticksContainer = this.shadowRoot.getElementById("ticks");
    this.scale = 1;
    this.offset = 0;
  }

  static get observedAttributes() {
    return ["scale", "offset"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "scale") {
      this.scale = parseFloat(newValue) || 1;
      this.updateTicks();
    } else if (name === "offset") {
      this.offset = parseFloat(newValue) || 0;
      this.updateTicks();
    }
  }

  updateTicks() {
    this.ticksContainer.innerHTML = "";

    const width = this.getBoundingClientRect().width;
    const visibleWidth = width / this.scale;
    const startPos = -this.offset / this.scale;

    let majorInterval = 100;
    if (this.scale < 0.5) majorInterval = 200;
    if (this.scale < 0.2) majorInterval = 500;
    if (this.scale > 2) majorInterval = 50;
    if (this.scale > 5) majorInterval = 20;

    const minorInterval = majorInterval / 5;
    const firstMajorTick = Math.ceil(startPos / majorInterval) * majorInterval;

    for (
      let pos = firstMajorTick;
      pos < startPos + visibleWidth;
      pos += minorInterval
    ) {
      const isMajor = pos % majorInterval === 0;

      const tick = document.createElement("div");
      tick.className = `tick ${isMajor ? "major-tick" : "minor-tick"}`;
      tick.style.left = `${(pos - startPos) * this.scale}px`;

      this.ticksContainer.appendChild(tick);

      if (isMajor) {
        const label = document.createElement("div");
        label.className = "tick-label";
        label.textContent = pos;
        label.style.left = `${(pos - startPos) * this.scale}px`;
        this.ticksContainer.appendChild(label);
      }
    }
  }
}

customElements.define("ruler-x", RulerX);

// Vertical Ruler
const rulerYTemplate = document.createElement("template");
rulerYTemplate.innerHTML = `
  <style>
    :host {
      display: block;
      height: 100%;
      width: 100%;
      background-color: #f0f0f0;
      position: relative;
      overflow: hidden;
    }
    
    .ticks {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
    
    .tick {
      position: absolute;
      left: 0;
      height: 1px;
      background-color: #333;
    }
    
    .tick-label {
      position: absolute;
      left: 5px;
      transform: translateY(-50%);
      font-size: 10px;
      color: #333;
    }
    
    .major-tick {
      width: 15px;
    }
    
    .minor-tick {
      width: 8px;
    }
  </style>
  
  <div class="ticks" id="ticks"></div>
`;

class RulerY extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(rulerYTemplate.content.cloneNode(true));

    this.ticksContainer = this.shadowRoot.getElementById("ticks");
    this.scale = 1;
    this.offset = 0;
  }

  static get observedAttributes() {
    return ["scale", "offset"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "scale") {
      this.scale = parseFloat(newValue) || 1;
      this.updateTicks();
    } else if (name === "offset") {
      this.offset = parseFloat(newValue) || 0;
      this.updateTicks();
    }
  }

  updateTicks() {
    this.ticksContainer.innerHTML = "";

    const height = this.getBoundingClientRect().height;
    const visibleHeight = height / this.scale;
    const startPos = -this.offset / this.scale;

    let majorInterval = 100;
    if (this.scale < 0.5) majorInterval = 200;
    if (this.scale < 0.2) majorInterval = 500;
    if (this.scale > 2) majorInterval = 50;
    if (this.scale > 5) majorInterval = 20;

    const minorInterval = majorInterval / 5;
    const firstMajorTick = Math.ceil(startPos / majorInterval) * majorInterval;

    for (
      let pos = firstMajorTick;
      pos < startPos + visibleHeight;
      pos += minorInterval
    ) {
      const isMajor = pos % majorInterval === 0;

      const tick = document.createElement("div");
      tick.className = `tick ${isMajor ? "major-tick" : "minor-tick"}`;
      tick.style.top = `${(pos - startPos) * this.scale}px`;

      this.ticksContainer.appendChild(tick);

      if (isMajor) {
        const label = document.createElement("div");
        label.className = "tick-label";
        label.textContent = pos;
        label.style.top = `${(pos - startPos) * this.scale}px`;
        this.ticksContainer.appendChild(label);
      }
    }
  }
}

customElements.define("ruler-y", RulerY);
