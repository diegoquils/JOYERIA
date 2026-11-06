let reparaciones = JSON.parse(localStorage.getItem("reparaciones")) || [];
let formulario = document.getElementById('formulario-reparacion');
let tabla = document.getElementById('tabla-reparaciones');
let idReparacionEditando = null;

renderizarTabla();

formulario.addEventListener('submit', function(event) {
    event.preventDefault();
    let clienteInput = document.getElementById('cliente').value;
    let telefonoInput = document.getElementById('telefono').value;
    let piezaInput = document.getElementById('pieza').value;
    let descripcionInput = document.getElementById('descripcion').value;
    let precioInput = document.getElementById('precio').value;  

    const nuevaReparacion = {
        id: Date.now(),
        cliente: clienteInput,
        telefono: telefonoInput,
        pieza: piezaInput,
        descripcion: descripcionInput,
        precio: precioInput,
        estado: "pendiente",
        fechaEntrada: new Date().toLocaleString('es-ES'),
        fechaSalida: "Aun sin salida"
    };
 
    reparaciones.push(nuevaReparacion);
    guardarEnLocalStorage();
    renderizarTabla();
    formulario.reset();
});

function renderizarTabla() {
    tabla.innerHTML = "";
    reparaciones.forEach(function(rep) {
        let fila = document.createElement('tr');
        if (rep.estado !== "entregado") {
            fila.innerHTML = `
                <td>${rep.id}</td>
                <td>${rep.cliente}</td>
                <td>${rep.telefono}</td>
                <td>${rep.pieza}</td>
                <td>${rep.descripcion}</td>
                <td>${rep.precio} €</td>
                <td>${rep.estado}</td>
                <td>${rep.fechaEntrada}</td>
                <td>${rep.fechaSalida}</td>
                <td><button onclick="cambiarEstado(${rep.id})">Entregar</button></td>
                <td><button onclick="eliminarReparacion(${rep.id})">Eliminar</button></td>
                <td><button onclick="editarReparacion(${rep.id})">Editar</button></td>
            `;
        } else {
            fila.innerHTML = `
                <td>${rep.id}</td>
                <td>${rep.cliente}</td>
                <td>${rep.telefono}</td>
                <td>${rep.pieza}</td>
                <td>${rep.descripcion}</td>
                <td>${rep.precio} €</td>
                <td>${rep.estado}</td>
                <td>${rep.fechaEntrada}</td>
                <td>${rep.fechaSalida}</td>
                <td><button onclick="eliminarReparacion(${rep.id})">Eliminar</button></td>
            `;
        }
        tabla.appendChild(fila);
    });
}

function cambiarEstado(id1) {
    reparaciones.forEach(function(rep) {
        if (rep.id == id1) {
            rep.estado = "entregado";
            rep.fechaSalida = new Date().toLocaleString('es-ES');
            guardarEnLocalStorage();
        }
    });
    renderizarTabla();
}

function eliminarReparacion(id1) {
    reparaciones = reparaciones.filter(function(rep) {
        return rep.id !== id1;
    });
    guardarEnLocalStorage();
    renderizarTabla();
}

function editarReparacion(id1) {
    idReparacionEditando = id1;

    let rep = reparaciones.find(function(item) {
        return item.id === id1;
    });
    
    document.getElementById('edit-cliente').value = rep.cliente;
    document.getElementById('edit-telefono').value = rep.telefono;
    document.getElementById('edit-pieza').value = rep.pieza;
    document.getElementById('edit-descripcion').value = rep.descripcion;
    document.getElementById('edit-precio').value = rep.precio;

    let modal = document.getElementById('modal-editar');
    modal.style.display = 'flex';
}

document.getElementById('formulario-editar').addEventListener('submit', function(event) {
    event.preventDefault();

    let clienteInput = document.getElementById('edit-cliente').value;
    let telefonoInput = document.getElementById('edit-telefono').value;
    let piezaInput = document.getElementById('edit-pieza').value;
    let descripcionInput = document.getElementById('edit-descripcion').value;
    let precioInput = document.getElementById('edit-precio').value;

    reparaciones.forEach(function(rep) {
        if (rep.id === idReparacionEditando) {
            rep.cliente = clienteInput;
            rep.telefono = telefonoInput;
            rep.pieza = piezaInput;
            rep.descripcion = descripcionInput;
            rep.precio = precioInput;
        }
    });

    guardarEnLocalStorage(); // 
    renderizarTabla();
    
    document.getElementById('modal-editar').style.display = 'none';
    idReparacionEditando = null;
});

function guardarEnLocalStorage() {
    localStorage.setItem("reparaciones", JSON.stringify(reparaciones)); // Corregido stringify
}