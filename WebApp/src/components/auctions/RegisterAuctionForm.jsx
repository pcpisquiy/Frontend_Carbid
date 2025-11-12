import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');
if (!API) throw new Error('REACT_APP_API_URL no está definida');

export default function RegisterAuctionForm() {
  const { authFetch, user } = useAuth();
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);

  const [marcaId, setMarcaId] = useState('');
  const [modeloId, setModeloId] = useState('');
  const [transmisionId, setTransmisionId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [precio, setPrecio] = useState('');
  const [km, setKm] = useState('');
  const [estadoId, setEstadoId] = useState('1');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [fotos, setFotos] = useState(['']);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    authFetch(`${API}/api/brands`).then(r => r.json()).then(setMarcas).catch(console.error);
  }, [authFetch]);

  useEffect(() => {
    setModelos([]);
    setModeloId('');
    if (!marcaId) return;
    authFetch(`${API}/api/brands/${marcaId}/models`).then(r => r.json()).then(setModelos).catch(console.error);
  }, [marcaId, authFetch]);

  const addFoto = () => setFotos([...fotos, '']);
  const setFoto = (i, val) => {
    const copy = [...fotos];
    copy[i] = val;
    setFotos(copy);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const body = {
        Titulo: titulo.trim(),
        Id_Modelo: Number(modeloId),
        Id_Transmision: Number(transmisionId),
        Precio_Inicial: Number(precio),
        Kilometraje: km ? Number(km) : 0,
        Id_Estado: Number(estadoId) || 1,
        Fecha_Inicio: fechaInicio || null,
        Fecha_Fin: fechaFin || null,
        Usuario_Grabacion: user?.id || 1,
        Fotos: fotos.filter(f => f && f.trim() !== ''),
      };
      const res = await authFetch(`${API}/api/auctions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Error al registrar');
      setMsg(`✅ Subasta registrada (ID ${data.Id_Publicacion})`);
    } catch (e) {
      setMsg(`❌ ${e.message}`);
    }
  };

  return (
    <form onSubmit={onSubmit} className="auction-form">
      <h3>Registrar Subasta</h3>
      {msg && <p>{msg}</p>}

      <label>Marca</label>
      <select value={marcaId} onChange={(e)=>setMarcaId(e.target.value)} required>
        <option value="">Seleccione marca</option>
        {marcas.map(m => <option key={m.Id} value={m.Id}>{m.Descripcion}</option>)}
      </select>

      <label>Modelo</label>
      <select value={modeloId} onChange={(e)=>setModeloId(e.target.value)} required disabled={!marcaId}>
        <option value="">{marcaId ? 'Seleccione modelo' : 'Primero seleccione marca'}</option>
        {modelos.map(md => <option key={md.Id} value={md.Id}>{md.Descripcion} {md.Anio ? `(${md.Anio})` : ''}</option>)}
      </select>

      <label>Transmisión (Id)</label>
      <input value={transmisionId} onChange={(e)=>setTransmisionId(e.target.value)} placeholder="Ej. 1=Manual, 2=Automática" required />

      <label>Título</label>
      <input value={titulo} onChange={(e)=>setTitulo(e.target.value)} required />

      <label>Precio inicial</label>
      <input type="number" value={precio} onChange={(e)=>setPrecio(e.target.value)} required />

      <label>Kilometraje</label>
      <input type="number" value={km} onChange={(e)=>setKm(e.target.value)} />

      <label>Estado (Id)</label>
      <input type="number" value={estadoId} onChange={(e)=>setEstadoId(e.target.value)} />

      <label>Fecha inicio</label>
      <input type="date" value={fechaInicio} onChange={(e)=>setFechaInicio(e.target.value)} />

      <label>Fecha fin</label>
      <input type="date" value={fechaFin} onChange={(e)=>setFechaFin(e.target.value)} />

      <h4>Fotos</h4>
      {fotos.map((f,i)=>(
        <input key={i} placeholder="URL de imagen" value={f} onChange={(e)=>setFoto(i,e.target.value)} />
      ))}
      <button type="button" onClick={addFoto}>+ Agregar foto</button>

      <button type="submit">Guardar</button>
    </form>
  );
}
