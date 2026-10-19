/**
 * The WordPress job: one install, and all the plumbing around it. Inline so it
 * follows the site theme (currentColor); the WordPress mark keeps its brand
 * blue. Animations live in index.css (.diagram-*).
 */
const WordpressSetup = () => (
  <svg
    className="diagram-svg"
    viewBox="0 0 760 340"
    role="img"
    aria-label="One WordPress install at the center, connected to the things set up around it: sites, subdomains, SMTP email, and per-user roles."
  >
    {/* WordPress brand mark */}
    <g transform="translate(24 6) scale(1.25)" fill="#21759B">
      <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0" />
    </g>
    <text x={64} y={29} fontSize={15} fontWeight={700} fill="currentColor">
      The WordPress job
    </text>

    {/* WordPress hub */}
    <rect x={40} y={100} width={180} height={150} rx={12} fill="none" stroke="#21759B" />
    <text x={130} y={171} fontSize={16} fontWeight={700} fill="currentColor" textAnchor="middle">WordPress</text>
    <text x={130} y={193} fontSize={12} fill="currentColor" opacity={0.65} textAnchor="middle">one install</text>

    {/* Connections */}
    <line className="diagram-flow" x1={220} y1={168} x2={358} y2={100} stroke="#21759B" strokeWidth={2} />
    <line className="diagram-flow" x1={220} y1={173} x2={358} y2={162} stroke="#21759B" strokeWidth={2} />
    <line className="diagram-flow" x1={220} y1={178} x2={358} y2={224} stroke="#21759B" strokeWidth={2} />
    <line className="diagram-flow" x1={220} y1={183} x2={358} y2={286} stroke="#21759B" strokeWidth={2} />

    {/* Sites */}
    <rect x={360} y={72} width={360} height={56} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.3} />
    <text x={378} y={97} fontSize={14} fontWeight={700} fill="currentColor">Sites</text>
    <text x={378} y={116} fontSize={12} fill="currentColor" opacity={0.65}>new, existing, reworked free themes</text>

    {/* Subdomains */}
    <rect x={360} y={134} width={360} height={56} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.3} />
    <text x={378} y={167} fontSize={14} fontWeight={700} fill="currentColor">Subdomains</text>

    {/* SMTP */}
    <rect x={360} y={196} width={360} height={56} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.3} />
    <text x={378} y={229} fontSize={14} fontWeight={700} fill="currentColor">SMTP email</text>

    {/* Roles */}
    <rect x={360} y={258} width={360} height={56} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.3} />
    <text x={378} y={291} fontSize={14} fontWeight={700} fill="currentColor">User roles (RBAC)</text>

    {/* Caption */}
    <text x={380} y={332} fontSize={13} fill="currentColor" opacity={0.6} textAnchor="middle">
      One WordPress install, and all the plumbing around it: sites, domains, mail, and who gets to touch what.
    </text>
  </svg>
);

export default WordpressSetup;
