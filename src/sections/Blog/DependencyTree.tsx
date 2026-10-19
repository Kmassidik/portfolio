/**
 * What `npm install` really pulls in: you pick a few packages, each drags in a
 * tree of transitive dependencies, and any one of them can carry a known CVE.
 * Inline so it follows the site theme (currentColor); CVE nodes are red.
 */
const DependencyTree = () => (
  <svg
    className="diagram-svg"
    viewBox="0 0 760 320"
    role="img"
    aria-label="A dependency tree. Your app depends on a few direct packages, each of which pulls in several transitive dependencies, and a few of those carry a known CVE."
  >
    {/* Header mark: a warning triangle */}
    <path d="M34 12 L44 30 L24 30 Z" fill="none" stroke="#c15f3c" strokeWidth={2} strokeLinejoin="round" />
    <text x={34} y={28} fontSize={11} fontWeight={700} fill="#c15f3c" textAnchor="middle">!</text>
    <text x={56} y={29} fontSize={15} fontWeight={700} fill="currentColor">
      What npm install really pulls in
    </text>

    {/* Edges: app → direct deps */}
    <line x1={380} y1={80} x2={140} y2={120} stroke="currentColor" strokeOpacity={0.3} />
    <line x1={380} y1={80} x2={380} y2={120} stroke="currentColor" strokeOpacity={0.3} />
    <line x1={380} y1={80} x2={620} y2={120} stroke="currentColor" strokeOpacity={0.3} />

    {/* Edges: direct deps → transitive deps */}
    <line x1={140} y1={160} x2={105} y2={204} stroke="currentColor" strokeOpacity={0.25} />
    <line x1={140} y1={160} x2={140} y2={204} stroke="currentColor" strokeOpacity={0.25} />
    <line x1={140} y1={160} x2={175} y2={204} stroke="currentColor" strokeOpacity={0.25} />
    <line x1={380} y1={160} x2={345} y2={204} stroke="currentColor" strokeOpacity={0.25} />
    <line x1={380} y1={160} x2={380} y2={204} stroke="currentColor" strokeOpacity={0.25} />
    <line x1={380} y1={160} x2={415} y2={204} stroke="currentColor" strokeOpacity={0.25} />
    <line x1={620} y1={160} x2={585} y2={204} stroke="currentColor" strokeOpacity={0.25} />
    <line x1={620} y1={160} x2={620} y2={204} stroke="currentColor" strokeOpacity={0.25} />
    <line x1={620} y1={160} x2={655} y2={204} stroke="currentColor" strokeOpacity={0.25} />

    {/* Root: your app */}
    <rect x={320} y={38} width={120} height={42} rx={8} fill="none" stroke="#c15f3c" />
    <text x={380} y={64} fontSize={13} fontWeight={700} fill="currentColor" textAnchor="middle">your app</text>

    {/* Direct deps */}
    <rect x={85} y={120} width={110} height={40} rx={8} fill="none" stroke="currentColor" strokeOpacity={0.35} />
    <text x={140} y={144} fontSize={12} fill="currentColor" textAnchor="middle">a package</text>
    <rect x={325} y={120} width={110} height={40} rx={8} fill="none" stroke="currentColor" strokeOpacity={0.35} />
    <text x={380} y={144} fontSize={12} fill="currentColor" textAnchor="middle">a package</text>
    <rect x={565} y={120} width={110} height={40} rx={8} fill="none" stroke="currentColor" strokeOpacity={0.35} />
    <text x={620} y={144} fontSize={12} fill="currentColor" textAnchor="middle">a package</text>

    {/* Transitive deps (dots), a few flagged as CVEs */}
    <circle cx={105} cy={214} r={9} fill="#c15f3c" opacity={0.45} />
    <circle cx={140} cy={214} r={9} fill="#c15f3c" opacity={0.45} />
    <circle cx={175} cy={214} r={9} fill="#d9534f" />
    <text x={175} y={218} fontSize={10} fontWeight={700} fill="#ffffff" textAnchor="middle">!</text>
    <circle cx={345} cy={214} r={9} fill="#d9534f" />
    <text x={345} y={218} fontSize={10} fontWeight={700} fill="#ffffff" textAnchor="middle">!</text>
    <circle cx={380} cy={214} r={9} fill="#c15f3c" opacity={0.45} />
    <circle cx={415} cy={214} r={9} fill="#c15f3c" opacity={0.45} />
    <circle cx={585} cy={214} r={9} fill="#c15f3c" opacity={0.45} />
    <circle cx={620} cy={214} r={9} fill="#c15f3c" opacity={0.45} />
    <circle cx={655} cy={214} r={9} fill="#d9534f" />
    <text x={655} y={218} fontSize={10} fontWeight={700} fill="#ffffff" textAnchor="middle">!</text>

    <text x={380} y={252} fontSize={11} fill="currentColor" opacity={0.6} textAnchor="middle">
      ...and hundreds more below these
    </text>

    {/* Legend */}
    <circle cx={296} cy={280} r={7} fill="#d9534f" />
    <text x={310} y={284} fontSize={12} fill="currentColor" opacity={0.75}>has a known CVE</text>

    {/* Caption */}
    <text x={380} y={308} fontSize={13} fill="currentColor" opacity={0.6} textAnchor="middle">
      You install a handful. You get hundreds. Any one of them can carry a known vulnerability.
    </text>
  </svg>
);

export default DependencyTree;
