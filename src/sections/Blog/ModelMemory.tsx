/**
 * Parameters against peak VRAM for the four image models, same card and settings.
 *   The point of the pair is the mismatch: the 12B model has the longest left bar
 *   and the shortest right bar, because sequential offload streams it in slices
 *   and pays for that in minutes rather than memory.
 *   Inline SVG so it follows the site theme (currentColor).
 */
const ACCENT = "#c15f3c";

type Model = {
  name: string;
  seconds: string;
  params: number;
  paramsLabel: string;
  vram: number;
  vramLabel: string;
  accent?: boolean;
};

const models: Model[] = [
  { name: "SD3.5 Medium", seconds: "99.7 s", params: 2.5, paramsLabel: "2.5B", vram: 3.03, vramLabel: "3.03 GB" },
  { name: "SDXL 1.0", seconds: "109.0 s", params: 2.6, paramsLabel: "2.6B", vram: 4.04, vramLabel: "4.04 GB" },
  { name: "FLUX.1-dev", seconds: "518.1 s", params: 12, paramsLabel: "12B", vram: 2.57, vramLabel: "2.57 GB", accent: true },
  { name: "Qwen-Image 2.1", seconds: "615.1 s", params: 7, paramsLabel: "7B", vram: 7.1, vramLabel: "7.10 GB" },
];

const AX = 190;
const A_MAX = 250;
const BX = 500;
const B_MAX = 230;

const ModelMemory = () => {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 760 384"
      role="img"
      aria-label="Four models compared. SD3.5 has 2.5 billion parameters and peaks at 3.0 GB, SDXL 2.6 billion and 4.0 GB, FLUX.1-dev 12 billion and only 2.6 GB, Qwen-Image 2.1 7 billion and 7.1 GB. FLUX is the largest model and uses the least memory."
    >
      <text x={20} y={22} fontSize={17} fontWeight={700} fill="currentColor">
        The biggest model used the least memory
      </text>
      <text x={20} y={42} fontSize={12.5} fill="currentColor" opacity={0.55}>
        40 renders, 10 prompts, 1024 × 1024, 30 steps, one 8 GB card
      </text>

      <text x={AX} y={70} fontSize={11.5} fill="currentColor" opacity={0.5}>
        parameters
      </text>
      <text x={BX} y={70} fontSize={11.5} fill="currentColor" opacity={0.5}>
        peak VRAM
      </text>

      {models.map((m, i) => {
        const ry = 88 + i * 62;
        const aw = (m.params / 12) * A_MAX;
        const bw = (m.vram / 8) * B_MAX;
        const c = m.accent ? ACCENT : "currentColor";
        return (
          <g key={m.name}>
            <text x={8} y={ry + 13} fontSize={13} fontWeight={600} fill="currentColor">
              {m.name}
            </text>
            <text x={8} y={ry + 29} fontSize={11} fill="currentColor" opacity={0.5}>
              {m.seconds}
            </text>

            <rect x={AX} y={ry} width={A_MAX} height={18} rx={3} fill="currentColor" fillOpacity={0.05} />
            <rect
              x={AX}
              y={ry}
              width={aw}
              height={18}
              rx={3}
              fill={c}
              fillOpacity={m.accent ? 0.8 : 0.3}
            />
            <text
              x={AX + aw + 7}
              y={ry + 13}
              fontSize={12}
              fill={c}
              opacity={m.accent ? 1 : 0.7}
            >
              {m.paramsLabel}
            </text>

            <rect x={BX} y={ry} width={B_MAX} height={18} rx={3} fill="currentColor" fillOpacity={0.05} />
            <rect
              x={BX}
              y={ry}
              width={bw}
              height={18}
              rx={3}
              fill={c}
              fillOpacity={m.accent ? 0.8 : 0.3}
            />
            <text
              x={BX + bw + 7}
              y={ry + 13}
              fontSize={12}
              fill={c}
              opacity={m.accent ? 1 : 0.7}
            >
              {m.vramLabel}
            </text>
          </g>
        );
      })}

      {[0, 4, 8, 12].map((v) => (
        <text
          key={v}
          x={AX + (v / 12) * A_MAX}
          y={342}
          fontSize={11}
          fill="currentColor"
          opacity={0.4}
          textAnchor="middle"
        >
          {v}B
        </text>
      ))}
      {[0, 2, 4, 6, 8].map((v) => (
        <text
          key={v}
          x={BX + (v / 8) * B_MAX}
          y={342}
          fontSize={11}
          fill="currentColor"
          opacity={0.4}
          textAnchor="middle"
        >
          {v}
        </text>
      ))}

      <text x={380} y={372} fontSize={12.5} fill="currentColor" opacity={0.7} textAnchor="middle">
        FLUX has 4.8× the parameters of SD3.5 and still peaks lower than SDXL. Offload pays the difference in minutes.
      </text>
    </svg>
  );
};

export default ModelMemory;
