/**
 * Why three radios on HF / VHF / UHF can't hear each other: each band sits at a
 * different wavelength. Lower band, longer wave. The three sine waves are drawn
 * at the same width so the cycle count shows the relative wavelength (HF long
 * and slow, UHF short and dense). Inline so it follows the site theme
 * (currentColor); brand accent on the labels. Cycle counts are illustrative,
 * the wavelengths quoted are the real ranges.
 */
const ACCENT = "#c15f3c";

// A sine wave as an SVG path: `cycles` full waves across [x0, x1], centered on yc.
const wavePath = (x0: number, x1: number, yc: number, cycles: number, amp: number) => {
  const steps = 260;
  let d = `M ${x0} ${yc}`;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = x0 + (x1 - x0) * t;
    const y = yc - amp * Math.sin(2 * Math.PI * cycles * t);
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
};

const BandWavelengths = () => {
  const x0 = 214;
  const x1 = 736;
  const amp = 20;
  const bands = [
    { yc: 82, name: "HF", freq: "3–30 MHz", lambda: "λ ≈ 10–100 m", cycles: 2 },
    { yc: 170, name: "VHF", freq: "136–174 MHz", lambda: "λ ≈ 2 m", cycles: 8 },
    { yc: 258, name: "UHF", freq: "400–470 MHz", lambda: "λ ≈ 70 cm", cycles: 20 },
  ];

  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 760 320"
      role="img"
      aria-label="Three radio bands drawn as sine waves of the same width. HF (3 to 30 MHz) is a long, slow wave with a wavelength of roughly 10 to 100 metres. VHF (136 to 174 MHz) is a shorter wave at about 2 metres. UHF (400 to 470 MHz) is a short, dense wave at about 70 centimetres. Lower the band, the longer the wave, which is why the three never line up and can't hear each other directly."
    >
      {/* Header: radio-wave mark + title */}
      <circle cx={28} cy={24} r={3} fill={ACCENT} />
      <path d="M35 17 A11 11 0 0 1 35 31" fill="none" stroke={ACCENT} strokeWidth={2} />
      <path d="M40 12 A18 18 0 0 1 40 36" fill="none" stroke={ACCENT} strokeWidth={2} opacity={0.55} />
      <text x={56} y={29} fontSize={15} fontWeight={700} fill="currentColor">
        Different band, different wavelength
      </text>

      {bands.map((b) => (
        <g key={b.name}>
          {/* label column */}
          <text x={24} y={b.yc - 4} fontSize={15} fontWeight={700} fill="currentColor">
            {b.name}
          </text>
          <text x={24} y={b.yc + 15} fontSize={11.5} fill="currentColor" opacity={0.6}>
            {b.freq}
          </text>
          <text x={120} y={b.yc + 4} fontSize={12.5} fill={ACCENT}>
            {b.lambda}
          </text>
          {/* baseline */}
          <line x1={x0} y1={b.yc} x2={x1} y2={b.yc} stroke="currentColor" strokeOpacity={0.12} />
          {/* the wave */}
          <path d={wavePath(x0, x1, b.yc, b.cycles, amp)} fill="none" stroke="currentColor" strokeWidth={1.7} strokeOpacity={0.85} strokeLinecap="round" />
        </g>
      ))}

      {/* Caption */}
      <text x={380} y={304} fontSize={13} fill="currentColor" opacity={0.78} textAnchor="middle">
        Lower the band, the longer the wave. Three different lengths, so they never line up.
      </text>
    </svg>
  );
};

export default BandWavelengths;
