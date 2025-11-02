import { useEffect, useRef, useState } from "react";
import './styles/header.css';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

export default function Header(){
  const [q, setQ] = useState("");  //  Estado de búsqueda 
  const {user, logout} = useAuth();  //  Estado de usuario (demo sin backend) null = no loggeado
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");  //  Tema: light o dark

    const headerRef = useRef(null);

    /* Manejar el glow del puntero */
    const onMove = (e) => {
        const el = headerRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;  // coordenada dentro del header
        const y = e.clientY - r.top;
        el.style.setProperty('--x', `${x}px`);
        el.style.setProperty('--y', `${y}px`);
    };
    const onEnter = () => headerRef.current?.classList.add('is-hovered');
    const onLeave = () => {
        const el = headerRef.current;
        if (!el) return;
        el.classList.remove('is-hovered');
        // mueve el halo fuera de vista cuando sales
        el.style.setProperty('--x', `-200px`);
        el.style.setProperty('--y', `-200px`);
    };



  // Aplicar clase al <html> cuando cambia el tema
  useEffect(()=>{
    const root = document.documentElement; // <html>
    root.classList.toggle("theme-dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

   
  // Funcion para buscar: solo prevenimos submit por ahora
  const onSubmitSearch = (e) => {
    e.preventDefault();
    // Aquí luego podrías navegar o filtrar resultados
    //window.dispatchEvent(new CustomEvent("global-search", { detail: q }));
  };


  // Toggle de tema, alternar entre light/dark
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <header
        ref={headerRef}
      className="site-header"
      role="banner"
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="container">
        <div className="brand">Car<span className="accent">Bid</span></div>

        <form className="search" role="search" onSubmit={onSubmitSearch} aria-label="Buscar subastas">
          <input
            type="search"
            placeholder="Buscar…"
            aria-label="Buscar"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
          />
          <button type="submit" className="icon-btn" aria-label="Buscar">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </form>

        <nav className="main-nav" aria-label="principal">
          <Link to="/">Inicio</Link>
          <Link to="/explorar">Explorar</Link>
          <Link to="/publicar">Publicar</Link>
    
          {/* Si hay user, muestra su nombre + botón de salir; si no, muestra Log In */}
          {user ? (
            <>
              <span className="navlink" aria-current="page">{user.name}</span>
              <button className="navlink" type="button" onClick={logout} title="Cerrar sesión">Salir</button>
            </>
          ) : (
            <Link className="navlink" to="/login">Log In</Link>
          )}

          <button
            className="icon-btn"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Cambiar a tema oscuro" : "Cambiar a tema claro"}
            aria-pressed={theme === "dark"}
            title={theme === "light" ? "Dark mode" : "Light mode"}
          >
            <i
              className={`fa ${theme === "light" ? "fa-moon-o" : "fa-sun-o"}`}
              aria-hidden="true"
            ></i>
          </button>
        </nav>
      </div>
    </header>
  );
}
