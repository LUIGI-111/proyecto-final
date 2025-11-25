document.addEventListener("DOMContentLoaded", async function () {

    const perfumeList = document.getElementById("perfume-list");
    const userName = document.getElementById("user-name");
    const logoutButton = document.getElementById("logout-button");

    const user = sessionStorage.getItem("user");
    if (user) userName.textContent = `Hola, ${JSON.parse(user).email}`;

    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("user");
        localStorage.removeItem("userId");
        window.location.href = "login.html";
    });

    async function loadPerfumes() {
        perfumeList.innerHTML = `<div class="loading">Cargando perfumes...</div>`;
        try {
            const res = await fetch("http://localhost:3000/api/perfumes");
            const data = await res.json();

            const perfumes = data.perfumes || [];

            perfumeList.innerHTML = "";

            if (!perfumes.length) {
                perfumeList.innerHTML = `<p>No hay perfumes disponibles.</p>`;
                return;
            }

            perfumes.forEach(p => {
                const card = `
                <div class="perfume-card">
                    <img src="${p.imagenUrl || 'img/default.png'}" alt="${p.nombre_perfume}">
                    <h3>${p.nombre_perfume}</h3>
                    <p class="marca">${p.marca}</p>
                    <p class="descripcion">${p.description_perfume || ''}</p>
                    <p class="precio">$${p.precio}</p>
                    <button class="btn-primary add-cart" data-id="${p.perfumes_id}">Agregar al carrito</button>
                    <button class="btn-secondary add-fav" data-id="${p.perfumes_id}">❤️ Favorito</button>
                </div>`;
                perfumeList.insertAdjacentHTML("beforeend", card);
            });

        } catch (err) {
            console.error(err);
            perfumeList.innerHTML = `<p>Error al cargar perfumes</p>`;
        }
    }

    loadPerfumes();

    // Toast
    function showToast(msg) {
        const toast = document.getElementById("toast");
        toast.textContent = msg;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }

    // Eventos carrito/favoritos
    perfumeList.addEventListener("click", async (e) => {
        const userId = localStorage.getItem("userId");
        if (!userId) return showToast("Debes iniciar sesión");

        if (e.target.classList.contains("add-cart")) {
            const perfumeId = e.target.dataset.id;
            const res = await fetch("http://localhost:3000/api/carrito", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fk_user_id: userId, fk_perfume_id: perfumeId, cantidad: 1 })
            });
            const data = await res.json();
            showToast(data.success ? "Producto agregado al carrito" : "Error al agregar al carrito");
        }

        if (e.target.classList.contains("add-fav")) {
            const perfumeId = e.target.dataset.id;
            const res = await fetch("http://localhost:3000/api/favoritos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fk_user_id: userId, fk_perfume_id: perfumeId })
            });
            const data = await res.json();
            showToast(data.success ? "Perfume agregado a favoritos" : "Error al agregar a favoritos");
        }
    });

});
