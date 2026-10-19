/**
 * CI/CD pipeline: a push runs GitHub Actions (build, test, image), which writes the
 * new image tag to git; Argo CD syncs the k3s cluster to match git. Inline so
 * it follows the site theme (currentColor); animations live in index.css.
 */
const CicdDiagram = () => (
  <svg
    className="diagram-svg"
    viewBox="0 0 780 290"
    role="img"
    aria-label="CI/CD pipeline: a git push triggers GitHub Actions to build, test, and push a container image, then write the new tag to git; Argo CD watches git and syncs the k3s cluster to match."
  >
    {/* GitHub brand mark */}
    <g transform="translate(24 6) scale(1.25)" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </g>
    <text x={64} y={29} fontSize={15} fontWeight={700} fill="currentColor">
      CI/CD: git push to k3s
    </text>

    {/* git push */}
    <rect x={12} y={112} width={120} height={76} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.3} />
    <text x={30} y={148} fontSize={14} fontWeight={700} fill="currentColor">git push</text>
    <text x={30} y={170} fontSize={12} fill="currentColor" opacity={0.65}>a commit</text>

    <text x={159} y={138} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">on push</text>
    <line className="diagram-flow" x1={132} y1={150} x2={180} y2={150} stroke="#c15f3c" strokeWidth={2} />
    <path d="M186 150 L176 145 L176 155 Z" fill="#c15f3c" />

    {/* GitHub Actions */}
    <rect x={186} y={96} width={180} height={108} rx={12} fill="none" stroke="#c15f3c" />
    <text x={202} y={122} fontSize={14} fontWeight={700} fill="currentColor">GitHub Actions</text>
    <text x={202} y={146} fontSize={13} fill="currentColor" opacity={0.65}>build</text>
    <text x={202} y={166} fontSize={13} fill="currentColor" opacity={0.65}>test</text>
    <text x={202} y={186} fontSize={13} fill="currentColor" opacity={0.65}>build &amp; push image</text>

    <text x={393} y={138} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">to git</text>
    <line className="diagram-flow" x1={366} y1={150} x2={414} y2={150} stroke="#c15f3c" strokeWidth={2} />
    <path d="M420 150 L410 145 L410 155 Z" fill="#c15f3c" />

    {/* Argo CD */}
    <rect x={420} y={96} width={160} height={108} rx={12} fill="none" stroke="#c15f3c" />
    <text x={436} y={122} fontSize={14} fontWeight={700} fill="currentColor">Argo CD</text>
    <text x={436} y={148} fontSize={13} fill="currentColor" opacity={0.65}>watches git</text>
    <text x={436} y={170} fontSize={13} fill="currentColor" opacity={0.65}>syncs cluster</text>

    <text x={607} y={138} fontSize={11} fill="currentColor" opacity={0.65} textAnchor="middle">sync</text>
    <line className="diagram-flow" x1={580} y1={150} x2={628} y2={150} stroke="#c15f3c" strokeWidth={2} />
    <path d="M634 150 L624 145 L624 155 Z" fill="#c15f3c" />

    {/* k3s */}
    <rect x={634} y={96} width={130} height={108} rx={12} fill="none" stroke="currentColor" strokeOpacity={0.3} />
    <text x={650} y={122} fontSize={14} fontWeight={700} fill="currentColor">k3s</text>
    <rect x={650} y={150} width={20} height={20} rx={4} fill="#c15f3c" opacity={0.85} />
    <rect className="diagram-blink" x={678} y={150} width={20} height={20} rx={4} fill="#c15f3c" />
    <rect x={706} y={150} width={20} height={20} rx={4} fill="#c15f3c" opacity={0.55} />

    {/* Caption */}
    <text x={390} y={254} fontSize={13} fill="currentColor" opacity={0.6} textAnchor="middle">
      A push builds the image and writes the new tag to git. Argo CD keeps the cluster matching git.
    </text>
  </svg>
);

export default CicdDiagram;
