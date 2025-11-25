document.addEventListener("DOMContentLoaded", function () {

    const form = document.forms["loginFormulario"];
    const loginError = document.getElementById("login-error");

    if (form) {
        form.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = form.elements["email"].value.trim();
        const password = form.elements["password"].value.trim();

        if (!email || !password) {
            alert("Por favor completa todos los campos.");
            return;
        }

        const formData = {
            email: email,
            password: password
        };

        // Enviamos los datos al servidor
        fetch("http://localhost:3000/api/user/login", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
            "Content-Type": "application/json"
            }
        })
            .then(res => res.ok ? res.json() : Promise.reject("Error en el servidor"))
            .then(data => {
            if (data.success) {
                console.log("Respuesta del servidor:", data);
                alert("Inicio de sesión exitoso");
                // Guardar datos en sessionStorage si quieres usarlos en la tienda
                sessionStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("userId", data.user.user_id);
                window.location.href = "shop.html";
            } else {
                loginError.textContent = data.message || "Error al iniciar sesión";
            }
            })
            .catch(error => {
            console.error("Error al enviar los datos:", error);
            alert("Error, no se pudo iniciar sesión");
            });
        });
    } else {
        console.error("No se encontró el formulario con el ID indicado");
    }
});