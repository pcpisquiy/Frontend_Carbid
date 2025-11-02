import { fmtGTQ } from "../../lib/auctions";

function when(ts){
    const d = new Date(ts);
    return d.toLocaleString(); 
}

export default function BidList({ bids = [] }){
    if (!bids.length) return <p className="muted">Aún no hay pujas.</p>;
    return (
        <div className="bidlist">
        {bids.map(b => (
            <div key={b.id} className="biditem">
            <span className="who">@{b.userId}</span>
            <span className="when muted mini">{when(b.ts)}</span>
            <span className="amt">{fmtGTQ.format(b.monto)}</span>
            </div>
        ))}
        </div>
    );
}
