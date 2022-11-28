const productos = document.getElementById("productos");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const fragment = document.createDocumentFragment();
const templateProductos = document.getElementById("template-productos").content
const templateItems = document.getElementById("template-items").content
const templateFooter = document.getElementById("template-footer").content

let carrito = {};
let data = [];
let personajes = {};
let api = [];
let charactersList = [];

document.addEventListener('DOMContentLoaded', e => { fetchData() })
document.addEventListener('click', e => { agregarCarrito(e) })
document.addEventListener('click', e => { eliminarPersonaje(e) })
document.addEventListener('click', e => { editarPersonaje(e) })
document.addEventListener('click', e => { guardarPersonaje(e) })

function isAllComplete(id, nombre, imagen, precio) {

    if (!id.trim()) {
        alert('Completa la Id')
        return false;
    }

    if (!nombre.trim()) {
        alert('Completa el nombre')
        return false;
    }
    if (!imagen.trim()) {
        alert('Completa la url de la imagen')
        return false;
    }
    if (!precio.trim()) {
        alert('Completa el precio')
        return false;
    }

    return true;
}

function isPositiveNumber(name,number) {

    if (number>1) {
        alert("Numero no valido en "+name)
        return false;
    }

    return true;
}

items.addEventListener('click', e => { btnAgregarEliminarProductos(e) })

const editarPersonaje = (e) => {
    let personaje = charactersList.filter(element => element._id == e.target.dataset.id)[0];

    if (e.target.classList.contains('btn-primary')) {
        document.getElementById("id").value = personaje._id;
        document.getElementById("nombre").value = personaje.name;
        document.getElementById("imagen").value = personaje.imageUrl;
        document.getElementById("precio").value = personaje.precio;
    }
    e.stopPropagation();

}

const guardarPersonaje = (e) => {

    if (e.target.classList.contains('btn-success')) {
        const idPersonaje = document.getElementById("id").value;
        const nombrePersonaje = document.getElementById("nombre").value;
        const precioPesonaje = document.getElementById("precio").value;
        const imagenPersonaje = document.getElementById("imagen").value;
        if (!isAllComplete(idPersonaje, nombrePersonaje, imagenPersonaje, precioPesonaje)
        ||!isPositiveNumber(idPersonaje,"id")||!isPositiveNumber(precioPesonaje,"precio")) {
            return;
        }

        let personaje = charactersList.filter(
            element => element._id == idPersonaje
        );
        if (personaje.length == 0) {
            let personajeNuevo = {};
            personajeNuevo._id = idPersonaje;
            personajeNuevo.name = nombrePersonaje;
            personajeNuevo.imageUrl = imagenPersonaje;
            personajeNuevo.precio = precioPesonaje;
            charactersList.push(personajeNuevo);
            alert('Información guardada');
        } else {
            let personaje = charactersList.filter(
                element => element._id == idPersonaje
            )[0];
            personaje._id = idPersonaje;
            personaje.name = nombrePersonaje;
            personaje.imageUrl = imagenPersonaje;
            personaje.precio = precioPesonaje;
            let valueIndex = 0;
            charactersList.forEach((element, index) => {
                if (element._id == idPersonaje) {
                    valueIndex = index;
                }
            });
            alert('Información editada');
            charactersList[valueIndex] = personaje;
        }
        pintarCards(charactersList);
        limpiar();
    }

}

const fetchData = async () => {
    const res = await fetch('https://api.disneyapi.dev/characters');
    const data = await res.json();
    addPrice(data.data);


    for (let index = 0; index < 12; index++) {
        charactersList.push(data.data[index])
    }
    pintarCards(charactersList);
}

function random(max) {
    return Math.floor(Math.random() * max);
}

const addPrice = (data) => {

    data.forEach((character) => {
        const precio = random(200);
        character.precio = (precio);
    })

}

const pintarCards = data => {

    productos.innerHTML = '';
    Object.values(data).forEach((item) => {

        templateProductos.querySelector('h5').textContent = item.name;
        templateProductos.querySelector('span').textContent = item.precio;
        templateProductos.querySelector('img').setAttribute("src", item.imageUrl)
        templateProductos.querySelector('button').dataset.id = item._id;
        templateProductos.querySelector('.btn-danger').dataset.id = item._id;
        templateProductos.querySelector('.btn-primary').dataset.id = item._id;
        templateProductos.querySelector('h4').textContent = item._id;
        const clone = templateProductos.cloneNode(true);
        fragment.appendChild(clone);

    })
    productos.appendChild(fragment);
}


const limpiar = () => {
    document.getElementById("id").value = '';
    document.getElementById("nombre").value = '';
    document.getElementById("imagen").value = '';
    document.getElementById("precio").value = '';
}
const agregarCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        llenarCarro(e.target.parentElement)
    }
    e.stopPropagation();
}

const eliminarPersonaje = e => {
    if (e.target.classList.contains('btn-danger')) {
        charactersList = charactersList.filter(element => element._id != e.target.dataset.id);
        pintarCards(charactersList);
    }
    e.stopPropagation();
}

const llenarCarro = item => {
    const producto = {
        id: item.querySelector('button').dataset.id,
        precio: item.querySelector('span').textContent,
        titulo: item.querySelector('h5').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }
    carrito[producto.id] = { ...producto }
    pintarProductos();
}
const pintarProductos = () => {
    items.innerHTML = '';
    Object.values(carrito).forEach(producto => {
        templateItems.querySelector('th').textContent = producto.id;
        templateItems.querySelectorAll('td')[0].textContent = producto.titulo;
        templateItems.querySelectorAll('td')[1].textContent = producto.cantidad;
        templateItems.querySelector('span').textContent = producto.precio * producto.cantidad;
        templateItems.querySelector('.btn-info').dataset.id = producto.id;
        templateItems.querySelector('.btn-danger').dataset.id = producto.id;
        const clone = templateItems.cloneNode(true);
        fragment.append(clone);
    })
    items.appendChild(fragment);
    pintarFooter();
}

const pintarFooter = () => {
    footer.innerHTML = '';
    if (Object.values(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5"> No hay elementos en el carro de compra</th>
        `
        return
    }
    const cantidad_productos = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0);
    const valor_total = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0);
    templateFooter.querySelectorAll('td')[0].textContent = cantidad_productos;
    templateFooter.querySelectorAll('span')[0].textContent = valor_total;
    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);
    const boton = document.querySelector('#vaciar-todo');
    boton.addEventListener('click', () => {
        carrito = {}
        pintarProductos();
    })
}

const btnAgregarEliminarProductos = e => {
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++;
        carrito[e.target.dataset.id] = { ...producto }
        pintarProductos();
    }
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = { ...producto }
        }
        pintarProductos();
    }
}