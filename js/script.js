window.onload = function () {

    let id;
    const listado = document.getElementById('listado');
    const btnAgregar = document.getElementById("btnAgregar")
    let tareas = [];

    listado.addEventListener("click", eliminarTarea);
    listado.addEventListener("click", terminarTarea);
    listado.addEventListener("click", editarTarea);
    listado.addEventListener("click", cancelarEditar);
    listado.addEventListener("click", guardarEdicionTarea);
    
    //se inicializa id y se carga datos de localStorage
    if (localStorage.length === 0) {
        id= 0;
    } 
    else{
        id=localStorage.length;
        cargarLista();
    }

    function cargarLista() {
        let arrayLocalS= Object.entries(localStorage);//entries: tranforma un objeto en arreglo

        //limpia el html
        while (listado.firstChild) {//mietras tenga elementos
            listado.removeChild(listado.firstChild); //remueve el primero q encuentra
        }        

        //Envia los datos del storage a la funcion
        for (const [llave, valor] of arrayLocalS) { 
            imprimirHtml(llave,valor);
        }
    }

    // funcion de agregar tarea 
    function imprimirHtml(id, tarea) {

        try {
            tarea=JSON.parse(tarea)
        } catch (error) {
            console.log("tarea no es JSON " + tarea + error)
        }

        if(tarea.valor) {
            const elemento = `
                            <li id="elemento">
                            
                                <p>${tarea.completado ? (
                                    `<span class='completa' id="valor${id}">${tarea.valor}</span>`
                                ) : (
                                    `<span class='incompleta' id="valor${id}">${tarea.valor}</span>`
                                )}</p>
                               
                                <button class="terminar" id="btn-terminar${id}" data-id="${id}">✓</button> 
                                <button class="eliminar" id="btn-eliminar${id}" data-id="${id}">—</button>
                                <button class="editar" id="btn-editar${id}" data-id="${id}">Editar</button>

                                <form id="formedit${id}" class="oculto">
                                    <input type="text" id="nuevovalor${id}" data-id="${id}" value="${tarea.valor}" "/>
                                    <button class="guardar" data-id="${id}">Guardar</button>
                                    <button class="cancelar" data-id="${id}" type="button">Cancelar</button>
                                </form>
                            </li>
                            `;
            listado.insertAdjacentHTML("beforeend", elemento);
        }
    }
    
    btnAgregar.onclick = function () {
        
        const tarea = { valor: "", completado: false };
        tarea.valor = document.getElementById("tarea").value
        tarea.completado = false;

        if(tarea.valor.trim() ==="") {
            alert("No se agrego una tarea");
            return;
        }

        //agregar al localStorage
        localStorage.setItem(
            id,
            JSON.stringify(tarea)
        );	//Adiciona item a localStorage
        //
        imprimirHtml(id, tarea);
        id++; 	
        document.getElementById("tarea").value = '';	
    }

    function eliminarTarea(e) {
        if (e.target.classList.contains("eliminar")) {
            const tareaID = Number(e.target.getAttribute("data-id"));
            //eliminamos con el array method filter
            localStorage.removeItem(tareaID);
            cargarLista();
        }
    }

    //terminar tarea
    function terminarTarea(e) {

        if (e.target.classList.contains("terminar")) {

            const tareaID = Number(e.target.getAttribute("data-id"));

            let tareaObtenida = JSON.parse(localStorage.getItem(tareaID));
            tareaObtenida.completado = !tareaObtenida.completado;
            localStorage.setItem(tareaID,JSON.stringify(tareaObtenida));

            cargarLista();
        }
    }

    //editar tarea
    function editarTarea(e) {
        if (e.target.classList.contains("editar")) {
            const tareaID = Number(e.target.getAttribute("data-id"));

            ocultarMostrarBotones(tareaID, true)
            // muestra formulario de edición de tarea
            const elemento = document.getElementById('formedit' + tareaID);
            elemento.className="disponible"
        }
    }

    // cancelar edicion
    function cancelarEditar(e) {
        if (e.target.classList.contains("cancelar")) {
            const tareaID = Number(e.target.getAttribute("data-id"));

            ocultarMostrarBotones(tareaID, false)
            // oculta formulario de edición de tarea
            const elemento = document.getElementById('formedit' + tareaID);
            elemento.className="oculto"
            cargarLista();
        }
    }

    function guardarEdicionTarea(e) {
        if (e.target.classList.contains("guardar")) {
            const tareaID = Number(e.target.getAttribute("data-id"));

            const nuevoValor = document.getElementById('nuevovalor' + tareaID);
    
            let tareaObtenida = JSON.parse(localStorage.getItem(tareaID));
            tareaObtenida.valor = nuevoValor.value;
            localStorage.setItem(tareaID,JSON.stringify(tareaObtenida));
    
            ocultarMostrarBotones(tareaID, false)
            // oculta formulario de edición de tarea
            const elemento = document.getElementById('formedit' + tareaID);
            elemento.className="oculto"        
            cargarLista();             
        }

    }

    function ocultarMostrarBotones(tareaID, ocultar) {

        let nombreClase = 'oculto'

        const btnTerminar = document.getElementById("btn-terminar" + tareaID);
        const btnEditar = document.getElementById("btn-editar" + tareaID);
        const btnEliminar = document.getElementById("btn-eliminar" + tareaID);
        const valor = document.getElementById("valor" + tareaID);
        if(ocultar) {
            btnTerminar.classList.add(nombreClase);
            btnEditar.classList.add(nombreClase);
            btnEliminar.classList.add(nombreClase);
            valor.classList.add(nombreClase);
        } else {
            btnTerminar.classList.remove(nombreClase);
            btnEditar.classList.remove(nombreClase);
            btnEliminar.classList.remove(nombreClase);
            valor.classList.remove(nombreClase);
        }
    }

}