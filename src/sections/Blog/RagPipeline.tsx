/**
 * The production RAG shape, in two lanes.
 *   Offline (built once, muted): documents -> chunk -> embed -> vector store.
 *   Online (every question, accent): question -> retrieve top-K (recall) ->
 *     re-rank top-N (precision) -> LLM -> grounded answer.
 * The vector store feeds the retrieve stage with candidates. Inline SVG so it
 * follows the site theme (currentColor); brand accent is the site's terracotta.
 */
const ACCENT = "#c15f3c";

const RagPipeline = () => {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 760 400"
      role="img"
      aria-label="The RAG pipeline in two lanes. Offline and built once: documents are chunked, each chunk is embedded into a vector, and the vectors are stored in a vector store. Online and run on every question: the question is embedded and used to retrieve the top-K candidate chunks from the vector store, a re-ranker narrows those to the top-N most relevant, and those chunks plus the question go to the LLM, which writes a grounded answer."
    >
      <defs>
        <marker id="rp-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="currentColor" />
        </marker>
        <marker id="rp-arrow-accent" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={ACCENT} />
        </marker>
      </defs>

      <text x={24} y={26} fontSize={15} fontWeight={700} fill="currentColor">
        The pipeline I actually build
      </text>

      {/* ---------- Offline lane: ingestion ---------- */}
      <text x={24} y={54} fontSize={11.5} fill="currentColor" opacity={0.5} fontWeight={600}>
        offline · indexed once
      </text>

      {/* documents */}
      <g>
        <rect x={40} y={66} width={116} height={50} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.5} />
        <text x={98} y={88} fontSize={13.5} fontWeight={600} fill="currentColor" textAnchor="middle" opacity={0.8}>documents</text>
        <text x={98} y={105} fontSize={10.5} fill="currentColor" textAnchor="middle" opacity={0.5}>your sources</text>
      </g>
      <line x1={156} y1={91} x2={196} y2={91} stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.5} markerEnd="url(#rp-arrow)" />
      {/* chunk */}
      <g>
        <rect x={196} y={66} width={104} height={50} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.5} />
        <text x={248} y={88} fontSize={13.5} fontWeight={600} fill="currentColor" textAnchor="middle" opacity={0.8}>chunk</text>
        <text x={248} y={105} fontSize={10.5} fill="currentColor" textAnchor="middle" opacity={0.5}>with overlap</text>
      </g>
      <line x1={300} y1={91} x2={340} y2={91} stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.5} markerEnd="url(#rp-arrow)" />
      {/* embed */}
      <g>
        <rect x={340} y={66} width={104} height={50} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.5} />
        <text x={392} y={88} fontSize={13.5} fontWeight={600} fill="currentColor" textAnchor="middle" opacity={0.8}>embed</text>
        <text x={392} y={105} fontSize={10.5} fill="currentColor" textAnchor="middle" opacity={0.5}>bi-encoder</text>
      </g>
      <line x1={444} y1={91} x2={484} y2={91} stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.5} markerEnd="url(#rp-arrow)" />
      {/* vector store */}
      <g>
        <rect x={484} y={66} width={150} height={50} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.6} />
        <text x={559} y={88} fontSize={13.5} fontWeight={700} fill="currentColor" textAnchor="middle" opacity={0.85}>vector store</text>
        <text x={559} y={105} fontSize={10.5} fill="currentColor" textAnchor="middle" opacity={0.5}>chunks as vectors</text>
      </g>

      {/* vector store -> retrieve (candidates), elbow down into the online lane */}
      <path
        className="diagram-flow"
        d="M 559,116 L 559,230 L 215,230 L 215,300"
        fill="none"
        stroke={ACCENT}
        strokeOpacity={0.5}
        strokeWidth={1.6}
        markerEnd="url(#rp-arrow-accent)"
      />
      <text x={386} y={222} fontSize={11} fill={ACCENT} textAnchor="middle" opacity={0.8}>candidates (top-K)</text>

      {/* ---------- Online lane: query ---------- */}
      <text x={24} y={286} fontSize={11.5} fill={ACCENT} opacity={0.85} fontWeight={600}>
        online · every question
      </text>

      {/* question */}
      <g>
        <rect x={14} y={300} width={100} height={52} rx={11} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1.5} />
        <text x={64} y={323} fontSize={13.5} fontWeight={600} fill="currentColor" textAnchor="middle">question</text>
        <text x={64} y={340} fontSize={10.5} fill="currentColor" textAnchor="middle" opacity={0.55}>user asks</text>
      </g>
      <line className="diagram-flow" x1={114} y1={326} x2={146} y2={326} stroke={ACCENT} strokeOpacity={0.55} strokeWidth={1.8} markerEnd="url(#rp-arrow-accent)" />

      {/* retrieve */}
      <g>
        <rect x={146} y={300} width={138} height={52} rx={11} fill={ACCENT} fillOpacity={0.05} stroke={ACCENT} strokeOpacity={0.5} strokeWidth={1.6} />
        <text x={215} y={323} fontSize={13.5} fontWeight={700} fill="currentColor" textAnchor="middle">retrieve</text>
        <text x={215} y={340} fontSize={10.5} fill={ACCENT} textAnchor="middle" opacity={0.85}>ANN search · recall</text>
      </g>
      <line className="diagram-flow" x1={284} y1={326} x2={316} y2={326} stroke={ACCENT} strokeOpacity={0.55} strokeWidth={1.8} markerEnd="url(#rp-arrow-accent)" />

      {/* re-rank (the emphasized stage) */}
      <g>
        <rect x={316} y={300} width={150} height={52} rx={11} fill={ACCENT} fillOpacity={0.09} stroke={ACCENT} strokeOpacity={0.75} strokeWidth={1.9} />
        <text x={391} y={323} fontSize={13.5} fontWeight={700} fill="currentColor" textAnchor="middle">re-rank</text>
        <text x={391} y={340} fontSize={10.5} fill={ACCENT} textAnchor="middle" opacity={0.85}>top-N · precision</text>
      </g>
      <line className="diagram-flow" x1={466} y1={326} x2={498} y2={326} stroke={ACCENT} strokeOpacity={0.55} strokeWidth={1.8} markerEnd="url(#rp-arrow-accent)" />

      {/* LLM */}
      <g>
        <rect x={498} y={300} width={104} height={52} rx={11} fill={ACCENT} fillOpacity={0.05} stroke={ACCENT} strokeOpacity={0.5} strokeWidth={1.6} />
        <circle className="diagram-blink" cx={520} cy={322} r={4.5} fill={ACCENT} />
        <text x={557} y={323} fontSize={13.5} fontWeight={700} fill="currentColor" textAnchor="middle">LLM</text>
        <text x={550} y={340} fontSize={10.5} fill="currentColor" textAnchor="middle" opacity={0.55}>reads, writes</text>
      </g>
      <line className="diagram-flow" x1={602} y1={326} x2={634} y2={326} stroke={ACCENT} strokeOpacity={0.55} strokeWidth={1.8} markerEnd="url(#rp-arrow-accent)" />

      {/* answer */}
      <g>
        <rect x={634} y={300} width={112} height={52} rx={11} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1.5} />
        <text x={690} y={323} fontSize={13.5} fontWeight={700} fill="currentColor" textAnchor="middle">answer</text>
        <text x={690} y={340} fontSize={10.5} fill={ACCENT} textAnchor="middle" opacity={0.8}>grounded</text>
      </g>

      {/* Caption */}
      <text x={380} y={388} fontSize={13} fill="currentColor" opacity={0.75} textAnchor="middle">
        Cast a wide net, then keep only the best few. The model only ever sees the top-N.
      </text>
    </svg>
  );
};

export default RagPipeline;
