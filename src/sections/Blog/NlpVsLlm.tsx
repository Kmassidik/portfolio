/**
 * Two ways to generate text, side by side.
 *   Left  (the old way): input -> hand-written rules + n-gram table -> template
 *          -> output. Rigid, short memory.
 *   Right (the LLM way): input -> tokens -> transformer predicts the next token
 *          from the full context, in a loop -> output. Fluid, long memory.
 * Inline SVG so it follows the site theme (currentColor); brand accent is the
 * site's terracotta.
 */
const ACCENT = "#c15f3c";

const NlpVsLlm = () => {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 760 460"
      role="img"
      aria-label="Two ways to generate text side by side. On the left, the classical pipeline: input text goes into hand-written rules and an n-gram table, which drives a fixed template to produce output. On the right, the LLM: input text is split into tokens, a transformer predicts the next token using the full context, and that loop produces the output."
    >
      <defs>
        <marker id="nl-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="currentColor" />
        </marker>
        <marker id="nl-arrow-accent" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={ACCENT} />
        </marker>
      </defs>

      {/* Column headers */}
      <text x={190} y={34} fontSize={16} fontWeight={700} fill="currentColor" textAnchor="middle" opacity={0.55}>
        The old way
      </text>
      <text x={190} y={54} fontSize={12.5} fill="currentColor" textAnchor="middle" opacity={0.45}>
        classical NLP
      </text>
      <text x={570} y={34} fontSize={16} fontWeight={700} fill={ACCENT} textAnchor="middle">
        The LLM way
      </text>
      <text x={570} y={54} fontSize={12.5} fill={ACCENT} textAnchor="middle" opacity={0.75}>
        next-token prediction
      </text>

      {/* Divider */}
      <line x1={380} y1={72} x2={380} y2={430} stroke="currentColor" strokeOpacity={0.12} strokeDasharray="3 5" />

      {/* ---- Left column: classical ---- */}
      {[
        { y: 86, label: "input text", sub: null, muted: true },
        { y: 168, label: "hand-written rules", sub: "+ n-gram table", muted: true },
        { y: 256, label: "fixed template", sub: "slot the values in", muted: true },
        { y: 344, label: "output", sub: "rigid, short memory", muted: true },
      ].map((b, i, arr) => (
        <g key={`c-${b.y}`}>
          <rect x={70} y={b.y} width={240} height={b.sub ? 58 : 44} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.5} />
          <text x={190} y={b.y + (b.sub ? 26 : 28)} fontSize={14.5} fontWeight={600} fill="currentColor" textAnchor="middle" opacity={0.8}>
            {b.label}
          </text>
          {b.sub && (
            <text x={190} y={b.y + 44} fontSize={11.5} fill="currentColor" textAnchor="middle" opacity={0.5}>
              {b.sub}
            </text>
          )}
          {i < arr.length - 1 && (
            <line x1={190} y1={b.y + (b.sub ? 58 : 44)} x2={190} y2={arr[i + 1].y} stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.5} markerEnd="url(#nl-arrow)" />
          )}
        </g>
      ))}

      {/* ---- Right column: LLM ---- */}
      {[
        { y: 86, label: "input text", sub: null },
        { y: 168, label: "tokens", sub: "split into pieces" },
        { y: 256, label: "transformer", sub: "predicts next token · full context" },
        { y: 344, label: "output", sub: "fluent, long memory" },
      ].map((b, i, arr) => (
        <g key={`l-${b.y}`}>
          <rect x={450} y={b.y} width={240} height={b.sub ? 58 : 44} rx={10} fill={ACCENT} fillOpacity={i === 2 ? 0.07 : 0.03} stroke={ACCENT} strokeOpacity={i === 2 ? 0.7 : 0.4} strokeWidth={i === 2 ? 1.8 : 1.5} />
          <text x={570} y={b.y + (b.sub ? 26 : 28)} fontSize={14.5} fontWeight={700} fill="currentColor" textAnchor="middle">
            {b.label}
          </text>
          {b.sub && (
            <text x={570} y={b.y + 44} fontSize={11.5} fill={ACCENT} textAnchor="middle" opacity={0.8}>
              {b.sub}
            </text>
          )}
          {i < arr.length - 1 && (
            <line className="diagram-flow" x1={570} y1={b.y + (b.sub ? 58 : 44)} x2={570} y2={arr[i + 1].y} stroke={ACCENT} strokeOpacity={0.55} strokeWidth={1.8} markerEnd="url(#nl-arrow-accent)" />
          )}
        </g>
      ))}

      {/* The loop arrow on the transformer: "one token at a time" */}
      <path
        className="diagram-flow"
        d="M 690,285 C 724,285 724,197 694,197"
        fill="none"
        stroke={ACCENT}
        strokeOpacity={0.5}
        strokeWidth={1.5}
        strokeDasharray="5 4"
        markerEnd="url(#nl-arrow-accent)"
      />
      <text transform="rotate(90 712 241)" x={712} y={241} fontSize={10.5} fill={ACCENT} opacity={0.75} textAnchor="middle">
        loop, one token at a time
      </text>

      {/* Caption */}
      <text x={380} y={448} fontSize={13} fill="currentColor" opacity={0.75} textAnchor="middle">
        Same job, two eras. One follows rules a human wrote. The other learns the patterns.
      </text>
    </svg>
  );
};

export default NlpVsLlm;
