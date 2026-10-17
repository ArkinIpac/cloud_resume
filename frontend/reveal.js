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

// Highlights the nav link for the section on screen.
const navLinks = document.querySelectorAll(".nav-links a");
const sections = [...navLinks].map((link) => document.querySelector(link.getAttribute("href")));

window.addEventListener("scroll", () => {
  let current = -1;
  sections.forEach((section, index) => {
    if (section && section.getBoundingClientRect().top < window.innerHeight * 0.4) current = index;
  });
  navLinks.forEach((link, index) => link.classList.toggle("active", index === current));
}, { passive: true });

// Lets each tile glow where the mouse is.
document.querySelectorAll(".tile").forEach((tile) => {
  tile.addEventListener("pointermove", (event) => {
    const box = tile.getBoundingClientRect();
    tile.style.setProperty("--mx", `${event.clientX - box.left}px`);
    tile.style.setProperty("--my", `${event.clientY - box.top}px`);
  });
});
