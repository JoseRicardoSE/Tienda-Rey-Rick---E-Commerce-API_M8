// Frontend - Tienda Rey Rick con JWT (HttpOnly Cookies)

const API_PRODUCTS = '/api/v1/products';
const API_CART = '/api/v1/cart';
const API_LOGIN = '/api/v1/auth/login';
const API_REGISTER = '/api/v1/auth/register';
const API_ME = '/api/v1/auth/me';
const API_LOGOUT = '/api/v1/auth/logout';

// Elementos UI
const authSection = document.getElementById('auth-section');
const toastEl = document.getElementById('toast');
const toastMensaje = document.getElementById('toast-mensaje');
let toast;
if (toastEl) {
  toast = new bootstrap.Toast(toastEl);
}

// Variables Globales
let listaProductos = [];
let miCarrito = null; // { id, userId, items: [] }
let usuarioActual = null;

// --- Helpers ---
function formatearPrecio(precio) {
  return '$' + Number(precio).toLocaleString('es-CL');
}

function mostrarToast(mensaje, esError) {
  if (!toast) return alert(mensaje);
  toastMensaje.textContent = mensaje;
  toastEl.classList.remove('text-bg-success', 'text-bg-danger');
  toastEl.classList.add(esError ? 'text-bg-danger' : 'text-bg-success');
  toast.show();
}

// --- Autenticación ---

async function checkAuth() {
  try {
    const res = await fetch(API_ME);
    if (res.ok) {
      const data = await res.json();
      usuarioActual = data.data; // Aquí viene el payload del token (id, email, etc.)
    } else {
      usuarioActual = null;
    }
  } catch (error) {
    usuarioActual = null;
  }
  renderAuthSection();
}

async function logout() {
  try {
    await fetch(API_LOGOUT, { method: 'POST' });
    window.location.href = '/';
  } catch (error) {
    mostrarToast("Error al cerrar sesión", true);
  }
}

function renderAuthSection() {
  if (usuarioActual) {
    if (authSection) {
      // Usamos el email como nombre ya que el payload por defecto solo trae id y email
      // Si el payload tiene fullName, se usa.
      const nombreMostrar = usuarioActual.fullName || usuarioActual.email;
      authSection.innerHTML = `
        <span class="me-2 fw-bold">Hola, ${nombreMostrar}</span>
        <button class="btn btn-outline-danger btn-sm" onclick="logout()">Salir</button>
      `;
    }
  } else {
    if (authSection) {
      authSection.innerHTML = `
        <a href="/login" class="btn btn-outline-primary btn-sm">Iniciar Sesión</a>
      `;
    }
  }
}

// --- Productos ---
async function obtenerProductos() {
  const contenedorProductos = document.getElementById('contenedor-productos');
  if (!contenedorProductos) return;

  try {
    const res = await fetch(API_PRODUCTS);
    const data = await res.json();
    listaProductos = data.data || [];
    mostrarProductos(listaProductos);
  } catch (error) {
    contenedorProductos.innerHTML = '<p class="text-danger">Error al cargar productos.</p>';
  }
}

function mostrarProductos(articulos) {
  const contenedorProductos = document.getElementById('contenedor-productos');
  if (!contenedorProductos) return;

  if (articulos.length === 0) {
    contenedorProductos.innerHTML = '<p class="col-12 text-center mt-5">No hay productos.</p>';
    return;
  }

  let html = '';
  for (const p of articulos) {
    const sinStock = p.stock === 0;
    html += `
      <div class="col-md-4 mb-4 d-flex">
        <div class="card h-100 w-100 border-0 shadow-sm">
          <img src="${p.imageUrl || 'https://dummyimage.com/300x250/ccc/000.png&text=Sin+Imagen'}" class="card-img-top rounded" alt="${p.name}" style="height: 250px; object-fit: contain; padding: 10px;">
          <div class="card-body d-flex flex-column text-center">
            <h5 class="card-title fw-bold text-dark fs-6">${p.name}</h5>
            <p class="mb-4 text-primary fw-bold">${formatearPrecio(p.price)} <br><small class="text-muted fw-normal">Stock: ${p.stock}</small></p>
            <button class="btn btn-dark btn-agregar mt-auto text-uppercase" data-id="${p.id}" ${sinStock ? 'disabled' : ''}>
              ${sinStock ? 'Agotado' : 'Añadir al carrito'}
            </button>
          </div>
        </div>
      </div>
    `;
  }
  contenedorProductos.innerHTML = html;
}

// --- Carrito ---
async function obtenerCarrito() {
  if (!usuarioActual) {
    actualizarUIcarrito();
    return;
  }

  try {
    const res = await fetch(API_CART);
    if (res.ok) {
      const data = await res.json();
      miCarrito = data.data;
      actualizarUIcarrito();
    } else {
      if(res.status === 401) logout();
    }
  } catch (error) {
    console.error("Error al obtener carrito", error);
  }
}

function actualizarUIcarrito() {
  // Global Navbar Counter
  const globalCounter = document.getElementById('contador-carrito-global');
  let totalItems = 0;
  if (miCarrito && miCarrito.items) {
    totalItems = miCarrito.items.reduce((acc, item) => acc + item.quantity, 0);
  }
  if (globalCounter) globalCounter.textContent = totalItems;

  // Cart Page
  const listaCarrito = document.getElementById('lista-carrito');
  const totalCarrito = document.getElementById('total-carrito');
  const btnComprar = document.getElementById('btn-comprar');
  const authWarning = document.getElementById('auth-warning');

  if (listaCarrito && totalCarrito && btnComprar) {
    if (!usuarioActual) {
      if (authWarning) authWarning.classList.remove('d-none');
      listaCarrito.innerHTML = '';
      return;
    }

    if (!miCarrito || !miCarrito.items || miCarrito.items.length === 0) {
      listaCarrito.innerHTML = '<li class="list-group-item text-center">Tu carrito está vacío</li>';
      totalCarrito.textContent = '$0';
      btnComprar.disabled = true;
      return;
    }

    btnComprar.disabled = false;
    let html = '';
    let total = 0;
    for (const item of miCarrito.items) {
      const p = item.product;
      const sub = Number(item.price) * item.quantity;
      total += sub;
      html += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <p class="mb-1 fw-bold">${p.name}</p>
            <small class="text-muted">${formatearPrecio(item.price)} x ${item.quantity}</small>
          </div>
          <div>
            <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${item.id}">Eliminar</button>
          </div>
        </li>
      `;
    }
    listaCarrito.innerHTML = html;
    totalCarrito.textContent = formatearPrecio(total);
  }
}

async function agregarAlCarrito(productId) {
  if (!usuarioActual) {
    mostrarToast('Inicia sesión para agregar productos', true);
    setTimeout(() => window.location.href = '/login', 2000);
    return;
  }

  try {
    const res = await fetch(`${API_CART}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity: 1 })
    });
    
    if (res.ok) {
      mostrarToast('Producto agregado al carrito', false);
      await obtenerCarrito();
    } else {
      const err = await res.json();
      mostrarToast(err.message || 'Error al agregar', true);
    }
  } catch (error) {
    mostrarToast('Error de conexión', true);
  }
}

async function eliminarDelCarrito(itemId) {
  try {
    const res = await fetch(`${API_CART}/items/${itemId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      mostrarToast('Producto eliminado', false);
      await obtenerCarrito();
    }
  } catch (error) {
    mostrarToast('Error al eliminar', true);
  }
}

async function checkout() {
  const btnComprar = document.getElementById('btn-comprar');
  if (btnComprar) btnComprar.disabled = true;

  try {
    const res = await fetch(`${API_CART}/checkout`, {
      method: 'POST'
    });
    const data = await res.json();

    if (res.ok) {
      mostrarToast(`Compra exitosa. Total pagado: ${formatearPrecio(data.data.total)}`, false);
      await obtenerCarrito();
    } else {
      mostrarToast(data.message || 'Error en la compra', true);
    }
  } catch (error) {
    mostrarToast('Error de conexión', true);
  } finally {
    if (btnComprar && miCarrito?.items?.length > 0) btnComprar.disabled = false;
  }
}

// --- Listeners de Formularios de Auth ---
const formLogin = document.getElementById('form-login');
if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const res = await fetch(API_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = '/';
      } else {
        mostrarToast(data.message, true);
      }
    } catch (err) {
      mostrarToast('Error de conexión', true);
    }
  });
}

const formRegister = document.getElementById('form-register');
if (formRegister) {
  formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      fullName: document.getElementById('reg-name').value,
      rut: document.getElementById('reg-rut').value,
      address: document.getElementById('reg-address').value,
      phone: document.getElementById('reg-phone').value,
      email: document.getElementById('reg-email').value,
      password: document.getElementById('reg-password').value,
    };

    try {
      const res = await fetch(API_REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        mostrarToast('Registro exitoso. Ahora inicia sesión.', false);
        document.getElementById('login-tab').click();
      } else {
        mostrarToast(data.message, true);
      }
    } catch (err) {
      mostrarToast('Error de conexión', true);
    }
  });
}

// --- Listeners Globales ---
document.addEventListener('click', (e) => {
  const btnAgregar = e.target.closest('.btn-agregar');
  if (btnAgregar) {
    agregarAlCarrito(btnAgregar.dataset.id);
  }

  const btnEliminar = e.target.closest('.btn-eliminar');
  if (btnEliminar) {
    eliminarDelCarrito(btnEliminar.dataset.id);
  }

  if (e.target.id === 'btn-comprar') {
    checkout();
  }
});

const inputBuscar = document.getElementById('buscar');
if (inputBuscar) {
  inputBuscar.addEventListener('input', () => {
    const texto = inputBuscar.value.toLowerCase();
    const filtrados = listaProductos.filter(p => p.name.toLowerCase().includes(texto));
    mostrarProductos(filtrados);
  });
}

// Inicialización Principal
async function init() {
  await checkAuth(); // Siempre verifica sesión primero
  await obtenerProductos();
  await obtenerCarrito();
}

init();
