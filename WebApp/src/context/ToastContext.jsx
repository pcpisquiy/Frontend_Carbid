import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);

let idSeq = 1;

export function ToastProvider({ children, duration = 4000, maxToasts = 5 }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
    const tm = timers.current.get(id);
    if (tm) { clearTimeout(tm); timers.current.delete(id); }
  }, []);

  const push = useCallback((payload) => {
    const id = idSeq++;
    const t = { id, type: payload.type || "info", title: payload.title || "", message: payload.message || "" };
    setToasts(prev => {
      const next = [t, ...prev];
      return next.slice(0, maxToasts);
    });
    const tm = setTimeout(() => remove(id), payload.duration || duration);
    timers.current.set(id, tm);
    return id;
  }, [duration, maxToasts, remove]);

  const api = useMemo(() => ({
    push,
    info:  (m, title="") => push({ type: "info", message: m, title }),
    success:(m, title="") => push({ type: "success", message: m, title }),
    warn:  (m, title="") => push({ type: "warning", message: m, title }),
    error: (m, title="") => push({ type: "error", message: m, title }),
    removeAll: () => setToasts([]),
  }), [push]);

  useEffect(() => {
    // Exponer API global opcional para listeners (boot/errorToasts.js)
    window.__TOAST__ = api;
    return () => { if (window.__TOAST__ === api) delete window.__TOAST__; };
  }, [api]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastContainer toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}

function ToastContainer({ toasts, onClose }) {
  return (
    <div style={containerStyle}>
      {toasts.map(t => (
        <div key={t.id} style={{ ...toastStyle, ...typeStyle[t.type] }} role="status" aria-live="polite">
          <div style={{ fontWeight: 600, marginBottom: t.title ? 4 : 0 }}>{t.title || labelOf(t.type)}</div>
          {t.message && <div>{t.message}</div>}
          <button onClick={() => onClose(t.id)} style={btnStyle} aria-label="Cerrar">×</button>
        </div>
      ))}
    </div>
  );
}

const containerStyle = {
  position: "fixed",
  top: 12,
  right: 12,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  zIndex: 9999,
};

const toastStyle = {
  position: "relative",
  minWidth: 260,
  maxWidth: 360,
  padding: "10px 36px 10px 12px",
  borderRadius: 12,
  boxShadow: "0 6px 22px rgba(0,0,0,.18)",
  color: "#0b0b0b",
  background: "white",
  borderLeft: "6px solid #999",
};

const typeStyle = {
  info:    { borderLeftColor: "#0ea5e9" },
  success: { borderLeftColor: "#22c55e" },
  warning: { borderLeftColor: "#f59e0b" },
  error:   { borderLeftColor: "#ef4444" },
};

const btnStyle = {
  position: "absolute",
  top: 4,
  right: 6,
  border: "none",
  background: "transparent",
  fontSize: 18,
  cursor: "pointer",
  lineHeight: 1,
};

function labelOf(type) {
  switch(type) {
    case "success": return "Éxito";
    case "warning": return "Atención";
    case "error": return "Error";
    default: return "Aviso";
  }
}
