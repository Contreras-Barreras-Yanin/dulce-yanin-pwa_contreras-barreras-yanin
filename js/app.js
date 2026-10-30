// app.js - muestra el estado de conexion (el Service Worker se registra en index.html)

// navigator.onLine a veces dice "true" aunque no haya red (por ejemplo, con la casilla
// Offline de DevTools). Por eso, ademas de preguntarle al navegador, hacemos una
// peticion pequena y comprobamos si de verdad llega.
async function hayConexion() {
  if (!navigator.onLine) return false;
  try {
    await fetch("manifest.json?ping=" + Date.now(), { cache: "no-store" });
    return true;
  } catch (error) {
    return false;
  }
}

async function actualizarPildoraConexion() {
  const pildora = document.getElementById("estado-conexion");
  if (!pildora) return;
  if (await hayConexion()) {
    pildora.textContent = "conectado";
    pildora.classList.remove("sin-conexion");
  } else {
    pildora.textContent = "sin conexión";
    pildora.classList.add("sin-conexion");
  }
}

document.addEventListener("DOMContentLoaded", actualizarPildoraConexion);
window.addEventListener("online", actualizarPildoraConexion);
window.addEventListener("offline", actualizarPildoraConexion);