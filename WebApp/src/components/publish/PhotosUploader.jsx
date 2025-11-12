import { useRef } from "react";

export default function PhotosUploader({ files, setFiles, max = 8 }){
  const inputRef = useRef(null);

  const handleFiles = (list) => {
    const arr = Array.from(list);
    const next = [...files, ...arr].slice(0, max);
    setFiles(next);
  };

  const onInputChange = (e) => {
    if (e.target.files?.length) handleFiles(e.target.files);
    // reset para poder volver a elegir el mismo archivo
    e.target.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const onRemove = (i) => {
    const next = files.slice();
    next.splice(i, 1);
    setFiles(next);
  };

  return (
    <div className="uploader stack-3">
      <div
        className="dropzone"
        onDragOver={(e)=>e.preventDefault()}
        onDrop={onDrop}
        onClick={()=>inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e)=> (e.key==='Enter'||e.key===' ') && inputRef.current?.click()}
        aria-label="Agregar fotos"
      >
        <p>
          Arrastra y suelta tus fotos aquí o <strong>haz clic para seleccionar</strong> (máx. {max})
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={onInputChange}
        />
      </div>

      <div className="thumbs">
        {files.map((f, i) => {
          const src = typeof f === "string" ? f : URL.createObjectURL(f);
          return (
            <div className="thumb" key={i}>
              <img src={src} alt={`Foto ${i+1}`} />
              <button
                type="button"
                className="icon-btn remove"
                aria-label="Quitar foto"
                onClick={()=>onRemove(i)}
              >
                <i className="fa fa-trash" aria-hidden="true"></i>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
