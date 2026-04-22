let isAdmin = false;
const adminCode = "DAYANA654321"; // CAMBIA ESTO

/* ACTIVAR MODO ADMIN CON HOLD */
let pressTimer;

document.getElementById("logoAdmin").addEventListener("mousedown", () => {
    pressTimer = setTimeout(() => {
        let code = prompt("Código admin:");
        if(code === adminCode){
            isAdmin = true;
            document.getElementById("adminPanel").style.display = "block";
            alert("Modo admin activado");
        }else{
            alert("Código incorrecto");
        }
    }, 2000);
});

document.getElementById("logoAdmin").addEventListener("mouseup", () => {
    clearTimeout(pressTimer);
});

/* AGREGAR PRODUCTOS */
function addProduct(){
    if(!isAdmin) return;

    let nombre = document.getElementById("nombreProd").value;
    let precio = document.getElementById("precioProd").value;

    if(!nombre || !precio) return alert("Completa datos");

    let cont = document.querySelector("#prod .grid");

    let card = document.createElement("div");
    card.className = "card-prod";

    card.innerHTML = `
        <div class="img-placeholder"></div>
        <h4>${nombre}</h4>
        <span class="price">$${precio}</span>
        <button class="btn-ws" onclick="order('${nombre}')">Pedir</button>
    `;

    cont.appendChild(card);

    /* guardar en localStorage */
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.push({nombre, precio});
    localStorage.setItem("productos", JSON.stringify(productos));
}

/* CARGAR PRODUCTOS */
window.onload = () => {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let cont = document.querySelector("#prod .grid");

    productos.forEach(p => {
        let card = document.createElement("div");
        card.className = "card-prod";

        card.innerHTML = `
            <div class="img-placeholder"></div>
            <h4>${p.nombre}</h4>
            <span class="price">$${p.precio}</span>
            <button class="btn-ws" onclick="order('${p.nombre}')">Pedir</button>
        `;

        cont.appendChild(card);
    });
};