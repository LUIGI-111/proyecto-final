document.addEventListener("DOMContentLoaded", async function () {
const cartContent = document.getElementById("cart-content");
const cartEmpty = document.getElementById("cart-empty");
const cartSummary = document.getElementById("cart-summary");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const logoutButton = document.getElementById("logout-button");

// Obtener usuario logueado
const userId = localStorage.getItem("userId");
if (!userId) {
    window.location.href = "login.html";
    return;
}

// Cerrar sesión
logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.location.href = "login.html";
});

// Función para mostrar toast
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

// Cargar carrito desde backend
try {
    const res = await fetch(`http://localhost:3000/api/carrito/${userId}`);
    const data = await res.json();

    cartContent.innerHTML = ""; // limpiar loading

    if (data.success && data.carrito.length > 0) {
    let subtotal = 0;

    data.carrito.forEach(item => {
        subtotal += item.precio * item.cantidad;

        const row = document.createElement("div");
        row.classList.add("cart-item");

        row.innerHTML = `
        <img src="${item.imagenUrl || '../img/default.png'}" alt="${item.nombre_perfume}" class="cart-img">
        <div class="cart-info">
            <h3>${item.nombre_perfume}</h3>
            <p>${item.marca}</p>
            <p>Cantidad: ${item.cantidad}</p>
            <p>Precio: $${item.precio}</p>
        </div>
        <button class="btn-secondary remove-item" data-id="${item.carrito_id}">Eliminar</button>
        `;

        cartContent.appendChild(row);
    });

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;

    cartSummary.style.display = "block";
    } else {
    cartEmpty.style.display = "block";
    }
} catch (error) {
    console.error("Error al cargar carrito:", error);
    cartContent.innerHTML = "<p>Error al cargar carrito.</p>";
}

// Delegación para eliminar productos
cartContent.addEventListener("click", async (e) => {
    if (e.target.classList.contains("remove-item")) {
    const id = e.target.dataset.id;

    try {
        const res = await fetch(`http://localhost:3000/api/carrito/${id}`, {
        method: "DELETE"
        });
        const data = await res.json();

        if (data.success) {
        showToast("Producto eliminado del carrito");
        e.target.closest(".cart-item").remove();
        } else {
        showToast("Error al eliminar producto");
        }
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        showToast("Error al eliminar producto");
    }
    }
});
});