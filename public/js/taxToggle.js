document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("taxToggle");

  toggle.addEventListener("change", () => {
    const taxPrices = document.querySelectorAll(".tax-price");

    taxPrices.forEach((el) => {
      if (toggle.checked) {
        el.classList.remove("d-none");
      } else {
        el.classList.add("d-none");
      }
    });
  });
});
