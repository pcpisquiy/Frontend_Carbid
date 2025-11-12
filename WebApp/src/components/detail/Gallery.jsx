import { useState } from "react";

const ph = "/images/placeholder.jpg";
const API = (process.env.REACT_APP_API_URL || '').replace(/\/+$/,'');

export default function Gallery({ images = [] }){
    const norm = images.length ? images : [ph];
    const [idx, setIdx] = useState(0);
    const main = norm[idx] || ph;

    const fix = (src) => {
        if (!src) return ph;
        if (src.startsWith("/img/")) return src.replace("/img/","/images/");
        if (src.startsWith("/uploads/")) return API + src;
        return src;
    };

    return (
        <section className="gallery">
        <div className="gallery-main">
            <img
            src={fix(main)}
            alt={`Foto ${idx+1}`}
            onError={(e)=>{ if(e.currentTarget.src !== window.location.origin + ph) e.currentTarget.src = ph; }}
            />
        </div>
        {norm.length > 1 && (
            <div className="gallery-thumbs">
            {norm.map((src, i) => (
                <button key={i} type="button" className="thumb" onClick={()=>setIdx(i)} aria-label={`Ver foto ${i+1}`}>
                <img
                    src={fix(src)}
                    alt=""
                    onError={(e)=>{ if(e.currentTarget.src !== window.location.origin + ph) e.currentTarget.src = ph; }}
                />
                </button>
            ))}
            </div>
        )}
        </section>
    );
}
