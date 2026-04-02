import "../../(content)/caddybook/caddybook.css";

export default function NavBar({ pages, current, onPrev, onNext }) {
  const prev = pages[current - 1];
  const next = pages[current + 1];

  return (
    <div className="nav-bar">
      <button className="nav-btn" onClick={onPrev} disabled={!prev}>
        <div className="nav-arrow">←</div>
        {prev && (
          <div className="nav-label-block">
            <span className="nav-direction">Previous</span>
            <span className="nav-title">{prev.title}</span>
            <span className="nav-sub">{prev.sub}</span>
          </div>
        )}
      </button>

      <div className="nav-dots">
        {pages.map((_, i) => (
          <div key={i} className={`nav-dot ${i === current ? "active" : ""}`} />
        ))}
      </div>

      <button className="nav-btn" onClick={onNext} disabled={!next}>
        {next && (
          <div className="nav-label-block right">
            <span className="nav-direction">Next</span>
            <span className="nav-title">{next.title}</span>
            <span className="nav-sub">{next.sub}</span>
          </div>
        )}
        <div className="nav-arrow">→</div>
      </button>
    </div>
  );
}
