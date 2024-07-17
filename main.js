// Productos disponibles
const products = [
    { id: 1, name: 'BioBizz', price: 1800, image: 'images/biobizz-light-mix.png', description: 'Light-Mix tiene como ingredientes principales turba, musgo de sphagnum y perlita. Mezclados juntos, estos componentes proporcionan un drenaje óptimo, lo cual es esencial para su uso con sistemas de riego automáticos.' },
    { id: 2, name: 'Champi Compost', price: 1300, image: 'images/champi-compost.png', description: 'El ChampiCompost GF es el sustrato que procede del cultivo del champiñón una vez recogida la producción. El compost post cultivo contiene gran variedad de materia orgánica y nutrientes útiles para su aplicación en la agricultura.' },
    { id: 3, name: 'Grotek', price: 20000, image: 'images/grotek.png', description: 'Blossom Blaster Pro de Grotek es un potente estimulador para la primera etapa de floración de las plantas de marihuana. Aporta una dosis exacta de Hierro, fosforo, nitrógeno, etc que harán que la planta desarrolle y aumente el número de brotes florales, aumentando así posteriormente la producción.' },
    { id: 4, name: 'Pot', price: 10000, image: 'images/pot-vege.png', description: 'Contiene los mejores componentes orgánicos y minerales en un solo producto. Éste hace que la planta se concentre especialmente en el desarrollo de ramas y brotes de gran robutez y vitalidad.' },
    { id: 5, name: 'RootHouse', price: 1800, image: 'images/roothouse.png', description: 'Las macetas Roots House cuentan con guías internas que evitan la estrangulación del sustrato y promueven el crecimiento explosivo de raíces. Su diseño incluye pequeñas aberturas que estimulan una poda aérea natural, mejorando el drenaje sin necesidad de leca.' },
    { id: 6, name: 'Santa Planta', price: 5000, image: 'images/santaplanta.png', description: 'La maceta geotextil Santa Planta ofrece una solución eficiente para el cultivo de plantas. Fabricada con material geotextil, proporciona un excelente drenaje y aireación para el desarrollo saludable de las raíces.' }
];

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
function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'col-md-4';
        productDiv.innerHTML = `
            <div class="card mb-4">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${formatCurrency(product.price)}</p>
                    <div class="button-container">
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">Agregar</button>
                        <button class="btn btn-info" onclick="showProductDetails(${product.id})" data-toggle="modal" data-target="#productModal">Información</button>
                    </div>
                </div>
            </div>
        `;
        productList.appendChild(productDiv);
    });
}

// Función para formatear currency
function formatCurrency(amount) {
    return amount.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    });
}

// Mostrar detalles del producto en el modal de Bootstrap
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    const modalTitle = document.getElementById('productModalLabel');
    const modalBody = document.getElementById('body-render');

    modalTitle.textContent = product.name;
    modalBody.innerHTML = `
        <img src="${product.image}" class="img-fluid mb-3" alt="${product.name}">
        <p class="modal-detalle">${product.description}</p>
        <p><strong>Precio: ${formatCurrency(product.price)}</strong></p>
    `;
    $('#productModal').modal('show');
}

// Agregar producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    miCarrito.agregarProducto(product);
    updateCart();
}

// Actualizar carrito
function updateCart() {
    const cartList = document.getElementById('cart-list');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const finalizePurchaseBtn = document.getElementById('finalize-purchase-btn');

    cartList.innerHTML = '';
    if (miCarrito.articulos.length === 0) {
        emptyCartMessage.style.display = 'block';
        finalizePurchaseBtn.style.display = 'none';
    } else {
        emptyCartMessage.style.display = 'none';
        finalizePurchaseBtn.style.display = 'block';
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

// Finalizar compra
function finalizePurchase() {
    if (miCarrito.articulos.length > 0) {
        const totalPrice = document.getElementById('total-price').innerText;
        document.getElementById('finalize-modal-body').innerHTML = `¡Compra realizada con éxito! El monto total es: ${totalPrice}`;
        $('#finalizeModal').modal('show');
        miCarrito.limpiarCarrito();
        updateCart();
    }
}

// Inicializar aplicación
function initApp() {
    displayProducts();
    updateCart();
}

document.addEventListener('DOMContentLoaded', initApp);
