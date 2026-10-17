// Fades each .reveal element in the first time it scrolls into view.
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

// Moves the soft yellow light to follow the mouse.
const spotlight = document.querySelector(".spotlight");
if (spotlight && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    spotlight.style.setProperty("--x", `${event.clientX}px`);
    spotlight.style.setProperty("--y", `${event.clientY}px`);
  });
}
