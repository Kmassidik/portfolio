/**
 * The power chain that keeps a rack alive: utility feed, a transfer switch, a
 * UPS to cover the gap, a generator for the long haul, a PDU, then the rack.
 * Inline so it follows the site theme (currentColor); accents reuse the site
 * colour.
 */
const DataCenterPower = () => (
  <svg
    className="diagram-svg"
    viewBox="0 0 760 300"
    role="img"
    aria-label="The power chain: utility power enters a transfer switch (ATS), which feeds a UPS, then a PDU, then the rack. A diesel generator feeds the transfer switch as backup when the grid fails."
  >
    {/* Header mark: a lightning bolt */}
    <path d="M36 10 L26 24 L33 24 L30 34 L42 18 L35 18 Z" fill="#c15f3c" />
    <text x={56} y={29} fontSize={15} fontWeight={700} fill="currentColor">
      The power chain
    </text>

    {/* Utility */}
    <rect x={18} y={104} width={108} height={70} rx={8} fill="none" stroke="currentColor" strokeOpacity={0.3} />
    <text x={72} y={135} fontSize={13} fontWeight={700} fill="currentColor" textAnchor="middle">Utility</text>
    <text x={72} y={153} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">grid feed</text>

    <line className="diagram-flow" x1={126} y1={139} x2={162} y2={139} stroke="#c15f3c" strokeWidth={2} />
    <path d="M168 139 L158 134 L158 144 Z" fill="#c15f3c" />

    {/* ATS */}
    <rect x={170} y={104} width={104} height={70} rx={8} fill="none" stroke="#c15f3c" />
    <text x={222} y={135} fontSize={13} fontWeight={700} fill="currentColor" textAnchor="middle">ATS</text>
    <text x={222} y={153} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">transfer switch</text>

    <line className="diagram-flow" x1={274} y1={139} x2={310} y2={139} stroke="#c15f3c" strokeWidth={2} />
    <path d="M316 139 L306 134 L306 144 Z" fill="#c15f3c" />

    {/* UPS */}
    <rect x={318} y={104} width={104} height={70} rx={8} fill="none" stroke="currentColor" strokeOpacity={0.3} />
    <text x={370} y={135} fontSize={13} fontWeight={700} fill="currentColor" textAnchor="middle">UPS</text>
    <text x={370} y={153} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">battery bridge</text>

    <line className="diagram-flow" x1={422} y1={139} x2={458} y2={139} stroke="#c15f3c" strokeWidth={2} />
    <path d="M464 139 L454 134 L454 144 Z" fill="#c15f3c" />

    {/* PDU */}
    <rect x={466} y={104} width={104} height={70} rx={8} fill="none" stroke="currentColor" strokeOpacity={0.3} />
    <text x={518} y={135} fontSize={13} fontWeight={700} fill="currentColor" textAnchor="middle">PDU</text>
    <text x={518} y={153} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">distribution</text>

    <line className="diagram-flow" x1={570} y1={139} x2={606} y2={139} stroke="#c15f3c" strokeWidth={2} />
    <path d="M612 139 L602 134 L602 144 Z" fill="#c15f3c" />

    {/* Rack */}
    <rect x={614} y={100} width={120} height={80} rx={8} fill="none" stroke="#c15f3c" />
    <text x={674} y={135} fontSize={13} fontWeight={700} fill="currentColor" textAnchor="middle">Rack</text>
    <text x={674} y={153} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">A + B feed</text>

    {/* Generator → ATS (backup) */}
    <line className="diagram-flow" x1={222} y1={214} x2={222} y2={182} stroke="#c15f3c" strokeWidth={2} />
    <path d="M222 176 L217 186 L227 186 Z" fill="#c15f3c" />
    <rect x={170} y={216} width={104} height={58} rx={8} fill="none" stroke="currentColor" strokeOpacity={0.3} />
    <text x={222} y={241} fontSize={13} fontWeight={700} fill="currentColor" textAnchor="middle">Generator</text>
    <text x={222} y={259} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">diesel, on outage</text>

    {/* Caption */}
    <text x={400} y={294} fontSize={13} fill="currentColor" opacity={0.6} textAnchor="middle">
      Grid power, a UPS to cover the gap, a generator for the long haul, then out to the racks.
    </text>
  </svg>
);

export default DataCenterPower;
