document.addEventListener("DOMContentLoaded", () => {
  const checkInInput = document.getElementById("checkIn");

  const checkOutInput = document.getElementById("checkOut");

  const nightCount = document.getElementById("nightCount");

  const subtotalPrice = document.getElementById("subtotalPrice");

  const taxPrice = document.getElementById("taxPrice");

  const totalPrice = document.getElementById("totalPrice");

  // Safety check

  if (
    !checkInInput ||
    !checkOutInput ||
    !nightCount ||
    !subtotalPrice ||
    !taxPrice ||
    !totalPrice
  ) {
    return;
  }

  // Dynamic data comes from show.ejs

  const bookedDates = window.bookedDates || [];

  const listingPrice = Number(window.listingPrice) || 0;

  // FLATPICKR

  flatpickr("#checkIn", {
    minDate: "today",

    disable: bookedDates,

    dateFormat: "Y-m-d",
  });

  flatpickr("#checkOut", {
    minDate: "today",

    disable: bookedDates,

    dateFormat: "Y-m-d",
  });
  // PRICE CALCULATION
  function calculatePrice() {
    const checkIn = new Date(checkInInput.value);

    const checkOut = new Date(checkOutInput.value);

    // Invalid dates

    if (!checkInInput.value || !checkOutInput.value || checkOut <= checkIn) {
      nightCount.innerText = 0;

      subtotalPrice.innerText = "₹0";

      taxPrice.innerText = "₹0";

      totalPrice.innerText = "₹0";

      return;
    }

    // Calculate nights

    const diffTime = checkOut - checkIn;

    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate prices

    const subtotal = nights * listingPrice;

    const taxes = Math.round(subtotal * 0.18);

    const finalTotal = subtotal + taxes;

    // Update UI

    nightCount.innerText = nights;

    subtotalPrice.innerText = `₹${subtotal.toLocaleString("en-IN")}`;

    taxPrice.innerText = `₹${taxes.toLocaleString("en-IN")}`;

    totalPrice.innerText = `₹${finalTotal.toLocaleString("en-IN")}`;
  }

  // EVENT LISTENERS

  checkInInput.addEventListener("change", calculatePrice);

  checkOutInput.addEventListener("change", calculatePrice);
});
