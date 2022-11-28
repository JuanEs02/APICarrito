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

items.addEventListener('click', e => { btnAgregarEliminarProductos(e) })

const editarPersonaje = () => {

    const idPersonaje = document.getElementById("id").value;
    const nombrePersonaje = document.getElementById("nombre").value;
    const precioPesonaje = document.getElementById("precio").value;
    const imagenPersonaje = document.getElementById("imagen").value;

    personajes[parseInt(idP)-1].id = idP
    personajes[parseInt(idP)-1].name = nombre
    personajes[parseInt(idP)-1].image = imagen
    personajes[parseInt(idP)-1].precio = precio
    console.log(idP + nombre + imagen + precio);
    productos.innerHTML="";
    pintarCards();
    agregar.style.display= 'block';
    editar.style.display= 'none';
    limpiar();

}
const fetchData = async () => {
    const res = await fetch('https://api.disneyapi.dev/characters');
    const data = await res.json();
    addPrice(data.data);


    for (let index = 0; index < 12; index++) {
        charactersList.push(data.data[index])
    }

    console.log(charactersList);
    // crearPersonaje();
    pintarCards(charactersList);
}

function random(max) {
    return Math.floor(Math.random() * max);
}


const borrarPesonaje = () => {
    console.log('element');
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
        const clone = templateProductos.cloneNode(true);
        fragment.appendChild(clone);

    })
    productos.appendChild(fragment);
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
        console.log(charactersList);
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
