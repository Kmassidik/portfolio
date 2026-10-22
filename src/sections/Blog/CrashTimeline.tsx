/**
 * Peak memory through one diffusion render, before the fix.
 *   The denoise is flat because the model is streamed, and the VAE decode is a
 *   single pass that lands the whole image at once. That last pass is the peak.
 *   Inline SVG so it follows the site theme (currentColor); accent is terracotta.
 */
const ACCENT = "#c15f3c";

const y = (gb: number) => 250 - gb * 23.75;

const CrashTimeline = () => {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 760 336"
      role="img"
      aria-label="GPU memory through one bf16 render. It ramps to 1.4 GB during loading, stays flat at 1.4 GB across thirty denoising steps, then spikes to 7 GB for the single VAE decode pass, just under the 8 GB ceiling, and that is where the out-of-memory error happened."
    >
      <text x={20} y={22} fontSize={17} fontWeight={700} fill="currentColor">
        One render, and the moment it died
      </text>
      <text x={20} y={42} fontSize={12.5} fill="currentColor" opacity={0.55}>
        bf16, 1024 × 1024, 30 steps, one 8 GB card, before the fix
      </text>

      {[2, 4, 6].map((v) => (
        <line
          key={v}
          x1={70}
          x2={730}
          y1={y(v)}
          y2={y(v)}
          stroke="currentColor"
          strokeOpacity={0.09}
        />
      ))}

      <line
        x1={70}
        x2={730}
        y1={y(8)}
        y2={y(8)}
        stroke="currentColor"
        strokeOpacity={0.45}
        strokeDasharray="4 4"
      />
      <text x={70} y={y(8) - 7} fontSize={11.5} fill="currentColor" opacity={0.55}>
        8 GB card
      </text>

      <path
        d={`M 70 250 L 110 ${y(1.4)} L 600 ${y(1.4)} L 612 ${y(7.0)} L 624 ${y(
          7.0
        )} L 636 250 Z`}
        fill={ACCENT}
        fillOpacity={0.16}
        stroke={ACCENT}
        strokeWidth={2}
      />

      <line
        x1={612}
        x2={612}
        y1={y(7.0)}
        y2={250}
        stroke={ACCENT}
        strokeOpacity={0.3}
        strokeDasharray="3 3"
      />
      <circle cx={612} cy={y(7.0)} r={4.5} fill={ACCENT} />

      <text x={600} y={110} fontSize={13} fontWeight={700} fill={ACCENT} textAnchor="end">
        out of memory
      </text>
      <text x={600} y={126} fontSize={11.5} fill="currentColor" opacity={0.65} textAnchor="end">
        5.19 GiB allocated
      </text>
      <text x={600} y={140} fontSize={11.5} fill="currentColor" opacity={0.65} textAnchor="end">
        1.90 GiB reserved, unallocated
      </text>

      <text x={300} y={y(1.4) - 8} fontSize={12.5} fill="currentColor" opacity={0.7} textAnchor="middle">
        1.4 GB, steady
      </text>

      {[0, 2, 4, 6, 8].map((v) => (
        <text
          key={v}
          x={60}
          y={y(v) + 4}
          fontSize={11.5}
          fill="currentColor"
          opacity={0.45}
          textAnchor="end"
        >
          {v}
        </text>
      ))}
      <text x={60} y={268} fontSize={11.5} fill="currentColor" opacity={0.45} textAnchor="end">
        GB
      </text>

      <text x={88} y={270} fontSize={12} fill="currentColor" opacity={0.6} textAnchor="middle">
        load
      </text>
      <text x={355} y={270} fontSize={12} fill="currentColor" opacity={0.6} textAnchor="middle">
        30 denoising steps
      </text>
      <text x={660} y={270} fontSize={12} fill="currentColor" opacity={0.6} textAnchor="middle">
        decode
      </text>

      <text x={380} y={308} fontSize={12.5} fill="currentColor" opacity={0.7} textAnchor="middle">
        The denoise never came close to the ceiling. The last pass did.
      </text>
    </svg>
  );
};

export default CrashTimeline;
