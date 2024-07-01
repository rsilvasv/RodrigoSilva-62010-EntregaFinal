
// Productos disponibles
const products = [
    { id: 1, name: 'BioBizz', price: 1800, image: 'images/biobizz-light-mix.png', description: 'Light-Mix tiene como ingredientes principales turba, musgo de sphagnum y perlita. Mezclados juntos, estos componentes proporcionan un drenaje óptimo, lo cual es esencial para su uso con sistemas de riego automáticos.' },
    { id: 2, name: 'Champi Compost', price: 1300, image: 'images/champi-compost.png', description: 'El ChampiCompost GF es el sustrato que procede del cultivo del champiñón una vez recogida la producción. El compost post cultivo contiene gran variedad de materia orgánica y nutrientes útiles para su aplicación en la agricultura.' },
    { id: 3, name: 'Grotek', price: 20000, image: 'images/grotek.png', description: 'Blossom Blaster Pro de Grotek es un potente estimulador para la primera etapa de floración de las plantas de marihuana. Aporta una dosis exacta de Hierro, fosforo, nitrógeno, etc que harán que la planta desarrolle y aumente el número de brotes florales, aumentando así posteriormente la producción.' },
    { id: 4, name: 'Pot', price: 10000, image: 'images/pot-vege.png', description: 'Contiene los mejores componentes orgánicos y minerales en un solo producto. Éste hace que la planta se concentre especialmente en el desarrollo de ramas y brotes de gran robutez y vitalidad.' },
    { id: 5, name: 'RootHouse', price: 1800, image: 'images/roothouse.png', description: 'Las macetas Roots House cuentan con guías internas que evitan la estrangulación del sustrato y promueven el crecimiento explosivo de raíces. Su diseño incluye pequeñas aberturas que estimulan una poda aérea natural, mejorando el drenaje sin necesidad de leca.' },
    { id: 6, name: 'Santa Planta', price: 5000, image: 'images/santaplanta.png', description: 'La maceta geotextil Santa Planta ofrece una solución eficiente para el cultivo de plantas. Fabricada con material geotextil, proporciona un excelente drenaje y aireación para el desarrollo saludable de las raíces.' }
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

// Mostrar detalles del producto en el modal de Bootstrap
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    
    // Obtener elementos del modal
    const modalTitle = document.getElementById('productModalLabel');
    const modalBody = document.getElementById('body-render');
    
    // Actualizar contenido del modal
    modalTitle.textContent = product.name;
    modalBody.innerHTML = `
        <img src="${product.image}" class="img-fluid mb-3" alt="${product.name}">
        <p>${product.description}</p>
        <p><strong>Precio: $${product.price}</strong></p>
    `;
    
    // Mostrar el modal
    $('#productModal').modal('show');
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

document.addEventListener('DOMContentLoaded', initApp);