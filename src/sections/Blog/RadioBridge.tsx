/**
 * The cross-band bridge as a top-to-bottom signal chain:
 *   3 radios (HF / VHF / UHF)
 *     -> interface board (trims + isolates the analog audio so a radio can't
 *        short into the Pi, and automates PTT via a BJT)
 *     -> USB audio (sound card)
 *     -> Raspberry Pi (bridge logic)
 * The Pi signals the board, and the board keys each radio's PTT back up the
 * loop. Inline SVG so it follows the site theme (currentColor); brand accent is
 * the site's terracotta. Layout adapted from a design by Kurnia.
 */
const ACCENT = "#c15f3c";

const RadioBridge = () => {
  const radios = [
    { x: 60, name: "HF manpack", band: "3–30 MHz", end: [280, 285] },
    { x: 290, name: "VHF walkie", band: "136–174 MHz", end: [380, 285] },
    { x: 520, name: "UHF handy", band: "400–470 MHz", end: [480, 285] },
  ];

  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 760 880"
      role="img"
      aria-label="The cross-band bridge as a top-to-bottom signal chain. Three radios (HF, VHF, UHF) feed an interface board that trims and isolates the analog audio so a radio cannot short into the Pi and that automates push-to-talk with a transistor. The board connects through a USB audio sound card into a Raspberry Pi running the bridge logic. The Pi signals the board, and the board keys each radio's PTT back around the loop."
    >
      <defs>
        <marker id="rb-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="currentColor" />
        </marker>
        <marker id="rb-arrow-accent" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={ACCENT} />
        </marker>
      </defs>

      {/* Header: radio-wave mark + title */}
      <g transform="translate(60, 50)">
        <circle cx={5} cy={20} r={4} fill={ACCENT} />
        <path d="M 12,12 A 10,10 0 0,1 12,28" fill="none" stroke={ACCENT} strokeWidth={2.5} strokeLinecap="round" />
        <path d="M 18,6 A 18,18 0 0,1 18,34" fill="none" stroke={ACCENT} strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
        <text x={36} y={26} fontSize={23} fontWeight={700} fill="currentColor">One bridge, three bands</text>
      </g>

      {/* Radios */}
      {radios.map((r) => (
        <g key={r.name} transform={`translate(${r.x}, 120)`}>
          <rect width={180} height={72} rx={12} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1.5} />
          <text x={90} y={32} fontSize={16} fontWeight={700} fill="currentColor" textAnchor="middle">{r.name}</text>
          <rect x={25} y={42} width={130} height={22} rx={10} fill={ACCENT} fillOpacity={0.08} stroke={ACCENT} strokeOpacity={0.4} strokeWidth={1} />
          <text x={90} y={57} fontSize={11.5} fontWeight={600} fill={ACCENT} textAnchor="middle">{r.band}</text>
          {/* socket pin */}
          <line x1={160} y1={12} x2={175} y2={-6} stroke={ACCENT} strokeWidth={1.6} />
          <circle cx={175} cy={-6} r={3.5} fill={ACCENT} />
        </g>
      ))}

      {/* Audio path: radios -> interface board (marching ants) */}
      {radios.map((r) => (
        <line
          key={`wire-${r.name}`}
          className="diagram-flow"
          x1={r.x + 90}
          y1={192}
          x2={r.end[0]}
          y2={r.end[1]}
          stroke="currentColor"
          strokeOpacity={0.45}
          strokeWidth={1.6}
          markerEnd="url(#rb-arrow)"
        />
      ))}

      {/* Stage 2: interface board (the crucial one) */}
      <g transform="translate(210, 290)">
        <rect width={340} height={150} rx={14} fill={ACCENT} fillOpacity={0.04} stroke={ACCENT} strokeWidth={1.8} />
        <text x={170} y={36} fontSize={18} fontWeight={700} fill="currentColor" textAnchor="middle">Interface board</text>
        <text x={170} y={66} fontSize={13.5} fill="currentColor" opacity={0.72} textAnchor="middle">trims the analog level</text>
        <text x={170} y={88} fontSize={13.5} fill="currentColor" opacity={0.72} textAnchor="middle">isolates · short guard</text>
        <text x={170} y={110} fontSize={13.5} fill="currentColor" opacity={0.72} textAnchor="middle">auto PTT (BJT)</text>
        <text x={170} y={134} fontSize={12.5} fill={ACCENT} textAnchor="middle">keeps a radio from shorting the Pi</text>
      </g>

      {/* board -> USB audio */}
      <line className="diagram-flow" x1={380} y1={440} x2={380} y2={505} stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.8} markerEnd="url(#rb-arrow)" />
      <text x={415} y={476} fontSize={12.5} fontStyle="italic" fill="currentColor" opacity={0.6}>audio ↓</text>

      {/* Stage 3: USB audio */}
      <g transform="translate(270, 510)">
        <rect width={220} height={72} rx={12} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1.5} />
        <text x={110} y={34} fontSize={16} fontWeight={700} fill="currentColor" textAnchor="middle">USB audio</text>
        <text x={110} y={54} fontSize={13} fill="currentColor" opacity={0.6} textAnchor="middle">sound card</text>
      </g>

      {/* USB -> Pi */}
      <line className="diagram-flow" x1={380} y1={582} x2={380} y2={645} stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.8} markerEnd="url(#rb-arrow)" />

      {/* Stage 4: Raspberry Pi */}
      <g transform="translate(250, 650)">
        <rect width={260} height={85} rx={14} fill={ACCENT} fillOpacity={0.04} stroke={ACCENT} strokeWidth={1.8} />
        <circle className="diagram-blink" cx={45} cy={32} r={5.5} fill={ACCENT} />
        <text x={142} y={38} fontSize={18} fontWeight={700} fill="currentColor" textAnchor="middle">Raspberry Pi</text>
        <text x={142} y={60} fontSize={13.5} fill="currentColor" opacity={0.6} textAnchor="middle">bridge logic</text>
      </g>

      {/* Control: the Pi picks who transmits and signals the board, which
          switches the PTT. The board, not the Pi, keys the radios. */}
      <path
        d="M 510,692 L 642,692 L 642,400 L 554,400"
        fill="none"
        stroke={ACCENT}
        strokeOpacity={0.55}
        strokeWidth={1.6}
        strokeDasharray="6 4"
        markerEnd="url(#rb-arrow-accent)"
      />
      <text transform="rotate(-90 662 548)" x={662} y={548} fontSize={12.5} fill={ACCENT} opacity={0.85} textAnchor="middle">
        Pi picks who transmits → board switches PTT
      </text>

      {/* Caption */}
      <text x={380} y={805} fontSize={15} fill="currentColor" opacity={0.8} textAnchor="middle">
        One on HF, one on VHF, one on UHF. Same conversation.
      </text>
    </svg>
  );
};

export default RadioBridge;
