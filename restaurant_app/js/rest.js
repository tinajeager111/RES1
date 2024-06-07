//crear selectores 

const btnGuardarCliente= document.querySelector('#guardar-cliente')
const contenido = document.querySelector('#resumen .contenido');

//crear la estructura 
let cliente = {
    mesa: "",
    hora: "",
    orden: []
}

const categorias= {
    1: "Pizzas",
    2: "Sushi",
    3: "Helados",
    4: "Ensaladas",
    5: "Cafe"
}

btnGuardarCliente.addEventListener('click', guardarCliente)


function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    const camposVacios = [mesa, hora].some(campo => campo == '');

    if(camposVacios){
    //caso en el que los campos estan vacios
    console.log('campos vacios')
    }else{
        console.log('campos llenos')

        cliente = {...cliente,mesa, hora}
       // console.log(cliente)

        var modalForm = document.querySelector('#formulario');
        var modal = bootstrap.Modal.getInstance(modalForm);

        modal.hide(); //ocultar ventana
        mostrarSecciones();
        obtenerMenu()
       
 
       
       // mostrarResumen();
     
       

    }
}


function mostrarSecciones (){
    const secciones = document.querySelectorAll('.d-none');
    secciones.forEach(seccion => seccion.classList.remove('d-none'));
}

function obtenerMenu (){
  
    const url = 'http://localhost:3000/menu';

    fetch(url)
    .then(respuesta => respuesta.json())
    .then(respuesta =>mostrarHTML(respuesta))
    .catch (error => console.log(error))
    

}

function mostrarHTML(menu){

    const contenido = document.querySelector('#menu .contenido');

 // Recorre el array de menú y crea los elementos HTML correspondientes
     menu.forEach(item => {
    const fila = document.createElement('div');
    fila.classList.add('row','border-top');

    const nombre = document.createElement('div');
    nombre.textContent = item.nombre;
        nombre.classList.add('col-md-2', 'py-3');

    const precio = document.createElement('div');
    precio.textContent = item.precio;
    precio.classList.add('col-md-2','py-3');


    const categoria = document.createElement('div');
    categoria.textContent = categorias [item.categoria];
    categoria.classList.add('col-md-3','py-3');

    const inputCantidad = document.createElement('input');
    inputCantidad.type = 'number';
    inputCantidad.min = 1;
    inputCantidad.value = 0;  
    inputCantidad.id = `producto-${item.id}`
    inputCantidad.onchange = function(){
        const cantidad = parseInt(inputCantidad.value);
       agregarOrden({...item, cantidad}); //para el momento de registrar no e pierda a orden anterior
    }
    //inputCantidad.classList.add('col-md-3', 'py-3');


    const agregar = document.createElement('div')
    agregar.classList.add('col-md-2', 'py-3')
        agregar.appendChild(inputCantidad)

    // Agrega los elementos creados al DOM

    fila.appendChild(nombre)
    fila.appendChild(precio)
    fila.appendChild(categoria)
 fila.appendChild(agregar)


    contenido.appendChild(fila);

    /*div.textContent = `${item.nombre} - ${item.precio} - ${item.categoria}`;
    contenido.appendChild(div);*/
  });
}

function agregarOrden(producto){
//console.log(producto)

let {orden} = cliente;
if (producto.cantidad >0){
    //validando que el producto este o exista 

    if (orden.some(item => item.id === producto.id)){
        //actualizar la cantidad
        const pedidoActualizado = orden.map(item=>{
            if(item.id === producto.id){
                item.cantidad = producto.cantidad;
            }
            return item;
        })
    
        cliente.orden = [...pedidoActualizado];
    }
    
    else{
        //caso en que no exista
        cliente.orden = [...orden, producto];
   
    
    }
   console.log(cliente.orden)
}
else{
    //cantidad sea igual a 0

    const resultado = orden.filter(item => item.id !== producto.id);
    cliente.orden = resultado;

    //console.log(cliente.orden)


}

limpiarHTML()

if(cliente.orden.length){
    //pedido existente
    actualizarResumen()
}

else{
    //pedido vacio
    console.log('pedido vacio')
}


}

function limpiarHTML(){

    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild)
    }

}

function actualizarResumen(){


  

    const resumen = document.createElement('div')
    //resumen.classList.add('col-md-6','card','py-2','px-3','shadow');

    //mostrar la mesa
    const mesa = document.createElement('p');
    mesa.textContent = `Mesa: ${cliente.mesa}`
    
    //mostrar la hora
    const hora = document.createElement('p');
    hora.textContent = `Hora: ${cliente.hora}`
    
    //mostrar los pedidos
    const titulo   = document.createElement('h2');
    titulo.textContent = 'Pedidos:';

    const agrupar = document.createElement('ul');
    const {orden} = cliente;

    orden.forEach(item => {
        const {nombre, precio, categoria, cantidad, id} = item  

        const lista = document.createElement('li');

    const nombre2 = document.createElement('p');
    nombre2.textContent = nombre;

    const precio2 = document.createElement('p');
    precio2.textContent = precio;

    const categoria2 = document.createElement('p');
    categoria2.textContent = categoria;

    const cantidad2 = document.createElement('p');
    nombre2.textContent = `Cantidad: ${cantidad}`;

    lista.appendChild(nombre2);
    lista.appendChild(precio2);
    lista.appendChild(categoria2);
    lista.appendChild(cantidad2);
    agrupar.appendChild(lista);

    })

    resumen.appendChild(agrupar);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(titulo);
    contenido.appendChild(resumen)


}