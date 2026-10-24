// notificaciones.js — Notification API (Dulce Yanin)
// Pide permiso al usuario y muestra avisos utiles: al activar, al agregar un
// producto al carrito y al sincronizar el carrito cuando vuelve el internet.

function mostrarNotificacion(titulo, cuerpo) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(titulo, { body: cuerpo, icon: "img/logo.jpg" });
  } catch (error) {
    console.error("No se pudo mostrar la notificacion:", error);
  }
}

// carrito.js llama a estas dos funciones
function notificarProductoAgregado(nombre) {
  mostrarNotificacion("Dulce Yanin", "Pedido agregado: " + nombre);
}

function notificarCarritoSincronizado() {
  mostrarNotificacion("Dulce Yanin", "Tu carrito se sincronizo correctamente.");
}

document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("btn-notificar");
  const mensaje = document.getElementById("notificaciones-mensaje");

  if (!("Notification" in window)) {
    mensaje.textContent = "Este navegador no soporta notificaciones.";
    return;
  }

  if (Notification.permission === "granted") {
    mensaje.textContent = "Notificaciones activadas.";
  }

  boton.addEventListener("click", () => {
    // Abre el dialogo del navegador (permitir / bloquear)
    Notification.requestPermission().then((permiso) => {
      if (permiso === "granted") {
        mensaje.textContent = "Notificaciones activadas.";
        mostrarNotificacion("Dulce Yanin", "Listo, te avisaremos cuando tu pedido se agregue.");
      } else {
        mensaje.textContent = "No diste permiso para notificaciones.";
      }
    });
  });
});