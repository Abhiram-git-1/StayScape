(() => {
  "use strict";

  // Run everything after DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    //Bootstrap validation
    const forms = document.querySelectorAll(".needs-validation");

    Array.from(forms).forEach((form) => {
      form.addEventListener(
        "submit",
        (event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add("was-validated");
        },
        false,
      );
    });

    // Star rating
    const stars = document.querySelectorAll(".star-rating input");
    stars.forEach((star) => {
      star.addEventListener("change", () => {
        console.log("Selected rating:", star.value);
      });
    });

    // Leaflet map
  });
})();
