import { useState } from "react";
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginForm(){
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [show, setShow] = useState(false);

    const { login } = useAuth();
    const nav = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/"

    const onSubmit = (e) => {
        e.preventDefault();
        // Demo: “validación” mínima: email no vacío.
        if(!email.trim()){ alert("Ingresa tu correo"); return; }
        login({ email });// Simula inicio de sesión
        nav(from, { replace: true }); // Redirige (por ahora a Home)
    }

    return (
        <form className="form stack-3" onSubmit={onSubmit}>
            <div className="field">
                <label htmlFor="email">Correo</label>
                <div className="input-wrap">
                    <i className="fa fa-envelope" aria-hidden="true"></i>
                    <input 
                        id="email" type="email" required
                        placeholder="tucorreo@email.com"
                        value={email} onChange={e => setEmail(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="field">
                <label htmlFor="pass">Contraseña</label>
                <div className="input-wrap">
                    <i className="fa fa-lock" aria-hidden="true"></i>
                    <input 
                        id="email" 
                        type={show ? "text" : "password"} 
                        required
                        placeholder= "••••••••"
                        value={pass} onChange={e => setPass(e.target.value)}
                    />
                    <button type="button" className="icon-btn ghost" 
                        onClick={() => setShow(s=>!s)}
                        title={show?"Ocultar":"Mostrar"}
                    >
                        <i className={`fa ${show?'fa-eye-slash':'fa-eye'}`} aria-hidden="true"></i>
                    </button>
                </div>
            </div>

            <div className="cluster between">
                <label className="check">
                    <input type="checkbox" />Recordarme
                </label>
                <a className="muted" href="#/recuperar">¿Olvidaste tu contraseña?</a>
            </div>

            <button className="btn primary wide" type="submit">
                Entrar
            </button>
        </form>
    )
}