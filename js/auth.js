const usuarios = {
    maria : {
        contraseña: "usuario123" ,
        nombre: "Maria" ,
        perfil: "user"
    },
     admin: {
        contrasena: "admin123",
        nombre: "Administrador",
        perfil: "admin"
     }
};
  const opciones = {
user: ["Home", "Pedidos", "Pedidos Ingresados"],
admin: ["Home", "Productos", "Procesamiento de Pedido"]
        };

let intentos = Number(sessionStorage.getItem("intentos")) || 0;
let sesion = null;

try {
sesion = JSON.parse(sessionStorage.getItem("sesionSupergato"));
        } catch {
sesion = null;
        }

        const formulario = document.getElementById("formLogin");
const usuario = document.getElementById("usuario");
const contrasena = document.getElementById("contrasena");
const error = document.getElementById("mensajeError");
const contador = document.getElementById("contadorIntentos");
const boton = document.getElementById("btnIngresar");
const modal = document.getElementById("modalBloqueo");

function actualizarIntentos() {
    contador.textContent = intentos + " de 3 intentos";

    if (intentos >= 3) {
        boton.disabled = true;
        usuario.disabled = true;
        contrasena.disabled = true;
        modal.hidden = false;
    }
}

function registrarError(mensaje) {
    intentos++;
    sessionStorage.setItem("intentos", intentos);

    error.textContent = mensaje;
    contrasena.value = "";

    actualizarIntentos();
}

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    if (intentos >= 3) {
        modal.hidden = false;
        return;
    }

    const nombre = usuario.value.trim().toLowerCase();
    const clave = contrasena.value;

    if (!usuarios[nombre]) {
        registrarError("El usuario no existe.");
        return;
    }

    if (usuarios[nombre].contrasena !== clave) {
        registrarError("Contraseña incorrecta.");
        return;
    }
    
    intentos = 0;
    sessionStorage.setItem("intentos", "0");

    sesion = {
            usuario: nombre,
            nombre: usuarios[nombre].nombre,
            perfil: usuarios[nombre].perfil
    };

    sessionStorage.setItem(
            "sesionSupergato",
            JSON.stringify(sesion)
    );

    window.location.hash = "home";
    mostrarPantalla();
});

        document.getElementById("btnCerrarModal")
    .addEventListener("click", function() {
    modal.hidden = true;
});
        
function crearMenu() {
    const menu = document.getElementById("menuNavegacion");
    const footer = document.getElementById("menuFooter");

    menu.innerHTML = "";
    footer.innerHTML = "";

    opciones[sesion.perfil].forEach(function(pagina) {
        const id = pagina.toLowerCase().replaceAll(" ", "-");

        const enlace = document.createElement("button");
        enlace.textContent = pagina;
        enlace.addEventListener("click", function() {
            navegar(id);
        });
        menu.appendChild(enlace);

        const enlaceFooter = document.createElement("button");
        enlaceFooter.textContent = pagina;
        enlaceFooter.addEventListener("click", function() {
            navegar(id);
        });
        footer.appendChild(enlaceFooter);
    });
}

function navegar(pagina) {
    if (!sesion) {
        mostrarPantalla();
        return;
    }

    const permitidas = opciones[sesion.perfil].map(
            p => p.toLowerCase().replaceAll(" ", "-")
    );

    if (!permitidas.includes(pagina)) {
        alert("No tienes permiso para entrar a esta pagina.");
        return;
    }

    window.location.hash = pagina;
    mostrarPantalla();
}

function mostrarDashboard() {
    document.getElementById("pantallaLogin").hidden = true;
    document.getElementById("pantallaDashboard").hidden = false;
    document.getElementById("menuNavegacion").hidden = false;
    document.getElementById("cerrarSesion").hidden = false;
    document.getElementById("contenedor")
            .classList.add("logueado");

    document.getElementById("tipoPerfil").textContent =
            sesion.perfil === "admin" ? "Administrador" : "Usuario";

    crearMenu();

    let pagina = window.location.hash.substring(1) || "home";

    const permitidas = opciones[sesion.perfil].map(
            p => p.toLowerCase().replaceAll(" ", "-")
    );

    if (!permitidas.includes(pagina)) {
        pagina = "home";
        history.replaceState(null, "", "#home");
    }

    const tarjetas = document.getElementById("opcionesDashboard");
    const contenido = document.getElementById("contenidoVista");

    tarjetas.innerHTML = "";
    contenido.innerHTML = "";

    if (pagina === "home") {
        document.getElementById("saludo").textContent =
                "Bienvenido " + sesion.nombre;

        document.getElementById("descripcionPerfil").textContent =
                "Sistema de gestión de pedidos Supergato.";

        opciones[sesion.perfil].forEach(function(opcion) {
            if (opcion === "Home") return;

            const tarjeta = document.createElement("button");
            tarjeta.className = "tarjeta";

            const titulo = document.createElement("h3");
            titulo.textContent = opcion;

            const descripcion = document.createElement("p");
            descripcion.textContent = "Ingresar a " + opcion;

            tarjeta.appendChild(titulo);
            tarjeta.appendChild(descripcion);

            tarjeta.addEventListener("click", function() {
                navegar(opcion.toLowerCase().replaceAll(" ", "-"));
            });

            tarjetas.appendChild(tarjeta);
        });
    } else {
        const nombrePagina = opciones[sesion.perfil].find(
                p => p.toLowerCase().replaceAll(" ", "-") === pagina
        );

        document.getElementById("saludo").textContent = nombrePagina;
        document.getElementById("descripcionPerfil").textContent =
                "Supergato - Gestión de pedidos";
        
        const titulo = document.createElement("h2");
        titulo.textContent = nombrePagina;
        contenido.appendChild(titulo);
    }
}

function mostrarPantalla() {
    if (!sesion || !usuarios[sesion.usuario] ||
            usuarios[sesion.usuario].perfil !== sesion.perfil) {

        sesion = null;
        sessionStorage.removeItem("sesionSupergato");

        document.getElementById("pantallaLogin").hidden = false;
        document.getElementById("pantallaDashboard").hidden = true;
        document.getElementById("menuNavegacion").hidden = true;
        document.getElementById("cerrarSesion").hidden = true;
        document.getElementById("contenedor")
                .classList.remove("logueado");

        document.getElementById("tipoPerfil").textContent =
                "Uso interno";

        actualizarIntentos();
        return;
    }

    mostrarDashboard();
}

document.getElementById("cerrarSesion")
    .addEventListener("click", function() {
    sesion = null;
    sessionStorage.removeItem("sesionSupergato");

    usuario.value = "";
    contrasena.value = "";
    error.textContent = "";

    history.replaceState(null, "", window.location.pathname);
    mostrarPantalla();
});

        window.addEventListener("hashchange", mostrarPantalla);
        
mostrarPantalla();

    
    
    
