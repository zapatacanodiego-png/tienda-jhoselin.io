// --- PROCESAMIENTO DE IMÁGENES ---
function leerImagen(input) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onloadend = function() {
        localStorage.setItem('tempImagen', reader.result);
    }
    if (file) { reader.readAsDataURL(file); }
}

// --- FUNCIONES DEL ADMINISTRADOR ---
function nuevoProducto() {
    let nombre = document.getElementById('nombreP').value;
    let precio = document.getElementById('precioP').value;
    let stock = document.getElementById('stockP').value;
    let imagen = localStorage.getItem('tempImagen') || "https://via.placeholder.com/150";

    if (nombre && precio && stock) {
        let productos = JSON.parse(localStorage.getItem('misProductos')) || [];
        productos.push({ nombre, precio, stock, imagen });
        localStorage.setItem('misProductos', JSON.stringify(productos));
        
        alert("¡Producto agregado a Jhoselin Boutique!");
        localStorage.removeItem('tempImagen');
        location.reload(); 
    } else {
        alert("Por favor, llena todos los campos.");
    }
}

function cargarProductosEnAdmin() {
    let productos = JSON.parse(localStorage.getItem('misProductos')) || [];
    let lista = document.getElementById('listaInventario');
    if (lista) {
        lista.innerHTML = "";
        productos.forEach((p, index) => {
            lista.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding:10px;">
                    <span><b>${p.nombre}</b> (Stock: ${p.stock}) - Bs. ${p.precio}</span>
                    <button onclick="eliminarProducto(${index})" style="background:#e74c3c; color:white; border:none; padding:5px; border-radius:5px;">Eliminar</button>
                </div>`;
        });
    }
}

function eliminarProducto(index) {
    if(confirm("¿Seguro que quieres eliminar este producto?")) {
        let productos = JSON.parse(localStorage.getItem('misProductos'));
        productos.splice(index, 1);
        localStorage.setItem('misProductos', JSON.stringify(productos));
        cargarProductosEnAdmin();
        // También recargamos la tienda si estuviera abierta
    }
}

function cargarPedidosAdmin() {
    let pedidos = JSON.parse(localStorage.getItem('misPedidos')) || [];
    let tabla = document.getElementById('cuerpoTabla');
    if (tabla) {
        tabla.innerHTML = "";
        pedidos.forEach((p, index) => {
            let esEntregado = p.estado === "Entregado";
            tabla.innerHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.producto}</td>
                    <td style="color: ${esEntregado ? 'green' : 'orange'}; font-weight: bold;">${p.estado}</td>
                    <td>
                        ${!esEntregado ? `<button onclick="marcarEntregado(${index})" style="background:#27ae60; color:white; border:none; padding:5px 10px; border-radius:5px;">Entregado</button>` : '✅'}
                    </td>
                </tr>`;
        });
    }
}

function marcarEntregado(index) {
    let pedidos = JSON.parse(localStorage.getItem('misPedidos'));
    pedidos[index].estado = "Entregado";
    localStorage.setItem('misPedidos', JSON.stringify(pedidos));
    cargarPedidosAdmin();
}

// --- FUNCIONES DEL CLIENTE ---
function cargarProductosTienda() {
    let productos = JSON.parse(localStorage.getItem('misProductos')) || [];
    let contenedor = document.getElementById('contenedorProductos');
    
    if (contenedor) {
        contenedor.innerHTML = ""; 
        productos.forEach(p => {
            contenedor.innerHTML += `
                <div class="tarjeta">
                    <img src="${p.imagen}" alt="ropa">
                    <h3>${p.nombre}</h3>
                    <p style="font-size:0.8rem; color:gray;">Disponibles: ${p.stock}</p>
                    <p style="font-weight:bold; color:#d4a373;">Bs. ${p.precio}</p>
                    <button class="btn-comprar" onclick="comprar('${p.nombre}')">Comprar</button>
                </div>`;
        });
    }
}

function comprar(nombreProducto) {
    let pedidos = JSON.parse(localStorage.getItem('misPedidos')) || [];
    pedidos.push({
        id: "#" + Math.floor(1000 + Math.random() * 9000),
        producto: nombreProducto,
        estado: "Pendiente"
    });
    localStorage.setItem('misPedidos', JSON.stringify(pedidos));
    alert("¡Pedido realizado!");
}
