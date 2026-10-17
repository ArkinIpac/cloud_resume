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

// Counts the stat numbers up the first time they scroll into view.
const statNumbers = document.querySelectorAll(".num[data-count]");
if ("IntersectionObserver" in window && typeof countUp === "function") {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        countUp(entry.target, Number(entry.target.dataset.count));
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  statNumbers.forEach((number) => statObserver.observe(number));
}
