document.addEventListener("DOMContentLoaded", function () {
  const form = document.forms["formRegister"];
  const registerError = document.getElementById("register-error");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = form.elements["email"].value.trim();
      const password = form.elements["password"].value.trim();

      // Validaciones básicas
      if (!email || !password) {
        registerError.textContent = "Por favor completa todos los campos.";
        return;
      }

      // Construir datos como x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("password", password);

      fetch("http://localhost:3000/api/user/register", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
        .then(res => res.ok ? res.json() : Promise.reject("Error en el servidor"))
        .then(data => {
          if (data.success) {
            alert("Usuario registrado con éxito");
            // Guardar el ID del usuario en localStorage
            localStorage.setItem("userId", data.user_id);
            // Redirigir a la tienda
            window.location.href = "shop.html";
          } else {
            registerError.textContent = data.message || "Error al registrar.";
          }
        })
        .catch(err => {
          console.error("Error:", err);
          registerError.textContent = "No se pudo registrar el usuario.";
        });
    });
  } else {
    console.error("No se encontró el formulario con el name 'formRegister'");
  }
});