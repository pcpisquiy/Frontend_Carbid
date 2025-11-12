export default function AuthTabs({ tab, setTab }){
    return (
        <div className="tabs" role="tablist">
            <button
                role="tab"
                className={`tab ${tab==='login' ? 'active' : ''}`}
                onClick={() => setTab('login')}
            >
                Iniciar sesión
            </button>
            <button
                role="tab"
                className={`tab ${tab==='register' ? 'active' : ''}`}
                onClick={() => setTab('register')}
            >
                Crear cuenta
            </button>
        </div>
    )
}