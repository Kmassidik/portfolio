/**
 * Total throughput against concurrency, four engines, one card.
 *   The point is the shape, not the ordering: flat, plateaus, climbs, and a
 *   cliff. Every value is from the measured table, no interpolation.
 *   Inline SVG so it follows the site theme (currentColor); accent is the
 *   site's terracotta.
 */
const ACCENT = "#c15f3c";

// x: 4 -> 140, 8 -> 340, 16 -> 540
// y: 0 -> 310, 3200 -> 60 (250px of plot height)
const y = (v: number) => 310 - (v / 3200) * 250;

const series: {
  name: string;
  color: string;
  dash?: string;
  points: [number, number][];
}[] = [
  {
    name: "vLLM",
    color: ACCENT,
    points: [
      [140, y(955.9)],
      [540, y(3029.1)],
    ],
  },
  {
    name: "SGLang",
    color: ACCENT,
    dash: "7 4",
    points: [
      [140, y(1106.5)],
      [340, y(2069.0)],
      [540, y(357.8)],
    ],
  },
  {
    name: "llama.cpp",
    color: "currentColor",
    points: [
      [140, y(862.4)],
      [540, y(772.6)],
    ],
  },
  {
    name: "Ollama",
    color: "currentColor",
    dash: "2 5",
    points: [
      [140, y(285.8)],
      [540, y(291.0)],
    ],
  },
];

const EngineThroughput = () => {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 720 390"
      role="img"
      aria-label="Total throughput against concurrent requests. vLLM climbs from 956 tokens per second at four to 3029 at sixteen. SGLang rises to 2069 at eight then collapses to 358 at sixteen. llama.cpp sits at 862 at four and 773 at sixteen. Ollama stays flat near 290."
    >
      <text x={24} y={26} fontSize={16} fontWeight={700} fill="currentColor">
        Total throughput as the crowd grows
      </text>
      <text x={24} y={44} fontSize={12} fill="currentColor" opacity={0.55}>
        tokens per second, total across all requests
      </text>

      {/* grid */}
      <g stroke="currentColor" strokeOpacity={0.12}>
        <line x1={90} y1={60} x2={540} y2={60} />
        <line x1={90} y1={122.5} x2={540} y2={122.5} />
        <line x1={90} y1={185} x2={540} y2={185} />
        <line x1={90} y1={247.5} x2={540} y2={247.5} />
        <line x1={90} y1={310} x2={540} y2={310} strokeOpacity={0.3} />
      </g>

      <g fontSize={11.5} fill="currentColor" opacity={0.5} textAnchor="end">
        <text x={82} y={64}>3,200</text>
        <text x={82} y={126.5}>2,400</text>
        <text x={82} y={189}>1,600</text>
        <text x={82} y={251.5}>800</text>
        <text x={82} y={314}>0</text>
      </g>

      <g fontSize={12} fill="currentColor" opacity={0.55} textAnchor="middle">
        <text x={140} y={330}>4</text>
        <text x={340} y={330}>8</text>
        <text x={540} y={330}>16</text>
        <text x={340} y={350}>concurrent requests</text>
      </g>

      {/* lines */}
      {series.map((s) => (
        <g key={s.name}>
          <polyline
            points={s.points.map((p) => p.join(",")).join(" ")}
            fill="none"
            stroke={s.color}
            strokeWidth={s.name === "vLLM" ? 2.4 : 2}
            strokeDasharray={s.dash}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={s.color === "currentColor" ? 0.7 : 1}
          />
          {s.points.map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={i === s.points.length - 1 ? 4.5 : 3.5}
              fill={s.color}
              opacity={s.color === "currentColor" ? 0.7 : 1}
            />
          ))}
        </g>
      ))}

      {/* direct labels, one per line end */}
      <g fontSize={13} fontWeight={600} fill={ACCENT}>
        <text x={552} y={77}>vLLM 3,029</text>
      </g>
      <g fontSize={12.5} fontWeight={600} fill={ACCENT} textAnchor="middle">
        <text x={340} y={136} opacity={0.85}>SGLang peak 2,069</text>
      </g>
      <g fontSize={12.5} fontWeight={600} fill={ACCENT}>
        <text x={530} y={300} textAnchor="end">SGLang 358</text>
      </g>
      <g fontSize={13} fontWeight={600} fill="currentColor">
        <text x={552} y={253}>llama.cpp 773</text>
        <text x={552} y={291}>Ollama 291</text>
      </g>

      <text x={360} y={378} fontSize={12.5} fill="currentColor" opacity={0.7} textAnchor="middle">
        Measured 2026-09-13 · SmolLM2-360M · one RTX 3060 Ti · 16-bit · requests arriving together
      </text>
    </svg>
  );
};

export default EngineThroughput;
