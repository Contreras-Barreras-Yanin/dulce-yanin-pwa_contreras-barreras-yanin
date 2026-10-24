// geolocalizacion.js - GPS del dispositivo + mapa (Leaflet) + ruta real (OSRM)
// El navegador SIEMPRE pide permiso. Solo funciona en https:// o localhost.

const SUCURSAL = {
  nombre: "Dulce Yanin, Repostería y pasteles",
  lat: 29.082258,
  lon: -110.948993,
};

// Haversine: distancia en linea recta (km), solo como respaldo si falla la ruta
function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const radioTierraKm = 6371;
  const aRadianes = (grados) => (grados * Math.PI) / 180;
  const dLat = aRadianes(lat2 - lat1);
  const dLon = aRadianes(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(lat1)) * Math.cos(aRadianes(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radioTierraKm * c;
}

// Pide a OSRM (gratis, sin API key) la ruta por calles. Devuelve null si falla.
async function obtenerRuta(origenLat, origenLon) {
  const url =
    "https://routing.openstreetmap.de/routed-car/route/v1/driving/" +
    `${origenLon},${origenLat};${SUCURSAL.lon},${SUCURSAL.lat}` +
    "?overview=full&geometries=geojson";
  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    if (datos.code !== "Ok") return null;
    const ruta = datos.routes[0];
    return {
      coords: ruta.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
      distanciaKm: ruta.distance / 1000,
      duracionMin: ruta.duration / 60,
    };
  } catch (error) {
    console.error("No se pudo calcular la ruta:", error);
    return null;
  }
}

let mapa;

function dibujarMapa(origenLat, origenLon, coordsRuta) {
  const contenedor = document.getElementById("mapa-ruta");
  contenedor.hidden = false;

  if (!mapa) {
    mapa = L.map(contenedor);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; colaboradores de OpenStreetMap",
      maxZoom: 19,
    }).addTo(mapa);
  } else {
    mapa.eachLayer((capa) => {
      if (capa instanceof L.Marker || capa instanceof L.Polyline) mapa.removeLayer(capa);
    });
  }

  const puntoUsuario = [origenLat, origenLon];
  const puntoSucursal = [SUCURSAL.lat, SUCURSAL.lon];

  L.marker(puntoUsuario).addTo(mapa).bindPopup("Tú estás aquí").openPopup();
  L.marker(puntoSucursal).addTo(mapa).bindPopup(SUCURSAL.nombre);

  const hayRuta = Array.isArray(coordsRuta) && coordsRuta.length > 0;
  const linea = hayRuta ? coordsRuta : [puntoUsuario, puntoSucursal];
  const estiloLinea = hayRuta
    ? { color: "#e85d93", weight: 5 }
    : { color: "#7c2d12", weight: 3, dashArray: "6 6" };

  L.polyline(linea, estiloLinea).addTo(mapa);
  mapa.fitBounds(L.latLngBounds([puntoUsuario, puntoSucursal]), { padding: [30, 30] });
  setTimeout(() => { mapa.invalidateSize(); mapa.fitBounds(L.latLngBounds([puntoUsuario, puntoSucursal]), { padding: [30, 30] }); }, 0);
}

document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("btn-ubicacion");
  const mensaje = document.getElementById("ubicacion-mensaje");

  boton.addEventListener("click", () => {
    if (!("geolocation" in navigator)) {
      mensaje.textContent = "Este dispositivo no reporta ubicación.";
      return;
    }
    mensaje.textContent = "Buscando tu ubicación…";

    navigator.geolocation.getCurrentPosition(
      async (posicion) => {
        const { latitude, longitude } = posicion.coords;
        const mapaUrl = `https://www.openstreetmap.org/directions?from=${latitude}%2C${longitude}&to=${SUCURSAL.lat}%2C${SUCURSAL.lon}`;

        mensaje.textContent = "Calculando la ruta hasta la sucursal…";
        const ruta = await obtenerRuta(latitude, longitude);
        dibujarMapa(latitude, longitude, ruta ? ruta.coords : null);

        if (ruta) {
          mensaje.innerHTML =
            `Ruta hasta Dulce Yanin: <strong>${ruta.distanciaKm.toFixed(1)} km</strong> · ` +
            `~${Math.round(ruta.duracionMin)} min en auto. ` +
            `<a href="${mapaUrl}" target="_blank" rel="noopener">Abrir en el mapa</a>`;
        } else {
          const distanciaKm = calcularDistanciaKm(latitude, longitude, SUCURSAL.lat, SUCURSAL.lon);
          mensaje.innerHTML =
            `No se pudo calcular la ruta por calles; línea recta de ` +
            `<strong>${distanciaKm.toFixed(1)} km</strong> hasta Dulce Yanin. ` +
            `<a href="${mapaUrl}" target="_blank" rel="noopener">Abrir en el mapa</a>`;
        }
      },
      (error) => {
        mensaje.textContent = "No se pudo obtener tu ubicación: " + error.message;
      }
    );
  });
});