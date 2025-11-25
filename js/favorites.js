document.addEventListener("DOMContentLoaded", async function () {
const favoritesContent = document.getElementById("favorites-content");
const favoritesEmpty = document.getElementById("favorites-empty");
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

// Cargar favoritos desde backend
try {
    const res = await fetch(`http://localhost:3000/api/favoritos/${userId}`);
    const data = await res.json();

    favoritesContent.innerHTML = ""; // limpiar loading

    if (data.success && data.favoritos.length > 0) {
    data.favoritos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("perfume-card");

        card.innerHTML = `
        <img src="${item.imagenUrl || '../img/default.png'}" alt="${item.nombre_perfume}" class="perfume-img">
        <h3>${item.nombre_perfume}</h3>
        <p class="marca">${item.marca}</p>
        <p class="precio">$${item.precio}</p>
        <button class="btn-secondary remove-fav" data-id="${item.favorito_id}">Eliminar</button>
        `;

        favoritesContent.appendChild(card);
    });
    } else {
    favoritesEmpty.style.display = "block";
    }
} catch (error) {
    console.error("Error al cargar favoritos:", error);
    favoritesContent.innerHTML = "<p>Error al cargar favoritos.</p>";
}

// Delegación para eliminar favoritos
favoritesContent.addEventListener("click", async (e) => {
    if (e.target.classList.contains("remove-fav")) {
    const id = e.target.dataset.id;

    try {
        const res = await fetch(`http://localhost:3000/api/favoritos/${id}`, {
        method: "DELETE"
        });
        const data = await res.json();

        if (data.success) {
        showToast("Perfume eliminado de favoritos");
        e.target.closest(".perfume-card").remove();

        // Si ya no quedan favoritos, mostrar mensaje vacío
        if (favoritesContent.children.length === 0) {
            favoritesEmpty.style.display = "block";
        }
        } else {
        showToast("Error al eliminar favorito");
        }
    } catch (error) {
        console.error("Error al eliminar favorito:", error);
        showToast("Error de conexión con el servidor");
    }
    }
});
});