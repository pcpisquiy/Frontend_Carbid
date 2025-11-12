import { useMemo, useState,useEffect } from "react";
import PhotosUploader from "../components/publish/PhotosUploader";
import "./styles/publish.css";
import { useAuth } from "../context/AuthContext";
const currentYear = new Date().getFullYear();

export default function Publish(){
  // Estado del formulario
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(currentYear);
  const [km, setKm] = useState("");
  const [trans, setTrans] = useState('1'); // 1=Automática,2=Manual,3=CVT
  const [base, setBase] = useState("");
  const [startAt, setStartAt] = useState(""); // datetime-local
  const [endAt, setEndAt] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
// IDs y catálogos
const [brandId, setBrandId] = useState('');
const [modelId, setModelId] = useState('');
const [brands, setBrands] = useState([]);
const [models, setModels] = useState([]);
const { authFetch } = useAuth();
// Cargar marcas al montar
useEffect(() => {
  (async () => {
    const r = await authFetch(`${process.env.REACT_APP_API_URL.replace(/\/+$/,'')}/api/brands`);
    const data = await r.json();
    if (!r.ok) throw new Error(data?.error || 'No se pudieron cargar las marcas');
    setBrands(Array.isArray(data) ? data : []);
  })().catch(console.error);
}, [authFetch]);

// Cuando cambia la marca, cargar modelos y limpiar el modelo seleccionado
useEffect(() => {
  setModels([]);
  setModelId('');
  setModel(''); // si sigues guardando el nombre del modelo en "model"
  if (!brandId) { setBrand(''); return; }

  // Actualiza también el texto visible de "brand" si lo sigues usando
  const b = brands.find(x => String(x.Id) === String(brandId));
  setBrand(b?.Descripcion || '');

  (async () => {
    const r = await authFetch(`${process.env.REACT_APP_API_URL.replace(/\/+$/,'')}/api/brands/${brandId}/models`);
    const data = await r.json();
    if (!r.ok) throw new Error(data?.error || 'No se pudieron cargar los modelos');
    setModels(Array.isArray(data) ? data : []);
  })().catch(console.error);
}, [brandId, brands, authFetch, setBrand, setModel]);

  // Validaciones simples
  const errors = useMemo(()=>{
    const e = {};
    const y = Number(year);
    const k = Number(km);
    const b = Number(base);
    if (!title.trim()) e.title = "Título requerido";
    if (!brandId.trim()) e.brand = "Marca requerida";
    if (!modelId.trim()) e.model = "Modelo requerido";
    if (!y || y < 1980 || y > currentYear + 1) e.year = "Año inválido";
    if (k < 0) e.km = "Kilometraje inválido";
    if (!b || b < 100) e.base = "Precio base mínimo 100";
    if (!startAt) e.startAt = "Fecha de inicio requerida";
    if (!endAt) e.endAt = "Fecha de cierre requerida";
    if (startAt && endAt && new Date(startAt) >= new Date(endAt)) e.endAt = "El cierre debe ser después del inicio";
    return e;
  }, [title, brandId, modelId, year, km, base, startAt, endAt]);

  const isValid = Object.keys(errors).length === 0;

const onSubmit = async (e) => {
  e.preventDefault();
  // if (!isValid) {
  //   alert("Revisa los campos resaltados.");
  //   return;
  // }

  try {
    setIsSubmitting(true);
    // Si usas Vite, puedes configurar VITE_API_URL=http://localhost:3000 en .env
    const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/+$/,'');
    const tokenJWT = localStorage.getItem("token"); // ajusta si lo guardas con otra clave

    const fd = new FormData();
    fd.append("Titulo", title.trim());
    fd.append("Id_Modelo", modelId.trim());
    fd.append("Kilometraje", Number(km || 0));
    fd.append('Id_Transmision', trans); // "Automática" | "Manual" | "CVT"
    fd.append("Precio_Inicial", Number(base));
    fd.append("Fecha_Inicio", new Date(startAt).toISOString()); // del input datetime-local
    fd.append("Fecha_Fin", new Date(endAt).toISOString());
    fd.append("brand", brandId.trim());
    fd.append("year", Number(year));
    fd.append("description", desc.trim());

    // Adjunta solo File/Blob reales; ignora strings (urls previas)
    files.forEach((f) => {
      if (f instanceof File || f instanceof Blob) {
        fd.append("images", f);
      }
    });

    const res = await fetch(`${API_BASE}/api/auctions`, {
      method: "POST",
      headers: {
        ...(tokenJWT ? { Authorization: `Bearer ${tokenJWT}` } : {}),
        // NO pongas Content-Type; el navegador lo pone con boundary
      },
      body: fd,
    });

    const data = await res.json();
    if (!res.ok) {
      // el backend devuelve { error } o { errors: [...] }
      const msg =
        data?.error ||
        (Array.isArray(data?.errors)
          ? data.errors.map((e) => e.msg || e.param || e).join(", ")
          : "No se pudo publicar");
      throw new Error(msg);
    }

    console.log("Subasta creada:", data);
    alert("¡Subasta creada con éxito!");
    // TODO: redirige al detalle si tienes ruta, ej.:
    // navigate(`/auctions/${data.id}`);
    // o resetea el formulario:
    setTitle("");
    setBrand("");
    setModel("");
    setYear(currentYear);
    setKm("");
    setTrans("Automática");
    setBase("");
    setStartAt("");
    setEndAt("");
    setDesc("");
    setFiles([]);
  } catch (err) {
    console.error(err);
    alert("Error: " + (err.message || "No se pudo publicar"));
  } finally {
    setIsSubmitting(false);
  }
};

  // Info para el resumen
  const duracion = useMemo(()=>{
    if(!startAt || !endAt) return null;
    const ms = new Date(endAt) - new Date(startAt);
    if (ms <= 0) return "Fechas inválidas";
    const h = Math.round(ms/36e5);
    return h < 24 ? `${h} h` : `${(h/24).toFixed(1)} d`;
  }, [startAt, endAt]);

  return (
    <main className="publish">
      <div className="publish-grid">
        {/* Columna izquierda: formulario */}
        <section className="surface">
          <header className="stack-3">
            <h1>Publicar vehículo</h1>
            <p className="muted">Completa los campos y añade fotos. Esta es una simulación sin backend.</p>
          </header>

          <form className="form stack-4" onSubmit={onSubmit} noValidate>
            {/* Título */}
            <div className="field">
              <label htmlFor="title">Título</label>
              <div className="input-wrap">
                <i className="fa fa-pencil" aria-hidden="true"></i>
                <input
                  id="title" type="text" required placeholder="Ej. Toyota Corolla SE 2018"
                  value={title} onChange={e=>setTitle(e.target.value)}
                  aria-invalid={!!errors.title}
                />
              </div>
              {errors.title && <small role="alert" className="muted">{errors.title}</small>}
            </div>

            {/* Marca/Modelo/Año */}
           {/* Marca/Modelo/Año */}
<div className="cluster start" style={{gap: 'clamp(0.5rem, 2vw, 1rem)'}}>

  {/* Marca (select) */}
  <div className="field" style={{flex:1}}>
    <label htmlFor="brand">Marca</label>
    <div className="input-wrap">
      <i className="fa fa-car" aria-hidden="true"></i>
      <select
        id="brand"
        required
        className="input"          // mantiene tu look de input
        value={brandId}
        onChange={e => setBrandId(e.target.value)}
        aria-invalid={!!errors.brand}
      >
        <option value="">Seleccione marca</option>
        {brands.map(b => (
          <option key={b.Id} value={b.Id}>{b.Descripcion}</option>
        ))}
      </select>
    </div>
    {errors.brand && <small role="alert" className="muted">{errors.brand}</small>}
  </div>

  {/* Modelo (select dependiente) */}
  <div className="field" style={{flex:1}}>
    <label htmlFor="model">Modelo</label>
    <div className="input-wrap">
      <i className="fa fa-tag" aria-hidden="true"></i>
      <select
        id="model"
        required
        className="input"          // mantiene tu look de input
        value={modelId}
        onChange={e => {
          setModelId(e.target.value);
          const m = models.find(x => String(x.Id) === e.target.value);
          setModel(m?.Descripcion || ''); // si sigues usando "model" (texto)
        }}
        aria-invalid={!!errors.model}
        disabled={!brandId}
      >
        <option value="">
          {!brandId ? 'Primero seleccione marca' : 'Seleccione modelo'}
        </option>
        {models.map(m => (
          <option key={m.Id} value={String(m.Id)}>
            {m.Descripcion}{m.Anio ? ` (${m.Anio})` : ''}
          </option>
        ))}
      </select>
    </div>
    {errors.model && <small role="alert" className="muted">{errors.model}</small>}
  </div>

</div>


            {/* Kilometraje / Transmisión */}
            <div className="cluster" style={{gap: 'clamp(0.5rem, 2vw, 1rem)'}}>
              <div className="field" style={{flex:1}}>
                <label htmlFor="km">Kilometraje</label>
                <div className="input-wrap">
                  <i className="fa fa-tachometer" aria-hidden="true"></i>
                  <input id="km" type="number" min={0} placeholder="Ej. 58000"
                         value={km} onChange={e=>setKm(e.target.value)}
                         aria-invalid={!!errors.km} />
                </div>
                {errors.km && <small role="alert" className="muted">{errors.km}</small>}
              </div>

              <div className="field" style={{flex:1}}>
                <label htmlFor="trans">Transmisión</label>
                <div className="input-wrap">
                  <i className="fa fa-cogs" aria-hidden="true"></i>
                  <select id="trans" value={trans} onChange={e=>setTrans(e.target.value)}>
                    <option value="1">Automática</option>
                    <option value="2">Manual</option>
                    <option value="3">CVT</option>
                    <option>CVT</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Precio base */}
            <div className="field">
              <label htmlFor="base">Precio base (GTQ)</label>
              <div className="input-wrap">
                <i className="fa fa-quora" aria-hidden="true"></i>
                <input id="base" type="number" required min={100} step="50" placeholder="Ej. 5000"
                       value={base} onChange={e=>setBase(e.target.value)}
                       aria-invalid={!!errors.base} />
              </div>
              {errors.base && <small role="alert" className="muted">{errors.base}</small>}
            </div>

            {/* Fechas */}
            <div className="cluster" style={{gap: 'clamp(0.5rem, 2vw, 1rem)'}}>
              <div className="field" style={{flex:1}}>
                <label htmlFor="start">Inicio</label>
                <div className="input-wrap">
                  <i className="fa fa-clock-o" aria-hidden="true"></i>
                  <input id="start" type="datetime-local" required
                         value={startAt} onChange={e=>setStartAt(e.target.value)}
                         aria-invalid={!!errors.startAt} />
                </div>
                {errors.startAt && <small role="alert" className="muted">{errors.startAt}</small>}
              </div>

              <div className="field" style={{flex:1}}>
                <label htmlFor="end">Cierre</label>
                <div className="input-wrap">
                  <i className="fa fa-hourglass-end" aria-hidden="true"></i>
                  <input id="end" type="datetime-local" required
                         value={endAt} onChange={e=>setEndAt(e.target.value)}
                         aria-invalid={!!errors.endAt} />
                </div>
                {errors.endAt && <small role="alert" className="muted">{errors.endAt}</small>}
              </div>
            </div>

            {/* Descripción */}
            <div className="field">
              <label htmlFor="desc">Descripción</label>
              <div className="input-wrap">
                <i className="fa fa-align-left" aria-hidden="true"></i>
                <textarea id="desc" placeholder="Detalles, mantenimiento, extras..."
                          value={desc} onChange={e=>setDesc(e.target.value)} />
              </div>
            </div>

            {/* Uploader */}
            <div className="field">
              <label>Fotos</label>
              <PhotosUploader files={files} setFiles={setFiles} />
            </div>

            {/* Botón enviar */}
            <div className="cluster between">
              <span className="muted">Revisa antes de publicar</span>
              <button className="btn primary" type="submit">
                Publicar
              </button>
            </div>
          </form>
        </section>

        {/* Columna derecha: resumen */}
        <aside className="surface aside-sticky stack-3" aria-labelledby="sumTitle">
          <h2 id="sumTitle">Resumen</h2>
          <div className="cluster between">
            <span className="muted">Precio base</span>
            <strong>{base ? Number(base).toLocaleString("es-ES",{style:"currency",currency:"GTQ", maximumFractionDigits:0}) : "-"}</strong>
          </div>
          <div className="cluster between">
            <span className="muted">Duración</span>
            <strong>{duracion ?? "-"}</strong>
          </div>
          <div className="cluster between">
            <span className="muted">Fotos</span>
            <strong>{files.length}</strong>
          </div>
          <hr className="rule" />
          <div className="stack-3">
            <div className="muted">Titulo de subasta</div>
            <strong>{title || "Tu título aparecerá aquí"}</strong>
            <div className="muted">{brand && model ? `${brand} ${model} ${year || ""}` : "Marca y modelo"}</div>
          </div>
        </aside>
      </div>
    </main>
  );
}
