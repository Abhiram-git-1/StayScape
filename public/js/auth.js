//LOGIN PASSWORD TOGGLE
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

if (password && togglePassword) {
  togglePassword.addEventListener("click", () => {
    const isPassword = password.type === "password";

    password.type = isPassword ? "text" : "password";

    togglePassword.innerHTML = isPassword
      ? '<i class="fa-solid fa-eye-slash"></i>'
      : '<i class="fa-solid fa-eye"></i>';
  });
}

//SIGNUP PASSWORD CONFIRMATION
const confirmPassword = document.getElementById("confirmPassword");

const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

const strength = document.getElementById("passwordStrength");

const match = document.getElementById("passwordMatch");

//CONFIRM PASSWORD TOGGLE
if (confirmPassword && toggleConfirmPassword) {
  toggleConfirmPassword.addEventListener("click", () => {
    const isPassword = confirmPassword.type === "password";

    confirmPassword.type = isPassword ? "text" : "password";

    toggleConfirmPassword.innerHTML = isPassword
      ? '<i class="fa-solid fa-eye-slash"></i>'
      : '<i class="fa-solid fa-eye"></i>';
  });
}

//PASSWORD STRENGTH
if (password && strength) {
  password.addEventListener("input", () => {
    const value = password.value;

    strength.className = "";

    if (value.length === 0) {
      strength.innerHTML = "";

      return;
    }

    if (value.length < 6) {
      strength.innerHTML = "Weak Password";

      strength.classList.add("password-weak");
    } else if (value.length < 10) {
      strength.innerHTML = "Medium Password";

      strength.classList.add("password-medium");
    } else {
      strength.innerHTML = "Strong Password";

      strength.classList.add("password-strong");
    }
  });
}

//PASSWORD MATCH
if (password && confirmPassword && match) {
  confirmPassword.addEventListener("input", () => {
    if (confirmPassword.value === "") {
      match.innerHTML = "";

      match.className = "";

      return;
    }

    if (password.value === confirmPassword.value) {
      match.innerHTML = "Passwords match ✓";

      match.classList.add("password-match");
    } else {
      match.innerHTML = "Passwords do not match";

      match.classList.add("password-no-match");
    }
  });
}
