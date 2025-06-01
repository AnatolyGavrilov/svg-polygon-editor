export function generateRandomPolygon(vertexCount, width, height) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.4;

  const points = [];
  for (let i = 0; i < vertexCount; i++) {
    const angle = (i / vertexCount) * 2 * Math.PI;
    const randomRadius = radius * (0.7 + Math.random() * 0.3);
    const x = centerX + randomRadius * Math.cos(angle);
    const y = centerY + randomRadius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return points.join(" ");
}

export function saveToLocalStorage(data) {
  try {
    localStorage.setItem("svgPolygonEditor", JSON.stringify(data));
    return true;
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
    return false;
  }
}

export function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem("svgPolygonEditor");
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Failed to load from localStorage:", e);
    return null;
  }
}

export function clearLocalStorage() {
  localStorage.removeItem("svgPolygonEditor");
}
