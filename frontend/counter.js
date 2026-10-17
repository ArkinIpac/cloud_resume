// Visitor counter: asks the Azure Function for the new count and shows it.
const counterElement = document.getElementById("counter");

async function updateCounter() {
  try {
    const response = await fetch("/api/counter");
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const data = await response.json();
    counterElement.textContent = data.count.toLocaleString();
  } catch (error) {
    console.error("Visitor counter failed:", error);
    counterElement.textContent = "—";
  }
}

updateCounter();
