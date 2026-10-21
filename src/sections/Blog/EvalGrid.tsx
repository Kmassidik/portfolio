/**
 * Ten tasks per model, one cell per task.
 *   Filled = correct, crossed = answered but wrong, dashed = gave up.
 *   The point of the drawing is the gap between the completion column and
 *   the accuracy column on the same run. Inline SVG so it follows the site
 *   theme (currentColor); brand accent is the site's terracotta.
 */
const ACCENT = "#c15f3c";

type Cell = "ok" | "wrong" | "gaveup";

const rows: {
  name: string;
  note: string;
  cells: Cell[];
  completion: string;
  accuracy: string;
}[] = [
  {
    name: "SmolLM2-360M",
    note: "included as a floor",
    cells: [
      "gaveup", "gaveup", "gaveup", "gaveup", "gaveup",
      "gaveup", "gaveup", "gaveup", "gaveup", "gaveup",
    ],
    completion: "0%",
    accuracy: "0%",
  },
  {
    name: "Llama-3-8B, 4-bit",
    note: "half precision",
    cells: [
      "ok", "ok", "ok", "ok", "ok",
      "wrong", "wrong", "wrong", "wrong", "gaveup",
    ],
    completion: "90%",
    accuracy: "50%",
  },
  {
    name: "Llama-3-8B, 8-bit",
    note: "double precision",
    cells: [
      "ok", "ok", "ok", "ok", "ok",
      "ok", "wrong", "wrong", "wrong", "gaveup",
    ],
    completion: "90%",
    accuracy: "60%",
  },
];

const EvalGrid = () => {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 760 360"
      role="img"
      aria-label="Ten tasks per model. The 360M gives up on all ten. The 4-bit 8B answers nine and is right on five. The 8-bit 8B answers nine and is right on six. Completion is 90% for both 8B models while accuracy is 50% and 60%."
    >
      <text x={24} y={26} fontSize={15} fontWeight={700} fill="currentColor">
        Same run, two very different numbers
      </text>

      <text x={610} y={58} fontSize={10.5} fill="currentColor" opacity={0.55} textAnchor="middle">
        completion
      </text>
      <text x={700} y={58} fontSize={10.5} fill="currentColor" opacity={0.55} textAnchor="middle">
        accuracy
      </text>

      {rows.map((row, r) => {
        const y = 72 + r * 72;
        return (
          <g key={row.name}>
            <text x={24} y={y + 15} fontSize={12.5} fontWeight={600} fill="currentColor">
              {row.name}
            </text>
            <text x={24} y={y + 30} fontSize={10.5} fill="currentColor" opacity={0.55}>
              {row.note}
            </text>

            {row.cells.map((cell, i) => {
              const x = 196 + i * 38;
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={y}
                    width={32}
                    height={32}
                    rx={4}
                    fill={cell === "ok" ? ACCENT : cell === "wrong" ? "currentColor" : "none"}
                    fillOpacity={cell === "ok" ? 0.85 : cell === "wrong" ? 0.1 : 0}
                    stroke={cell === "ok" ? ACCENT : "currentColor"}
                    strokeOpacity={cell === "ok" ? 1 : cell === "wrong" ? 0.25 : 0.35}
                    strokeDasharray={cell === "gaveup" ? "3 3" : undefined}
                  />
                  {cell === "wrong" && (
                    <>
                      <line
                        x1={x + 10}
                        y1={y + 10}
                        x2={x + 22}
                        y2={y + 22}
                        stroke="currentColor"
                        strokeOpacity={0.45}
                        strokeWidth={1.4}
                      />
                      <line
                        x1={x + 22}
                        y1={y + 10}
                        x2={x + 10}
                        y2={y + 22}
                        stroke="currentColor"
                        strokeOpacity={0.45}
                        strokeWidth={1.4}
                      />
                    </>
                  )}
                </g>
              );
            })}

            <text x={610} y={y + 21} fontSize={13} fontWeight={600} fill="currentColor" textAnchor="middle">
              {row.completion}
            </text>
            <text x={700} y={y + 21} fontSize={13} fontWeight={700} fill={ACCENT} textAnchor="middle">
              {row.accuracy}
            </text>
          </g>
        );
      })}

      {/* legend */}
      <g>
        <rect x={196} y={276} width={14} height={14} rx={2} fill={ACCENT} fillOpacity={0.85} stroke={ACCENT} />
        <text x={216} y={287} fontSize={11} fill="currentColor" opacity={0.7}>
          correct
        </text>

        <rect x={310} y={276} width={14} height={14} rx={2} fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeOpacity={0.25} />
        <line x1={313} y1={279} x2={321} y2={287} stroke="currentColor" strokeOpacity={0.45} strokeWidth={1.2} />
        <line x1={321} y1={279} x2={313} y2={287} stroke="currentColor" strokeOpacity={0.45} strokeWidth={1.2} />
        <text x={330} y={287} fontSize={11} fill="currentColor" opacity={0.7}>
          answered, wrong
        </text>

        <rect x={470} y={276} width={14} height={14} rx={2} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 3" />
        <text x={490} y={287} fontSize={11} fill="currentColor" opacity={0.7}>
          gave up
        </text>
      </g>

      <text x={380} y={322} fontSize={12.5} fill="currentColor" opacity={0.75} textAnchor="middle">
        Both 8B models answered 9 of 10 tasks. They were right on 5 and 6.
      </text>
      <text x={380} y={342} fontSize={12.5} fill="currentColor" opacity={0.75} textAnchor="middle">
        Every log and dashboard reports the left number.
      </text>
    </svg>
  );
};

export default EvalGrid;
