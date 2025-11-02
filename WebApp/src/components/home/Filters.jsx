export default function Filters({ value, onChange, onApply, onReset, options }) {
  const activeCount = [
    value.marca, value.anio, value.min, value.max, value.estado
  ].filter(Boolean).length;

  const handleChange = (key) => (e) => {
    onChange({ [key]: e.target.value });
  };

  return (
    <details className="filters">
      <summary>
        <span className="summary-left">
          <i className="fa fa-sliders" aria-hidden="true"></i>
          Filtros {activeCount ? <small className="badge">{activeCount}</small> : null}
        </span>
        <span className="summary-right">
          <span className="hint">toca para abrir/cerrar</span>
          <i className="fa fa-angle-down" aria-hidden="true"></i>
        </span>
      </summary>

      <div className="panel">
        <div className="filters-grid">
          {/* Marca */}
          <div className="field">
            <label htmlFor="f-marca">Marca</label>
            <div className="input-wrap">
              <i className="fa fa-car" aria-hidden="true"></i>
              <select id="f-marca" value={value.marca} onChange={handleChange("marca")}>
                <option value="">Todas</option>
                {options.marcas?.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Año */}
          <div className="field">
            <label htmlFor="f-anio">Año</label>
            <div className="input-wrap">
              <i className="fa fa-calendar" aria-hidden="true"></i>
              <select id="f-anio" value={value.anio} onChange={handleChange("anio")}>
                <option value="">Todos</option>
                {options.anios?.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          {/* Precio min */}
          <div className="field">
            <label htmlFor="f-min">Precio mín.</label>
            <div className="input-wrap">
              <i className="fa fa-usd" aria-hidden="true"></i>
              <input
                id="f-min" type="number" min="0" placeholder="Ej. 3000"
                value={value.min} onChange={handleChange("min")}
              />
            </div>
          </div>

          {/* Precio max */}
          <div className="field">
            <label htmlFor="f-max">Precio máx.</label>
            <div className="input-wrap">
              <i className="fa fa-usd" aria-hidden="true"></i>
              <input
                id="f-max" type="number" min="0" placeholder="Ej. 15000"
                value={value.max} onChange={handleChange("max")}
              />
            </div>
          </div>

          {/* Estado */}
          <div className="field">
            <label htmlFor="f-estado">Estado</label>
            <div className="input-wrap">
              <i className="fa fa-bolt" aria-hidden="true"></i>
              <select id="f-estado" value={value.estado} onChange={handleChange("estado")}>
                <option value="">Todos</option>
                <option value="activa">Activa</option>
                <option value="programada">Próxima</option>
                <option value="finalizada">Finalizada</option>
              </select>
            </div>
          </div>

          {/* Orden */}
          <div className="field">
            <label htmlFor="f-orden">Ordenar por</label>
            <div className="input-wrap">
              <i className="fa fa-sort-amount-desc" aria-hidden="true"></i>
              <select id="f-orden" value={value.orden} onChange={handleChange("orden")}>
                <option value="cierre">Cierre</option>
                <option value="puja">Puja</option>
                <option value="reciente">Más reciente</option>
              </select>
            </div>
          </div>
        </div>

        <div className="filters-actions">
          <button type="button" className="btn dark" onClick={onReset}>
            Limpiar
          </button>
          <button type="button" className="btn primary" onClick={onApply}>
            Aplicar
          </button>
        </div>
      </div>
    </details>
  );
}