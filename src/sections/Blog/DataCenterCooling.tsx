/**
 * How a data center stays cold: CRAC units push cold air into the fronts of the
 * racks, hot air comes out the back and returns to be cooled again. Inline so it
 * follows the site theme (currentColor); cold is blue, hot reuses the accent.
 */
const DataCenterCooling = () => (
  <svg
    className="diagram-svg"
    viewBox="0 0 760 300"
    role="img"
    aria-label="A cooling loop: a CRAC unit pushes cold air into the front of a rack, hot air leaves the back of the rack and returns to the CRAC unit to be cooled again."
  >
    {/* Header mark: cold air falling */}
    <path d="M24 12 L28 18 L32 12 Z" fill="#5b9bd5" />
    <path d="M34 12 L38 18 L42 12 Z" fill="#5b9bd5" />
    <path d="M29 20 L33 26 L37 20 Z" fill="#5b9bd5" />
    <text x={56} y={29} fontSize={15} fontWeight={700} fill="currentColor">
      How the room stays cold
    </text>

    {/* Hot-air return (rack back → up → over → CRAC) */}
    <text x={325} y={50} fontSize={11} fill="#c15f3c" fontWeight={700} textAnchor="middle">hot air returns</text>
    <polyline className="diagram-flow" points="505,100 505,58 145,58 145,106" fill="none" stroke="#c15f3c" strokeWidth={2} />
    <path d="M145 112 L140 102 L150 102 Z" fill="#c15f3c" />

    {/* CRAC */}
    <rect x={70} y={110} width={150} height={120} rx={8} fill="none" stroke="#5b9bd5" />
    <text x={145} y={162} fontSize={14} fontWeight={700} fill="currentColor" textAnchor="middle">CRAC unit</text>
    <text x={145} y={182} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">+ chiller loop</text>

    {/* Cold-air supply (CRAC → rack front) */}
    <text x={322} y={156} fontSize={11} fill="#5b9bd5" fontWeight={700} textAnchor="middle">cold air</text>
    <line className="diagram-flow" x1={222} y1={170} x2={424} y2={170} stroke="#5b9bd5" strokeWidth={2} />
    <path d="M430 170 L420 165 L420 175 Z" fill="#5b9bd5" />

    {/* Rack */}
    <rect x={430} y={100} width={150} height={140} rx={8} fill="none" stroke="#c15f3c" />
    <text x={505} y={124} fontSize={13} fontWeight={700} fill="currentColor" textAnchor="middle">Rack</text>
    <rect x={446} y={140} width={118} height={16} rx={2} fill="#c15f3c" opacity={0.85} />
    <rect x={446} y={164} width={118} height={16} rx={2} fill="#c15f3c" opacity={0.55} />
    <rect x={446} y={188} width={118} height={16} rx={2} fill="#c15f3c" opacity={0.85} />
    <text x={505} y={224} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">cold front · hot back</text>

    {/* Caption */}
    <text x={380} y={282} fontSize={13} fill="currentColor" opacity={0.6} textAnchor="middle">
      Cold air into the front, hot air out the back, pulled away and cooled again. Forever.
    </text>
  </svg>
);

export default DataCenterCooling;
