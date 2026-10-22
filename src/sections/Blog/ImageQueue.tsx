/**
 * The image service boundary: the web process writes a row, one worker owns
 * the card. Everything else in the app follows from that line.
 *   Inline SVG so it follows the site theme (currentColor); accent is terracotta
 *   and marks the only GPU the worker can see.
 */
const ACCENT = "#c15f3c";

const ImageQueue = () => {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 760 404"
      role="img"
      aria-label="A browser sends a prompt to FastAPI, which inserts a queued row into SQLite and never touches a GPU. A separate worker claims one job at a time and renders on GPU 1. GPU 0 for audio and GPU 2 for the language model are not visible to the worker because of CUDA_VISIBLE_DEVICES."
    >
      <text x={20} y={22} fontSize={17} fontWeight={700} fill="currentColor">
        One rule, and the rest of the design follows
      </text>
      <text x={20} y={42} fontSize={12.5} fill="currentColor" opacity={0.55}>
        The web process writes a row. One worker owns the card.
      </text>

      <g>
        <rect x={8} y={64} width={116} height={68} rx={7} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.25} />
        <text x={20} y={88} fontSize={13} fontWeight={600} fill="currentColor">browser</text>
        <text x={20} y={106} fontSize={11.5} fill="currentColor" opacity={0.55}>prompt + gallery</text>
      </g>

      <g>
        <rect x={154} y={64} width={166} height={68} rx={7} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.25} />
        <text x={166} y={88} fontSize={13} fontWeight={600} fill="currentColor">FastAPI</text>
        <text x={166} y={106} fontSize={11.5} fill="currentColor" opacity={0.55}>writes a row, no GPU</text>
      </g>

      <g>
        <rect x={350} y={64} width={160} height={68} rx={7} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.25} />
        <text x={362} y={88} fontSize={13} fontWeight={600} fill="currentColor">SQLite, WAL</text>
        <text x={362} y={106} fontSize={11.5} fill="currentColor" opacity={0.55}>one jobs table</text>
      </g>

      <g>
        <rect x={540} y={64} width={200} height={68} rx={7} fill={ACCENT} fillOpacity={0.07} stroke={ACCENT} strokeOpacity={0.7} />
        <text x={552} y={88} fontSize={13} fontWeight={600} fill="currentColor">worker_multi.py</text>
        <text x={552} y={106} fontSize={11.5} fill="currentColor" opacity={0.55}>claims one job at a time</text>
      </g>

      {[
        { x1: 124, x2: 150, label: "POST", lx: 137 },
        { x1: 320, x2: 346, label: "write", lx: 333 },
        { x1: 510, x2: 536, label: "claim", lx: 523 },
      ].map((a) => (
        <g key={a.label}>
          <line x1={a.x1} y1={98} x2={a.x2} y2={98} stroke="currentColor" strokeOpacity={0.4} />
          <polygon points={`${a.x2},98 ${a.x2 - 6},94 ${a.x2 - 6},102`} fill="currentColor" fillOpacity={0.4} />
          <text x={a.lx} y={90} fontSize={9.5} fill="currentColor" opacity={0.5} textAnchor="middle">
            {a.label}
          </text>
        </g>
      ))}

      <line x1={640} y1={132} x2={640} y2={176} stroke="currentColor" strokeOpacity={0.4} />
      <polygon points="640,176 636,170 644,170" fill="currentColor" fillOpacity={0.4} />

      <g opacity={0.55}>
        <rect x={180} y={180} width={150} height={72} rx={7} fill="none" stroke="currentColor" strokeOpacity={0.4} strokeDasharray="4 4" />
        <text x={192} y={205} fontSize={12.5} fontWeight={600} fill="currentColor">GPU 0 · audio</text>
        <text x={192} y={222} fontSize={11} fill="currentColor">not visible</text>
      </g>

      <g opacity={0.55}>
        <rect x={350} y={180} width={150} height={72} rx={7} fill="none" stroke="currentColor" strokeOpacity={0.4} strokeDasharray="4 4" />
        <text x={362} y={205} fontSize={12.5} fontWeight={600} fill="currentColor">GPU 2 · LLM</text>
        <text x={362} y={222} fontSize={11} fill="currentColor">not visible</text>
      </g>

      <g>
        <rect x={540} y={180} width={200} height={72} rx={7} fill={ACCENT} fillOpacity={0.14} stroke={ACCENT} strokeOpacity={0.85} />
        <text x={552} y={204} fontSize={12.5} fontWeight={600} fill="currentColor">GPU 1 · image</text>
        <text x={552} y={221} fontSize={11} fill="currentColor" opacity={0.6}>the only card it can see</text>
        <text x={552} y={238} fontSize={10} fill="currentColor" opacity={0.5}>CUDA_VISIBLE_DEVICES=1</text>
      </g>

      <line x1={640} y1={252} x2={640} y2={292} stroke="currentColor" strokeOpacity={0.4} />
      <polygon points="640,292 636,286 644,286" fill="currentColor" fillOpacity={0.4} />

      <g>
        <rect x={540} y={296} width={200} height={58} rx={7} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.25} />
        <text x={552} y={320} fontSize={12.5} fontWeight={600} fill="currentColor">outputs/</text>
        <text x={552} y={337} fontSize={11.5} fill="currentColor" opacity={0.55}>png + params json</text>
      </g>

      <text x={380} y={388} fontSize={12.5} fill="currentColor" opacity={0.7} textAnchor="middle">
        The cards the worker cannot see are the point, not a side effect.
      </text>
    </svg>
  );
};

export default ImageQueue;
