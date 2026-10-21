/**
 * The inference stack as six rungs, with the names sorted onto them.
 *   The point is that TensorRT is a compiler, TensorRT-LLM is an engine, and
 *   Triton the kernel language is four rungs below Triton Inference Server.
 *   Inline SVG so it follows the site theme (currentColor); accent is the
 *   site's terracotta and marks the rung this project works on.
 */
const ACCENT = "#c15f3c";

type Row = {
  rung: string;
  desc: string;
  lines: string[];
  y: number;
  h: number;
  accent?: boolean;
};

const rows: Row[] = [
  {
    rung: "5 · serving",
    desc: "wraps an engine in an API",
    lines: ["Triton Inference Server · Ray Serve"],
    y: 44,
    h: 46,
  },
  {
    rung: "4 · engine",
    desc: "owns the generation loop",
    lines: [
      "text engines   llama.cpp · Ollama · vLLM · SGLang · TensorRT-LLM",
      "image + audio engines   diffusers · ComfyUI · xDiT · audio.cpp",
    ],
    y: 100,
    h: 58,
    accent: true,
  },
  {
    rung: "3 · framework",
    desc: "tensors, dispatch, autograd",
    lines: ["PyTorch · ggml / GGUF"],
    y: 168,
    h: 46,
  },
  {
    rung: "2 · compiler",
    desc: "maths into device code",
    lines: ["Triton the kernel language · TensorRT · XLA"],
    y: 224,
    h: 46,
  },
  {
    rung: "1 · metal",
    desc: "the raw compute API",
    lines: ["CUDA · ROCm / HIP · Metal"],
    y: 280,
    h: 46,
  },
  {
    rung: "0 · silicon",
    desc: "the physical chip",
    lines: ["RTX 3060 Ti · sm_86"],
    y: 336,
    h: 46,
  },
];

const EngineRungs = () => {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 760 424"
      role="img"
      aria-label="Six rungs of the inference stack, bottom to top: silicon, metal, compiler, framework, engine, serving. TensorRT sits on the compiler rung, TensorRT-LLM on the text engine rung. Triton the kernel language is on the compiler rung while Triton Inference Server is on the serving rung."
    >
      <text x={20} y={24} fontSize={16} fontWeight={700} fill="currentColor">
        One stack, six rungs, and the names sorted onto them
      </text>

      {rows.map((r) => {
        const twoLines = r.lines.length > 1;
        return (
          <g key={r.rung}>
            <rect
              x={4}
              y={r.y}
              width={206}
              height={r.h}
              rx={6}
              fill="currentColor"
              fillOpacity={0.04}
              stroke="currentColor"
              strokeOpacity={0.25}
            />
            <text x={16} y={r.y + 20} fontSize={13} fontWeight={700} fill="currentColor">
              {r.rung}
            </text>
            <text x={16} y={r.y + 36} fontSize={11} fill="currentColor" opacity={0.55}>
              {r.desc}
            </text>

            <rect
              x={220}
              y={r.y}
              width={536}
              height={r.h}
              rx={6}
              fill={r.accent ? ACCENT : "currentColor"}
              fillOpacity={r.accent ? 0.07 : 0.03}
              stroke={r.accent ? ACCENT : "currentColor"}
              strokeOpacity={r.accent ? 0.7 : 0.22}
            />
            {r.lines.map((line, i) => (
              <text
                key={i}
                x={232}
                y={twoLines ? r.y + 23 + i * 20 : r.y + 27}
                fontSize={11.5}
                fill="currentColor"
                opacity={0.88}
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}

      <text x={380} y={408} fontSize={12} fill="currentColor" opacity={0.7} textAnchor="middle">
        The rungs are stable, the occupants are not. TensorRT is a compiler, TensorRT-LLM is the engine above it.
      </text>
    </svg>
  );
};

export default EngineRungs;
