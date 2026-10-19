/**
 * Multi-stage Docker build diagram, rendered inline so it inherits the
 * article's themed text color via `currentColor`, so it follows the site's
 * light/dark toggle, not the OS setting. Animations live in index.css
 * (.diagram-*) and respect prefers-reduced-motion.
 */
const DockerMultiStage = () => (
  <svg
    className="diagram-svg"
    viewBox="0 0 760 300"
    role="img"
    aria-label="A multi-stage Docker build: stage one uses the full toolchain to build the app and is discarded; only the built output is copied into a small stage-two runtime image that ships."
  >
    {/* Docker brand mark */}
    <g transform="translate(24 4) scale(1.25)" fill="#2496ED">
      <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z" />
    </g>
    <text x={64} y={27} fontSize={15} fontWeight={700} fill="currentColor">
      Docker
    </text>

    {/* Stage 1: build */}
    <rect
      x={20}
      y={40}
      width={300}
      height={172}
      rx={12}
      fill="none"
      stroke="currentColor"
      strokeOpacity={0.3}
    />
    <text x={40} y={76} fontSize={15} fontWeight={700} fill="currentColor">
      Stage 1 · build
    </text>
    <text x={40} y={108} fontSize={14} fill="currentColor" opacity={0.65}>
      FROM node:20-alpine
    </text>
    <text x={40} y={134} fontSize={14} fill="currentColor" opacity={0.65}>
      npm ci
    </text>
    <text x={40} y={160} fontSize={14} fill="currentColor" opacity={0.65}>
      npm run build
    </text>
    <text x={40} y={196} fontSize={13} fontWeight={700} fill="#c15f3c">
      ~1.1 GB · discarded
    </text>

    {/* Arrow: flows from build → runtime */}
    <text
      x={380}
      y={110}
      fontSize={12}
      fill="currentColor"
      opacity={0.65}
      textAnchor="middle"
    >
      --from=build
    </text>
    <line
      className="diagram-flow"
      x1={332}
      y1={126}
      x2={420}
      y2={126}
      stroke="#c15f3c"
      strokeWidth={2}
    />
    <path d="M430 126 L420 121 L420 131 Z" fill="#c15f3c" />
    <circle className="diagram-dot" cx={332} cy={126} r={4} fill="#c15f3c" />

    {/* Stage 2: runtime */}
    <rect
      x={440}
      y={76}
      width={300}
      height={100}
      rx={12}
      fill="none"
      stroke="#c15f3c"
    />
    <text x={460} y={112} fontSize={15} fontWeight={700} fill="currentColor">
      Stage 2 · runtime
    </text>
    <text x={460} y={140} fontSize={14} fill="currentColor" opacity={0.65}>
      built output + prod deps
    </text>
    <text
      className="diagram-blink"
      x={460}
      y={164}
      fontSize={13}
      fontWeight={700}
      fill="#c15f3c"
    >
      ~180 MB · shipped
    </text>

    {/* Caption */}
    <text
      x={380}
      y={270}
      fontSize={13}
      fill="currentColor"
      opacity={0.6}
      textAnchor="middle"
    >
      Only the build's output crosses into the final image. The toolchain stays
      behind.
    </text>
  </svg>
);

export default DockerMultiStage;
