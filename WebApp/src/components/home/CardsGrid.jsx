import Card from "./Card";

export default function CardsGrid({ items, allBids = [], onOpen }) {
  if (!items?.length) {
    return <p className="muted">No hay subastas que coincidan con tu búsqueda.</p>;
  }
  return (
    <div className="home-grid">
      {items.map(a => (
        <Card key={a.id} a={a} allBids={allBids} onOpen={onOpen} />
      ))}
    </div>
  );
}
