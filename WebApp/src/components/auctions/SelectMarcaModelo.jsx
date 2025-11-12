import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";

/**
 * Componente DROP-IN para *reemplazar solamente* los campos de Marca y Modelo
 * manteniendo el diseño original (puedes pasar className de tus textfields).
 *
 * Props:
 *  - brandId, setBrandId   (estado externo de marca)
 *  - modelId, setModelId   (estado externo de modelo)
 *  - className             (clases para el <select>, ej: 'input input-dark')
 *  - disabled              (bool)
 *  - required              (bool, default true)
 */
export default function SelectMarcaModelo({
  brandId, setBrandId,
  modelId, setModelId,
  className = "input",
  disabled = false,
  required = true,
}) {
  const { authFetch } = useAuth();
  const API = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");
  if (!API) throw new Error("REACT_APP_API_URL no está definida");

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoadingBrands(true);
        const r = await authFetch(`${API}/api/brands`);
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error || "No se pudieron cargar las marcas");
        setBrands(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingBrands(false);
      }
    })();
  }, [authFetch]);

  useEffect(() => {
    setModels([]);
    if (!brandId) { setModelId && setModelId(""); return; }
    (async () => {
      try {
        setLoadingModels(true);
        const r = await authFetch(`${API}/api/brands/${brandId}/models`);
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error || "No se pudieron cargar los modelos");
        setModels(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingModels(false);
      }
    })();
  }, [brandId, authFetch, setModelId, API]);

  const brandOpts = useMemo(() => brands.map(b => ({ value: String(b.Id), label: b.Descripcion })), [brands]);
  const modelOpts = useMemo(() => models.map(m => ({ value: String(m.Id), label: `${m.Descripcion}${m.Anio ? " ("+m.Anio+")" : ""}` })), [models]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="field">
        <label htmlFor="brandSelect">Marca</label>
        <select
          id="brandSelect"
          className={className}
          value={brandId || ""}
          onChange={(e)=>setBrandId && setBrandId(e.target.value)}
          required={required}
          disabled={disabled || loadingBrands}
        >
          <option value="">{loadingBrands ? "Cargando marcas..." : "Seleccione marca"}</option>
          {brandOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {required && !brandId && <small className="help">Marca requerida</small>}
      </div>

      <div className="field">
        <label htmlFor="modelSelect">Modelo</label>
        <select
          id="modelSelect"
          className={className}
          value={modelId || ""}
          onChange={(e)=>setModelId && setModelId(e.target.value)}
          required={required}
          disabled={disabled || !brandId || loadingModels}
        >
          <option value="">
            {!brandId ? "Primero seleccione marca" : (loadingModels ? "Cargando modelos..." : "Seleccione modelo")}
          </option>
          {modelOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {required && !modelId && <small className="help">Modelo requerido</small>}
      </div>
    </div>
  );
}
