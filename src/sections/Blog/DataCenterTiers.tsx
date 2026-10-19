/**
 * Data center tiers (Uptime Institute I to IV) as a climbing ladder: each tier
 * adds redundancy and another nine of uptime. Inline so it follows the site
 * theme (currentColor); accents reuse the site colour.
 */
const DataCenterTiers = () => (
  <svg
    className="diagram-svg"
    viewBox="0 0 760 330"
    role="img"
    aria-label="The four data center tiers as rising bars. Tier I: no redundancy, about 99.67% uptime. Tier II: redundant parts, about 99.74%. Tier III: concurrently maintainable, about 99.98%. Tier IV: fault tolerant, about 99.995%. Each tier up adds redundancy and uptime."
  >
    {/* Header mark: ascending steps */}
    <rect x={24} y={26} width={6} height={8} fill="#c15f3c" />
    <rect x={32} y={22} width={6} height={12} fill="#c15f3c" />
    <rect x={40} y={17} width={6} height={17} fill="#c15f3c" />
    <text x={56} y={29} fontSize={15} fontWeight={700} fill="currentColor">
      Data center tiers
    </text>

    {/* Tier I */}
    <text x={135} y={182} fontSize={11} fill="#c15f3c" fontWeight={700} textAnchor="middle">99.67%</text>
    <rect x={70} y={190} width={130} height={70} rx={4} fill="#c15f3c" opacity={0.45} />
    <text x={135} y={282} fontSize={14} fontWeight={700} fill="currentColor" textAnchor="middle">Tier I</text>
    <text x={135} y={300} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">no redundancy</text>

    {/* Tier II */}
    <text x={300} y={142} fontSize={11} fill="#c15f3c" fontWeight={700} textAnchor="middle">99.74%</text>
    <rect x={235} y={150} width={130} height={110} rx={4} fill="#c15f3c" opacity={0.6} />
    <text x={300} y={282} fontSize={14} fontWeight={700} fill="currentColor" textAnchor="middle">Tier II</text>
    <text x={300} y={300} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">redundant parts</text>

    {/* Tier III */}
    <text x={465} y={97} fontSize={11} fill="#c15f3c" fontWeight={700} textAnchor="middle">99.98%</text>
    <rect x={400} y={105} width={130} height={155} rx={4} fill="#c15f3c" opacity={0.78} />
    <text x={465} y={282} fontSize={14} fontWeight={700} fill="currentColor" textAnchor="middle">Tier III</text>
    <text x={465} y={300} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">maintainable</text>

    {/* Tier IV */}
    <text className="diagram-blink" x={630} y={52} fontSize={11} fill="#c15f3c" fontWeight={700} textAnchor="middle">99.995%</text>
    <rect x={565} y={60} width={130} height={200} rx={4} fill="#c15f3c" opacity={0.92} />
    <text x={630} y={282} fontSize={14} fontWeight={700} fill="currentColor" textAnchor="middle">Tier IV</text>
    <text x={630} y={300} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">fault tolerant</text>

    {/* Baseline */}
    <line x1={40} y1={260} x2={720} y2={260} stroke="currentColor" strokeOpacity={0.25} />

    {/* Caption */}
    <text x={380} y={322} fontSize={13} fill="currentColor" opacity={0.6} textAnchor="middle">
      Each tier up is another layer of redundancy, and another nine of uptime.
    </text>
  </svg>
);

export default DataCenterTiers;
