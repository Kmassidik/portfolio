import KubernetesMark from "./KubernetesMark";

/**
 * How Kubernetes works: you hand the control plane a desired state, and its
 * controllers keep the worker nodes matching it (the reconcile loop). Inline so
 * it follows the site theme (currentColor); animations live in index.css.
 */
const K8sHowItWorks = () => (
  <svg
    className="diagram-svg"
    viewBox="0 0 780 340"
    role="img"
    aria-label="How Kubernetes works: kubectl sends a desired state to the control plane (API server, etcd, scheduler, controllers), which runs pods on the worker nodes and watches them, reconciling actual state back to the desired state."
  >
    <KubernetesMark transform="translate(24 6) scale(1.25)" />
    <text x={64} y={29} fontSize={15} fontWeight={700} fill="currentColor">
      How Kubernetes works
    </text>

    {/* kubectl */}
    <rect x={16} y={132} width={118} height={66} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.3} />
    <text x={32} y={162} fontSize={14} fontWeight={700} fill="currentColor">kubectl</text>
    <text x={32} y={183} fontSize={12} fill="currentColor" opacity={0.65}>apply YAML</text>

    {/* desired state → control plane */}
    <text x={168} y={151} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">desired</text>
    <line className="diagram-flow" x1={136} y1={165} x2={190} y2={165} stroke="#c15f3c" strokeWidth={2} />
    <path d="M200 165 L190 160 L190 170 Z" fill="#c15f3c" />

    {/* Control plane */}
    <rect x={206} y={62} width={212} height={214} rx={12} fill="none" stroke="#c15f3c" />
    <text x={222} y={88} fontSize={14} fontWeight={700} fill="currentColor">Control plane</text>
    {[
      { y: 100, label: "API server" },
      { y: 138, label: "etcd · state store" },
      { y: 176, label: "scheduler" },
      { y: 214, label: "controllers" },
    ].map((chip) => (
      <g key={chip.label}>
        <rect x={220} y={chip.y} width={184} height={30} rx={6} fill="none" stroke="currentColor" strokeOpacity={0.3} />
        <text x={232} y={chip.y + 20} fontSize={13} fill="currentColor">{chip.label}</text>
      </g>
    ))}

    {/* run → nodes */}
    <text x={447} y={150} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">run</text>
    <line className="diagram-flow" x1={422} y1={164} x2={466} y2={164} stroke="#c15f3c" strokeWidth={2} />
    <path d="M476 164 L466 159 L466 169 Z" fill="#c15f3c" />

    {/* watch ← nodes */}
    <text x={447} y={234} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">watch</text>
    <line x1={472} y1={218} x2={430} y2={218} stroke="#c15f3c" strokeWidth={2} />
    <path d="M420 218 L430 213 L430 223 Z" fill="#c15f3c" />

    {/* Worker nodes */}
    <rect x={476} y={62} width={288} height={214} rx={12} fill="none" stroke="currentColor" strokeOpacity={0.3} />
    <text x={492} y={88} fontSize={14} fontWeight={700} fill="currentColor">Worker nodes</text>

    {/* node 1 */}
    <rect x={492} y={100} width={256} height={80} rx={8} fill="none" stroke="currentColor" strokeOpacity={0.3} />
    <text x={504} y={120} fontSize={12} fill="currentColor" opacity={0.65}>kubelet</text>
    <rect x={504} y={132} width={20} height={20} rx={4} fill="#c15f3c" opacity={0.85} />
    <rect x={532} y={132} width={20} height={20} rx={4} fill="#c15f3c" opacity={0.85} />
    <rect className="diagram-blink" x={560} y={132} width={20} height={20} rx={4} fill="#c15f3c" />

    {/* node 2 */}
    <rect x={492} y={188} width={256} height={80} rx={8} fill="none" stroke="currentColor" strokeOpacity={0.3} />
    <text x={504} y={208} fontSize={12} fill="currentColor" opacity={0.65}>kubelet</text>
    <rect x={504} y={220} width={20} height={20} rx={4} fill="#c15f3c" opacity={0.85} />
    <rect x={532} y={220} width={20} height={20} rx={4} fill="#c15f3c" opacity={0.55} />
    <rect x={560} y={220} width={20} height={20} rx={4} fill="#c15f3c" opacity={0.85} />

    {/* Caption */}
    <text x={390} y={322} fontSize={13} fill="currentColor" opacity={0.6} textAnchor="middle">
      You declare the desired state. Controllers keep the actual state matching it.
    </text>
  </svg>
);

export default K8sHowItWorks;
