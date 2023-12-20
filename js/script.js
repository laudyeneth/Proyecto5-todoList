window.onload = function () {

    let id;
    const listado = document.getElementById('listado');
    const btnAgregar = document.getElementById("btnAgregar")
    let tareas = [];

    listado.addEventListener("click", eliminarTarea);
    listado.addEventListener("click", terminarTarea);
    
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
            imprimirHtml(llave,JSON.parse(valor));
        }
    }

    // funcion de agregar tarea 
    function imprimirHtml(id, tarea) {
        
        const elemento = `
                        <li id="elemento">
                        <button class="terminar" data-id="${id}">✔</button> 
                        <p>${tarea.completado ? (
                            `<span class='completa'>${tarea.valor}</span>`
                        ) : (
                            `<span class='incompleta'>${tarea.valor}</span>`
                        )}</p>
                        <button class="eliminar" data-id="${id}">--</button> 
                        </li>
                        `;
        listado.insertAdjacentHTML("beforeend", elemento);
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

}