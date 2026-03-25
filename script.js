// Menú y nav
const btn = document.querySelector(".btn-hamburguesa");
const nav = document.querySelector(".site-nav");
const btnPagar = document.querySelector(".btn-pagar");
const modal = document.querySelector(".modal-pago");
const btnCerrar = document.querySelector(".btn-cerrar");
const reset = document.getElementById("btn-reset");

if (reset) {
    reset.addEventListener("click", function () {
        document.querySelectorAll(".cantidad-numero").forEach(cant => {
            cant.textContent = "0";
    });
        document.querySelectorAll(".sub").forEach(subs => {
            subs.textContent = "0";
    });
        document.getElementById("total").textContent = "0";
        document.querySelectorAll(".item-resumen").forEach(item => {
            item.classList.remove("activo");
    });
    btnPagar.disabled = true;
  });
}


if (btnPagar && modal) {
    btnPagar.addEventListener("click", () => {
        modal.classList.add("activo");
        document.body.classList.add("modal-activo");
    });
}

if (btnCerrar && modal) {
    btnCerrar.addEventListener("click", () => {
        modal.classList.remove("activo");
        document.body.classList.remove("modal-activo");
        limpiarFormulario();
    });
}

if (btn && nav) {
    btn.addEventListener('click', function () {
        const abierto = nav.classList.toggle("abierto");
        document.body.classList.toggle("menu-abierto", abierto);
        btn.setAttribute("aria-expanded", String(abierto));
        btn.setAttribute("aria-label", abierto ? "Cerrar menu de navegacion" : "Abrir menu de navegacion");

        if (abierto) {
            btn.classList.remove("scrolleando");
        }
    });
}

const cards = document.querySelectorAll(".card");
const montoTotal = document.getElementById("total");

// Monto total del pedido
function actualizarTotalGeneral() {
  let total = 0;

  document.querySelectorAll(".item-resumen.activo .sub").forEach((sub) => {
    total += Number(sub.textContent) || 0;
  });

  if (montoTotal) {
    montoTotal.textContent = String(total);
  }

   btnPagar.disabled = total > 0 ? false : true;
}

cards.forEach((card => {
    const btnSumar = card.querySelector(".sumar");
    const btnRestar = card.querySelector(".restar");
    const cantidad = card.querySelector(".cantidad-numero");

    const producto = card.dataset.prod;
    const resumen = document.querySelector(`.item-resumen[data-prod="${producto}"]`);
    const sub = resumen ? resumen.querySelector(".sub") : null;

    if (!btnSumar || !btnRestar || !cantidad || !producto || !resumen || !sub ) return; 

    btnSumar.addEventListener("click", () => {
        const actual = Number(cantidad.textContent) || 0;
        cantidad.textContent = actual +1;

        const precioUnitario = Number(card.dataset.price) || 0;
        const subtotalActual = Number(sub.textContent) || 0;
        const subtotalFinal = subtotalActual + precioUnitario;
        sub.textContent = String(subtotalFinal);
        resumen.classList.add("activo");

        actualizarTotalGeneral();
    });

    btnRestar.addEventListener("click", () => {
        const actual = Number(cantidad.textContent) || 0;
        cantidad.textContent = Math.max(0, actual -1);

        const precioUnitario = Number(card.dataset.price) || 0;
        const subtotalActual = Number(sub.textContent) || 0;
        const subtotalFinal = Math.max(0, subtotalActual - precioUnitario);
        sub.textContent = String(subtotalFinal);

        if (subtotalFinal === 0) {
            resumen.classList.remove("activo");
        } else {
            resumen.classList.add("activo");
        }
        actualizarTotalGeneral();
    });
}));

// JS y API
const pedido = document.getElementById("form-pago");
function limpiarFormulario() {
    const pedidoForm = document.getElementById("form-pago");
    if (pedidoForm) pedidoForm.reset();
}

if (pedido) {
    pedido.addEventListener("submit", (e) => {
    e.preventDefault()
// Validamos el contenido del formulario
    const nombre = pedido.nombre.value.trim();
    const email = pedido.email.value.trim();
    const telefono = pedido.telefono.value.trim();

    if (!nombre || !email || !telefono ) return;

// Armamos los items
    const items = [];
    document.querySelectorAll(".card.activo").forEach((item) => {
        const titulo = item.dataset.prod;
        const precio = Number(item.dataset.price);
        const cantidad = Number(item.querySelector(".cantidad-numero").textContent);

        items.push({
            title: titulo,
            unit_price: precio,
            quantity: cantidad
        })
    })
// Flujo de fetch
    return fetch("/api/crear-preferencia", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            items: items,
            payer: {
                name: nombre,
                email: email,
                phone: {
                    area_code: "54",
                    number: telefono
                }
            }
        })
    })
    .then(response => {
        console.log("status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("respuesta completa:", data); 
        console.log(data);
        window.location.href = data.init_point
        limpiarFormulario();
    })
    .catch(error => {
      console.log(error);
      alert("hubo un error, intenta de nuevo.");
    });
   });
}

// Formulario de contacto //
const bandeja = document.getElementById("serviciosForm");

if (bandeja) {
    bandeja.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = bandeja.nombre.value.trim();
    const email = bandeja.email.value.trim();
    const mensaje = bandeja.mensaje.value.trim();

    if (!nombre || !email || !mensaje) return;

    const formData = new FormData(bandeja);

    fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(formData).toString()
    })
  .then(() => {
    bandeja.reset();
    alert("¡Mensaje enviado!");
    })
  .catch(() => {
    alert("hubo un error, intenta de nuevo.");
    });
 });    
}

window.addEventListener('scroll', () => {
    if (document.body.classList.contains('menu-abierto')) return;
    const btn1 = document.querySelector('.btn-hamburguesa');

     if (window.scrollY > 100) {
        btn?.classList.add('scrolleando');
    } else {
        btn?.classList.remove('scrolleando');
    }
});