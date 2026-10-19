import KubernetesMark from "./KubernetesMark";

/**
 * Cloudflare Tunnel → k3s cluster architecture, rendered inline so it follows
 * the site theme (currentColor). The Kubernetes mark keeps its brand blue;
 * accents reuse the site colour. Animations live in index.css (.diagram-*).
 */
const K8sDiagram = () => (
  <svg
    className="diagram-svg"
    viewBox="0 0 760 320"
    role="img"
    aria-label="Architecture: traffic enters through Cloudflare and an outbound tunnel into a k3s cluster running on bare-metal VMs with no public IP."
  >
    {/* Kubernetes brand mark */}
    <KubernetesMark transform="translate(24 6) scale(1.25)" />
    <text x={64} y={29} fontSize={15} fontWeight={700} fill="currentColor">
      k3s on bare metal
    </text>

    {/* Cloudflare edge */}
    <rect
      x={24}
      y={78}
      width={180}
      height={116}
      rx={12}
      fill="none"
      stroke="currentColor"
      strokeOpacity={0.3}
    />
    <text x={44} y={112} fontSize={15} fontWeight={700} fill="currentColor">
      Cloudflare
    </text>
    <text x={44} y={138} fontSize={13} fill="currentColor" opacity={0.65}>
      edge + tunnel
    </text>

    {/* Outbound tunnel */}
    <text
      x={252}
      y={122}
      fontSize={12}
      fill="currentColor"
      opacity={0.65}
      textAnchor="middle"
    >
      tunnel
    </text>
    <line
      className="diagram-flow"
      x1={208}
      y1={136}
      x2={296}
      y2={136}
      stroke="#c15f3c"
      strokeWidth={2}
    />
    <path d="M306 136 L296 131 L296 141 Z" fill="#c15f3c" />
    <circle className="diagram-dot" cx={208} cy={136} r={4} fill="#c15f3c" />

    {/* k3s cluster */}
    <rect
      x={312}
      y={60}
      width={424}
      height={176}
      rx={12}
      fill="none"
      stroke="#c15f3c"
    />
    <text x={332} y={90} fontSize={15} fontWeight={700} fill="currentColor">
      k3s cluster
    </text>
    <text x={332} y={112} fontSize={13} fill="currentColor" opacity={0.65}>
      bare-metal VMs · no public IP
    </text>

    {/* node 1 */}
    <rect
      x={332}
      y={126}
      width={186}
      height={92}
      rx={8}
      fill="none"
      stroke="currentColor"
      strokeOpacity={0.3}
    />
    <text x={344} y={146} fontSize={12} fill="currentColor" opacity={0.65}>
      node
    </text>
    <rect x={344} y={160} width={24} height={24} rx={4} fill="#c15f3c" opacity={0.85} />
    <rect x={376} y={160} width={24} height={24} rx={4} fill="#c15f3c" opacity={0.85} />
    <rect x={408} y={160} width={24} height={24} rx={4} fill="#c15f3c" opacity={0.55} />

    {/* node 2 */}
    <rect
      x={530}
      y={126}
      width={186}
      height={92}
      rx={8}
      fill="none"
      stroke="currentColor"
      strokeOpacity={0.3}
    />
    <text x={542} y={146} fontSize={12} fill="currentColor" opacity={0.65}>
      node
    </text>
    <rect x={542} y={160} width={24} height={24} rx={4} fill="#c15f3c" opacity={0.85} />
    <rect
      className="diagram-blink"
      x={574}
      y={160}
      width={24}
      height={24}
      rx={4}
      fill="#c15f3c"
    />
    <rect x={606} y={160} width={24} height={24} rx={4} fill="#c15f3c" opacity={0.55} />

    {/* Caption */}
    <text
      x={380}
      y={300}
      fontSize={13}
      fill="currentColor"
      opacity={0.6}
      textAnchor="middle"
    >
      No public IP. The cluster dials out to Cloudflare, so nothing is exposed
      inbound.
    </text>
  </svg>
);

export default K8sDiagram;
