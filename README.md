# Aplicación simulador de Ecommerce

## Descripción
Esta es una aplicación web de carrito de compras hecha con JavaScript, HTML y CSS. 
Permite a los usuarios ver productos, agregarlos al carrito, cambiar cantidades, eliminarlos y finalizar la compra. 
El carrito se guarda en `localStorage` para que no se pierda al recargar la página.

## Funcionalidades
- **Carga de Productos:** Los productos se cargan desde un archivo `data.json`.
- **Agregar al Carrito:** Los usuarios pueden agregar productos al carrito.
- **Modificar Cantidades:** Se puede aumentar o disminuir la cantidad de productos en el carrito.
- **Eliminar Productos:** Se pueden eliminar productos del carrito.
- **Vaciar Carrito:** Se puede vaciar completamente el carrito de compras.
- **Ver Carrito:** El carrito se muestra en un panel desplegable.
- **Finalizar Compra:** Al finalizar, se completa un formulario con datos personales y se elige un método de pago.
- **Notificaciones:** Se usan notificaciones `Sweet Alert` para informar a los usuarios.
- **Filtrar Productos:** Los productos se pueden filtrar por categoría.

## Uso
1. **Carga de Productos:**
    - La aplicación carga los productos desde `data.json` cuando se inicia.
    - La función `fetchProducts` obtiene los datos y los muestra.

2. **Agregar al Carrito:**
    - Cada producto tiene un botón "Agregar al carrito" que llama a `addToCart(productId)`.
    - Aparece una notificación `Sweet Alert` al agregar un producto.

3. **Modificar Cantidades:**
    - En el carrito, cada producto tiene botones "+" y "-" para cambiar la cantidad.
    - Estos botones llaman a `changeQuantity(productId, amount)`.

4. **Eliminar Productos:**
    - En el carrito, cada producto tiene un botón "Eliminar" que llama a `removeFromCart(productId)`.

5. **Vaciar Carrito:**
    - Hay una opción para vaciar completamente el carrito llamando a `clearCart()`.

6. **Ver Carrito:**
    - El carrito se muestra en un panel desplegable al hacer clic en el ícono del carrito.
    - Se actualiza dinámicamente con `updateCart()`.

7. **Finalizar Compra:**
    - Al hacer clic en "Finalizar Compra", se abre un formulario `Sweet Alert` para completar la información personal.
    - Luego, se abre otro formulario para elegir el método de pago y completar los detalles.
    - Al confirmar, aparece un mensaje de éxito y el carrito se vacía.

8. **Filtrar Productos:**
    - Los productos se pueden filtrar por categoría usando un menú desplegable.
    - Al cambiar la categoría, se llama a `filterProducts(category)` y se actualiza la vista.

## GRACIAS!
Queria guardarme este espacio para agradecerles a mis profesores Nacho y David por esta cursada, sin ellos no pudiera haber realizado este proyecto.
Espero que disfruten de este simulador de ecommerce que me llevo muchas horas desarrollarlo!

Atte. Rodrigo
