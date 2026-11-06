let filtro = document.getElementById("panel-filtros");
let reparaciones = JSON.parse(localStorage.getItem("reparaciones")) || [];
let tabla = document.getElementById('cuerpo-tabla-busqueda');
let boton = document.getElementById("btn-limpiar-filtros");

filtro.addEventListener("input", function() {
    let clienteNom = document.getElementById("filtro-nom").value;
    let telefono   = document.getElementById("filtro-tel").value;
    let id         = document.getElementById("filtro-id").value;
    let estado     = document.getElementById("filtro-estado").value;
    let fecha      = document.getElementById("filtro-fecha").value;

    renderizarTabla(clienteNom, telefono, id, estado, fecha); 
});

boton.addEventListener("click", function() {
    document.getElementById("filtro-nom").value = "";
    document.getElementById("filtro-id").value = "";
    document.getElementById("filtro-tel").value = "";
    document.getElementById("filtro-estado").value = "todos";
    document.getElementById("filtro-fecha").value = "";

    tabla.innerHTML = "";
});

function renderizarTabla(clienteNom = "", telefono = "", id = "", estado = "todos", fecha = "") {
    tabla.innerHTML = "";
    
    let fechaConCero = "";
    let fechaSinCero = "";

    if (fecha !== "") {
        let partes = fecha.split("-"); 
        if (partes.length === 3) {
            let anio = partes[0];
            let mes  = partes[1];
            let dia  = partes[2];

           
            fechaConCero = `${dia}/${mes}/${anio}`; 

      
            let diaNum = parseInt(dia, 10);
            let mesNum = parseInt(mes, 10);
            fechaSinCero = `${diaNum}/${mesNum}/${anio}`;
        }
    }

    reparaciones.forEach(function(rep) {
        let fila = document.createElement('tr');

        let coincideNom   = (clienteNom !== "") && rep.cliente.toLowerCase().includes(clienteNom.toLowerCase());
        let coincideTel   = (telefono !== "")   && rep.telefono.includes(telefono);
        let coincideId    = (id !== "")         && rep.id.toString().includes(id);
        
        
        let coincideFecha = (fecha !== "") && (
            rep.fechaEntrada.includes(fechaConCero) || 
            rep.fechaEntrada.includes(fechaSinCero) ||
            rep.fechaEntrada.includes(fecha)
        );

        let pasaTexto;

        if (clienteNom !== "" || telefono !== "" || id !== "" || fecha !== "") {
            pasaTexto = coincideNom || coincideTel || coincideId || coincideFecha;
        } else {
            pasaTexto = true;
        }

        let pasaEstado = (estado === "todos") || rep.estado.toLowerCase() === estado.toLowerCase();

        if (pasaTexto && pasaEstado) {

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
                    <td>${rep.fechaSalida || '-'}</td>
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
                    <td>${rep.fechaSalida || '-'}</td>
                    <td><button onclick="eliminarReparacion(${rep.id})">Eliminar</button></td>
                `;
            }
            tabla.appendChild(fila);
        }
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

    let clienteNom = document.getElementById("filtro-nom").value;
    let telefono   = document.getElementById("filtro-tel").value;
    let id         = document.getElementById("filtro-id").value;
    let estado     = document.getElementById("filtro-estado").value;
    let fecha      = document.getElementById("filtro-fecha").value;
    renderizarTabla(clienteNom, telefono, id, estado, fecha);
}

function eliminarReparacion(id1) {
    reparaciones = reparaciones.filter(function(rep) {
        return rep.id !== id1;
    });
    guardarEnLocalStorage();

    let clienteNom = document.getElementById("filtro-nom").value;
    let telefono   = document.getElementById("filtro-tel").value;
    let id         = document.getElementById("filtro-id").value;
    let estado     = document.getElementById("filtro-estado").value;
    let fecha      = document.getElementById("filtro-fecha").value;
    renderizarTabla(clienteNom, telefono, id, estado, fecha);
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

function guardarEnLocalStorage() {
    localStorage.setItem("reparaciones", JSON.stringify(reparaciones));
}