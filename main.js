
// Productos disponibles
const products = [
    { id: 1, name: 'BioBizz', price: 1800, image: 'images/biobizz-light-mix.png', description: 'Tierra negra fértil para plantas' },
    { id: 2, name: 'Champi Compost', price: 1300, image: 'images/champi-compost.png', description: 'Tierra arcillosa ideal para retener agua' },
    { id: 3, name: 'Grotek', price: 20000, image: 'images/grotek.png', description: 'Fertilizante químico para un crecimiento rápido de las plantas' },
    { id: 4, name: 'Pot', price: 10000, image: 'images/pot-vege.png', description: 'Fertilizante orgánico para mejorar la calidad del suelo' },
    { id: 5, name: 'RootHouse', price: 1800, image: 'images/roothouse.png', description: 'Maceta ideal para cultivos indoor' },
    { id: 6, name: 'Santa Planta', price: 5000, image: 'images/santaplanta.png', description: 'Maceta ideal para cultivos outdoor' }
];

// Carrito de compras
let cart = [];

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
                    <p class="card-text">$${product.price}</p>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Agregar</button>
                    <button class="btn btn-info" onclick="showProductDetails(${product.id})">Información</button>
                </div>
            </div>
        `;
        productList.appendChild(productDiv);
    });
}

// Mostrar detalles del producto
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    alert(`Nombre: ${product.name}\nDescripción: ${product.description}\nPrecio: $${product.price}`);
}

// Agregar producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCart();
    saveCart(); // Guardar automáticamente el carrito
}

// Actualizar carrito
function updateCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';
    cart.forEach((product, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'mb-2';
        cartItem.innerHTML = `
            <div>${product.name} - $${product.price} <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Eliminar</button></div>
        `;
        cartList.appendChild(cartItem);
    });
    const totalPrice = cart.reduce((total, product) => total + product.price, 0);
    document.getElementById('total-price').innerText = totalPrice;
}

// Eliminar producto del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    saveCart(); // Guardar automáticamente el carrito
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Cargar carrito desde localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Finalizar compra
function finalizePurchase() {
    if (cart.length > 0) {
        alert(`Compra finalizada. Total: $${document.getElementById('total-price').innerText}`);
        cart = [];
        updateCart();
        saveCart();
    } else {
        alert('El carrito está vacío.');
    }
}

// Inicializar aplicación
function initApp() {
    displayProducts();
    loadCart();
}

// Ejecutar al cargar la página
window.onload = initApp;