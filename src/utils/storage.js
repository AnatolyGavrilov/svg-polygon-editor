export function saveState(state) {
  try {
    localStorage.setItem("polygonEditor", JSON.stringify(state));
    return true;
  } catch (e) {
    console.error("Failed to save state:", e);
    return false;
  }
}

export function loadState() {
  try {
    const state = localStorage.getItem("polygonEditor");
    return state ? JSON.parse(state) : null;
  } catch (e) {
    console.error("Failed to load state:", e);
    return null;
  }
}

export function clearState() {
  localStorage.removeItem("polygonEditor");
}
