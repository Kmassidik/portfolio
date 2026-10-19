/**
 * A data center rack and what keeps it alive: power, cooling, and network.
 * Inline so it follows the site theme (currentColor); accents reuse the site
 * colour. Animations live in index.css (.diagram-*).
 */
const DataCenterRack = () => (
  <svg
    className="diagram-svg"
    viewBox="0 0 760 360"
    role="img"
    aria-label="One server rack holding a switch, 1U and 2U servers, a NAS, and a KVM, fed by three things that keep it alive: power (electrical circuits and UPS), cooling (AC and cold-aisle airflow), and network (switches, routers, Cat6 and fiber)."
  >
    {/* Header mark: a little stack of server units */}
    <rect x={26} y={12} width={28} height={9} rx={2} fill="#c15f3c" />
    <rect x={26} y={23} width={28} height={9} rx={2} fill="#c15f3c" opacity={0.55} />
    <text x={64} y={29} fontSize={15} fontWeight={700} fill="currentColor">
      Inside a data center rack
    </text>

    {/* Rack */}
    <rect x={60} y={74} width={150} height={236} rx={8} fill="none" stroke="#c15f3c" />
    <text x={72} y={96} fontSize={13} fontWeight={700} fill="currentColor">Rack</text>
    {/* Top of rack: the switch / router (MikroTik), with ports + a link light */}
    <rect x={74} y={108} width={122} height={18} rx={2} fill="#c15f3c" opacity={0.9} />
    <rect x={80} y={115} width={8} height={5} rx={1} fill="#201f1e" opacity={0.55} />
    <rect x={92} y={115} width={8} height={5} rx={1} fill="#201f1e" opacity={0.55} />
    <rect x={104} y={115} width={8} height={5} rx={1} fill="#201f1e" opacity={0.55} />
    <rect x={116} y={115} width={8} height={5} rx={1} fill="#201f1e" opacity={0.55} />
    <rect x={128} y={115} width={8} height={5} rx={1} fill="#201f1e" opacity={0.55} />
    <rect x={140} y={115} width={8} height={5} rx={1} fill="#201f1e" opacity={0.55} />
    <rect x={152} y={115} width={8} height={5} rx={1} fill="#201f1e" opacity={0.55} />
    <circle className="diagram-blink" cx={180} cy={117} r={3} fill="#6fcf97" />
    {/* Servers */}
    <rect x={74} y={130} width={122} height={18} rx={2} fill="#c15f3c" opacity={0.55} />
    <rect x={74} y={152} width={122} height={34} rx={2} fill="#c15f3c" opacity={0.85} />
    <rect x={74} y={192} width={122} height={18} rx={2} fill="#c15f3c" opacity={0.55} />
    <rect x={74} y={214} width={122} height={34} rx={2} fill="#c15f3c" opacity={0.85} />
    <rect x={74} y={254} width={122} height={18} rx={2} fill="#c15f3c" opacity={0.55} />

    {/* Form-factor labels (left) */}
    <line x1={60} y1={117} x2={48} y2={117} stroke="currentColor" strokeOpacity={0.4} />
    <text x={44} y={121} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="end">switch</text>
    <line x1={60} y1={139} x2={48} y2={139} stroke="currentColor" strokeOpacity={0.4} />
    <text x={44} y={143} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="end">1U</text>
    <line x1={60} y1={169} x2={48} y2={169} stroke="currentColor" strokeOpacity={0.4} />
    <text x={44} y={173} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="end">2U</text>
    <line x1={60} y1={201} x2={48} y2={201} stroke="currentColor" strokeOpacity={0.4} />
    <text x={44} y={205} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="end">NAS</text>
    <line x1={60} y1={263} x2={48} y2={263} stroke="currentColor" strokeOpacity={0.4} />
    <text x={44} y={267} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="end">KVM</text>

    {/* Feeds → rack */}
    <line className="diagram-flow" x1={428} y1={113} x2={218} y2={113} stroke="#c15f3c" strokeWidth={2} />
    <path d="M210 113 L220 108 L220 118 Z" fill="#c15f3c" />
    <line className="diagram-flow" x1={428} y1={187} x2={218} y2={187} stroke="#c15f3c" strokeWidth={2} />
    <path d="M210 187 L220 182 L220 192 Z" fill="#c15f3c" />
    <line className="diagram-flow" x1={428} y1={261} x2={218} y2={261} stroke="#c15f3c" strokeWidth={2} />
    <path d="M210 261 L220 256 L220 266 Z" fill="#c15f3c" />

    {/* Power */}
    <rect x={430} y={84} width={290} height={58} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.3} />
    <text x={448} y={109} fontSize={14} fontWeight={700} fill="currentColor">Power</text>
    <text x={448} y={128} fontSize={12} fill="currentColor" opacity={0.65}>electrical circuits, UPS</text>

    {/* Cooling */}
    <rect x={430} y={158} width={290} height={58} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.3} />
    <text x={448} y={183} fontSize={14} fontWeight={700} fill="currentColor">Cooling</text>
    <text x={448} y={202} fontSize={12} fill="currentColor" opacity={0.65}>AC, cold-aisle airflow</text>

    {/* Network */}
    <rect x={430} y={232} width={290} height={58} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.3} />
    <text x={448} y={257} fontSize={14} fontWeight={700} fill="currentColor">Network</text>
    <text x={448} y={276} fontSize={12} fill="currentColor" opacity={0.65}>switches &amp; routers (MikroTik), fiber</text>

    {/* Caption */}
    <text x={390} y={346} fontSize={13} fill="currentColor" opacity={0.6} textAnchor="middle">
      A rack is metal, power, cold air, and cables. The cloud is a room someone keeps cold.
    </text>
  </svg>
);

export default DataCenterRack;
