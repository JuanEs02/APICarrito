const productos = document.getElementById('productos')
const fragment = document.createDocumentFragment()
const templateProductos = document.getElementById("template-productos").content
let carrito = {}

document.addEventListener('DOMContentLoaded', e => { fetchData() })
productos.addEventListener('click', e=>{agregarCarro(e)})


const fetchData = async () => {
    const rest = await fetch('api.json')
    const data = await rest.json()
    pintarCards(data);
}

const pintarCards = data => {

    data.forEach(item => {
        templateProductos.querySelector('h5').textContent = item.titulo;
        templateProductos.querySelector('p').textContent = item.precio;
        templateProductos.querySelector('img').setAttribute("src", item.imagen)
        templateProductos.querySelector('button').dataset.id = item.id;
        const clone = templateProductos.cloneNode(true)
        fragment.appendChild(clone)
    })
    productos.appendChild(fragment)
}

const agregarCarro = e =>{
    llenarCarro(e.target.parentElement);
}

const llenarCarro = item =>{
    const producto = {
        id: item.querySelector('button').dataset.id,
        precio: item.querySelector('p').textContent,
        titulo: item.querySelector('h5').textContent,
        cantidad: 1
    }
    console.log(producto)
}