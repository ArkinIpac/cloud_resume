// Visitor counter: asks the Azure Function for the new count, shows it,
// and animates the diagram of the path the request took.
const counterElement = document.getElementById("counter");
const arch = document.getElementById("arch");
const archStatus = document.getElementById("arch-status");

// Counts a number up from 0 for a smooth reveal.
function countUp(element, target, duration = 1200) {
  const start = performance.now();
  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

async function updateCounter() {
  if (arch) arch.classList.add("running");
  const startedAt = performance.now();
  try {
    const response = await fetch("/api/counter");
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const data = await response.json();
    const roundTrip = Math.round(performance.now() - startedAt);
    countUp(counterElement, data.count);
    if (arch) {
      arch.classList.add("done");
      archStatus.textContent = `You are visitor #${data.count.toLocaleString()} · round trip ${roundTrip} ms`;
    }
  } catch (error) {
    console.error("Visitor counter failed:", error);
    counterElement.textContent = "—";
    if (arch) {
      arch.classList.add("failed");
      archStatus.textContent = "Couldn't reach the API right now";
    }
  }
}

updateCounter();
