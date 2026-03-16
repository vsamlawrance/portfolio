// ===== GSAP PAGE ENTRANCE =====
window.addEventListener("load", () => {
  gsap.to(".project-header", { opacity: 1, duration: 1, y: 0, ease: "power2.out" });
  gsap.to(".project-grid", { opacity: 1, duration: 1.2, delay: 0.5, y: 0, ease: "power2.out" });
});

// ===== MODAL FUNCTIONALITY =====
const infoBtns = document.querySelectorAll(".info-btn");
const modals = document.querySelectorAll(".modal");
const closeBtns = document.querySelectorAll(".close-btn");
const closeBottoms = document.querySelectorAll(".close-bottom");

infoBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const modalId = btn.parentElement.getAttribute("data-modal");
    document.getElementById(modalId).style.display = "flex";
  });
});

closeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.closest(".modal").style.display = "none";
  });
});

closeBottoms.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.closest(".modal").style.display = "none";
  });
});

window.addEventListener("click", (e) => {
  modals.forEach((modal) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});
