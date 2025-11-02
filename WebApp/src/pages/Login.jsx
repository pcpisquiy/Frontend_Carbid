import { useState  } from "react";
import AuthTabs from '../components/auth/AuthTabs';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import './styles/auth.css';

export default function Login() {
    // Tab activo: 'login' | 'register'
    const [tab, setTab] = useState('login');

    return (
        <main className="container auth">
            <section className="auth-card">
                <header className="auth-header">
                    <h1 id="authTitle">Bienvenido a Car<span className="accent">Bid</span></h1>
                    <p className="muted">Accede a tus subastas o crea tu cuenta.</p>
                </header>

                <AuthTabs tab={tab} setTab={setTab} />

                <div className="auth-body">
                    {tab === 'login' ? <LoginForm /> : <RegisterForm onSwitch={() => setTab('login')} />}
                </div>
            </section>
        </main>
    );
}