/**
 * Three ways to give a model a fact.
 *   Fine-tune the weights (muted): the fact lives in the weights, changes
 *     when you retrain, and cannot cite its own source.
 *   Retrieve at query time (accent): the fact lives in the context, changes
 *     when you re-index, and cites the passage it came from.
 *   Paste the whole context (muted): the fact lives in the window, and you
 *     pay prefill for all of it on every request.
 * The band underneath carries the one measured result: on knowledge
 * questions, retrieval beat closed-book fine-tuning by about 2.6x.
 * Inline SVG so it follows the site theme (currentColor); accent is the
 * site's terracotta.
 */
const ACCENT = "#c15f3c";

const PANEL_W = 226;
const PANEL_Y = 50;
const PANEL_H = 224;
const PANEL_X = [24, 266, 508];

const RagDecision = () => {
  const columns = [
    {
      title: "Fine-tune the weights",
      accent: false,
      rows: [
        ["where it lives", "the weights"],
        ["when it changes", "you retrain"],
        ["can it cite", "no"],
      ],
    },
    {
      title: "Retrieve at query time",
      accent: true,
      rows: [
        ["where it lives", "the context"],
        ["when it changes", "you re-index"],
        ["can it cite", "yes — the passage"],
      ],
    },
    {
      title: "Paste it all in",
      accent: false,
      rows: [
        ["where it lives", "the window"],
        ["when it changes", "every request"],
        ["can it cite", "no"],
      ],
    },
  ];

  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 760 400"
      role="img"
      aria-label="Three ways to give a model a fact, side by side. Fine-tune the weights: the fact lives in the weights, changes when you retrain, and cannot cite a source. Retrieve at query time: the fact lives in the context, changes when you re-index, and can cite the passage. Paste it all in: the fact lives in the window, changes on every request, and cannot cite a source. Below, the measured result: on knowledge questions, retrieval beat closed-book fine-tuning by about 2.6 times."
    >
      <text x={24} y={26} fontSize={15} fontWeight={700} fill="currentColor">
        Three ways to give a model a fact
      </text>

      {columns.map((col, i) => {
        const x = PANEL_X[i];
        const cx = x + PANEL_W / 2;
        const stroke = col.accent ? ACCENT : "currentColor";
        const strokeOpacity = col.accent ? 0.7 : 0.28;
        const fillOpacity = col.accent ? 0.06 : 0.02;

        return (
          <g key={col.title}>
            <rect
              x={x}
              y={PANEL_Y}
              width={PANEL_W}
              height={PANEL_H}
              rx={11}
              fill={col.accent ? ACCENT : "currentColor"}
              fillOpacity={fillOpacity}
              stroke={stroke}
              strokeOpacity={strokeOpacity}
              strokeWidth={col.accent ? 1.9 : 1.4}
            />

            <text
              x={cx}
              y={80}
              fontSize={13.5}
              fontWeight={700}
              fill={col.accent ? ACCENT : "currentColor"}
              textAnchor="middle"
            >
              {col.title}
            </text>

            <line
              x1={x + 16}
              y1={98}
              x2={x + PANEL_W - 16}
              y2={98}
              stroke="currentColor"
              strokeOpacity={0.14}
              strokeDasharray="3 4"
            />

            {col.rows.map(([label, value], r) => {
              const labelY = 126 + r * 56;
              const valueY = labelY + 19;
              return (
                <g key={label}>
                  <text
                    x={cx}
                    y={labelY}
                    fontSize={9.5}
                    fill="currentColor"
                    opacity={0.5}
                    textAnchor="middle"
                  >
                    {label}
                  </text>
                  <text
                    x={cx}
                    y={valueY}
                    fontSize={12}
                    fontWeight={600}
                    fill={col.accent ? ACCENT : "currentColor"}
                    opacity={col.accent ? 0.95 : 0.82}
                    textAnchor="middle"
                  >
                    {value}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* the one measured result */}
      <rect
        x={24}
        y={292}
        width={712}
        height={54}
        rx={10}
        fill={ACCENT}
        fillOpacity={0.06}
        stroke={ACCENT}
        strokeOpacity={0.35}
        strokeWidth={1.4}
      />
      <text x={44} y={312} fontSize={10.5} fill="currentColor" opacity={0.6}>
        measured on the box · knowledge questions
      </text>
      <text x={44} y={334} fontSize={14} fontWeight={700} fill={ACCENT}>
        Retrieval beat closed-book fine-tuning ~2.6×
      </text>

      {/* the rule */}
      <text x={380} y={376} fontSize={12.5} fill="currentColor" opacity={0.75} textAnchor="middle">
        Facts belong in retrieval. Behaviour belongs in the weights.
      </text>
    </svg>
  );
};

export default RagDecision;
