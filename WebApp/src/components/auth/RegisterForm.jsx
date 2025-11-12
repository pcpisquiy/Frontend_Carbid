import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API = (import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL || "http://localhost:8083").replace(/\/+$/, "");

export default function RegisterForm({ onSwitch }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [err, setErr] = useState('');
  const { login } = useAuth?.() || { login: null };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (pass !== pass2) { alert('Las contraseñas no coinciden.'); return; }

    const payload = {
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      password: pass,
    };

    try {
      const res = await fetch(`${API}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text();
        try {
          const j = JSON.parse(t);
          throw new Error(j?.error || j?.message || t);
        } catch {
          throw new Error(t);
        }
      }
      // opcional: auto-login
      if (login) {
        await login({ usuario: payload.username, password: payload.password });
      }
      if (onSwitch) onSwitch(); // o redirige al home
    } catch (e) {
      setErr(e.message || 'Error al registrar');
    }
  };

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h2>Crea tu cuenta</h2>

      {err ? <p style={{ color: 'tomato' }}>{err}</p> : null}

      <div className="field">
        <label htmlFor="name">Nombre</label>
        <div className="input-wrap">
          <i className="fa fa-user" aria-hidden="true"></i>
          <input id="name" type="text" required placeholder="Tu nombre"
            value={name} onChange={(e)=>setName(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="username">Usuario</label>
        <div className="input-wrap">
          <i className="fa fa-user-circle-o" aria-hidden="true"></i>
          <input id="username" type="text" required placeholder="usuario123"
            autoComplete="username" pattern="^[a-zA-Z0-9_]{3,16}$"
            title="3–16 caracteres: letras, números o _"
            value={username} onChange={(e)=>setUsername(e.target.value.toLowerCase())} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="email">Correo</label>
        <div className="input-wrap">
          <i className="fa fa-envelope" aria-hidden="true"></i>
          <input id="email" type="email" required placeholder="tucorreo@email.com"
            value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="pass">Contraseña</label>
        <div className="input-wrap">
          <i className="fa fa-lock" aria-hidden="true"></i>
          <input id="pass" type="password" required minLength={8}
            autoComplete="new-password" placeholder="••••••••"
            value={pass} onChange={(e)=>setPass(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="pass2">Repite contraseña</label>
        <div className="input-wrap">
          <i className="fa fa-lock" aria-hidden="true"></i>
          <input id="pass2" type="password" required minLength={8}
            autoComplete="new-password" placeholder="••••••••"
            value={pass2} onChange={(e)=>setPass2(e.target.value)} />
        </div>
      </div>

      <button className="btn primary wide" type="submit">Crear cuenta</button>
      <p className="muted" style={{ textAlign: 'center' }}>
        ¿Ya tienes cuenta?{' '}
        <button type="button" className="navlink" onClick={onSwitch}>Inicia sesión</button>
      </p>
    </form>
  );
}
