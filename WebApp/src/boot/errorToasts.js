// src/boot/errorToasts.js
// Muestra toasts automáticamente ante errores no capturados y promesas rechazadas.

window.addEventListener("error", (ev) => {
  const msg = ev?.error?.message || ev?.message || "Error no controlado";
  if (window.__TOAST__) window.__TOAST__.error(msg);
});

window.addEventListener("unhandledrejection", (ev) => {
  const msg = ev?.reason?.message || String(ev?.reason || "Promesa rechazada");
  if (window.__TOAST__) window.__TOAST__.error(msg);
});
