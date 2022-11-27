const productos = document.getElementById('productos')

const fetchData = async () =>{
    const rest = await fetch('api.json')
    const data = await rest.json()
}

const pintarCards = data =>{
    console.log(data);
}