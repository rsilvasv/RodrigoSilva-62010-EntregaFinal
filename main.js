// Productos disponibles
let products = [];

async function fetchProducts() {
    try {
        const response = await fetch('data.json');
        products = await response.json();
        displayProducts(products);
        initApp();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}


// Clase Carrito de Compras
class CarritoDeCompras {
    constructor() {
        this.articulos = JSON.parse(localStorage.getItem('carrito')) || [];
    }

    agregarProducto(producto) {
        const productoExistente = this.articulos.find(prod => prod.id === producto.id);
        if (productoExistente) {
            productoExistente.quantity++;
        } else {
            producto.quantity = 1;
            this.articulos.push(producto);
        }
        this.guardarCarrito();
    }

    cambiarCantidad(id, cantidad) {
        const producto = this.articulos.find(prod => prod.id === id);
        if (producto) {
            producto.quantity += cantidad;
            if (producto.quantity <= 0) {
                this.eliminarProducto(id);
            }
            this.guardarCarrito();
        }
    }

    eliminarProducto(id) {
        this.articulos = this.articulos.filter(prod => prod.id !== id);
        this.guardarCarrito();
    }

    calcularTotal() {
        return this.articulos.reduce((total, producto) => total + producto.price * producto.quantity, 0);
    }

    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.articulos));
    }

    limpiarCarrito() {
        localStorage.removeItem('carrito');
        this.articulos = [];
    }
}

const miCarrito = new CarritoDeCompras();

// Mostrar productos
function displayProducts(productsToDisplay) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    productsToDisplay.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'col-md-4';
        productDiv.innerHTML = `
            <div class="card mb-4">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${formatCurrency(product.price)}</p>
                    <div class="button-container">
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">Agregar al carrito</button>
                        <button class="btn btn-info" onclick="showProductDetails(${product.id})" data-toggle="modal" data-target="#productModal">Información</button>
                    </div>
                </div>
            </div>
        `;
        productList.appendChild(productDiv);
    });
}

document.getElementById('openCart').addEventListener('click', function() {
    document.getElementById('carritoPanel').classList.add('active');
});
document.getElementById('closeCart').addEventListener('click', function() {
    document.getElementById('carritoPanel').classList.remove('active');
});

// Función para formatear currency
function formatCurrency(amount) {
    return amount.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    });
}

// Mostrar detalles del producto con Sweet Alert
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    
    Swal.fire({
        title: product.name,
        html: `
            <img src="${product.image}" class="img-fluid mb-3" alt="${product.name}">
            <p class="modal-detalle">${product.description}</p>
            <p><strong>Precio: ${formatCurrency(product.price)}</strong></p>
        `,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: 'Cerrar',
        customClass: {
            popup: 'animated fadeInDown'
        }
    });
}

// Agregar producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    miCarrito.agregarProducto(product);

    // Mostrar notificación
    Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: `${product.name} agregado al carrito`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    updateCart();
    updateCartCount();
}

// Actualizar contador del carrito
function updateCartCount() {
    const cartCount = miCarrito.articulos.reduce((total, product) => total + product.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}

// Actualizar carrito
function updateCart() {
    const cartList = document.getElementById('cart-list');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const finalizePurchaseBtn = document.getElementById('finalize-purchase-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');

    cartList.innerHTML = '';
    if (miCarrito.articulos.length === 0) {
        emptyCartMessage.style.display = 'block';
        finalizePurchaseBtn.style.display = 'none';
        clearCartBtn.style.display = 'none'; // Ocultar el botón "Vaciar Carrito"
    } else {
        emptyCartMessage.style.display = 'none';
        finalizePurchaseBtn.style.display = 'block';
        clearCartBtn.style.display = 'block'; // Mostrar el botón "Vaciar Carrito"
    }

    miCarrito.articulos.forEach(product => {
        const cartItem = document.createElement('div');
        cartItem.className = 'mb-2';
        cartItem.innerHTML = `
            <div class="test">
                <div>${product.name} - ${formatCurrency(product.price)} x ${product.quantity}</div>
                <div>
                    <button class="btn btn-secondary btn-sm btn-quantity" onclick="changeQuantity(${product.id}, -1)">-</button>
                    <button class="btn btn-secondary btn-sm btn-quantity" onclick="changeQuantity(${product.id}, 1)">+</button>
                    <button class="btn btn-danger btn-sm btn-remove" onclick="removeFromCart(${product.id})">Eliminar</button>
                </div>
            </div>
        `;
        cartList.appendChild(cartItem);
    });

    const totalPrice = miCarrito.calcularTotal();
    document.getElementById('total-price').innerText = formatCurrency(totalPrice);
}

//Funcion para vaciar carrito
function clearCart() {
    miCarrito.articulos = []; // Vaciar el carrito
    localStorage.removeItem('carrito');
    updateCart(); // Actualizar el carrito en la interfaz
}

// Cambiar cantidad de producto en el carrito
function changeQuantity(productId, amount) {
    miCarrito.cambiarCantidad(productId, amount);
    updateCart();
}

// Eliminar producto del carrito
function removeFromCart(productId) {
    miCarrito.eliminarProducto(productId);
    updateCart();
}


// PROCESO DE COMPRA
// Formulario de usuario
function showUserForm(totalPrice) {
    return Swal.fire({
        title: 'Complete su información',
        html: `
            <div class="swal2-form-group">
                <label for="swal-input1">Nombre:</label>
                <input type="text" id="swal-input1" class="swal2-input small-input" placeholder="Ej. Raul" value="">
            </div>
            <div class="swal2-form-group">
                <label for="swal-input2">Apellido:</label>
                <input type="text" id="swal-input2" class="swal2-input small-input" placeholder="Ej. Gonzalez" value="">
            </div>
            <div class="swal2-form-group">
                <label for="swal-input3">Email:</label>
                <input type="email" id="swal-input3" class="swal2-input small-input" placeholder="email@gmail.com" value="">
            </div>
        `,
        icon: 'info',
        focusConfirm: false,
        showCancelButton: true,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'animated fadeInDown'
        },
        preConfirm: () => {
            const firstName = document.getElementById('swal-input1').value;
            const lastName = document.getElementById('swal-input2').value;
            const email = document.getElementById('swal-input3').value;
            if (!firstName || !lastName || !email) {
                Swal.showValidationMessage('Por favor, completa todos los campos.');
                return false;
            }
            return { firstName, lastName, email };
        }
    });
}

// Formulario de pago con datos pre-completados
function showPaymentForm(totalPrice) {
    return Swal.fire({
        title: 'Elegir Modo de Pago',
        html: `
            <div class="swal2-form-group">
                <label for="payment-method">Método de Pago:</label>
                <select id="payment-method" class="swal2-input small-input">
                    <option value="card">Tarjeta de Crédito/Débito</option>
                    <option value="paypal">PayPal</option>
                </select>
            </div>
            <div id="payment-details" class="swal2-form-group">
                <label for="card-number">Número de Tarjeta:</label>
                <input type="text" id="card-number" class="swal2-input small-input" placeholder="Ej. 1234 5678 9012 3456" value="">
            </div>
            <div class="swal2-form-group">
                <label for="card-expiry">Fecha de Expiración:</label>
                <input type="text" id="card-expiry" class="swal2-input small-input" placeholder="MM/AA" value="">
            </div>
            <div class="swal2-form-group">
                <label for="card-cvc">CVC:</label>
                <input type="text" id="card-cvc" class="swal2-input small-input" placeholder="Ej.123" value="">
            </div>
            <p class="total-finalize">El monto total es: <strong>${totalPrice}</strong></p>
        `,
        icon: 'info',
        focusConfirm: false,
        showCancelButton: true,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'animated fadeInDown'
        },
        preConfirm: () => {
            const paymentMethod = document.getElementById('payment-method').value;
            let paymentDetails = {};
            if (paymentMethod === 'card') {
                const cardNumber = document.getElementById('card-number').value;
                const cardExpiry = document.getElementById('card-expiry').value;
                const cardCvc = document.getElementById('card-cvc').value;
                if (!cardNumber || !cardExpiry || !cardCvc) {
                    Swal.showValidationMessage('Por favor, completa todos los campos de la tarjeta.');
                    return false;
                }
                paymentDetails = { cardNumber, cardExpiry, cardCvc };
            } else {
                // Simulación de datos de PayPal
                paymentDetails = { paypalEmail: 'usuario@example.com' };
            }
            return { paymentMethod, paymentDetails };
        }
    });
}

// Finalizar compra
function finalizePurchase() {
    if (miCarrito.articulos.length > 0) {
        const totalPrice = document.getElementById('total-price').innerText;

        showUserForm(totalPrice).then((result) => {
            if (result.isConfirmed) {
                const { firstName, lastName, email } = result.value;
                
                showPaymentForm(totalPrice).then((paymentResult) => {
                    if (paymentResult.isConfirmed) {
                        const { paymentMethod, paymentDetails } = paymentResult.value;
                        
                        Swal.fire({
                            title: '¡Compra realizada con éxito! ¡Gracias por elegirnos!',
                            html: `<p>El monto total es: <strong>${totalPrice}</strong></p>`,
                            icon: 'success',
                            showConfirmButton: true,
                            confirmButtonText: 'Cerrar',
                            customClass: {
                                popup: 'animated fadeInDown'
                            }
                        }).then(() => {
                            miCarrito.limpiarCarrito();
                            updateCart();
                            updateCartCount();
                        });
                    }
                });
            }
        });
    }
}



//Integracion del data.json
document.addEventListener('DOMContentLoaded', fetchProducts);

document.addEventListener('DOMContentLoaded', initApp);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('category-filter').addEventListener('change', function() {
        const selectedCategory = this.value;
        filterProducts(selectedCategory);
    });
});

//Filtro de productos
let filteredGlobal = [];

const filteredNotEmptyEvent = new CustomEvent('filteredNotEmpty');

function filterProducts(category) {
    let filteredProducts = products;
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
        console.log(filteredProducts);
    }
    filteredGlobal = filteredProducts;
    console.log(filteredGlobal);

    
    if (filteredGlobal.length > 0) {
        document.dispatchEvent(filteredNotEmptyEvent);
        console.log(filteredNotEmptyEvent);
    }
}

document.addEventListener('filteredNotEmpty', function() {
    displayProducts(filteredGlobal);
});

// Inicializar aplicación
function initApp() {
    displayProducts(products);
    updateCart();
    updateCartCount();
}