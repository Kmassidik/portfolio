/**
 * Why retrieval needs two stages: a bi-encoder, then a cross-encoder.
 *   Bi-encoder (stage 1, recall): encode the question and each document
 *     separately into vectors, compare with cosine similarity. Precomputable,
 *     scales to millions, but coarse.
 *   Cross-encoder (stage 2, precision): feed the question and a document in
 *     together, attend across both, output one relevance score. Accurate, but
 *     has to run fresh for every pair.
 * Inline SVG so it follows the site theme (currentColor); accent on the
 * cross-encoder, the precision upgrade.
 */
const ACCENT = "#c15f3c";

const EncoderCompare = () => {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 760 360"
      role="img"
      aria-label="Bi-encoder versus cross-encoder. The bi-encoder encodes the question and a document separately into two vectors and compares them with cosine similarity, which can be precomputed and scales to millions but is coarse. The cross-encoder feeds the question and document in together and lets the model attend across both to produce one relevance score, which is far more accurate but has to run fresh for every pair."
    >
      <defs>
        <marker id="ec-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="currentColor" />
        </marker>
        <marker id="ec-arrow-accent" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={ACCENT} />
        </marker>
      </defs>

      <text x={24} y={26} fontSize={15} fontWeight={700} fill="currentColor">
        Why two stages: bi-encoder vs cross-encoder
      </text>

      {/* ---------- Row 1: bi-encoder (retrieve) ---------- */}
      <text x={24} y={54} fontSize={11.5} fill="currentColor" opacity={0.6} fontWeight={600}>
        bi-encoder · stage 1 · recall
      </text>

      {/* question / document inputs */}
      <rect x={30} y={64} width={104} height={34} rx={9} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1.4} />
      <text x={82} y={85} fontSize={12.5} fill="currentColor" textAnchor="middle">question</text>
      <rect x={30} y={110} width={104} height={34} rx={9} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1.4} />
      <text x={82} y={131} fontSize={12.5} fill="currentColor" textAnchor="middle">document</text>

      <line x1={134} y1={81} x2={168} y2={81} stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.4} markerEnd="url(#ec-arrow)" />
      <line x1={134} y1={127} x2={168} y2={127} stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.4} markerEnd="url(#ec-arrow)" />

      {/* two separate encoders */}
      <rect x={168} y={64} width={96} height={34} rx={9} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.4} />
      <text x={216} y={85} fontSize={12} fill="currentColor" textAnchor="middle" opacity={0.8}>encode</text>
      <rect x={168} y={110} width={96} height={34} rx={9} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.4} />
      <text x={216} y={131} fontSize={12} fill="currentColor" textAnchor="middle" opacity={0.8}>encode</text>

      <line x1={264} y1={81} x2={298} y2={81} stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.4} markerEnd="url(#ec-arrow)" />
      <line x1={264} y1={127} x2={298} y2={127} stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.4} markerEnd="url(#ec-arrow)" />

      {/* two vectors */}
      <rect x={298} y={66} width={62} height={30} rx={8} fill="none" stroke="currentColor" strokeOpacity={0.45} strokeWidth={1.3} />
      <text x={329} y={86} fontSize={12.5} fontStyle="italic" fill="currentColor" textAnchor="middle" opacity={0.8}>e_q</text>
      <rect x={298} y={112} width={62} height={30} rx={8} fill="none" stroke="currentColor" strokeOpacity={0.45} strokeWidth={1.3} />
      <text x={329} y={132} fontSize={12.5} fontStyle="italic" fill="currentColor" textAnchor="middle" opacity={0.8}>e_d</text>

      {/* converge into cosine */}
      <line x1={360} y1={81} x2={398} y2={97} stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.4} markerEnd="url(#ec-arrow)" />
      <line x1={360} y1={127} x2={398} y2={111} stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.4} markerEnd="url(#ec-arrow)" />

      <rect x={400} y={84} width={140} height={40} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.45} strokeWidth={1.5} />
      <text x={470} y={108} fontSize={12.5} fontWeight={600} fill="currentColor" textAnchor="middle" opacity={0.85}>cosine similarity</text>

      <line x1={540} y1={104} x2={576} y2={104} stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.4} markerEnd="url(#ec-arrow)" />
      <rect x={578} y={84} width={150} height={40} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.5} />
      <text x={653} y={108} fontSize={12.5} fontWeight={600} fill="currentColor" textAnchor="middle" opacity={0.8}>relevance score</text>

      <text x={380} y={166} fontSize={12} fill="currentColor" textAnchor="middle" opacity={0.6}>
        Docs encoded once, offline. Scoring is just vector math, so it scales to millions. Coarse, but wide.
      </text>

      {/* divider */}
      <line x1={30} y1={188} x2={730} y2={188} stroke="currentColor" strokeOpacity={0.12} strokeDasharray="3 5" />

      {/* ---------- Row 2: cross-encoder (re-rank) ---------- */}
      <text x={24} y={214} fontSize={11.5} fill={ACCENT} opacity={0.9} fontWeight={700}>
        cross-encoder · stage 2 · precision
      </text>

      {/* joined input */}
      <rect x={30} y={226} width={180} height={48} rx={11} fill={ACCENT} fillOpacity={0.05} stroke={ACCENT} strokeOpacity={0.5} strokeWidth={1.5} />
      <text x={120} y={246} fontSize={12.5} fontWeight={600} fill="currentColor" textAnchor="middle">question + document</text>
      <text x={120} y={263} fontSize={10.5} fill={ACCENT} textAnchor="middle" opacity={0.8}>fed in together</text>

      <line className="diagram-flow" x1={210} y1={250} x2={248} y2={250} stroke={ACCENT} strokeOpacity={0.55} strokeWidth={1.8} markerEnd="url(#ec-arrow-accent)" />

      {/* single cross-encoder */}
      <rect x={250} y={226} width={210} height={48} rx={11} fill={ACCENT} fillOpacity={0.09} stroke={ACCENT} strokeOpacity={0.75} strokeWidth={1.9} />
      <circle className="diagram-blink" cx={272} cy={250} r={4.5} fill={ACCENT} />
      <text x={360} y={246} fontSize={12.5} fontWeight={700} fill="currentColor" textAnchor="middle">encode together</text>
      <text x={360} y={263} fontSize={10.5} fill={ACCENT} textAnchor="middle" opacity={0.85}>attends across both</text>

      <line className="diagram-flow" x1={460} y1={250} x2={498} y2={250} stroke={ACCENT} strokeOpacity={0.55} strokeWidth={1.8} markerEnd="url(#ec-arrow-accent)" />

      <rect x={500} y={226} width={170} height={48} rx={11} fill="none" stroke={ACCENT} strokeOpacity={0.5} strokeWidth={1.6} />
      <text x={585} y={246} fontSize={12.5} fontWeight={700} fill="currentColor" textAnchor="middle">relevance score</text>
      <text x={585} y={263} fontSize={10.5} fill={ACCENT} textAnchor="middle" opacity={0.8}>one per pair</text>

      <text x={380} y={312} fontSize={12} fill="currentColor" textAnchor="middle" opacity={0.6}>
        No precompute, one full pass per pair. Costly, so it runs only on the top-K. Narrow, but sharp.
      </text>
    </svg>
  );
};

export default EncoderCompare;
